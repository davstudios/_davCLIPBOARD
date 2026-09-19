export function normalizeSearch(value){return String(value??'').trim().toLocaleLowerCase();}

export function normalizeClipboardText(value){
  const text=String(value??'');
  return text.trim().length?text:'';
}

export function previewText(value,max=160){
  const text=String(value??'').replace(/\s+/g,' ').trim();
  if(text.length<=max)return text;
  return `${text.slice(0,Math.max(0,max-1)).trimEnd()}…`;
}

export function wordCount(value){
  const text=String(value??'').trim();
  return text?text.split(/\s+/).length:0;
}

export function characterCount(value){return String(value??'').length;}

export function matchesEntry(entry,query){
  const needle=normalizeSearch(query);
  if(!needle)return true;
  return normalizeSearch(entry?.text).includes(needle);
}

export function sortEntries(entries){
  return [...entries].sort((a,b)=>Number(b?.createdAt||0)-Number(a?.createdAt||0));
}

export function filterEntries(entries,{query='',pinnedOnly=false}={}){
  return sortEntries(entries).filter((entry)=>(!pinnedOnly||entry.pinned)&&matchesEntry(entry,query));
}

export function upsertClipboardEntry(entries,text,{now=Date.now(),id=`clip-${now}`}={}){
  const clean=normalizeClipboardText(text);
  if(!clean)return {entries:[...entries],added:false,id:null};
  const existing=entries.find((entry)=>entry.text===clean);
  if(existing){
    const moved={...existing,createdAt:now};
    return {entries:[moved,...entries.filter((entry)=>entry.id!==existing.id)],added:false,id:existing.id};
  }
  const created={id,text:clean,createdAt:now,pinned:false};
  return {entries:[created,...entries],added:true,id};
}

export function enforceHistoryLimit(entries,limit){
  const max=Math.max(10,Number(limit)||100);
  if(entries.length<=max)return [...entries];
  const pinned=entries.filter((entry)=>entry.pinned);
  const unpinned=entries.filter((entry)=>!entry.pinned);
  const room=Math.max(0,max-pinned.length);
  return [...pinned,...unpinned.slice(0,room)].sort((a,b)=>Number(b?.createdAt||0)-Number(a?.createdAt||0));
}

export function clearUnpinned(entries){return entries.filter((entry)=>entry.pinned);}

export function pruneExpiredEntries(entries,retentionDays,now=Date.now()){
  const days=Number(retentionDays)||0;
  if(days<=0)return [...entries];
  const cutoff=now-days*86400000;
  return entries.filter((entry)=>entry.pinned||Number(entry.createdAt||0)>=cutoff);
}


export function statsForEntries(entries,now=Date.now()){
  const date=new Date(now);
  const start=new Date(date.getFullYear(),date.getMonth(),date.getDate()).getTime();
  return {
    total:entries.length,
    pinned:entries.filter((entry)=>entry.pinned).length,
    today:entries.filter((entry)=>Number(entry.createdAt||0)>=start).length
  };
}

export function formatRelativeTime(timestamp,now=Date.now(),language='it'){
  const delta=Math.max(0,now-Number(timestamp||0));
  const seconds=Math.floor(delta/1000);
  if(seconds<10)return language==='en'?'just now':'adesso';
  if(seconds<60)return language==='en'?`${seconds}s ago`:`${seconds}s fa`;
  const minutes=Math.floor(seconds/60);
  if(minutes<60)return language==='en'?`${minutes} min ago`:`${minutes} min fa`;
  const hours=Math.floor(minutes/60);
  if(hours<24)return language==='en'?`${hours}h ago`:`${hours} h fa`;
  const days=Math.floor(hours/24);
  if(days<7)return language==='en'?`${days}d ago`:`${days} g fa`;
  return new Intl.DateTimeFormat(language==='en'?'en-US':'it-IT',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(timestamp));
}

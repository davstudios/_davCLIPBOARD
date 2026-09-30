import './styles.css';
import './motion.css';
import { invoke } from '@tauri-apps/api/core';
import { getVersion } from '@tauri-apps/api/app';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { register,isRegistered } from '@tauri-apps/plugin-global-shortcut';
import { enable as enableAutostart,disable as disableAutostart,isEnabled as isAutostartEnabled } from '@tauri-apps/plugin-autostart';
import { readText,writeText } from '@tauri-apps/plugin-clipboard-manager';
import { openUrl } from '@tauri-apps/plugin-opener';
import { characterCount,clearUnpinned,enforceHistoryLimit,filterEntries,formatRelativeTime,previewText,pruneExpiredEntries,statsForEntries,upsertClipboardEntry,wordCount } from './clipboard-engine.js';

const icons={
  history:'<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></svg>',
  pin:'<svg class="nav-favorites-star" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.75 2.86 5.8 6.4.93-4.63 4.51 1.09 6.38L12 17.36l-5.72 3.01 1.09-6.38-4.63-4.51 6.4-.93L12 2.75z"/></svg>',
  settings:'<svg class="nav-settings-gear" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.09a2 2 0 0 1 1 1.74v.5a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
  clipboard:'<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5V3h6v1.5M9 9h6M9 13h6M9 17h4"/></svg>',
  search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  copy:'<svg viewBox="0 0 24 24"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>',
  trash:'<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14"/></svg>',
  pause:'<svg viewBox="0 0 24 24"><path d="M8 5v14M16 5v14"/></svg>',
  play:'<svg viewBox="0 0 24 24"><path d="m8 5 11 7-11 7z"/></svg>',
  shield:'<svg viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6z"/><path d="m9 12 2 2 4-4"/></svg>',
  sun:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon:'<svg viewBox="0 0 24 24"><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5z"/></svg>',
  coffee:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20.216 6.415-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 0 0-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 0 0-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 0 1-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 0 1 3.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 0 1-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 0 1-4.743.295 37.059 37.059 0 0 1-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0 0 11.343.376.483.483 0 0 1 .535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 0 1 .39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 0 1-.169.364zm-6.159 3.9c-.862.37-1.84.788-3.109.788a5.884 5.884 0 0 1-1.569-.217l.877 9.004c.065.78.717 1.38 1.5 1.38 0 0 1.243.065 1.658.065.447 0 1.786-.065 1.786-.065.783 0 1.434-.6 1.499-1.38l.94-9.95a3.996 3.996 0 0 0-1.322-.238c-.826 0-1.491.284-2.26.613z"/></svg>',
  globe:'<svg viewBox="0 0 390 390" aria-hidden="true"><path d="M195,0C87.305,0,0,87.304,0,195s87.305,195,195,195s195-87.304,195-195S302.695,0,195,0z M119.524,45.678c-3.493,4.838-6.838,10.033-10.007,15.6c-4.841,8.503-9.16,17.656-12.945,27.33c-8.064-2.22-16.089-4.713-24.064-7.483C85.91,66.718,101.813,54.667,119.524,45.678z M52.298,107.694c11.438,4.293,22.976,8.056,34.591,11.293c-4.78,18.934-7.744,39.182-8.745,60.087h-49.72C30.888,153.108,39.305,128.852,52.298,107.694z M52.298,282.306c-12.994-21.159-21.411-45.414-23.874-71.38h49.72c1.002,20.905,3.965,41.153,8.745,60.087C75.274,274.25,63.736,278.013,52.298,282.306z M72.508,308.876c7.975-2.77,16-5.265,24.063-7.483c3.786,9.674,8.105,18.827,12.946,27.33c3.168,5.566,6.514,10.762,10.007,15.6C101.813,335.333,85.91,323.283,72.508,308.876z M179.074,354.07c-20.393-7.648-38.458-29.593-51.05-59.894c16.931-3.125,33.977-5.059,51.05-5.8V354.07z M179.074,256.454c-20.448,0.818-40.862,3.221-61.117,7.191c-4.16-16.355-6.908-34.13-7.915-52.72h69.032V256.454z M179.074,179.074h-69.032c1.007-18.59,3.755-36.365,7.915-52.72c20.254,3.971,40.669,6.373,61.117,7.191V179.074z M179.074,101.623c-17.073-.741-34.118-2.675-51.05-5.8c12.592-30.301,30.657-52.245,51.05-59.894V101.623z M337.703,107.697c12.993,21.157,21.409,45.412,23.872,71.377h-49.72c-1.001-20.903-3.965-41.151-8.744-60.083C314.727,115.754,326.266,111.992,337.703,107.697z M317.495,81.128c-7.975,2.77-16,5.265-24.065,7.484c-3.786-9.676-8.105-18.831-12.947-27.335c-3.169-5.566-6.514-10.762-10.006-15.6C288.189,54.668,304.092,66.72,317.495,81.128z M210.926,35.93c20.393,7.648,38.459,29.595,51.051,59.898c-16.931,3.124-33.977,5.057-51.051,5.797V35.93z M210.926,133.547c20.45-.817,40.865-3.219,61.118-7.188c4.16,16.354,6.907,34.128,7.914,52.716h-69.032V133.547z M210.926,210.926h69.032c-1.007,18.588-3.754,36.362-7.914,52.716c-20.253-3.97-40.668-6.371-61.118-7.189V210.926z M210.926,354.07v-65.694c17.075.741,34.121,2.673,51.051,5.798C249.385,324.475,231.319,346.422,210.926,354.07z M270.477,344.322c3.493-4.838,6.838-10.033,10.006-15.6c4.842-8.504,9.161-17.659,12.947-27.334c8.064,2.22,16.089,4.714,24.065,7.484C304.092,323.28,288.189,335.332,270.477,344.322z M337.703,282.304c-11.437-4.296-22.976-8.058-34.591-11.296c4.779-18.932,7.742-39.179,8.744-60.082h49.72C359.112,236.891,350.696,261.146,337.703,282.304z"/></svg>',
  check:'<svg viewBox="0 0 24 24"><path d="m5 12 4 4 10-10"/></svg>'
};

const app=document.querySelector('#app');
const isTauri='__TAURI_INTERNALS__' in window;
const stored=JSON.parse(localStorage.getItem('davclipboard-settings')||'{}');
const state={
  page:'history',
  version:'26.9.2',
  entries:[],
  query:'',
  monitoring:stored.monitoring!==false,
  lastClipboard:'',
  selectedId:null,
  autostart:false,
  settings:{theme:stored.theme||'system',language:stored.language||'it',historyLimit:Number(stored.historyLimit)||100,retentionDays:Number(stored.retentionDays)||0}
};
let monitorTimer=null;
let saveTimer=null;

const t=(it,en)=>state.settings.language==='en'?en:it;
const esc=(value)=>String(value??'').replace(/[&<>'"]/g,(char)=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'})[char]);
const resolvedTheme=()=>state.settings.theme==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):state.settings.theme;
function persistSettings(){localStorage.setItem('davclipboard-settings',JSON.stringify({...state.settings,monitoring:state.monitoring}));}
function applyTheme(){document.documentElement.dataset.theme=resolvedTheme();document.documentElement.lang=state.settings.language;}
function toast(message){const region=document.querySelector('#toast-region');if(!region)return;const node=document.createElement('div');node.className='toast';node.textContent=message;region.appendChild(node);setTimeout(()=>{node.classList.add('is-leaving');setTimeout(()=>node.remove(),190);},3600);}
function navButton(page,icon,label){return `<button class="nav-item ${state.page===page?'active':''}" data-page="${page}">${icon}<span>${label}</span></button>`;}
function runUiTransition(kind,change){document.documentElement.dataset.uiTransition=kind;if(document.startViewTransition){const transition=document.startViewTransition(change);transition.finished.finally(()=>delete document.documentElement.dataset.uiTransition);return;}document.documentElement.dataset.uiTransition=`${kind}-out`;setTimeout(()=>{change();document.documentElement.dataset.uiTransition=`${kind}-in`;setTimeout(()=>delete document.documentElement.dataset.uiTransition,430);},180);}
function currentTitle(){if(state.page==='pinned')return t('Preferiti','Favorites');if(state.page==='settings')return t('Impostazioni','Settings');return t('Cronologia','History');}
function currentSubtitle(){if(state.page==='pinned')return t('Conserva gli appunti importanti e ritrovali subito.','Keep important clips and find them instantly.');if(state.page==='settings')return t('Personalizza comportamento, aspetto e lingua dell’app.','Customize app behavior, appearance and language.');return t('Ritrova, cerca e riusa rapidamente ciò che copi.','Find, search and reuse what you copy.');}
function shell(content,motion='page'){
  applyTheme();
  app.innerHTML=`<div class="shell" data-motion-mode="${motion}"><aside class="sidebar"><div class="brand"><span>_dav</span>CLIPBOARD</div><nav>${navButton('history',icons.history,t('Cronologia','History'))}${navButton('pinned',icons.pin,t('Preferiti','Favorites'))}${navButton('settings',icons.settings,t('Impostazioni','Settings'))}</nav><div class="sidebar-bottom"><button class="coffee-button" data-coffee>${icons.coffee}<span>${t('Comprami Un Caffè','Buy Me A Coffee')}</span></button><button class="icon-button theme-toggle" data-theme-toggle aria-label="Tema"><span class="theme-icon theme-icon-sun">${icons.sun}</span><span class="theme-icon theme-icon-moon">${icons.moon}</span></button></div></aside><main class="main"><header class="topbar"><div class="topbar-copy"><div class="eyebrow">_davCLIPBOARD · v${esc(state.version)}</div><h1>${esc(currentTitle())}</h1><p>${esc(currentSubtitle())}</p></div>${state.page!=='settings'?`<div class="top-actions"><div class="monitor-pill ${state.monitoring?'':'paused'}"><i class="monitor-dot"></i>${state.monitoring?t('Monitoraggio attivo','Monitoring active'):t('In pausa','Paused')}</div><button class="button secondary" data-monitor-toggle>${state.monitoring?icons.pause:icons.play}${state.monitoring?t('Pausa','Pause'):t('Riprendi','Resume')}</button></div>`:''}</header>${content}</main></div><div id="toast-region"></div>`;
  bindShell();
}
function bindShell(){
  document.querySelectorAll('[data-page]').forEach((button)=>button.addEventListener('click',()=>{const page=button.dataset.page;if(page===state.page)return;state.page=page;state.query='';render('page');}));
  document.querySelectorAll('[data-theme-toggle]').forEach((button)=>button.addEventListener('click',()=>{const next=resolvedTheme()==='dark'?'light':'dark';runUiTransition('theme',()=>{state.settings.theme=next;persistSettings();render('content');});}));
  document.querySelector('[data-monitor-toggle]')?.addEventListener('click',()=>{state.monitoring=!state.monitoring;persistSettings();render('content');toast(state.monitoring?t('Monitoraggio riattivato','Monitoring resumed'):t('Monitoraggio in pausa','Monitoring paused'));});
  document.querySelector('[data-coffee]')?.addEventListener('click',()=>openExternal('https://buymeacoffee.com/davstudios'));
}
async function openExternal(url){if(isTauri){await openUrl(url);}else{window.open(url,'_blank','noopener');}}
async function loadHistory(){
  try{
    state.entries=isTauri?await invoke('load_clipboard_history'):JSON.parse(localStorage.getItem('davclipboard-history')||'[]');
    state.entries=pruneExpiredEntries(Array.isArray(state.entries)?state.entries:[],state.settings.retentionDays);
    state.entries=enforceHistoryLimit(state.entries,state.settings.historyLimit);
  }catch{state.entries=[];}
}
function saveHistory(){
  clearTimeout(saveTimer);
  saveTimer=setTimeout(async()=>{
    try{
      if(isTauri)await invoke('save_clipboard_history',{entries:state.entries});
      else localStorage.setItem('davclipboard-history',JSON.stringify(state.entries));
    }catch{toast(t('Impossibile salvare la cronologia','Could not save history'));}
  },120);
}
async function readClipboard(){
  if(isTauri)return await readText();
  if(navigator.clipboard?.readText)return await navigator.clipboard.readText();
  return '';
}
async function writeClipboard(text){
  state.lastClipboard=text;
  if(isTauri)await writeText(text);else if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(text);
}
async function pollClipboard(){
  if(!state.monitoring)return;
  try{
    const text=await readClipboard();
    if(!text||text===state.lastClipboard)return;
    state.lastClipboard=text;
    const result=upsertClipboardEntry(state.entries,text,{id:crypto.randomUUID?.()||`clip-${Date.now()}`});
    state.entries=pruneExpiredEntries(result.entries,state.settings.retentionDays);
    state.entries=enforceHistoryLimit(state.entries,state.settings.historyLimit);
    saveHistory();
    if(state.page!=='settings')render('content');
  }catch{}
}
function startMonitoring(){clearInterval(monitorTimer);monitorTimer=setInterval(pollClipboard,900);pollClipboard();}
function focusSearch(){const input=document.querySelector('[data-search]');if(input){input.focus();input.select();}}
function setKeyboardSelection(id){state.selectedId=id;document.querySelectorAll('.clip-row').forEach((row)=>{const selected=row.dataset.entry===id;row.classList.toggle('keyboard-selected',selected);row.setAttribute('aria-selected',selected?'true':'false');if(selected)row.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});});}
function moveKeyboardSelection(delta){const rows=[...document.querySelectorAll('.clip-row')];if(!rows.length)return;const index=rows.findIndex((row)=>row.dataset.entry===state.selectedId);const next=index<0?(delta>0?0:rows.length-1):Math.max(0,Math.min(rows.length-1,index+delta));setKeyboardSelection(rows[next].dataset.entry);}
async function copySelectedEntry(){if(!state.selectedId)return;const entry=state.entries.find((item)=>item.id===state.selectedId);if(!entry)return;await writeClipboard(entry.text);toast(t('Copiato negli appunti','Copied to clipboard'));}
function bindKeyboardNavigation(){document.addEventListener('keydown',(event)=>{const target=event.target;const typing=target instanceof HTMLInputElement||target instanceof HTMLTextAreaElement||target?.isContentEditable;if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='f'){if(state.page!=='settings'){event.preventDefault();focusSearch();}return;}if(typing){if(event.key==='Escape'&&state.query){event.preventDefault();state.query='';historyPage(state.page==='pinned','static');focusSearch();}return;}if(state.page==='settings')return;if(event.key==='ArrowDown'){event.preventDefault();moveKeyboardSelection(1);}else if(event.key==='ArrowUp'){event.preventDefault();moveKeyboardSelection(-1);}else if(event.key==='Enter'&&state.selectedId){event.preventDefault();copySelectedEntry();}else if(event.key==='Escape'&&state.selectedId){event.preventDefault();setKeyboardSelection(null);}});}
async function setupGlobalShortcut(){if(!isTauri)return;const shortcut='CommandOrControl+Shift+V';try{if(!await isRegistered(shortcut)){await register(shortcut,async(event)=>{if(event.state!=='Pressed')return;const window=getCurrentWindow();await window.show();await window.setFocus();state.page='history';state.query='';render('content');requestAnimationFrame(focusSearch);});}}catch{toast(t('Scorciatoia globale non disponibile','Global shortcut unavailable'));}}
function statsCards(){const stats=statsForEntries(state.entries);return `<div class="clipboard-stats"><div class="panel stat-card"><span>${t('Elementi salvati','Saved items')}</span><strong>${stats.total.toLocaleString()}</strong></div><div class="panel stat-card"><span>${t('Preferiti','Favorites')}</span><strong>${stats.pinned.toLocaleString()}</strong></div><div class="panel stat-card"><span>${t('Catturati oggi','Captured today')}</span><strong>${stats.today.toLocaleString()}</strong></div></div>`;}
function clipRow(entry){
  const words=wordCount(entry.text);const chars=characterCount(entry.text);const time=formatRelativeTime(entry.createdAt,Date.now(),state.settings.language);
  return `<article class="clip-row ${state.selectedId===entry.id?'keyboard-selected':''}" data-entry="${esc(entry.id)}" aria-selected="${state.selectedId===entry.id?'true':'false'}"><div class="clip-symbol">${icons.clipboard}</div><div class="clip-content"><p class="clip-preview">${esc(previewText(entry.text,460))}</p><div class="clip-meta"><span>${esc(time)}</span><span>·</span><span>${chars.toLocaleString()} ${t('caratteri','chars')}</span><span>·</span><span>${words.toLocaleString()} ${t('parole','words')}</span>${entry.pinned?`<span class="pin-label">${icons.pin}${t('Preferito','Favorite')}</span>`:''}</div></div><div class="clip-actions"><button class="clip-action" data-copy="${esc(entry.id)}" aria-label="Copia">${icons.copy}</button><button class="clip-action ${entry.pinned?'active':''}" data-pin="${esc(entry.id)}" aria-label="Preferito">${icons.pin}</button><button class="clip-action danger" data-delete="${esc(entry.id)}" aria-label="Elimina">${icons.trash}</button></div></article>`;
}
function emptyState(pinnedOnly){return `<div class="clipboard-empty"><div class="clipboard-empty-mark">${pinnedOnly?icons.pin:icons.clipboard}</div><h2>${pinnedOnly?t('Nessun preferito','No favorites'):t('La cronologia è vuota','Clipboard history is empty')}</h2><p>${pinnedOnly?t('Aggiungi ai preferiti gli elementi che vuoi conservare qui.','Add the items you want to keep here to favorites.'):t('Copia del testo in qualsiasi applicazione: apparirà automaticamente qui mentre _davCLIPBOARD è aperta.','Copy text in any app and it will automatically appear here while _davCLIPBOARD is open.')}</p></div>`;}
function historyPage(pinnedOnly=false,motion='page'){
  const entries=filterEntries(state.entries,{query:state.query,pinnedOnly});
  shell(`<section class="history-page clipboard-history-page">${statsCards()}<div class="clipboard-toolbar"><label class="search-box">${icons.search}<input data-search value="${esc(state.query)}" placeholder="${esc(t('Cerca nella cronologia…','Search clipboard history…'))}"></label>${!pinnedOnly?`<button class="button secondary" data-clear ${state.entries.some((entry)=>!entry.pinned)?'':'disabled'}>${icons.trash}${t('Svuota','Clear')}</button>`:''}</div><section class="panel clipboard-panel"><div class="clipboard-panel-head"><div><h2>${pinnedOnly?t('Elementi preferiti','Favorite items'):t('Appunti recenti','Recent clips')}</h2><span>${entries.length} ${t('elementi visualizzati','items shown')}</span></div></div>${entries.length?`<div class="clip-list">${entries.map(clipRow).join('')}</div>`:emptyState(pinnedOnly)}</section><div class="panel privacy-banner">${icons.shield}<div><strong>${t('Tutto resta sul dispositivo','Everything stays on your device')}</strong><span>${t('La cronologia viene salvata localmente nei dati dell’app. Nessun contenuto viene inviato online.','History is stored locally in the app data. No clipboard content is sent online.')}</span></div></div></section>`,motion);
  const input=document.querySelector('[data-search]');
  input?.addEventListener('input',(event)=>{state.query=event.target.value;historyPage(pinnedOnly,'static');requestAnimationFrame(()=>{const next=document.querySelector('[data-search]');next?.focus();next?.setSelectionRange(state.query.length,state.query.length);});});
  document.querySelectorAll('[data-copy]').forEach((button)=>button.addEventListener('click',async()=>{const entry=state.entries.find((item)=>item.id===button.dataset.copy);if(!entry)return;await writeClipboard(entry.text);toast(t('Copiato negli appunti','Copied to clipboard'));}));
  document.querySelectorAll('.clip-row').forEach((row)=>row.addEventListener('click',(event)=>{if(event.target.closest('button'))return;setKeyboardSelection(row.dataset.entry);}));
  document.querySelectorAll('[data-pin]').forEach((button)=>button.addEventListener('click',()=>{const entry=state.entries.find((item)=>item.id===button.dataset.pin);if(!entry)return;entry.pinned=!entry.pinned;saveHistory();historyPage(pinnedOnly,'content');}));
  document.querySelectorAll('[data-delete]').forEach((button)=>button.addEventListener('click',()=>{state.entries=state.entries.filter((item)=>item.id!==button.dataset.delete);saveHistory();historyPage(pinnedOnly,'content');}));
  document.querySelector('[data-clear]')?.addEventListener('click',()=>{state.entries=clearUnpinned(state.entries);saveHistory();historyPage(false,'content');toast(t('Cronologia svuotata. I preferiti sono stati conservati.','History cleared. Favorites were kept.'));});
}
function selectControl(id,value,options){return `<div class="dav-select" data-select="${id}"><button class="dav-select-trigger" data-select-trigger><span>${esc(options.find((item)=>item.value===String(value))?.label||value)}</span><span>⌄</span></button><div class="dav-select-menu">${options.map((item)=>`<button class="dav-select-option" data-select-value="${esc(item.value)}"><span>${esc(item.label)}</span>${String(value)===item.value?icons.check:''}</button>`).join('')}</div></div>`;}
function settingsPage(motion='page'){
  shell(`<div class="settings-grid"><section class="panel settings-card"><h2>${t('Comportamento','Behavior')}</h2><div class="setting-row"><div><strong>${t('Monitoraggio automatico','Automatic monitoring')}</strong><span>${t('Cattura il testo copiato mentre l’app è aperta.','Capture copied text while the app is open.')}</span></div><label class="switch"><input type="checkbox" data-setting-monitoring ${state.monitoring?'checked':''}><span></span></label></div><div class="setting-row"><div><strong>${t('Avvio automatico','Launch at startup')}</strong><span>${t('Avvia _davCLIPBOARD quando accedi al computer.','Start _davCLIPBOARD when you sign in to your computer.')}</span></div><label class="switch"><input type="checkbox" data-setting-autostart ${state.autostart?'checked':''} ${isTauri?'':'disabled'}><span></span></label></div><div class="setting-control"><span>${t('Elementi massimi','Maximum items')}</span>${selectControl('limit',state.settings.historyLimit,[50,100,250,500].map((value)=>({value:String(value),label:String(value)})))}</div><div class="setting-control"><span>${t('Pulizia automatica','Automatic cleanup')}</span>${selectControl('retention',state.settings.retentionDays,[{value:'0',label:t('Mai','Never')},{value:'1',label:t('Dopo 1 giorno','After 1 day')},{value:'7',label:t('Dopo 7 giorni','After 7 days')},{value:'30',label:t('Dopo 30 giorni','After 30 days')},{value:'90',label:t('Dopo 90 giorni','After 90 days')}])}</div><div class="setting-control"><span>${t('Tema','Theme')}</span>${selectControl('theme',state.settings.theme,[{value:'system',label:t('Sistema','System')},{value:'light',label:t('Chiaro','Light')},{value:'dark',label:t('Scuro','Dark')}])}</div><div class="setting-control"><span>${t('Lingua','Language')}</span>${selectControl('language',state.settings.language,[{value:'it',label:'Italiano'},{value:'en',label:'English'}])}</div><div class="settings-note"><strong>${t('Scorciatoia globale','Global shortcut')}</strong><br><span class="kbd">Ctrl/Cmd</span> + <span class="kbd">Shift</span> + <span class="kbd">V</span> · ${t('apre _davCLIPBOARD e porta il cursore sulla ricerca. Frecce ↑/↓ selezionano un appunto e Invio lo ricopia.','opens _davCLIPBOARD and focuses search. Arrow keys ↑/↓ select a clip and Enter copies it.')}</div><div class="danger-zone"><strong>${t('Cancella tutta la cronologia','Delete all history')}</strong><span>${t('Rimuove anche gli elementi preferiti salvati localmente.','Also removes locally saved favorites.')}</span><button class="button danger" data-delete-all>${icons.trash}${t('Cancella tutto','Delete all')}</button></div></section><section class="panel about-card"><div class="brand big about-logo"><span>_dav</span>CLIPBOARD</div><p>${t('Un gestore appunti locale, rapido e coerente con la suite _davstudios.','A fast local clipboard manager consistent with the _davstudios suite.')}</p><div class="about-links"><button class="website-button" data-site>${icons.globe}<span>davstudios.it</span></button><button class="coffee-button wide" data-coffee-about>${icons.coffee}<span>${t('Comprami Un Caffè','Buy Me A Coffee')}</span></button></div><div class="version">${t('Versione','Version')} ${esc(state.version)} · ${t('Release stabile','Stable release')}</div></section><section class="panel capability-card"><h2>${t('Funzioni principali','Main features')}</h2><div class="capability-list"><div><strong>${t('Cronologia automatica e privata','Automatic private history')}</strong><span>${t('Monitora gli appunti di testo e salva tutto esclusivamente sul dispositivo.','Monitors text clipboard changes and stores everything exclusively on the device.')}</span></div><div><strong>${t('Ricerca, preferiti e tastiera','Search, favorites and keyboard')}</strong><span>${t('Trova rapidamente un appunto, conservalo tra i preferiti e riusalo anche senza mouse.','Quickly find a clip, keep it as a favorite and reuse it without the mouse.')}</span></div><div><strong>${t('Scorciatoia globale e avvio automatico','Global shortcut and autostart')}</strong><span>${t('Richiama l’app con Ctrl/Cmd+Shift+V e scegli se avviarla insieme al sistema.','Recall the app with Ctrl/Cmd+Shift+V and choose whether it launches with the system.')}</span></div></div></section></div>`,motion);
  bindSelects();
  document.querySelector('[data-setting-monitoring]')?.addEventListener('change',(event)=>{state.monitoring=event.target.checked;persistSettings();render('content');toast(state.monitoring?t('Monitoraggio riattivato','Monitoring resumed'):t('Monitoraggio in pausa','Monitoring paused'));});
  document.querySelector('[data-setting-autostart]')?.addEventListener('change',async(event)=>{const enabled=event.target.checked;event.target.disabled=true;try{if(isTauri){if(enabled)await enableAutostart();else await disableAutostart();}state.autostart=enabled;toast(enabled?t('Avvio automatico attivato','Autostart enabled'):t('Avvio automatico disattivato','Autostart disabled'));}catch{event.target.checked=state.autostart;toast(t('Impossibile modificare l’avvio automatico','Could not change autostart'));}finally{event.target.disabled=!isTauri;}});
  document.querySelector('[data-delete-all]')?.addEventListener('click',()=>{state.entries=[];state.selectedId=null;saveHistory();render('content');toast(t('Cronologia eliminata','History deleted'));});
  document.querySelector('[data-coffee-about]')?.addEventListener('click',()=>openExternal('https://buymeacoffee.com/davstudios'));
  document.querySelector('[data-site]')?.addEventListener('click',()=>openExternal(state.settings.language==='en'?'https://www.davstudios.it/en':'https://www.davstudios.it'));
}
function bindSelects(){
  document.querySelectorAll('[data-select]').forEach((select)=>{
    select.querySelector('[data-select-trigger]')?.addEventListener('click',(event)=>{event.stopPropagation();document.querySelectorAll('.dav-select.is-open').forEach((other)=>{if(other!==select)other.classList.remove('is-open');});select.classList.toggle('is-open');});
    select.querySelectorAll('[data-select-value]').forEach((option)=>option.addEventListener('click',()=>{
      const id=select.dataset.select;const value=option.dataset.selectValue;
      if(id==='limit'){state.settings.historyLimit=Number(value);state.entries=enforceHistoryLimit(state.entries,state.settings.historyLimit);saveHistory();persistSettings();settingsPage('content');return;}
      if(id==='retention'){state.settings.retentionDays=Number(value);state.entries=pruneExpiredEntries(state.entries,state.settings.retentionDays);saveHistory();persistSettings();settingsPage('content');toast(t('Pulizia automatica aggiornata','Automatic cleanup updated'));return;}
      runUiTransition(id==='theme'?'theme':'language',()=>{state.settings[id]=value;persistSettings();settingsPage('content');});
    }));
  });
}
function render(motion='page'){if(state.page==='settings')settingsPage(motion);else historyPage(state.page==='pinned',motion);}
async function init(){
  applyTheme();
  if(isTauri){try{state.version=await getVersion();}catch{}try{state.autostart=await isAutostartEnabled();}catch{}}
  await loadHistory();
  document.addEventListener('click',()=>document.querySelectorAll('.dav-select.is-open').forEach((node)=>node.classList.remove('is-open')));
  render('startup');
  bindKeyboardNavigation();
  await setupGlobalShortcut();
  startMonitoring();
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if(state.settings.theme==='system')render('content');});
}
init();

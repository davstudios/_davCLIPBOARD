import test from 'node:test';
import assert from 'node:assert/strict';
import { characterCount,clearUnpinned,enforceHistoryLimit,filterEntries,formatRelativeTime,matchesEntry,normalizeClipboardText,normalizeSearch,previewText,pruneExpiredEntries,statsForEntries,upsertClipboardEntry,wordCount } from '../src/clipboard-engine.js';

test('normalizeSearch trims and normalizes case',()=>assert.equal(normalizeSearch('  Ciao MONDO  '),'ciao mondo'));
test('normalizeClipboardText ignores blank values',()=>assert.equal(normalizeClipboardText('   '),''));
test('previewText compacts whitespace and truncates',()=>assert.equal(previewText('uno\n  due tre',9),'uno due…'));
test('wordCount counts words',()=>assert.equal(wordCount('uno due\ntre'),3));
test('characterCount preserves exact length',()=>assert.equal(characterCount(' a '),3));
test('matchesEntry searches clipboard text',()=>assert.equal(matchesEntry({text:'Hello World'},'world'),true));
test('upsertClipboardEntry adds a new clip',()=>{const result=upsertClipboardEntry([],'ciao',{now:100,id:'x'});assert.equal(result.added,true);assert.equal(result.entries[0].id,'x');});
test('upsertClipboardEntry moves duplicate to top without duplicating',()=>{const entries=[{id:'a',text:'uno',createdAt:1,pinned:true},{id:'b',text:'due',createdAt:2,pinned:false}];const result=upsertClipboardEntry(entries,'uno',{now:3,id:'c'});assert.equal(result.entries.length,2);assert.equal(result.entries[0].id,'a');assert.equal(result.entries[0].pinned,true);});
test('history limit preserves pinned clips',()=>{const entries=[{id:'p',text:'p',createdAt:1,pinned:true},...Array.from({length:20},(_,index)=>({id:String(index),text:String(index),createdAt:30-index,pinned:false}))];const limited=enforceHistoryLimit(entries,10);assert.equal(limited.length,10);assert.equal(limited.some((entry)=>entry.id==='p'),true);});
test('filterEntries supports favorites and search',()=>{const entries=[{id:'1',text:'Apple',createdAt:1,pinned:true},{id:'2',text:'Banana',createdAt:2,pinned:false}];assert.deepEqual(filterEntries(entries,{query:'app',pinnedOnly:true}).map((entry)=>entry.id),['1']);});
test('clearUnpinned keeps only favorites',()=>assert.deepEqual(clearUnpinned([{id:'1',pinned:true},{id:'2',pinned:false}]).map((entry)=>entry.id),['1']));
test('statsForEntries counts total pinned and today',()=>{const now=new Date(2026,8,18,12).getTime();const yesterday=now-86400000;const stats=statsForEntries([{createdAt:now,pinned:true},{createdAt:yesterday,pinned:false}],now);assert.deepEqual(stats,{total:2,pinned:1,today:1});});
test('formatRelativeTime formats recent values',()=>assert.equal(formatRelativeTime(95000,100000,'it'),'adesso'));

test('pruneExpiredEntries preserves favorites and removes old unpinned clips',()=>{const now=10*86400000;const entries=[{id:'old',createdAt:0,pinned:false},{id:'favorite',createdAt:0,pinned:true},{id:'new',createdAt:now-86400000,pinned:false}];assert.deepEqual(pruneExpiredEntries(entries,7,now).map((entry)=>entry.id),['favorite','new']);});

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Script from "next/script";

/* =========================================================
   EXAM PRESETS  (min/max in KB, optional w/h in px)
   Values change with each notification, so verify with the official notice.
   ========================================================= */
const EXAMS = {
  ssc:   { name: 'SSC', sub: 'CGL · CHSL · MTS · GD', docs: {
           photo:{min:20,max:50}, signature:{min:10,max:20} } },
  upsc:  { name: 'UPSC', sub: 'CSE · NDA · CDS', docs: {
           photo:{min:20,max:300}, signature:{min:20,max:300}, document:{min:50,max:300} } },
  ibps:  { name: 'IBPS', sub: 'PO · Clerk · RRB', docs: {
           photo:{min:20,max:50,w:200,h:230}, signature:{min:10,max:20,w:140,h:60},
           thumb:{min:20,max:50,w:240,h:240}, declaration:{min:50,max:100,w:800,h:400} } },
  sbi:   { name: 'SBI', sub: 'PO · Clerk', docs: {
           photo:{min:20,max:50,w:200,h:230}, signature:{min:10,max:20,w:140,h:60},
           thumb:{min:20,max:50,w:240,h:240}, declaration:{min:50,max:100,w:800,h:400} } },
  rrb:   { name: 'RRB', sub: 'NTPC · Group D · ALP', docs: {
           photo:{min:20,max:50}, signature:{min:10,max:40}, document:{min:50,max:500} } },
  tspsc: { name: 'TGPSC', sub: 'Group 1/2/3/4', docs: {
           photo:{min:10,max:50}, signature:{min:10,max:50}, document:{min:50,max:1024} } },
  appsc: { name: 'APPSC', sub: 'Group 1/2', docs: {
           photo:{min:10,max:50}, signature:{min:10,max:50}, document:{min:50,max:1024} } },
  neet:  { name: 'NEET UG', sub: 'NTA', docs: {
           photo:{min:10,max:200}, signature:{min:4,max:30}, thumb:{min:10,max:200}, document:{min:50,max:300} } },
  jee:   { name: 'JEE Main', sub: 'NTA', docs: {
           photo:{min:10,max:200}, signature:{min:4,max:30}, document:{min:50,max:300} } },
};
const DOC_LABELS = { photo:'🧑 Photo', signature:'✍️ Signature', thumb:'👍 Left Thumb', declaration:'📝 Declaration', document:'📄 Document' };
const SIZE_PRESETS = [10, 20, 30, 50, 80, 100, 200, 500];

const LS_SETTINGS = 'eic_settings_v1';
const LS_HISTORY  = 'eic_history_v1';
const MAX_FILES = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
const ALLOWED_EXT = /\.(jpe?g|png)$/i;
const MAX_FILE_BYTES = 25 * 1048576;       // 25 MB per file
const MAX_PIXELS = 100 * 1000 * 1000;      // 100 megapixels — guards against "decompression bomb" images
const MIN_KB = 5, MAX_KB = 5000;           // allowed custom target size

const DEFAULT_SETTINGS = { mode:'size', exam:'ssc', doc:'photo', sizeKb:50, resizeDims:true };

// Saved settings come from localStorage, which anything on this origin (or the user) can edit.
// Never trust them: keep only values that are valid, fall back to defaults for the rest.
function sanitizeSettings(raw){
  const s = { ...DEFAULT_SETTINGS };
  if (!raw || typeof raw !== 'object') return s;
  if (raw.mode === 'size' || raw.mode === 'exam') s.mode = raw.mode;
  if (typeof raw.exam === 'string' && Object.prototype.hasOwnProperty.call(EXAMS, raw.exam)) s.exam = raw.exam;
  const docs = EXAMS[s.exam].docs;
  s.doc = (typeof raw.doc === 'string' && Object.prototype.hasOwnProperty.call(docs, raw.doc)) ? raw.doc : Object.keys(docs)[0];
  const kb = Math.round(Number(raw.sizeKb));
  if (Number.isFinite(kb) && kb >= MIN_KB && kb <= MAX_KB) s.sizeKb = kb;
  if (typeof raw.resizeDims === 'boolean') s.resizeDims = raw.resizeDims;
  return s;
}

// History holds the student's photos/signatures, so it lives in sessionStorage (wiped when the tab
// closes) — not localStorage — so nothing is left behind on a shared / cyber-café computer.
const storeFor = k => (k === LS_HISTORY ? sessionStorage : localStorage);
const isJpegDataURL = v => typeof v === 'string' && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(v);

/* ---------- Pure helpers ---------- */
function loadJSON(k, fb){ try { return JSON.parse(storeFor(k).getItem(k)) ?? fb; } catch { return fb; } }
function saveJSON(k, v){ try { storeFor(k).setItem(k, JSON.stringify(v)); return true; } catch { return false; } }
function fmtSize(b){ return b < 1024 ? b + ' B' : b < 1048576 ? (b/1024).toFixed(1) + ' KB' : (b/1048576).toFixed(2) + ' MB'; }
const canvasToBlob = (c, type, q) => new Promise(r => c.toBlob(r, type, q));
const blobToDataURL = b => new Promise(r => { const fr=new FileReader(); fr.onload=()=>r(fr.result); fr.readAsDataURL(b); });
function loadImage(src){ return new Promise((res, rej)=>{ const i=new Image(); i.onload=()=>res(i); i.onerror=rej; i.src=src; }); }
function esc(s){ return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
function targetText(t){ return `${t.label} · ${t.min?t.min+'–':'≤ '}${t.max} KB`; }

// Draws image to canvas. If w/h given: cover-crop to exact size. Else scale down by `scale` (white bg for transparency).
function drawToCanvas(img, scale, w, h){
  const c = document.createElement('canvas'); const ctx = c.getContext('2d');
  if (w && h) {
    c.width = Math.round(w*scale); c.height = Math.round(h*scale);
    const r = Math.max(c.width/img.naturalWidth, c.height/img.naturalHeight);
    const dw = img.naturalWidth*r, dh = img.naturalHeight*r;
    ctx.fillStyle='#fff'; ctx.fillRect(0,0,c.width,c.height);
    ctx.imageSmoothingQuality='high';
    ctx.drawImage(img, (c.width-dw)/2, (c.height-dh)/2, dw, dh);
  } else {
    c.width = Math.max(1, Math.round(img.naturalWidth*scale)); c.height = Math.max(1, Math.round(img.naturalHeight*scale));
    ctx.fillStyle='#fff'; ctx.fillRect(0,0,c.width,c.height);
    ctx.imageSmoothingQuality='high';
    ctx.drawImage(img, 0, 0, c.width, c.height);
  }
  return c;
}

// Binary-search quality for the largest blob ≤ maxBytes
async function bestQuality(canvas, type, maxBytes){
  let lo=0.05, hi=0.95, best=null;
  for (let i=0;i<8;i++){
    const q=(lo+hi)/2; const b=await canvasToBlob(canvas,type,q);
    if (b && b.size <= maxBytes){ best={blob:b,q}; lo=q; } else hi=q;
  }
  if (!best){ const b=await canvasToBlob(canvas,type,0.05); if (b.size<=maxBytes) best={blob:b,q:0.05}; }
  return best;
}

// Main compression: keeps quality high by shrinking dimensions when needed
async function compressToTarget(img, target, type='image/jpeg'){
  const maxBytes = Math.floor(target.max*1024*0.97); // 3% safety margin
  const MAX_DIM = 2400;
  let scale = target.w ? 1 : Math.min(1, MAX_DIM/Math.max(img.naturalWidth,img.naturalHeight));
  let fallback = null;
  for (let step=0; step<14; step++){
    const c = drawToCanvas(img, scale, target.w, target.h);
    const r = await bestQuality(c, type, maxBytes);
    if (r){
      const res = { ...r, w:c.width, h:c.height };
      if (r.q >= 0.6 || (target.w && step===0 && r.q>=0.3)) return res;
      if (!fallback) fallback = res;
      if (target.w) return res; // keep exact exam dimensions
    }
    if (c.width < 80 || c.height < 80) break;
    scale *= 0.85;
  }
  return fallback;
}

function saveBlob(blob, filename){
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href), 3000);
}

/* =========================================================
   The tool. Scoped to `root` (every id is prefixed "eic-") so it cannot touch the
   rest of the site, and every global listener is tied to `signal` so it is removed
   on unmount. Everything runs in the browser — images are never uploaded.
   ========================================================= */
function initCompressor(root, signal){
  const $ = id => root.querySelector('#eic-' + id);

  try { localStorage.removeItem(LS_HISTORY); } catch { /* clear any history an older build left in localStorage */ }
  let state = sanitizeSettings(loadJSON(LS_SETTINGS, null));
  let items = []; // { id, file, name, origURL, img, blob, url, w, h, target, formatCache }
  let runToken = 0;
  let modalCancel = null;
  let customTimer = null;
  let lastCustom = '';

  function toast(msg){ const t=$('toast'); t.textContent=msg; t.style.opacity=1; clearTimeout(t._h); t._h=setTimeout(()=>t.style.opacity=0,2200); }
  function persist(){ saveJSON(LS_SETTINGS, state); }

  function getTarget(){
    if (state.mode === 'exam') {
      const ex = EXAMS[state.exam]; const d = ex.docs[state.doc] || Object.values(ex.docs)[0];
      return { min:d.min, max:d.max, w: state.resizeDims ? d.w : undefined, h: state.resizeDims ? d.h : undefined,
               label: `${ex.name} · ${DOC_LABELS[state.doc].replace(/^\S+\s/,'')}` };
    }
    return { min:0, max:state.sizeKb, label:`Custom · up to ${state.sizeKb} KB` };
  }

  /* ---------- Render settings UI ---------- */
  function renderModes(){
    const exam = state.mode === 'exam';
    $('modeExam').className = 'py-2 rounded-lg ' + (exam ? 'bg-white shadow-sm text-brand-700' : 'text-slate-600');
    $('modeSize').className = 'py-2 rounded-lg ' + (!exam ? 'bg-white shadow-sm text-brand-700' : 'text-slate-600');
    $('examPanel').classList.toggle('hidden', !exam);
    $('sizePanel').classList.toggle('hidden', exam);
    renderExamGrid(); renderDocTypes(); renderSizeGrid(); renderTargetLine();
  }
  function renderExamGrid(){
    $('examGrid').innerHTML = Object.entries(EXAMS).map(([k,e]) => `
      <button data-exam="${k}" class="text-left rounded-xl border border-slate-200 px-3 py-2.5 hover:border-brand-300 transition ${state.exam===k?'eic-chip-active':''}">
        <span class="block font-semibold text-sm">${e.name}</span>
        <span class="block text-[11px] text-slate-500 truncate">${e.sub}</span>
      </button>`).join('');
  }
  function renderDocTypes(){
    const docs = EXAMS[state.exam].docs;
    if (!docs[state.doc]) state.doc = Object.keys(docs)[0];
    $('docTypeGrid').innerHTML = Object.keys(docs).map(k => `
      <button data-doc="${k}" class="rounded-full border border-slate-200 px-3.5 py-1.5 text-sm hover:border-brand-300 ${state.doc===k?'eic-chip-active':''}">${DOC_LABELS[k]}</button>`).join('');
    const d = docs[state.doc];
    $('examInfo').innerHTML = `<b>Required size:</b> ${d.min} KB – ${d.max} KB` + (d.w ? ` &nbsp;·&nbsp; <b>Dimensions:</b> ${d.w} × ${d.h} px` : '') + ` &nbsp;·&nbsp; <b>Format:</b> JPG/JPEG`;
    $('dimToggleWrap').classList.toggle('hidden', !d.w);
    $('dimToggle').checked = state.resizeDims;
  }
  function renderSizeGrid(){
    $('sizeGrid').innerHTML = SIZE_PRESETS.map(kb => `
      <button data-kb="${kb}" class="rounded-xl border border-slate-200 py-2.5 text-sm font-semibold hover:border-brand-300 ${state.sizeKb===kb && !$('customKb').value ?'eic-chip-active':''}">${kb}<span class="text-[11px] font-normal text-slate-500"> KB</span></button>`).join('');
  }
  function renderTargetLine(){
    const t = getTarget();
    $('currentTarget').innerHTML = `Target: <span class="font-semibold text-brand-700">${t.label}</span> → ${t.min?t.min+'–':'≤ '}${t.max} KB`;
  }

  /* ---------- Settings changes (asks first if results exist) ---------- */
  function changeSetting(mutate, onCancel){
    const before = JSON.stringify(state);
    const draft = JSON.parse(before); mutate(draft);
    if (JSON.stringify(draft) === before) return;          // nothing actually changed
    const apply = () => { state = draft; persist(); renderModes(); };

    if (!items.length) { apply(); return; }                 // no results → just switch
    const oldT = getTarget(); const saved = state; state = draft; const newT = getTarget(); state = saved;
    openModal({
      icon:'🔄', title:'Change compression settings?',
      text:`You have ${items.length} compressed image${items.length>1?'s':''} on screen. What would you like to do?`,
      change:`<div class="flex items-center gap-2 flex-wrap"><span class="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-500 line-through">${targetText(oldT)}</span><span class="text-slate-400">→</span><span class="px-2 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 font-semibold">${targetText(newT)}</span></div>`,
      showHistory:true,
      actions:[
        { label:'🔁 Re-compress the same images', cls:'bg-brand-500 hover:bg-brand-600 text-white shadow-sm',
          run:()=>{ apply(); recompressIfLoaded(); } },
        { label:'🗑️ Clear results & upload new', cls:'bg-white border-2 border-rose-200 text-rose-600 hover:bg-rose-50',
          run:(clearHist)=>{ apply(); clearResults(clearHist); } },
        { label:'Cancel, keep my results', cls:'text-slate-500 hover:bg-slate-50', cancel:true, run:()=>{ onCancel?.(); renderModes(); } },
      ]
    });
  }

  $('modeExam').onclick = () => changeSetting(d => { d.mode='exam'; });
  $('modeSize').onclick = () => changeSetting(d => { d.mode='size'; });
  $('examGrid').onclick = e => { const b=e.target.closest('[data-exam]'); if(!b) return;
    changeSetting(d => { d.exam=b.dataset.exam; if (!EXAMS[d.exam].docs[d.doc]) d.doc=Object.keys(EXAMS[d.exam].docs)[0]; }); };
  $('docTypeGrid').onclick = e => { const b=e.target.closest('[data-doc]'); if(!b) return; changeSetting(d => { d.doc=b.dataset.doc; }); };
  $('sizeGrid').onclick = e => { const b=e.target.closest('[data-kb]'); if(!b) return;
    const prev=$('customKb').value; $('customKb').value='';
    changeSetting(d => { d.sizeKb=+b.dataset.kb; }, () => { $('customKb').value=prev; }); };
  $('customKb').oninput = e => {
    clearTimeout(customTimer);
    customTimer = setTimeout(() => {
      const typed = Math.round(+e.target.value), prev = lastCustom;
      if (!Number.isFinite(typed) || typed < MIN_KB) return;
      const v = Math.min(typed, MAX_KB);             // clamp absurd values
      if (v !== typed) e.target.value = String(v);
      lastCustom = e.target.value;
      changeSetting(d => { d.sizeKb=v; }, () => { $('customKb').value = prev; lastCustom = prev; });
    }, 800);  // wait until the student stops typing
  };
  $('dimToggle').onchange = e => { const v=e.target.checked; changeSetting(d => { d.resizeDims=v; }, () => { $('dimToggle').checked=!v; }); };

  /* ---------- Upload flow (max 5 · JPG/JPEG/PNG only) ---------- */
  const dz = $('dropZone');
  ['dragenter','dragover'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('border-brand-500','bg-brand-50/40'); }, { signal }));
  ['dragleave','drop'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove('border-brand-500','bg-brand-50/40'); }, { signal }));
  dz.addEventListener('drop', e => handleFiles([...e.dataTransfer.files]), { signal });
  $('fileInput').onchange = e => { handleFiles([...e.target.files]); e.target.value=''; };

  function updateSlots(){
    const n = items.length;
    $('slotCount').textContent = `${n} / ${MAX_FILES}`;
    $('slotCount').className = 'text-xs font-semibold px-2.5 py-1 rounded-full ' + (n>=MAX_FILES ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600');
    dz.classList.toggle('opacity-50', n>=MAX_FILES);
    dz.classList.toggle('pointer-events-none', n>=MAX_FILES);
  }

  async function handleFiles(files){
    if (!files.length) return;
    const rejected = [], tooBig = [], tooManyPixels = [];
    let valid = files.filter(f => {
      const ok = ALLOWED_TYPES.includes(f.type) && ALLOWED_EXT.test(f.name);
      if (!ok) { rejected.push(f.name); return false; }
      if (f.size > MAX_FILE_BYTES || f.size === 0) { tooBig.push(f.name); return false; }
      return true;
    });
    const free = MAX_FILES - items.length;
    let skipped = 0;
    if (valid.length > free) { skipped = valid.length - free; valid = valid.slice(0, free); }

    const msgs = [];
    if (rejected.length) msgs.push(`${rejected.length} file(s) skipped: only JPG, JPEG and PNG are allowed`);
    if (tooBig.length) msgs.push(`${tooBig.length} file(s) empty or over 25 MB skipped`);
    if (skipped) msgs.push(`Only ${MAX_FILES} images allowed at a time, so ${skipped} were not added`);
    if (msgs.length) toast(msgs.join(' · '));
    if (!valid.length) return;

    for (const file of valid){
      const origURL = URL.createObjectURL(file);
      try {
        // A file renamed to .jpg/.png that is not really an image fails to decode here and is dropped.
        const img = await loadImage(origURL);
        if (!img.naturalWidth || !img.naturalHeight) throw new Error('empty image');
        if (img.naturalWidth * img.naturalHeight > MAX_PIXELS) {
          URL.revokeObjectURL(origURL); tooManyPixels.push(file.name); continue;
        }
        items.push({ id: Date.now()+Math.random(), file, origURL, img, name: file.name.replace(/\.[^.]+$/,''), formatCache:{} });
      } catch { URL.revokeObjectURL(origURL); toast('Could not read one of the files. Is it a real JPG or PNG image?'); }
    }
    if (tooManyPixels.length) toast(`${tooManyPixels.length} image(s) skipped: too many pixels (over 100 megapixels). Please resize or crop first.`);
    updateSlots();
    if (items.length) await runAll();
  }

  function recompressIfLoaded(){ if (items.length) { toast(`Re-compressing for ${getTarget().label}`); items.forEach(i=>{ i.blob=null; }); runAll(); } }

  async function runAll(){
    const token = ++runToken;
    renderResults();
    $('resultCard').scrollIntoView({behavior:'smooth', block:'start'});
    const t = getTarget();
    for (const it of items){
      if (it.blob && it.target && it.target.label===t.label && it.target.max===t.max && it.target.w===t.w) continue;
      await new Promise(r=>setTimeout(r,30));
      const res = await compressToTarget(it.img, t);
      if (token !== runToken) return; // settings changed mid-run
      if (!res) { it.error = 'Could not reach that size. Try a larger target.'; renderResults(); continue; }
      if (it.url) URL.revokeObjectURL(it.url);
      Object.assign(it, { blob:res.blob, url:URL.createObjectURL(res.blob), w:res.w, h:res.h, target:t, formatCache:{}, error:null });
      renderResults();
      addHistory(it);
    }
  }

  function resultHTML(it, idx){
    const head = `<div class="flex items-center justify-between gap-2 mb-3">
        <p class="font-semibold text-sm truncate"><span class="text-slate-400 mr-1">#${idx+1}</span>${esc(it.file.name)}</p>
        <button data-remove="${it.id}" class="shrink-0 text-xs text-slate-400 hover:text-rose-600 px-2 py-1 rounded-lg hover:bg-rose-50">✕ Remove</button></div>`;
    if (it.error) return `<article class="rounded-2xl border border-rose-200 bg-rose-50/40 p-4">${head}<p class="text-sm text-rose-700">${it.error}</p></article>`;
    if (!it.blob) return `<article class="rounded-2xl border border-slate-200 p-4">${head}<div class="flex items-center gap-3 py-6 justify-center text-slate-500 text-sm"><div class="eic-spinner"></div>Compressing to fit your limit…</div></article>`;

    const t = it.target, kb = it.blob.size/1024;
    const saved = Math.max(0, (1 - it.blob.size/it.file.size)*100);
    const pill = (t.min && kb < t.min)
      ? `<span class="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">⚠ Below minimum ${t.min} KB</span>`
      : `<span class="text-xs font-semibold px-3 py-1 rounded-full bg-leaf-50 text-leaf-700 border border-leaf-200">✓ Ready (${kb.toFixed(1)} KB ≤ ${t.max} KB)</span>`;
    const fmtBtn = (f,label,primary) => `<button data-fmt="${f}" data-id="${it.id}" class="dl-btn rounded-xl text-sm font-semibold ${primary?'w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white shadow-sm':'py-2.5 border border-slate-200 hover:border-brand-500 hover:bg-brand-50'}">${label}<span class="fmt-size block text-[11px] font-normal ${primary?'opacity-90':'text-slate-500'}">${primary?fmtSize(it.blob.size):(it.formatCache[f]?fmtSize(it.formatCache[f].size):'tap to download')}</span></button>`;

    return `<article class="rounded-2xl border border-slate-200 p-4">
      ${head}
      <div class="mb-3">${pill}</div>
      <div class="grid grid-cols-3 gap-2 text-center">
        <div class="rounded-xl bg-slate-50 p-2.5"><p class="text-[11px] text-slate-500">Original</p><p class="font-bold">${fmtSize(it.file.size)}</p></div>
        <div class="rounded-xl bg-leaf-50 p-2.5"><p class="text-[11px] text-leaf-700">Compressed</p><p class="font-bold text-leaf-700">${fmtSize(it.blob.size)}</p></div>
        <div class="rounded-xl bg-brand-50 p-2.5"><p class="text-[11px] text-brand-700">Saved</p><p class="font-bold text-brand-700">${saved.toFixed(0)}%</p></div>
      </div>
      <div class="mt-2.5 h-2 rounded-full bg-slate-100 overflow-hidden"><div class="h-full bg-leaf-500" style="width:${Math.max(2,100-saved)}%"></div></div>
      <p class="mt-1 text-[11px] text-slate-500">Compressed file is ${(100-saved).toFixed(1)}% of the original (${saved.toFixed(1)}% smaller)</p>
      <div class="mt-4 grid grid-cols-2 gap-3">
        <figure class="rounded-xl border border-slate-200 overflow-hidden">
          <div class="eic-checker h-40 sm:h-48 grid place-items-center p-2"><img src="${it.origURL}" class="max-h-full max-w-full object-contain" alt="Original" /></div>
          <figcaption class="px-2.5 py-1.5 text-[11px] flex justify-between border-t border-slate-100"><b class="text-slate-700">Before</b><span class="text-slate-500">${it.img.naturalWidth}×${it.img.naturalHeight}</span></figcaption>
        </figure>
        <figure class="rounded-xl border-2 border-leaf-200 overflow-hidden">
          <div class="eic-checker h-40 sm:h-48 grid place-items-center p-2"><img src="${it.url}" class="max-h-full max-w-full object-contain" alt="Compressed" /></div>
          <figcaption class="px-2.5 py-1.5 text-[11px] flex justify-between border-t border-leaf-100"><b class="text-leaf-700">After</b><span class="text-slate-500">${it.w}×${it.h}</span></figcaption>
        </figure>
      </div>
      <div class="mt-4">${fmtBtn('jpg','⇣ Download JPG',true)}</div>
      <details class="mt-3">
        <summary class="cursor-pointer text-sm text-slate-500 hover:text-brand-700 select-none">Need another format? (PNG, WEBP, PDF)</summary>
        <div class="mt-2 grid grid-cols-3 gap-2">${fmtBtn('png','PNG')}${fmtBtn('webp','WEBP')}${fmtBtn('pdf','PDF')}</div>
      </details>
      <p data-note="${it.id}" class="mt-2 text-xs text-amber-700 hidden"></p>
    </article>`;
  }

  // Switch between "upload" view and "results" view
  function updateView(){
    const hasResults = items.length > 0;
    $('uploadCard').classList.toggle('hidden', hasResults);
    $('tipsCard').classList.toggle('hidden', hasResults);
    $('resultCard').classList.toggle('hidden', !hasResults);
    // On phones show results first, settings below
    $('rightCol').classList.toggle('order-first', hasResults);
    $('rightCol').classList.toggle('lg:order-none', hasResults);
    const left = MAX_FILES - items.length;
    $('addMore').disabled = left <= 0;
    $('addMore').classList.toggle('opacity-40', left <= 0);
    $('addMore').classList.toggle('cursor-not-allowed', left <= 0);
    $('addMore').textContent = left > 0 ? `＋ Add more (${left} left)` : 'Limit reached (5/5)';
  }

  function renderResults(){
    updateView();
    if (!items.length) return;
    $('results').innerHTML = items.map(resultHTML).join('');
    const done = items.filter(i=>i.blob);
    const o = done.reduce((s,i)=>s+i.file.size,0), c = done.reduce((s,i)=>s+i.blob.size,0);
    const busy = done.length < items.length - items.filter(i=>i.error).length;
    const t = getTarget();
    $('summaryIcon').innerHTML = busy ? '<div class="eic-spinner" style="border-color:#fff6;border-top-color:#fff"></div>' : '✓';
    $('summaryIcon').className = 'w-11 h-11 shrink-0 rounded-2xl text-white grid place-items-center text-xl ' + (busy ? 'bg-brand-500' : 'bg-leaf-500');
    $('summaryTitle').textContent = busy
      ? `Compressing ${done.length + 1} of ${items.length}…`
      : `${done.length} image${done.length>1?'s':''} ready to upload 🎉`;
    $('totals').innerHTML = done.length
      ? `Total <b>${fmtSize(o)}</b> → <b class="text-leaf-700">${fmtSize(c)}</b> · <b>${Math.max(0,(1-c/o)*100).toFixed(0)}%</b> smaller`
      : 'Hang on, this takes a few seconds.';
    $('targetChip').textContent = `🎯 ${t.label} · ${t.min?t.min+'–':'≤ '}${t.max} KB`;
    $('downloadAll').textContent = done.length > 1 ? `⇣ Download all ${done.length} (JPG)` : '⇣ Download JPG';
    $('downloadAll').disabled = !done.length;
    $('downloadAll').classList.toggle('opacity-50', !done.length);
  }

  /* ---------- Downloads ---------- */
  async function buildFormat(it, fmt){
    if (it.formatCache[fmt]) return it.formatCache[fmt];
    const c = drawToCanvas(await loadImage(it.url), 1);
    let blob;
    if (fmt === 'jpg') blob = it.blob;
    else if (fmt === 'png') blob = await canvasToBlob(c, 'image/png');
    else if (fmt === 'webp') {
      const r = await bestQuality(c, 'image/webp', Math.floor(it.target.max*1024*0.97));
      blob = r ? r.blob : await canvasToBlob(c, 'image/webp', 0.5);
    } else if (fmt === 'pdf') {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ unit:'px', format:[it.w, it.h], orientation: it.w>it.h?'l':'p', hotfixes:['px_scaling'] });
      pdf.addImage(await blobToDataURL(it.blob), 'JPEG', 0, 0, it.w, it.h);
      blob = pdf.output('blob');
    }
    it.formatCache[fmt] = blob;
    return blob;
  }
  $('results').onclick = async e => {
    const rm = e.target.closest('[data-remove]');
    if (rm){
      const it = items.find(i=>i.id==rm.dataset.remove);
      if (it){ URL.revokeObjectURL(it.origURL); if (it.url) URL.revokeObjectURL(it.url); }
      items = items.filter(i=>i.id!=rm.dataset.remove); updateSlots(); renderResults(); return;
    }
    const btn = e.target.closest('.dl-btn'); if (!btn) return;
    const it = items.find(i=>i.id==btn.dataset.id); if (!it?.blob) return;
    const fmt = btn.dataset.fmt;
    if (fmt === 'pdf' && !window.jspdf) return toast('PDF library still loading. Try again in a moment.');
    const blob = await buildFormat(it, fmt);
    btn.querySelector('.fmt-size').textContent = fmtSize(blob.size);
    const note = root.querySelector(`[data-note="${it.id}"]`);
    if (blob.size > it.target.max*1024){
      note.textContent = `${fmt.toUpperCase()} came out at ${fmtSize(blob.size)}, which is above the ${it.target.max} KB limit. ${fmt==='png'?'PNG is lossless and usually larger. ':''}Use JPG to stay within the limit.`;
      note.classList.remove('hidden');
    } else note.classList.add('hidden');
    saveBlob(blob, `${it.name}_${Math.round(blob.size/1024)}kb.${fmt}`);
    toast(`Downloaded ${fmt.toUpperCase()} · ${fmtSize(blob.size)}`);
  };
  $('downloadAll').onclick = async () => {
    const done = items.filter(i=>i.blob);
    for (const it of done){ saveBlob(it.blob, `${it.name}_${Math.round(it.blob.size/1024)}kb.jpg`); await new Promise(r=>setTimeout(r,400)); }
    toast(`Downloaded ${done.length} JPG files`);
  };
  function clearResults(clearHistory){
    items.forEach(i=>{ URL.revokeObjectURL(i.origURL); if (i.url) URL.revokeObjectURL(i.url); });
    items = []; runToken++; updateSlots(); renderResults();
    if (clearHistory) { sessionStorage.removeItem(LS_HISTORY); renderHistory(); }
    window.scrollTo({top:0,behavior:'smooth'});
    toast(clearHistory ? 'Results and saved history cleared' : 'Cleared. Upload new images.');
  }
  $('resetBtn').onclick = () => openModal({
    icon:'🗑️', danger:true, title:'Clear these results?',
    text:`Your ${items.length} compressed image${items.length>1?'s':''} will be removed from the screen. Download them first if you still need them.`,
    showHistory:true,
    actions:[
      { label:'Yes, clear & start over', cls:'bg-rose-600 hover:bg-rose-700 text-white shadow-sm', run:(h)=>clearResults(h) },
      { label:'Cancel', cls:'text-slate-500 hover:bg-slate-50', cancel:true },
    ]
  });

  /* ---------- Popup helper ---------- */
  function openModal({ icon, title, text, change, showHistory, danger, actions }){
    $('modalIcon').textContent = icon || '❔';
    $('modalIcon').className = 'w-12 h-12 shrink-0 rounded-2xl grid place-items-center text-2xl ' + (danger ? 'bg-rose-50 text-rose-600' : 'bg-brand-50 text-brand-600');
    $('modalTitle').textContent = title; $('modalText').textContent = text;
    $('modalChange').innerHTML = change || ''; $('modalChange').classList.toggle('hidden', !change);
    $('modalHistory').checked = false;
    $('modalHistoryWrap').classList.toggle('hidden', !showHistory); $('modalHistoryWrap').classList.toggle('flex', !!showHistory);
    $('modalActions').innerHTML = '';
    modalCancel = actions.find(a=>a.cancel)?.run || null;
    actions.forEach(a => {
      const btn = document.createElement('button');
      btn.className = 'h-12 rounded-xl text-sm font-semibold transition ' + a.cls;
      btn.textContent = a.label;
      btn.onclick = () => { const h=$('modalHistory').checked; closeModal(); a.run?.(h); };
      $('modalActions').appendChild(btn);
    });
    $('modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      $('modalBackdrop').classList.remove('opacity-0');
      $('modalPanel').classList.remove('translate-y-6','opacity-0');
      $('modalActions').firstChild?.focus();
    });
  }
  function closeModal(){
    $('modalBackdrop').classList.add('opacity-0');
    $('modalPanel').classList.add('translate-y-6','opacity-0');
    document.body.style.overflow = '';
    setTimeout(()=>$('modal').classList.add('hidden'), 200);
  }
  function cancelModal(){ if ($('modal').classList.contains('hidden')) return; closeModal(); modalCancel?.(); }
  $('modalBackdrop').onclick = cancelModal;
  document.addEventListener('keydown', e => { if (e.key === 'Escape') cancelModal(); }, { signal });

  /* ---------- History (sessionStorage: wiped when the tab is closed) ---------- */
  async function addHistory(it){
    const thumbC = drawToCanvas(await loadImage(it.url), Math.min(1, 96/Math.max(it.w,it.h)));
    const thumb = thumbC.toDataURL('image/jpeg', 0.7);
    const full = it.blob.size < 600*1024 ? await blobToDataURL(it.blob) : null; // keep storage small
    let hist = readHistory();
    hist.unshift({ id:Date.now()+Math.random(), name:it.name, label:it.target.label, orig:it.file.size, comp:it.blob.size, w:it.w, h:it.h, thumb, full, at:new Date().toISOString() });
    hist = hist.slice(0, 12);
    while (hist.length && !saveJSON(LS_HISTORY, hist)) { hist.pop(); } // drop oldest if storage is full
    renderHistory();
  }
  // Only well-formed entries are ever rendered: image sources must be real JPEG data URLs and the
  // numbers must be numbers, so a tampered entry can never inject markup or a javascript: link.
  const validEntry = h => h && typeof h === 'object'
    && Number.isFinite(h.id) && Number.isFinite(h.orig) && Number.isFinite(h.comp) && h.orig > 0
    && typeof h.name === 'string' && typeof h.label === 'string'
    && isJpegDataURL(h.thumb) && (h.full === null || isJpegDataURL(h.full));
  const readHistory = () => { const raw = loadJSON(LS_HISTORY, []); return Array.isArray(raw) ? raw.filter(validEntry) : []; };

  function renderHistory(){
    const hist = readHistory();
    $('clearHistory').classList.toggle('hidden', !hist.length);
    if (!hist.length){ $('historyList').innerHTML = `<li class="text-sm text-slate-400 text-center py-6 border border-dashed border-slate-200 rounded-xl">No compressions yet</li>`; return; }
    $('historyList').innerHTML = hist.map(h => {
      const pct = Math.max(0,(1-h.comp/h.orig)*100).toFixed(0);
      return `<li class="flex items-center gap-3 p-2 rounded-xl border border-slate-100 hover:bg-slate-50">
        <img src="${h.thumb}" class="w-11 h-11 rounded-lg object-cover border border-slate-200" alt="" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">${esc(h.name)}</p>
          <p class="text-[11px] text-slate-500 truncate">${esc(h.label)} · ${fmtSize(h.orig)} → <b class="text-leaf-700">${fmtSize(h.comp)}</b> (−${pct}%)</p>
        </div>
        ${h.full ? `<button data-dl="${h.id}" title="Download JPG" class="shrink-0 w-8 h-8 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100">⇣</button>` : ''}
        <button data-del="${h.id}" title="Remove" class="shrink-0 w-8 h-8 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600">✕</button>
      </li>`; }).join('');
  }
  $('historyList').onclick = e => {
    const dl = e.target.closest('[data-dl]'), del = e.target.closest('[data-del]');
    let hist = readHistory();
    if (dl){ const h = hist.find(x=>x.id==dl.dataset.dl); if (h && h.full) { const a=document.createElement('a'); a.href=h.full; a.download=`${h.name}_${Math.round(h.comp/1024)}kb.jpg`; a.click(); } }
    if (del){ hist = hist.filter(x=>x.id!=del.dataset.del); saveJSON(LS_HISTORY, hist); renderHistory(); }
  };
  $('clearHistory').onclick = () => openModal({
    icon:'🗑️', danger:true, title:'Clear recent compressions?',
    text:'This removes the saved history on this device. Images already downloaded are not affected.',
    actions:[
      { label:'Yes, clear history', cls:'bg-rose-600 hover:bg-rose-700 text-white shadow-sm', run:()=>{ sessionStorage.removeItem(LS_HISTORY); renderHistory(); toast('History cleared'); } },
      { label:'Cancel', cls:'text-slate-500 hover:bg-slate-50', cancel:true },
    ]
  });

  /* ---------- Results actions ---------- */
  $('addMore').onclick = () => { if (items.length < MAX_FILES) $('fileInput').click(); };
  $('changeTarget').onclick = () => {
    $('settingsCard').scrollIntoView({behavior:'smooth', block:'start'});
    $('settingsCard').classList.add('ring-4','ring-brand-100');
    setTimeout(()=>$('settingsCard').classList.remove('ring-4','ring-brand-100'), 1600);
  };
  const rc = $('resultCard');
  ['dragenter','dragover'].forEach(ev => rc.addEventListener(ev, e => { e.preventDefault(); rc.classList.add('ring-4','ring-brand-100'); }, { signal }));
  ['dragleave','drop'].forEach(ev => rc.addEventListener(ev, e => { e.preventDefault(); rc.classList.remove('ring-4','ring-brand-100'); }, { signal }));
  rc.addEventListener('drop', e => handleFiles([...e.dataTransfer.files]), { signal });

  /* ---------- Init ---------- */
  renderModes(); renderHistory(); updateSlots(); updateView();

  // Cleanup on unmount
  return () => {
    runToken++;
    clearTimeout(customTimer);
    clearTimeout($('toast')?._h);
    items.forEach(i => { URL.revokeObjectURL(i.origURL); if (i.url) URL.revokeObjectURL(i.url); });
    items = [];
    document.body.style.overflow = '';
  };
}

export default function ExamImageCompressorClient() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ac = new AbortController();
    const cleanup = initCompressor(rootRef.current, ac.signal);
    return () => { ac.abort(); cleanup(); };
  }, []);

  return (
    <div ref={rootRef}>
      {/* PDF export uses jsPDF; loaded lazily and only needed when "PDF" is clicked */}
      {/* Pinned version + Subresource Integrity: the browser refuses the file if even one byte differs
          from the official cdnjs build, so a compromised CDN cannot inject code into this page. */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/4.2.1/jspdf.umd.min.js"
        integrity="sha512-plOdviVmws4Y3JAvbnpfKb2hVxKM1lCwsi3vmElYRj+tiDLffZ4FVUj5a8vyKJ9pIgl8JCAHEJ4D1iUKBecswg=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        strategy="lazyOnload"
      />

      {/* Tool sub-bar */}
      <div className="bg-linear-to-r from-brand-50 via-white to-leaf-50 border-b border-slate-100">
        <div className="w-full mx-auto px-4 md:px-15 py-3 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-sm text-slate-500">
            <Link href="/" className="hover:text-brand-600">Home</Link> <span className="mx-1">›</span> Tools <span className="mx-1">›</span> <span className="text-slate-800 font-medium">Exam Image Compressor</span>
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-leaf-700 bg-white border border-leaf-200 px-3 py-1.5 rounded-full">🔒 100% private: images never leave your device</span>
        </div>
      </div>

      <main className="w-full mx-auto px-4 md:px-15 py-6 sm:py-8">
        {/* Hero */}
        <section className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Compress your photo for <span className="text-brand-500">govt job</span> <span className="text-leaf-500">applications</span></h1>
          <p className="mt-3 text-slate-500 max-w-2xl mx-auto">Choose a size (or your exam), upload your photo, and download. It is compressed to fit the limit automatically.</p>
        </section>

        {/* Steps */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* LEFT: settings */}
          <section id="eic-leftCol" className="lg:col-span-2 space-y-6">

            {/* Step 1: mode */}
            <div id="eic-settingsCard" className="scroll-mt-28 rounded-2xl border border-slate-200 p-5 shadow-xs bg-white">
              <h2 className="font-semibold flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs grid place-items-center">1</span> Choose the size</h2>
              <div className="mt-4 grid grid-cols-2 bg-slate-100 p-1 rounded-xl text-sm font-medium">
                <button id="eic-modeSize" className="py-2 rounded-lg bg-white shadow-sm text-brand-700">By Size (KB)</button>
                <button id="eic-modeExam" className="py-2 rounded-lg text-slate-600">By Exam</button>
              </div>

              {/* Exam mode */}
              <div id="eic-examPanel" className="mt-5 hidden">
                <label className="text-sm font-medium text-slate-700">Select exam</label>
                <div id="eic-examGrid" className="mt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2"></div>

                <label className="block mt-5 text-sm font-medium text-slate-700">What are you uploading?</label>
                <div id="eic-docTypeGrid" className="mt-2 flex flex-wrap gap-2"></div>

                <div id="eic-examInfo" className="mt-4 rounded-xl bg-brand-50 border border-brand-100 p-3 text-sm text-brand-700"></div>
                <label id="eic-dimToggleWrap" className="mt-3 flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input id="eic-dimToggle" type="checkbox" defaultChecked className="w-4 h-4 accent-brand-500" />
                  Also resize to the exam&apos;s pixel size
                </label>
              </div>

              {/* Size mode */}
              <div id="eic-sizePanel" className="mt-5">
                <label className="text-sm font-medium text-slate-700">Target maximum size</label>
                <div id="eic-sizeGrid" className="mt-2 grid grid-cols-4 gap-2"></div>
                <div className="mt-4">
                  <label className="text-sm font-medium text-slate-700" htmlFor="eic-customKb">Or enter custom size</label>
                  <div className="mt-2 flex items-center rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-brand-200 overflow-hidden">
                    <input id="eic-customKb" type="number" min="5" max="5000" placeholder="e.g. 80" className="flex-1 px-3 py-2.5 outline-hidden text-sm" />
                    <span className="px-3 text-sm text-slate-500 bg-slate-50 border-l border-slate-200 py-2.5">KB</span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400">⚠️ Exam limits change with each notification. Always check the official notification before you submit.</p>
            </div>
          </section>

          {/* RIGHT: upload + results */}
          <section id="eic-rightCol" className="lg:col-span-3 space-y-6">
            {/* Step 2: upload (hidden once results appear) */}
            <div id="eic-uploadCard" className="rounded-2xl border border-slate-200 p-5 shadow-xs bg-white">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-brand-500 text-white text-xs grid place-items-center">2</span> Upload your photo</h2>
                <span id="eic-slotCount" className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">0 / 5</span>
              </div>
              <label id="eic-dropZone" htmlFor="eic-fileInput" className="mt-4 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-300 rounded-2xl py-10 px-4 cursor-pointer hover:border-brand-500 hover:bg-brand-50/40 transition">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 grid place-items-center text-2xl">📷</div>
                <p className="mt-3 font-semibold">Tap to choose or drag &amp; drop</p>
                <p className="text-sm text-slate-500">Up to <b>5 images</b> at a time · <b>JPG, JPEG, PNG</b> only · max 25 MB each</p>
                <span className="mt-4 inline-flex px-5 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-semibold shadow-sm hover:bg-brand-600">Choose images</span>
              </label>
              <input id="eic-fileInput" type="file" multiple accept=".jpg,.jpeg,.png,image/jpeg,image/png" className="hidden" />
              <div id="eic-currentTarget" className="mt-3 text-sm text-slate-600 text-center"></div>
            </div>

            {/* Step 3: results (replaces the upload box) */}
            <div id="eic-resultCard" className="scroll-mt-28 rounded-2xl border border-slate-200 shadow-xs overflow-hidden hidden bg-white">
              {/* Summary banner */}
              <div id="eic-summaryBanner" className="p-5 bg-linear-to-r from-leaf-50 to-white border-b border-leaf-100">
                <div className="flex items-start gap-3">
                  <div id="eic-summaryIcon" className="w-11 h-11 shrink-0 rounded-2xl bg-leaf-500 text-white grid place-items-center text-xl">✓</div>
                  <div className="flex-1 min-w-0">
                    <h2 id="eic-summaryTitle" className="font-bold text-lg leading-tight">Your images are ready</h2>
                    <p id="eic-totals" className="mt-1 text-sm text-slate-600"></p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span id="eic-targetChip" className="px-2.5 py-1 rounded-full bg-white border border-brand-200 text-brand-700 font-semibold"></span>
                      <button id="eic-changeTarget" className="px-2.5 py-1 rounded-full text-slate-500 hover:text-brand-700 hover:bg-brand-50 underline-offset-2 hover:underline">✎ Change exam / size</button>
                    </div>
                  </div>
                </div>
                {/* Actions */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button id="eic-downloadAll" className="sm:col-span-1 h-11 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-sm transition">⇣ Download all (JPG)</button>
                  <button id="eic-addMore" className="h-11 rounded-xl border-2 border-dashed border-brand-300 text-brand-700 hover:bg-brand-50 text-sm font-semibold transition">＋ Add more</button>
                  <button id="eic-resetBtn" className="h-11 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium transition">↺ Start over</button>
                </div>
              </div>
              <div id="eic-results" className="p-5 space-y-5"></div>
              <p className="px-5 pb-5 -mt-1 text-xs text-slate-400 text-center">Tip: you can also drag &amp; drop more images anywhere on this box.</p>
            </div>

            {/* Tips */}
            <div id="eic-tipsCard" className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">
              <p className="font-semibold text-slate-800 mb-2">Tips for a smooth upload</p>
              <ul className="space-y-1.5 list-disc pl-5">
                <li>Use a recent passport-size photo with a plain white or light background.</li>
                <li>Sign in black ink on white paper and crop tightly around the signature.</li>
                <li>Most exam portals only accept <b>JPG/JPEG</b>, so pick JPG unless the portal asks for something else.</li>
              </ul>
            </div>
          </section>
        </div>

        {/* Recent compressions: collapsed by default so the page stays simple */}
        <details className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <summary className="cursor-pointer select-none px-5 py-4 font-semibold text-slate-800 hover:text-brand-700">
            Recent compressions <span className="text-xs font-normal text-slate-400">(kept only until you close this tab)</span>
          </summary>
          <div className="px-5 pb-5">
            <div className="flex justify-end">
              <button id="eic-clearHistory" className="text-xs text-rose-600 hover:underline">Clear all</button>
            </div>
            <ul id="eic-historyList" className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3"></ul>
          </div>
        </details>
      </main>

      {/* Confirm popup */}
      <div id="eic-modal" className="fixed inset-0 z-200 hidden" role="dialog" aria-modal="true" aria-labelledby="eic-modalTitle">
        <div id="eic-modalBackdrop" className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 transition-opacity duration-200"></div>
        <div className="absolute inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
          <div id="eic-modalPanel" className="pointer-events-auto w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 translate-y-6 opacity-0 transition duration-200">
            <div className="flex items-start gap-4">
              <div id="eic-modalIcon" className="w-12 h-12 shrink-0 rounded-2xl bg-brand-50 text-brand-600 grid place-items-center text-2xl">🔄</div>
              <div className="flex-1">
                <h3 id="eic-modalTitle" className="text-lg font-bold leading-tight"></h3>
                <p id="eic-modalText" className="mt-1.5 text-sm text-slate-600"></p>
              </div>
            </div>
            <div id="eic-modalChange" className="mt-4 hidden rounded-xl bg-slate-50 border border-slate-100 p-3 text-sm"></div>
            <label id="eic-modalHistoryWrap" className="mt-4 hidden items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input id="eic-modalHistory" type="checkbox" className="w-4 h-4 accent-brand-500" />
              Also clear the recent compressions list
            </label>
            <div id="eic-modalActions" className="mt-6 grid gap-2"></div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div id="eic-toast" className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg opacity-0 pointer-events-none transition z-210"></div>
    </div>
  );
}

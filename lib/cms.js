const cheerio = require('cheerio');
const crypto = require('node:crypto');
const PROJECT = '7hhngrqf';
const DATASET = 'production';
const memo = new Map();
const excluded = new Set(['script','style','noscript','svg','canvas','input','textarea','select','option']);
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
function allowedUrl(value, image = false) {
  if (typeof value !== 'string' || /[\u0000-\u0020\\]/.test(value)) return false;
  if (/^(\/[^/]|#)/.test(value)) return true;
  try { const u = new URL(value); return image ? u.protocol === 'https:' : ['https:', 'mailto:', 'tel:'].includes(u.protocol); } catch { return false; }
}
function scan(html) {
  const $ = cheerio.load(html); const slots = [];
  function walk(node, path, blocked = false, section = 'General') {
    const tag = node.name;
    blocked = blocked || excluded.has(tag) || node.attribs?.['aria-hidden'] === 'true' || node.attribs?.hidden !== undefined;
    if (blocked) return;
    if (tag === 'head') section = 'Search and sharing';
    if (['header','footer','nav'].includes(tag)) section = tag[0].toUpperCase()+tag.slice(1);
    if (['section','main'].includes(tag)) section = $(node).find('h1,h2').first().text().replace(/\s+/g,' ').trim().slice(0,75) || node.attribs?.id || section;
    const add = (kind, value, attr) => {
      if (!value || !String(value).trim()) return;
      const key = 'f'+digest(path+':'+(attr||'text')).slice(0,18);
      slots.push({key,kind,value,attr,node,path,section,label:kind==='image' ? ($(node).attr('alt')||'Image') : kind==='link' ? ($(node).text().trim().slice(0,70)||value) : String(value).trim().slice(0,85)});
    };
    if (node.type === 'text' && node.data.trim() && /[A-Za-z0-9]/.test(node.data)) add('text',node.data);
    if (tag === 'meta' && ['description','og:title','og:description','twitter:title','twitter:description'].includes(node.attribs?.name||node.attribs?.property)) add('text',node.attribs.content,'content');
    if (tag === 'img' && node.attribs?.src) { add('image',node.attribs.src,'src'); if(node.attribs.alt) add('text',node.attribs.alt,'alt'); }
    if (tag === 'a' && allowedUrl(node.attribs?.href)) add('link',node.attribs.href,'href');
    (node.children||[]).forEach((child,i)=>walk(child,path+'.'+i,blocked,section));
  }
  walk($.root()[0], '0');
  return {$,slots};
}
function imageUrl(field) {
  const ref = field.image?.asset?._ref;
  if (!ref) return field.value;
  const m = /^image-([a-zA-Z0-9]+)-(\d+x\d+)-(jpg|jpeg|png|webp|gif|avif)$/.exec(ref);
  return m ? `https://cdn.sanity.io/images/${PROJECT}/${DATASET}/${m[1]}-${m[2]}.${m[3]}` : field.value;
}
function render(html, doc) {
  if (!doc || doc._type !== "sitePage") return html;
  const fields = new Map((doc.sections||[]).flatMap(s=>s.fields||[]).map(f=>[f._key,f]));
  const {$,slots} = scan(html); let changed = false;
  for (const slot of slots) {
    const field = fields.get(slot.key); if (!field || field.original !== slot.value || field.kind !== slot.kind) continue;
    const value = slot.kind==='image' ? imageUrl(field) : field.value;
    if (typeof value !== 'string' || value === slot.value || value.length > 20000) continue;
    if (slot.kind !== 'text' && !allowedUrl(value,slot.kind==='image')) continue;
    if (slot.attr) $(slot.node).attr(slot.attr,value); else slot.node.data = value;
    changed = true;
  }
  return changed ? $.html() : html;
}
async function published(id) {
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) return null;
  const existing = memo.get(id);
  if (existing && Date.now()-existing.at < 15000) return existing.doc;
  try {
    const query = '*[_id == $id && _type == "sitePage"][0]';
    const url = new URL(`https://${PROJECT}.api.sanity.io/v2026-09-17/data/query/${DATASET}`);
    url.searchParams.set('query',query); url.searchParams.set('$id',JSON.stringify(id)); url.searchParams.set('perspective','published');
    const response=await fetch(url,{signal:AbortSignal.timeout(1800)});
    if(!response.ok) throw new Error('CMS unavailable');
    const doc=(await response.json()).result;
    memo.set(id,{at:Date.now(),doc}); return doc;
  } catch { return existing?.doc || null; }
}
async function renderPublished(html,id) { return render(html,await published(id)); }
module.exports={scan,digest,render,renderPublished,published,allowedUrl,imageUrl};

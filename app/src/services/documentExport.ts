import { FACILITY_BRAND } from '../data/sampleData';
import type { FamilyUpdate, Resident } from '../types';

/**
 * Builds a standalone printable HTML document (letterhead, full update, footer)
 * and opens it in a new window for the browser's native print-to-PDF flow —
 * ported as-is from the original prototype, no PDF library involved.
 */
export function generateFamilyDocument(resident: Resident, update: FamilyUpdate): boolean {
  const b = FACILITY_BRAND;
  const weekOf = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${resident.name} — Family Update</title>
<style>
@page{size:letter;margin:0.75in;}
*{box-sizing:border-box;}
body{font-family:Georgia,'Times New Roman',serif;color:#2B2420;margin:0;padding:0;background:#fff;}
.toolbar{position:sticky;top:0;background:#fff;border-bottom:1px solid #E5DDD0;padding:12px 24px;display:flex;gap:10px;justify-content:flex-end;}
.toolbar button{font-family:-apple-system,sans-serif;font-size:13px;padding:8px 16px;border-radius:6px;border:1px solid ${b.primary};background:${b.primary};color:#fff;cursor:pointer;font-weight:600;}
.toolbar button.secondary{background:#fff;color:${b.primary};}
.doc{max-width:7.5in;margin:0 auto;padding:0 24px 48px;}
.letterhead{display:flex;align-items:center;gap:14px;border-bottom:3px solid ${b.grove};padding:28px 0 18px;margin-bottom:24px;}
.logo-badge{width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,${b.primary},${b.grove});color:#fff;display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:700;letter-spacing:0.5px;flex-shrink:0;overflow:hidden;}
.logo-badge img{width:100%;height:100%;object-fit:cover;}
.brand-name{font-size:24px;font-weight:700;color:${b.primaryDark};letter-spacing:0.5px;}
.brand-tag{font-size:12px;color:${b.grove};font-style:italic;margin-top:2px;}
.doc-title{font-size:13px;color:#8A7A63;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4px;}
.res-name{font-size:22px;font-weight:700;color:#2B2420;margin-bottom:4px;}
.res-meta{font-size:13px;color:#6B5D4A;margin-bottom:20px;}
.greeting{font-style:italic;font-size:14px;color:#5A4C38;margin-bottom:22px;line-height:1.7;}
.sec{margin-bottom:20px;}
.sec-label{font-size:11px;font-weight:700;color:${b.primary};text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;}
.sec-body{font-size:14px;line-height:1.75;color:#2B2420;}
.bright{background:${b.accentLight};border-left:4px solid ${b.primary};padding:14px 18px;border-radius:4px;margin-bottom:20px;}
.bright-label{font-size:11px;font-weight:700;color:${b.primaryDark};text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;}
.grief{background:#F5F0EA;border-left:4px solid #9C8B6E;padding:14px 18px;border-radius:4px;margin-bottom:20px;}
.qbox{background:${b.groveLight};border:1px solid #D3DFCE;border-radius:6px;padding:16px 18px;margin-bottom:20px;}
.qbox-label{font-size:11px;font-weight:700;color:${b.grove};text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;}
.q-item{font-size:13px;color:#2B2420;padding:4px 0;padding-left:16px;position:relative;}
.q-item:before{content:"→";position:absolute;left:0;color:${b.grove};}
.closing{font-size:13px;font-style:italic;color:#6B5D4A;margin-bottom:20px;}
.footer{border-top:1px solid #E5DDD0;padding-top:14px;margin-top:28px;font-size:10px;color:#9A8B72;line-height:1.7;}
@media print{.toolbar{display:none;}.doc{padding:0;}}
</style></head><body>
<div class="toolbar">
  <button class="secondary" onclick="window.close()">Close</button>
  <button onclick="window.print()">🖨️ Print / Save as PDF</button>
</div>
<div class="doc">
  <div class="letterhead">
    <div class="logo-badge">${b.logoUrl ? `<img src="${b.logoUrl}" alt="${b.name} logo">` : b.logoText}</div>
    <div><div class="brand-name">${b.name}</div><div class="brand-tag">${b.tagline}</div></div>
  </div>
  <div class="doc-title">Family Update — Week of ${weekOf}</div>
  <div class="res-name">${resident.name}</div>
  <div class="res-meta">${resident.type}${resident.type === 'Cognitive Concerns — Not Yet Diagnosed' ? '' : ' · ' + resident.stage + ' Stage'} · Room ${resident.room} · Prepared for ${resident.contact}</div>
  <div class="greeting">${update.greeting || ''}</div>
  <div class="sec"><div class="sec-label">This Week</div><div class="sec-body">${update.whatWeObserved || ''}</div></div>
  <div class="sec"><div class="sec-label">Understanding the Journey</div><div class="sec-body">${update.whatThisMeans || ''}</div></div>
  ${update.brightMoment ? `<div class="bright"><div class="bright-label">A Moment Worth Sharing</div><div class="sec-body">${update.brightMoment}</div></div>` : ''}
  <div class="sec"><div class="sec-label">Your Next Visit</div><div class="sec-body">${update.howToConnect || ''}</div></div>
  ${update.griefNote ? `<div class="grief"><div class="bright-label">A Note for Your Family</div><div class="sec-body">${update.griefNote}</div></div>` : ''}
  ${update.questionsForFamily && update.questionsForFamily.length ? `<div class="qbox"><div class="qbox-label">Questions for Your Next Care Conference</div>${update.questionsForFamily.map((q) => `<div class="q-item">${q}</div>`).join('')}</div>` : ''}
  <div class="closing">${update.closingNote || ''}</div>
  <div class="footer">This update reflects caregiver observations and is not a medical assessment. For clinical concerns, please contact the care team directly.<br>${b.name} · ${b.address} · ${b.phone} · ${b.email}<br>${b.license} · Generated ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
</div>
</body></html>`;

  const win = window.open('', '_blank');
  if (!win) return false;
  win.document.open();
  win.document.write(html);
  win.document.close();
  return true;
}

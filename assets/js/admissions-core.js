/* Pure validation and selection rules, shared by the UI and checks. */
(function (root) {
 'use strict';
 function score(value) {
  const text = String(value).trim();
  if (!text) return {error: 'Vui lòng nhập điểm sau phúc khảo.'};
  if (!/^\d{1,2}([.,]\d{1,2})?$/.test(text)) return {error: 'Điểm phải là số, tối đa 2 chữ số thập phân (ví dụ 8.25).'};
  const number = Number(text.replace(',', '.'));
  if (number < 0 || number > 10) return {error: 'Điểm phải nằm trong khoảng từ 0 đến 10.'};
  return {value: number};
 }
 function textError(value, label, min, max) {
  const text = value.trim();
  if (!text) return 'Vui lòng nhập ' + label + '.';
  if (text.length < min || text.length > max) return label + ' phải từ ' + min + ' đến ' + max + ' ký tự.';
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(text)) return label + ' chứa ký tự không hợp lệ.';
  return '';
 }
 function prerequisites(data) {
  if (!data.closed || !data.locked) return 'Chưa đủ điều kiện xét tuyển: giai đoạn phúc khảo chưa hoàn thành hoặc điểm chính thức chưa được chốt.';
  if (!data.schools.length || data.schools.some(s => !Number.isInteger(s.quota) || s.quota <= 0)) return 'Thiếu hoặc không hợp lệ thông tin chỉ tiêu tuyển sinh. Vui lòng bổ sung trước khi xét tuyển.';
  const ids = new Set(data.schools.map(s => s.id));
  if (!data.candidates.length || new Set(data.candidates.map(c => c.id)).size !== data.candidates.length || data.candidates.some(c => !Number.isFinite(c.score) || c.score < 0 || c.score > 30 || c.wishes.length !== 3 || new Set(c.wishes).size !== 3 || c.wishes.some(w => !ids.has(w)))) return 'Dữ liệu điểm hoặc nguyện vọng chưa đầy đủ, bị trùng hoặc không hợp lệ. Vui lòng kiểm tra lại.';
  return '';
 }
 async function select(data, resolveTie) {
  const invalid = prerequisites(data);
  if (invalid) throw new Error(invalid);
  const results = Object.fromEntries(data.candidates.map(c => [c.id, {school: null, wish: null}]));
  const decisions = [];
  for (let wish = 0; wish < 3; wish++) {
   for (const school of data.schools) {
    const used = Object.values(results).filter(r => r.school === school.id).length;
    const remaining = Math.max(0, school.quota - used);
    if (!remaining) continue;
    const pool = data.candidates.filter(c => !results[c.id].school && c.wishes[wish] === school.id).sort((a,b) => b.score - a.score || a.id.localeCompare(b.id));
    let accepted = pool.slice(0, remaining);
    if (pool.length > remaining && pool[remaining - 1].score === pool[remaining].score) {
     const cutoff = pool[remaining - 1].score;
     const above = pool.filter(c => c.score > cutoff);
     const equal = pool.filter(c => c.score === cutoff);
     const choice = await resolveTie({school, wish: wish + 1, remaining, cutoff, above: above.length, equal: equal.length});
     if (choice !== 'all' && choice !== 'higher') return null;
     accepted = choice === 'all' ? pool.filter(c => c.score >= cutoff) : above;
     decisions.push({school: school.name, wish: wish + 1, cutoff, choice, count: accepted.length, remaining});
    }
    accepted.forEach(c => { results[c.id] = {school: school.id, wish: wish + 1}; });
   }
  }
  return {results, decisions};
 }
 const api = {score, textError, prerequisites, select};
 if (typeof module !== 'undefined' && module.exports) module.exports = api;
 else root.AdmissionCore = api;
})(typeof window !== 'undefined' ? window : this);

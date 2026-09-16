/* Interactive prototype only. Production must validate roles and data on the server. */
(() => {
 'use strict';
 const page = document.querySelector('[data-workflow]');
 if (!page) return;
 const $ = id => document.getElementById(id);
 const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const clone = value => JSON.parse(JSON.stringify(value));
 const core = window.AdmissionCore;
 const key = 'tuyensinh10.workflow.v1';
 const now = new Date();
 const deadline = new Date(now); deadline.setDate(deadline.getDate() + 7); deadline.setHours(23,59,59,999);
 const subjects = [{id:'toan',name:'Toán',score:8},{id:'van',name:'Ngữ văn',score:7.25},{id:'anh',name:'Tiếng Anh',score:8.5}];
 const seed = {
  deadline: deadline.toISOString(), published: true,
  requests: [
   {id:'PK001',student:'100002',name:'Trần Quốc Bảo',subject:'toan',oldScore:7.5,reason:'Đề nghị kiểm tra lại điểm phần tự luận của bài thi.',created:now.toISOString(),status:'pending'},
   {id:'PK002',student:'100003',name:'Lê Ngọc Hà',subject:'van',oldScore:8,reason:'Em mong hội đồng xem xét lại phần đọc hiểu của bài thi.',created:now.toISOString(),status:'pending'},
   {id:'PK003',student:'100001',name:'Nguyễn Minh Anh',subject:'anh',oldScore:8.5,reason:'Đề nghị kiểm tra lại điểm phần viết của bài thi.',created:now.toISOString(),status:'done',newScore:8.5,updated:now.toISOString(),actor:'Hội đồng phúc khảo',history:[]}
  ],
  admission: {closed:false,locked:false,schools:[{id:'A',name:'THPT Nguyễn Trãi',short:'Nguyễn Trãi',quota:2},{id:'B',name:'THPT Lê Quý Đôn',short:'Lê Quý Đôn',quota:3},{id:'C',name:'THPT Trần Phú',short:'Trần Phú',quota:3}],candidates:[
   {id:'100001',name:'Nguyễn Minh Anh',score:23.75,wishes:['A','B','C']},
   {id:'100002',name:'Trần Quốc Bảo',score:26,wishes:['A','B','C']},
   {id:'100003',name:'Lê Ngọc Hà',score:25,wishes:['A','B','C']},
   {id:'100004',name:'Phạm Gia Huy',score:25,wishes:['A','B','C']},
   {id:'100005',name:'Võ Khánh Linh',score:27,wishes:['B','C','A']},
   {id:'100006',name:'Đặng Tuấn Kiệt',score:26.5,wishes:['B','C','A']},
   {id:'100007',name:'Bùi Bảo Ngọc',score:24,wishes:['B','C','A']},
   {id:'100008',name:'Đỗ Hoàng Nam',score:22,wishes:['A','B','C']},
   {id:'100009',name:'Trương Thảo Vy',score:21,wishes:['B','C','A']},
   {id:'100010',name:'Ngô Đức Anh',score:20,wishes:['A','B','C']},
   {id:'100011',name:'Phan Minh Châu',score:19,wishes:['B','C','A']}
  ]}, official:null
 };
 let state = clone(seed);
 let storageError = false;
 let storageSnapshot = null;
 try { const saved = localStorage.getItem(key); storageSnapshot = saved; if (saved) { const parsed = JSON.parse(saved); if (!Array.isArray(parsed.requests) || !parsed.admission || !Number.isFinite(Date.parse(parsed.deadline))) throw new Error(); state = parsed; } }
 catch (_) { storageError = true; }
 function message(text, type = 'error') { const box = $('pageMessage'); box.hidden = false; box.className = 'wf-alert ' + type; box.textContent = text; box.scrollIntoView({block:'nearest',behavior:'smooth'}); }
 function save(next) {
  try { if (localStorage.getItem(key) !== storageSnapshot) {message('Dữ liệu đã thay đổi ở trang khác. Vui lòng tải lại trang trước khi lưu để tránh ghi đè kết quả mới.');return false;} const serialized = JSON.stringify(next); localStorage.setItem(key, serialized); storageSnapshot = serialized; state = next; return true; }
  catch (_) { message('Không thể lưu dữ liệu. Thông tin trước đó được giữ nguyên. Vui lòng thử lại hoặc kiểm tra dung lượng lưu trữ của trình duyệt.'); return false; }
 }
 function fieldError(id, text) { $(id).setAttribute('aria-invalid', text ? 'true':'false'); $(id + 'Error').textContent = text; return !text; }
 function clearErrors(form) { form.querySelectorAll('.field-error').forEach(e => {e.textContent='';}); form.querySelectorAll('[aria-invalid]').forEach(e => e.removeAttribute('aria-invalid')); }
 function focusError(form) { form.querySelector('[aria-invalid=true]')?.focus(); }
 const subjectName = id => subjects.find(s => s.id === id)?.name || id;
 const date = value => new Date(value).toLocaleString('vi-VN', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});
 const scoreText = value => Number(value).toFixed(2);
 const badge = request => request.status === 'done' ? '<span class="pill green">Đã có kết quả</span>' : '<span class="pill orange">Chờ xử lý</span>';
 function stats(items) { return items.map(([label,count,color]) => '<div class="stat-card"><div class="stat-icon '+color+'" aria-hidden="true">'+({blue:'▤',orange:'◷',green:'✓'}[color])+'</div><div><span>'+label+'</span><h2>'+count+'</h2></div></div>').join(''); }
 const dialog = document.createElement('dialog'); dialog.className = 'wf-dialog'; dialog.setAttribute('aria-labelledby','dialogTitle');
 dialog.innerHTML = '<h2 id="dialogTitle"></h2><p id="dialogText"></p><div class="actions" id="dialogActions"></div>'; document.body.append(dialog);
 function ask(title, text, options = [{value:'cancel',label:'Quay lại'},{value:'ok',label:'Xác nhận'}]) {
  return new Promise(resolve => {
   const previous = document.activeElement; $('dialogTitle').textContent = title; $('dialogText').textContent = text; $('dialogActions').replaceChildren();
   const close = value => { dialog.close(); previous?.focus(); resolve(value); };
   dialog.oncancel = event => {event.preventDefault();close('cancel');};
   options.forEach((option,index) => {const button=document.createElement('button');button.type='button';button.className=index===options.length-1?'primary-button':'secondary-button';button.textContent=option.label;button.onclick=()=>close(option.value);$('dialogActions').append(button);});
   dialog.showModal(); $('dialogActions').firstElementChild.focus();
  });
 }
 function initRequest() {
  const form = $('requestForm');
  function selected() {
   const subject = subjects.find(s => s.id === $('subject').value);
   const request = state.requests.find(r => r.student === '100001' && r.subject === subject?.id);
   $('selectedScore').textContent = subject ? scoreText(request?.status === 'done' ? request.newScore : subject.score) : '—';
   $('selectedStatus').textContent = !subject ? 'Chưa chọn môn' : request ? (request.status === 'done' ? 'Đã có kết quả':'Chờ xử lý') : 'Chưa đăng ký';
  }
  function render() {
   const mine = state.requests.filter(r=>r.student==='100001');
   $('deadlineNotice').textContent='Thời hạn đăng ký phúc khảo: đến '+date(state.deadline)+'. '+(Date.now()>Date.parse(state.deadline)?'Đã hết thời hạn đăng ký.':'Đang tiếp nhận yêu cầu.');
   $('subjectRows').innerHTML=subjects.map(s=>{const r=mine.find(r=>r.subject===s.id);return '<tr><td><strong>'+s.name+'</strong></td><td>'+scoreText(r?.status==='done'?r.newScore:s.score)+'</td><td>'+(r?badge(r):'<span class="pill">Chưa đăng ký</span>')+'</td></tr>';}).join('');
   $('subject').innerHTML='<option value="">-- Chọn môn thi --</option>'+subjects.map(s=>'<option value="'+s.id+'">'+s.name+(mine.some(r=>r.subject===s.id)?' — Đã đăng ký':'')+'</option>').join('');
   $('myRequests').innerHTML=mine.length?mine.map(r=>'<tr><td><strong>'+subjectName(r.subject)+'</strong><small>'+esc(r.id)+'</small></td><td>'+date(r.created)+'</td><td>'+badge(r)+'</td><td>'+(r.status==='done'?scoreText(r.newScore):'—')+'</td></tr>').join(''):'<tr><td colspan="4" class="empty">Bạn chưa gửi yêu cầu phúc khảo.</td></tr>';
   selected();
  }
  $('subject').onchange=()=>{fieldError('subject','');selected();};
  $('reason').oninput=()=>{$('reasonCount').textContent=$('reason').value.length;fieldError('reason','');};
  form.onreset=()=>{setTimeout(()=>{clearErrors(form);$('reasonCount').textContent='0';selected();},0);};
  let busy=false;
  form.onsubmit=async event=>{
   event.preventDefault(); if(busy)return; clearErrors(form);
   if(!state.published){message('Điểm thi chưa được công bố. Chưa thể gửi yêu cầu phúc khảo.');return;}
   if(Date.now()>Date.parse(state.deadline)){message('Đã hết thời hạn đăng ký phúc khảo.');return;}
   const subject=subjects.find(s=>s.id===$('subject').value);
   const validSubject=fieldError('subject',subject?'':'Vui lòng chọn môn thi trong danh sách.');
   const validReason=fieldError('reason',core.textError($('reason').value,'lý do phúc khảo',10,1000));
   if(!validSubject||!validReason){focusError(form);return;}
   if(state.requests.some(r=>r.student==='100001'&&r.subject===subject.id)){fieldError('subject','Môn thi này đã được đăng ký phúc khảo.');focusError(form);return;}
   busy=true;
   const choice=await ask('Xác nhận gửi yêu cầu','Môn thi: '+subject.name+'\nĐiểm hiện tại: '+scoreText(subject.score)+'\nYêu cầu sẽ được chuyển đến Hội đồng phúc khảo.');
   if(choice==='ok'){
    if(Date.now()>Date.parse(state.deadline)){message('Đã hết thời hạn đăng ký phúc khảo.');busy=false;return;}
    const next=clone(state);next.requests.push({id:'PK'+Date.now(),student:'100001',name:'Nguyễn Minh Anh',subject:subject.id,oldScore:subject.score,reason:$('reason').value.trim(),created:new Date().toISOString(),status:'pending'});
    next.admission.closed=false;next.admission.locked=false;
    if(save(next)){form.reset();render();message('Gửi yêu cầu phúc khảo thành công. Trạng thái: Chờ xử lý.','success');}
   }busy=false;
  };render();
 }
 function initReview() {
  const form=$('reviewForm'); let busy=false;
  const current=()=>state.requests.find(r=>r.id===$('reviewRequest').value);
  function changeScore(){const r=current(),parsed=core.score($('newScore').value);const changed=r&&!parsed.error&&parsed.value!==r.oldScore;$('evidenceFields').hidden=!changed;$('scoreChange').hidden=!r||!!parsed.error;if(r&&!parsed.error){$('scoreChange').className='wf-alert '+(changed?'warning':'');$('scoreChange').textContent=changed?'Điểm thay đổi từ '+scoreText(r.oldScore)+' thành '+scoreText(parsed.value)+'. Cần bổ sung biên bản và minh chứng.':'Điểm không thay đổi. Không yêu cầu biên bản và minh chứng.';}}
  function selectRequest(){clearErrors(form);const r=current();$('newScore').value=r?.status==='done'?scoreText(r.newScore):'';$('minutes').value=r?.minutes||'';$('evidence').value='';$('existingEvidence').replaceChildren();
   if(r?.evidence){const link=document.createElement('a');link.className='attachment';link.textContent='Minh chứng đã lưu: '+r.evidence.name;link.href=r.evidence.data;link.download=r.evidence.name;$('existingEvidence').append(link);}
   $('reviewDetails').innerHTML=r?'<dl><dt>Thí sinh</dt><dd>'+esc(r.name)+'</dd><dt>Số báo danh</dt><dd>'+esc(r.student)+'</dd><dt>Môn thi</dt><dd>'+subjectName(r.subject)+'</dd><dt>Điểm trước phúc khảo</dt><dd>'+scoreText(r.oldScore)+'</dd></dl><p class="hint">Lý do: '+esc(r.reason)+'</p>'+(r.updated?'<p class="hint">Cập nhật: '+date(r.updated)+' • '+esc(r.actor)+'</p>':''):'Chọn yêu cầu từ danh sách để xem thông tin bài thi.';changeScore();
  }
  function render(){const pending=state.requests.filter(r=>r.status==='pending').length;$('reviewStats').innerHTML=stats([['Tổng yêu cầu',state.requests.length,'blue'],['Chờ xử lý',pending,'orange'],['Đã có kết quả',state.requests.length-pending,'green']]);const selected=$('reviewRequest').value;$('reviewRequest').innerHTML='<option value="">-- Chọn yêu cầu phúc khảo --</option>'+state.requests.map(r=>'<option value="'+esc(r.id)+'">'+esc(r.id)+' • '+esc(r.name)+' • '+subjectName(r.subject)+'</option>').join('');$('reviewRequest').value=selected;
   const rows=state.requests.filter(r=>$('reviewFilter').value==='all'||r.status===$('reviewFilter').value);$('reviewRows').innerHTML=rows.length?rows.map(r=>'<tr><td><strong>'+esc(r.name)+'</strong><small>'+esc(r.id)+' • '+esc(r.student)+'</small></td><td>'+subjectName(r.subject)+'<small>'+scoreText(r.oldScore)+(r.status==='done'?' → '+scoreText(r.newScore):'')+'</small></td><td>'+badge(r)+'</td><td><button class="text-button" data-select="'+esc(r.id)+'">'+(r.status==='done'?'Xem / sửa':'Cập nhật')+'</button></td></tr>').join(''):'<tr><td colspan="4" class="empty">Không có yêu cầu phù hợp với trạng thái đã chọn.</td></tr>';
   $('reviewRows').querySelectorAll('[data-select]').forEach(button=>button.onclick=()=>{$('reviewRequest').value=button.dataset.select;selectRequest();$('newScore').focus();});
  }
  $('reviewFilter').onchange=render;$('reviewRequest').onchange=selectRequest;$('newScore').oninput=()=>{fieldError('newScore','');changeScore();};$('cancelReview').onclick=async()=>{if(await ask('Hủy thay đổi?','Thông tin vừa nhập sẽ không được lưu.')==='ok'){selectRequest();message('Đã hủy thay đổi. Kết quả đã lưu được giữ nguyên.','success');}};
  form.onsubmit=async event=>{event.preventDefault();if(busy)return;clearErrors(form);const r=current();let valid=fieldError('reviewRequest',r?'':'Vui lòng chọn yêu cầu phúc khảo.');const parsed=core.score($('newScore').value);valid=fieldError('newScore',parsed.error||'')&&valid;const changed=r&&!parsed.error&&parsed.value!==r.oldScore;const file=$('evidence').files[0];
   if(changed){valid=fieldError('minutes',core.textError($('minutes').value,'biên bản',10,2000))&&valid;let error='';if(!file&&!r.evidence)error='Vui lòng đính kèm minh chứng khi điểm thay đổi.';else if(file){if(!/\.(pdf|png|jpe?g)$/i.test(file.name)||!['application/pdf','image/png','image/jpeg'].includes(file.type))error='Chỉ chấp nhận tệp PDF, PNG hoặc JPG.';else if(file.size===0||file.size>2*1024*1024)error='Tệp phải có dữ liệu và không vượt quá 2 MB.';}valid=fieldError('evidence',error)&&valid;}
   if(!valid){focusError(form);return;}busy=true;
   if(await ask('Xác nhận lưu kết quả','Thí sinh: '+r.name+'\nMôn: '+subjectName(r.subject)+'\nĐiểm: '+scoreText(r.oldScore)+' → '+scoreText(parsed.value))!=='ok'){busy=false;return;}
   try{let evidence=changed?r.evidence:null;if(changed&&file){const bytes=new Uint8Array(await file.slice(0,8).arrayBuffer());const pdf=bytes[0]===37&&bytes[1]===80&&bytes[2]===68&&bytes[3]===70;const png=bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71;const jpg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255;if(!(file.type==='application/pdf'&&pdf||file.type==='image/png'&&png||file.type==='image/jpeg'&&jpg)){fieldError('evidence','Nội dung tệp không khớp định dạng PDF, PNG hoặc JPG.');focusError(form);return;}const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('Không đọc được minh chứng. Vui lòng chọn lại tệp.'));reader.readAsDataURL(file);});evidence={name:file.name,data};}
    const next=clone(state);const item=next.requests.find(item=>item.id===r.id);const previousScore=item.status==='done'?item.newScore:item.oldScore;item.history=item.history||[];item.history.push({score:previousScore,updated:item.updated||item.created,minutes:item.minutes||'',evidence:item.evidence||null});Object.assign(item,{status:'done',newScore:parsed.value,minutes:changed?$('minutes').value.trim():'',evidence,actor:'Hội đồng phúc khảo',updated:new Date().toISOString()});const candidate=next.admission.candidates.find(c=>c.id===item.student);if(candidate)candidate.score=Math.round((candidate.score+parsed.value-previousScore)*100)/100;next.admission.closed=false;next.admission.locked=false;if(save(next)){render();selectRequest();message('Cập nhật kết quả phúc khảo thành công. Đã ghi nhận người thực hiện và thời gian.','success');}
   }catch(error){message(error.message||'Không thể lưu kết quả phúc khảo. Dữ liệu trước đó được giữ nguyên.');}finally{busy=false;}
  };render();
 }
 function initAdmission(){let draft=null,busy=false;let data=state.admission;const school=id=>data.schools.find(s=>s.id===id);
  function render(){const result=draft||state.official;$('step1').className=result?'':'current';$('step2').className=draft?'current':'';$('step3').className=!draft&&state.official?'current':'';$('resultTitle').textContent=draft?'Kết quả xét tuyển dự kiến':state.official?'Kết quả xét tuyển chính thức':'Danh sách thí sinh';$('resultSubtitle').textContent=draft?'Kiểm tra kết quả trước khi xác nhận lưu.':state.official?'Đã lưu lúc '+date(state.official.savedAt)+' • Hội đồng tuyển sinh':'Kiểm tra điểm xét tuyển và thứ tự nguyện vọng đã đăng ký.';$('draftActions').hidden=!draft;
   const admitted=result?Object.values(result.results).filter(r=>r.school).length:0;$('admissionStats').innerHTML=stats([['Thí sinh đăng ký',data.candidates.length,'blue'],['Trúng tuyển',admitted,'green'],[result?'Không trúng tuyển':'Chờ xét tuyển',data.candidates.length-admitted,'orange']]);
   $('candidateRows').innerHTML=data.candidates.filter(c=>$('schoolFilter').value==='all'||result?.results[c.id]?.school===$('schoolFilter').value).sort((a,b)=>b.score-a.score).map(c=>{const r=result?.results[c.id];return '<tr><td><strong>'+esc(c.name)+'</strong><small>'+c.id+'</small></td><td><strong>'+scoreText(result?.scores?.[c.id] ?? c.score)+'</strong></td>'+c.wishes.map(id=>'<td>'+esc(school(id)?.short||'Chưa có')+'</td>').join('')+'<td>'+(r?.school?'<span class="pill green">Trúng tuyển NV'+r.wish+'</span><small>'+esc(school(r.school).name)+'</small>':r?'<span class="pill">Không trúng tuyển</span>':'<span class="pill blue">Chờ xét tuyển</span>')+'</td></tr>';}).join('')||'<tr><td colspan="6" class="empty">Không có thí sinh trúng tuyển trường đã chọn.</td></tr>';
   $('tieSummary').hidden=!result?.decisions.length;$('tieSummary').textContent=result?.decisions.map(d=>d.school+' • NV'+d.wish+' • Đồng điểm '+scoreText(d.cutoff)+': '+(d.choice==='all'?'Nhận toàn bộ nhóm đồng điểm':'Chỉ nhận nhóm có điểm cao hơn')+' ('+d.count+'/'+d.remaining+' chỗ còn lại).').join(' ')||'';
  }
  function renderConditions(){ $('conditions').innerHTML='<div class="check-item"><strong>Giai đoạn phúc khảo</strong><span>'+(data.closed?'✓ Đã hoàn thành':'Chưa hoàn thành')+'</span></div><div class="check-item"><strong>Điểm chính thức</strong><span>'+(data.locked?'✓ Đã chốt điểm':'Chưa chốt điểm')+'</span></div><div class="check-item"><strong>Chỉ tiêu và nguyện vọng</strong><span>'+(core.prerequisites({...data,closed:true,locked:true})?'Cần kiểm tra dữ liệu':'✓ Đầy đủ, hợp lệ')+'</span></div>'; }
  const closeButton=document.createElement('button');closeButton.className='secondary-button';closeButton.textContent='Hoàn tất phúc khảo và chốt điểm';$('runAdmission').before(closeButton);
  closeButton.onclick=async()=>{if(state.requests.some(r=>r.status!=='done')){message('Còn yêu cầu phúc khảo chưa xử lý. Vui lòng cập nhật đầy đủ kết quả trước khi chốt điểm.');return;}if(await ask('Chốt điểm chính thức?','Xác nhận giai đoạn phúc khảo đã kết thúc và các kết quả đã được kiểm tra. Hệ thống sẽ đóng tiếp nhận yêu cầu và sử dụng điểm hiện tại để xét tuyển.')!=='ok')return;const next=clone(state);next.admission.closed=true;next.admission.locked=true;next.deadline=new Date(Date.now()-1000).toISOString();if(save(next)){data=state.admission;draft=null;renderConditions();render();message('Đã hoàn tất phúc khảo và chốt điểm chính thức.','success');}};
  renderConditions();
  $('schoolRows').innerHTML=data.schools.map(s=>'<tr><td><strong>'+esc(s.name)+'</strong></td><td>'+s.quota+'</td>'+[0,1,2].map(w=>'<td>'+data.candidates.filter(c=>c.wishes[w]===s.id).length+'</td>').join('')+'</tr>').join('');
  $('schoolFilter').innerHTML='<option value="all">Tất cả thí sinh</option>'+data.schools.map(s=>'<option value="'+s.id+'">'+esc(s.name)+'</option>').join('');$('schoolFilter').onchange=render;
  $('runAdmission').onclick=async()=>{if(busy)return;const error=core.prerequisites(data);if(error){message(error);return;}busy=true;$('runAdmission').disabled=true;try{if(await ask('Thực hiện xét tuyển?','Hệ thống sẽ xét lần lượt NV1, NV2, NV3 cho '+data.candidates.length+' thí sinh. Kết quả dự kiến cần được xác nhận trước khi lưu chính thức.')!=='ok')return;const proposed=await core.select(data,async tie=>ask('Xử lý thí sinh đồng điểm',tie.school.name+' • NV'+tie.wish+'\nCòn '+tie.remaining+' chỉ tiêu; '+tie.above+' thí sinh có điểm cao hơn và '+tie.equal+' thí sinh cùng '+scoreText(tie.cutoff)+' điểm.\nA: Nhận toàn bộ nhóm đồng điểm, chấp nhận vượt chỉ tiêu.\nB: Chỉ nhận nhóm có điểm cao hơn, chấp nhận thiếu chỉ tiêu.',[{value:'cancel',label:'Dừng xét tuyển'},{value:'higher',label:'B · Điểm cao hơn'},{value:'all',label:'A · Nhận toàn bộ'}]));if(!proposed){message('Đã dừng xét tuyển. Kết quả trước đó được giữ nguyên.','warning');return;}draft=proposed;$('schoolFilter').value='all';render();message('Đã hoàn tất xét tuyển dự kiến. Vui lòng kiểm tra và xác nhận lưu.','success');}finally{busy=false;$('runAdmission').disabled=false;}};
  $('discardAdmission').onclick=async()=>{if(await ask('Hủy kết quả dự kiến?','Kết quả chính thức đã lưu trước đó sẽ được giữ nguyên.')==='ok'){draft=null;render();message('Đã hủy kết quả dự kiến.','success');}};
  $('saveAdmission').onclick=async()=>{if(!draft||busy)return;busy=true;try{if(await ask('Lưu kết quả chính thức?','Kết quả đang xem sẽ trở thành kết quả xét tuyển chính thức'+(state.official?' và thay thế kết quả đã lưu trước đó.':'.'))!=='ok')return;const error=core.prerequisites(data);if(error){message(error);return;}const next=clone(state);next.official={...draft,scores:Object.fromEntries(data.candidates.map(c=>[c.id,c.score])),savedAt:new Date().toISOString()};if(save(next)){draft=null;render();message('Xét tuyển thành công. Đã lưu kết quả chính thức của từng thí sinh.','success');}}finally{busy=false;}};
  render();
 }
 if(page.dataset.workflow==='request')initRequest();
 if(page.dataset.workflow==='review')initReview();
 if(page.dataset.workflow==='admission')initAdmission();
 if(storageError)message('Không đọc được dữ liệu đã lưu. Đang hiển thị bộ dữ liệu ban đầu; vui lòng kiểm tra bộ nhớ trình duyệt.','warning');
})();

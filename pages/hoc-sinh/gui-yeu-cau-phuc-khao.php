<?php $activePage = 'request'; $displayName = 'Nguyễn Minh Anh'; $displayRole = 'Học sinh • SBD 100001'; include dirname(__FILE__) . '/../../components/layout/header.php'; ?>
<section class="content workflow" data-workflow="request">
 <div class="page-heading"><div><div class="eyebrow">HỌC SINH / PHÚC KHẢO</div><h1>Gửi yêu cầu phúc khảo</h1><p>Chọn môn thi và gửi đề nghị xem xét lại kết quả bài thi của bạn.</p></div><span class="pill blue">Kỳ thi tuyển sinh lớp 10 • 2026</span></div>
 <div id="pageMessage" role="status" aria-live="polite" hidden></div>
 <div class="wf-alert" id="deadlineNotice"></div>
 <div class="wf-grid"><div>
  <div class="panel"><div class="panel-header"><div><h2>Kết quả thi của bạn</h2><p>Nguyễn Minh Anh • Số báo danh 100001</p></div><span class="pill green">Đã công bố điểm</span></div><div class="wf-table-wrap"><table class="wf-table"><thead><tr><th>Môn thi</th><th>Điểm thi</th><th>Phúc khảo</th></tr></thead><tbody id="subjectRows"></tbody></table></div></div>
  <div class="panel"><div class="panel-header"><div><h2>Yêu cầu đã gửi</h2><p>Theo dõi trạng thái xử lý theo từng môn thi.</p></div></div><div class="wf-table-wrap"><table class="wf-table"><thead><tr><th>Môn thi</th><th>Ngày gửi</th><th>Trạng thái</th><th>Kết quả</th></tr></thead><tbody id="myRequests"></tbody></table></div></div>
 </div><div class="panel"><div class="panel-header"><div><h2>Thông tin yêu cầu</h2><p>Các trường có dấu * là bắt buộc.</p></div></div>
 <form id="requestForm" novalidate>
  <div class="field"><label for="subject">Môn thi cần phúc khảo <span class="required">*</span></label><select id="subject" aria-describedby="subjectError"><option value="">-- Chọn môn thi --</option></select><div class="field-error" id="subjectError"></div></div>
  <div class="summary-box"><dl><dt>Điểm hiện tại</dt><dd id="selectedScore">—</dd><dt>Trạng thái yêu cầu</dt><dd id="selectedStatus">Chưa chọn môn</dd></dl></div>
  <div class="field"><label for="reason">Lý do phúc khảo <span class="required">*</span></label><textarea id="reason" maxlength="1000" placeholder="Trình bày lý do bạn đề nghị phúc khảo bài thi…" aria-describedby="reasonHint reasonError"></textarea><span class="hint" id="reasonHint">Từ 10 đến 1.000 ký tự. <span id="reasonCount">0</span>/1.000</span><div class="field-error" id="reasonError"></div></div>
  <div class="wf-alert">Mỗi môn thi chỉ được gửi một yêu cầu. Vui lòng kiểm tra thông tin trước khi xác nhận gửi.</div>
  <div class="actions"><button class="secondary-button" type="reset">Nhập lại</button><button class="primary-button" type="submit">Gửi yêu cầu</button></div>
 </form></div></div>
</section>
<?php include dirname(__FILE__) . '/../../components/layout/footer.php'; ?>

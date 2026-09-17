<?php $activePage = 'review'; $displayName = 'Hội đồng phúc khảo'; $displayRole = 'Quản lý kết quả phúc khảo'; include dirname(__FILE__) . '/../../components/layout/header.php'; ?>
<section class="content workflow" data-workflow="review">
 <div class="page-heading"><div><div class="eyebrow">HỘI ĐỒNG PHÚC KHẢO</div><h1>Quản lý kết quả phúc khảo</h1><p>Cập nhật điểm sau chấm lại và lưu biên bản, minh chứng liên quan.</p></div><span class="pill blue">Tuyển sinh lớp 10 • 2026</span></div>
 <div id="pageMessage" role="status" aria-live="polite" hidden></div>
 <div class="stat-grid" id="reviewStats"></div>
 <div class="wf-grid"><div class="panel"><div class="panel-header"><div><h2>Danh sách yêu cầu</h2><p>Chọn một yêu cầu để xem và cập nhật kết quả.</p></div><select id="reviewFilter" class="filter-select" aria-label="Lọc trạng thái"><option value="all">Tất cả trạng thái</option><option value="pending">Chờ xử lý</option><option value="done">Đã có kết quả</option></select></div><div class="wf-table-wrap"><table class="wf-table"><thead><tr><th>Yêu cầu / Thí sinh</th><th>Môn / Điểm</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody id="reviewRows"></tbody></table></div></div>
 <div class="panel"><div class="panel-header"><div><h2>Cập nhật kết quả</h2><p>Các trường có dấu * là bắt buộc.</p></div></div>
 <form id="reviewForm" novalidate>
  <div class="field"><label for="reviewRequest">Yêu cầu phúc khảo <span class="required">*</span></label><select id="reviewRequest" aria-describedby="reviewRequestError"><option value="">-- Chọn yêu cầu phúc khảo --</option></select><div class="field-error" id="reviewRequestError"></div></div>
  <div id="reviewDetails" class="summary-box">Chọn yêu cầu từ danh sách để xem thông tin bài thi.</div>
  <div class="field"><label for="newScore">Điểm sau phúc khảo <span class="required">*</span></label><input id="newScore" type="text" inputmode="decimal" placeholder="Ví dụ: 8.25" aria-describedby="scoreHint newScoreError"><span class="hint" id="scoreHint">Từ 0 đến 10, tối đa 2 chữ số thập phân; chấp nhận dấu chấm hoặc dấu phẩy.</span><div class="field-error" id="newScoreError"></div></div>
  <div id="scoreChange" class="wf-alert" hidden></div>
  <div id="evidenceFields" hidden>
   <div class="field"><label for="minutes">Biên bản thay đổi điểm <span class="required">*</span></label><textarea id="minutes" maxlength="2000" placeholder="Nhập số biên bản và nội dung xác nhận thay đổi điểm…" aria-describedby="minutesHint minutesError"></textarea><span class="hint" id="minutesHint">Từ 10 đến 2.000 ký tự.</span><div class="field-error" id="minutesError"></div></div>
   <div class="field"><label for="evidence">Minh chứng <span class="required">*</span></label><input id="evidence" type="file" accept=".pdf,.png,.jpg,.jpeg" aria-describedby="evidenceHint evidenceError"><span class="hint" id="evidenceHint">Một tệp PDF, PNG hoặc JPG; tối đa 2 MB.</span><div id="existingEvidence"></div><div class="field-error" id="evidenceError"></div></div>
  </div>
  <div class="actions"><button type="button" id="cancelReview" class="secondary-button">Hủy thay đổi</button><button type="submit" class="primary-button">Lưu kết quả</button></div>
 </form></div></div>
</section>
<?php include dirname(__FILE__) . '/../../components/layout/footer.php'; ?>

<?php $activePage = 'admission'; $displayName = 'Hội đồng tuyển sinh'; $displayRole = 'Xét tuyển theo nguyện vọng'; include dirname(__FILE__) . '/../../components/layout/header.php'; ?>
<section class="content workflow" data-workflow="admission">
 <div class="page-heading"><div><div class="eyebrow">HỘI ĐỒNG TUYỂN SINH</div><h1>Xét tuyển theo NV1, NV2, NV3</h1><p>Xét theo điểm từ cao xuống thấp, lần lượt ưu tiên nguyện vọng 1 → 2 → 3.</p></div><span class="pill blue">Tuyển sinh lớp 10 • 2026</span></div>
 <div id="pageMessage" role="status" aria-live="polite" hidden></div>
 <div class="stepper"><span id="step1" class="current">1. Kiểm tra dữ liệu</span><span id="step2">2. Xem kết quả dự kiến</span><span id="step3">3. Lưu kết quả chính thức</span></div>
 <div class="panel"><div class="panel-header"><div><h2>Dữ liệu phục vụ xét tuyển</h2><p>Điểm, chỉ tiêu và nguyện vọng phải hợp lệ trước khi thực hiện.</p></div></div><div class="check-list" id="conditions"></div><div class="wf-table-wrap"><table class="wf-table"><thead><tr><th>Trường THPT</th><th>Chỉ tiêu</th><th>Đăng ký NV1</th><th>Đăng ký NV2</th><th>Đăng ký NV3</th></tr></thead><tbody id="schoolRows"></tbody></table></div><div class="actions"><button id="runAdmission" class="primary-button">Thực hiện xét tuyển</button></div></div>
 <div class="stat-grid" id="admissionStats"></div>
 <div class="panel"><div class="panel-header"><div><h2 id="resultTitle">Danh sách thí sinh</h2><p id="resultSubtitle">Kiểm tra điểm xét tuyển và thứ tự nguyện vọng đã đăng ký.</p></div><select id="schoolFilter" class="filter-select" aria-label="Lọc theo trường trúng tuyển"><option value="all">Tất cả thí sinh</option></select></div>
 <div id="tieSummary" class="wf-alert warning" hidden></div>
 <div class="wf-table-wrap"><table class="wf-table"><thead><tr><th>SBD / Họ và tên</th><th>Điểm xét tuyển</th><th>NV1</th><th>NV2</th><th>NV3</th><th>Kết quả</th></tr></thead><tbody id="candidateRows"></tbody></table></div>
 <div id="draftActions" class="actions" hidden><button id="discardAdmission" class="secondary-button">Hủy kết quả dự kiến</button><button id="saveAdmission" class="primary-button">Xác nhận lưu kết quả</button></div>
 </div>
</section>
<?php include dirname(__FILE__) . '/../../components/layout/footer.php'; ?>

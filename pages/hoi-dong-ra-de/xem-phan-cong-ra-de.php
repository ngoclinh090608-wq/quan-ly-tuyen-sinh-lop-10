<?php
$activePage = 'question-assignment';
$displayName = 'ThS. Lê Hoàng Nam';
$displayRole = 'Hội đồng ra đề thi • Quyền: Xem phân công ra đề';
include dirname(__FILE__) . '/../../components/layout/header.php';
?>

<link rel="stylesheet" href="<?php echo htmlspecialchars($appBase); ?>/assets/css/xem-phan-cong-ra-de.css">

<section class="content workflow" data-workflow="view-question-assignment">
    <!-- Tiêu đề trang (Basic Flow 1) -->
    <div class="page-heading">
        <div>
            <div class="eyebrow">HỘI ĐỒNG RA ĐỀ THI / NHIỆM VỤ RA ĐỀ</div>
            <h1>Xem phân công ra đề thi (Use Case 8)</h1>
            <p>Hệ thống cho phép thành viên Hội đồng ra đề thi xem chi tiết phân công nhiệm vụ ra đề thi, thời gian cách ly và quy chuẩn đề thi theo từng môn được giao.</p>
        </div>
        <span class="pill blue">Kỳ thi tuyển sinh lớp 10 • 2026 - 2027</span>
    </div>

    <!-- Thông báo trạng thái trên trang -->
    <div id="assignmentPageAlert" class="wf-alert" role="status" aria-live="polite" hidden></div>

    <!-- Thanh công cụ kiểm thử mô phỏng các kịch bản của Use Case 8 -->
    <div class="simulation-bar">
        <div class="simulation-bar-info">
            <strong>🧪 Thanh kiểm thử kịch bản Use Case 8:</strong>
            <span>Nhấn nhanh các nút bên dưới để trải nghiệm các luồng nghiệp vụ &amp; tình huống ngoại lệ theo đặc tả.</span>
        </div>
        <div class="simulation-btn-group">
            <button type="button" id="btnSimulateBasic" class="simulation-btn" title="Trải nghiệm luồng xem phân công cơ bản (Bước 1-9)">
                ✓ Thử Basic Flow (1-9)
            </button>
            <button type="button" id="btnSimulateAltSubject" class="simulation-btn" title="Chuyển sang môn thi khác trong danh sách phân công">
                🔀 Ca 6.1: Đổi môn thi
            </button>
            <button type="button" id="btnSimulateBackList" class="simulation-btn" title="Quay lại danh sách các môn thi được phân công">
                ↩ Ca 8.1: Quay lại danh sách
            </button>
            <button type="button" id="btnSimulateNoAssignments" class="simulation-btn" title="Kỳ thi chưa có thông tin phân công">
                🚫 Ca 2.1: Chưa có phân công
            </button>
            <button type="button" id="btnSimulateNoPermission" class="simulation-btn" title="Kỳ thi không có quyền truy cập">
                🔒 Ca 4.1: Không có quyền xem
            </button>
            <button type="button" id="btnSimulateLoadError" class="simulation-btn" title="Bật/tắt mô phỏng lỗi gián đoạn kết nối máy chủ">
                ⚠️ Ca 7.1: Lỗi tải phân công
            </button>
            <button type="button" id="btnResetData" class="simulation-btn" style="color: #c23939;" title="Khôi phục trạng thái ban đầu">
                ↺ Khôi phục dữ liệu
            </button>
        </div>
    </div>

    <!-- Banner xác nhận tiền điều kiện (Preconditions) & Hậu điều kiện -->
    <div class="precondition-card">
        <div class="precondition-content">
            <div class="precondition-icon">✓</div>
            <div class="precondition-text">
                <h4>Tiền điều kiện đã được đáp ứng đầy đủ</h4>
                <p>Cán bộ: <strong><?php echo htmlspecialchars($displayName); ?></strong> | Đã đăng nhập thành công và được phân quyền xem thông tin phân công ra đề. Kỳ thi và phân công ra đề đã tồn tại trong hệ thống. Dữ liệu được bảo vệ an toàn (chế độ chỉ xem - read-only).</p>
            </div>
        </div>
        <span class="pill green">Đủ điều kiện xem phân công</span>
    </div>

    <!-- Thẻ thống kê tổng quan -->
    <div class="assignment-stat-grid">
        <div class="assignment-stat-card">
            <div class="assignment-stat-icon blue">📚</div>
            <div class="assignment-stat-info">
                <span>Số môn phân công</span>
                <h3 id="statSubjectCount">4 môn thi</h3>
            </div>
        </div>
        <div class="assignment-stat-card">
            <div class="assignment-stat-icon green">📅</div>
            <div class="assignment-stat-info">
                <span>Năm học kỳ thi</span>
                <h3 id="statExamYear">2026 - 2027</h3>
            </div>
        </div>
        <div class="assignment-stat-card">
            <div class="assignment-stat-icon purple">🛡</div>
            <div class="assignment-stat-info">
                <span>Cấp độ bảo mật</span>
                <h3 id="statSecurityLevel">Tối Mật (Vòng 1)</h3>
            </div>
        </div>
        <div class="assignment-stat-card">
            <div class="assignment-stat-icon orange">📜</div>
            <div class="assignment-stat-info">
                <span>Tình trạng quyết định</span>
                <h3 id="statAssignmentStatus">Đã ban hành</h3>
            </div>
        </div>
    </div>

    <!-- Khối chọn Kỳ thi cần xem phân công (Basic Flow 2 & 3) -->
    <div class="exam-select-card">
        <div class="exam-select-header">
            <h2><span>📋</span> Chọn kỳ thi cần xem phân công ra đề thi (Bước 2, 3)</h2>
            <span class="pill blue">Kỳ thi được phân công</span>
        </div>
        <div class="exam-select-grid">
            <div class="field" style="margin-bottom: 0;">
                <label for="examSelect">Kỳ thi tuyển sinh <span class="required">*</span></label>
                <select id="examSelect" class="filter-select" style="max-width: 100%;"></select>
            </div>
            <div>
                <button type="button" class="secondary-button" onclick="location.reload();" style="height: 43px; display: flex; align-items: center; gap: 6px;">
                    <span>↻</span> Làm mới danh sách
                </button>
            </div>
        </div>
    </div>

    <!-- Danh sách các môn thi được phân công ra đề (Basic Flow 5 & 6) -->
    <div class="panel" id="subjectsSection">
        <div class="panel-header" style="flex-wrap: wrap; gap: 10px;">
            <div>
                <h2>Danh sách môn thi được phân công ra đề (Bước 5)</h2>
                <p>Chọn một môn thi bên dưới để xem chi tiết thông tin nhiệm vụ và danh sách thành viên tổ ra đề (Bước 6).</p>
            </div>
            <span class="pill blue" style="font-size: 11px;">Nhấp vào thẻ môn để xem chi tiết</span>
        </div>
        <div class="subjects-grid" id="subjectsGrid">
            <!-- Render bởi JavaScript -->
        </div>
    </div>

    <!-- Khung thông tin chi tiết phân công ra đề thi (Basic Flow 7 & 8) -->
    <div id="assignmentDetailSection">
        <div id="assignmentDetailContent">
            <!-- Render bởi JavaScript -->
        </div>
    </div>
</section>

<!-- Hộp thoại Modal In Biên bản Phân công ra đề thi (Bước 8) -->
<dialog id="printAssignmentModal" class="print-assignment-dialog">
    <div class="assign-modal-header print-dialog-header">
        <h3><span>🖨</span> Văn bản phân công nhiệm vụ ra đề thi chính thức</h3>
        <button type="button" class="mobile-close" onclick="document.getElementById('printAssignmentModal').close();" aria-label="Đóng">✕</button>
    </div>
    <div class="print-assignment-body" id="printAssignmentContent">
        <!-- Render bởi JavaScript -->
    </div>
    <div class="assign-modal-footer print-dialog-footer">
        <button type="button" class="secondary-button" onclick="document.getElementById('printAssignmentModal').close();">
            Đóng
        </button>
        <button type="button" class="primary-button" onclick="window.print();">
            🖨 In văn bản (Print)
        </button>
    </div>
</dialog>

<script src="<?php echo htmlspecialchars($appBase); ?>/assets/js/xem-phan-cong-ra-de.js"></script>

<?php include dirname(__FILE__) . '/../../components/layout/footer.php'; ?>

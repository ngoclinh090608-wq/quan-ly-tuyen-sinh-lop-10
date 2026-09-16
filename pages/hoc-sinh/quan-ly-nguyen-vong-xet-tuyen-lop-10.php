<?php
$activePage = 'wishes';
$displayName = 'Nguyễn Minh Anh';
$displayRole = 'Học sinh • SBD 100001';
include dirname(__FILE__) . '/../../components/layout/header.php';
?>

<link rel="stylesheet" href="<?php echo htmlspecialchars($appBase); ?>/assets/css/quan-ly-nguyen-vong.css">

<section class="content workflow" data-page="quan-ly-nguyen-vong">
    <!-- Tiêu đề trang -->
    <div class="page-heading">
        <div>
            <div class="eyebrow">HỌC SINH / NGUYỆN VỌNG XÉT TUYỂN</div>
            <h1>Quản lý nguyện vọng xét tuyển lớp 10</h1>
            <p>Đăng ký, sắp xếp thứ tự ưu tiên và điều chỉnh nguyện vọng xét tuyển vào các trường THPT năm học 2026 - 2027.</p>
        </div>
        <span class="pill blue">Kỳ thi tuyển sinh lớp 10 • 2026</span>
    </div>

    <!-- Hộp thông báo chung trên đầu trang -->
    <div id="pageAlert" class="wf-alert" role="status" aria-live="polite" hidden></div>

    <!-- Thanh công cụ hỗ trợ kiểm thử mô phỏng thời hạn tiếp nhận -->
    <div class="simulation-bar">
        <div>
            <strong>🔧 Thanh điều khiển mô phỏng kịch bản:</strong>
            <span>Kiểm thử trạng thái hết hạn đăng ký / điều chỉnh nguyện vọng.</span>
        </div>
        <button type="button" id="toggleDeadlineBtn" class="simulation-btn">
            Mô phỏng: Hết hạn điều chỉnh (Khóa sửa)
        </button>
    </div>

    <!-- Thông báo thời hạn đăng ký -->
    <div class="wf-alert" id="deadlineNoticeText" style="border-left: 4px solid #1769e0; background: #ffffff;">
        Thời hạn đăng ký &amp; điều chỉnh nguyện vọng: Đến <strong>17:00 ngày 20/05/2026</strong>. Trạng thái: <span class="pill green">Đang mở tiếp nhận</span>
    </div>

    <!-- Thẻ thông tin thí sinh đăng ký -->
    <div class="candidate-card">
        <div class="candidate-profile">
            <div class="candidate-avatar-badge" aria-hidden="true">10</div>
            <div class="candidate-details">
                <h3>Nguyễn Minh Anh</h3>
                <div class="candidate-meta">
                    <span>Số báo danh: <strong>100001</strong></span>
                    <span>•</span>
                    <span>Trường THCS: <strong>Nguyễn Du</strong></span>
                    <span>•</span>
                    <span>Khu vực: <strong>Quận 1, TP. Hồ Chí Minh</strong></span>
                </div>
            </div>
        </div>
        <div>
            <span class="pill blue">Đã đăng ký dự thi thành công</span>
        </div>
    </div>

    <!-- Khung tổng hợp lỗi kiểm tra tính hợp lệ (Exception Flow 4.1 & 4.2) -->
    <div id="validationSummaryBox" class="wf-alert error" hidden></div>

    <!-- KHỐI 1: Nguyện vọng THPT Công lập thường (NV1, NV2, NV3) -->
    <div class="wish-section">
        <div class="wish-section-header">
            <div>
                <h2>
                    <span>🏫</span>
                    <span>1. Nguyện vọng THPT Công lập thường</span>
                </h2>
                <p class="hint" style="margin-top: 4px;">
                    Xếp theo thứ tự ưu tiên giảm dần từ NV1 đến NV3. Không được chọn cùng một trường cho nhiều nguyện vọng.
                </p>
            </div>
            <span class="wish-limit-pill" id="regularWishCount">3 / 3 nguyện vọng</span>
        </div>

        <!-- Danh sách các hàng nguyện vọng thường -->
        <div id="regularWishList" class="wish-list"></div>

        <!-- Nút thêm nguyện vọng thường (Alternative Flow 3.1) -->
        <button type="button" id="addRegularWishBtn" class="add-wish-btn">
            <span aria-hidden="true">+</span>
            <span>Thêm nguyện vọng thường</span>
        </button>
    </div>

    <!-- Tùy chọn đăng ký thi chuyên -->
    <div class="specialized-toggle-wrap">
        <input type="checkbox" id="enableSpecializedCheckbox">
        <label for="enableSpecializedCheckbox">
            Tôi có nguyện vọng đăng ký dự thi vào lớp 10 Chuyên (Tối đa 2 nguyện vọng chuyên)
        </label>
    </div>

    <!-- KHỐI 2: Nguyện vọng THPT Chuyên (NVC1, NVC2) -->
    <div class="wish-section" id="specializedSection" style="display: none;">
        <div class="wish-section-header">
            <div>
                <h2>
                    <span>⭐</span>
                    <span>2. Nguyện vọng lớp 10 Chuyên</span>
                </h2>
                <p class="hint" style="margin-top: 4px;">
                    Dành cho thí sinh đủ điều kiện dự thi môn chuyên. Điểm xét tuyển môn chuyên nhân hệ số 2.
                </p>
            </div>
            <span class="wish-limit-pill" id="specializedWishCount">0 / 2 nguyện vọng chuyên</span>
        </div>

        <!-- Danh sách nguyện vọng chuyên -->
        <div id="specializedWishList" class="wish-list"></div>

        <!-- Nút thêm nguyện vọng chuyên (Alternative Flow 3.1) -->
        <button type="button" id="addSpecializedWishBtn" class="add-wish-btn">
            <span aria-hidden="true">+</span>
            <span>Thêm nguyện vọng chuyên</span>
        </button>
    </div>

    <!-- Khung tóm tắt quy chế Sở GD&ĐT -->
    <div class="rule-box">
        <h4>
            <span>📌</span>
            <span>Quy định xét tuyển của Sở Giáo dục &amp; Đào tạo:</span>
        </h4>
        <ul>
            <li>Học sinh được đăng ký tối đa <strong>3 nguyện vọng thường</strong> (NV1, NV2, NV3) vào các trường THPT công lập.</li>
            <li>Học sinh không được chọn trùng trường THPT ở các nguyện vọng thường khác nhau.</li>
            <li>Học sinh đã trúng tuyển ở nguyện vọng trên sẽ không được xét tuyển ở các nguyện vọng dưới.</li>
            <li>Thí sinh đăng ký thi lớp chuyên được đăng ký tối đa <strong>2 nguyện vọng chuyên</strong> (NVC1, NVC2) tại các trường THPT chuyên.</li>
            <li>Học sinh có quyền thay đổi, điều chỉnh nguyện vọng không giới hạn số lần trong thời gian quy định.</li>
        </ul>
    </div>

    <!-- Thanh thao tác lưu và hủy (Actions) -->
    <div class="actions" style="margin-top: 24px;">
        <button type="button" id="cancelChangesBtn" class="secondary-button" title="Khôi phục danh sách đã lưu">
            Nhập lại / Hủy thay đổi
        </button>
        <button type="button" id="printReceiptBtn" class="secondary-button" title="In phiếu xác nhận đăng ký nguyện vọng">
            🖨️ In phiếu đăng ký
        </button>
        <button type="button" id="saveWishesBtn" class="primary-button" title="Lưu nguyện vọng vào hệ thống">
            Lưu nguyện vọng xét tuyển
        </button>
    </div>

    <!-- Hộp thoại Modal xác nhận thao tác (Xóa / Hủy / Lưu) căn giữa màn hình -->
    <dialog id="actionConfirmModal" class="action-confirm-dialog" aria-labelledby="dialogTitle">
        <div class="dialog-header">
            <h3 id="dialogTitle">Xác nhận thao tác</h3>
        </div>
        <div class="dialog-body" id="dialogBody"></div>
        <div class="dialog-footer">
            <button type="button" id="dialogCancelBtn" class="secondary-button">Hủy bỏ</button>
            <button type="button" id="dialogConfirmBtn" class="primary-button">Xác nhận</button>
        </div>
    </dialog>

    <!-- Khung ẩn phục vụ in phiếu đăng ký (Chỉ hiện khi in) -->
    <div id="printableWishReceipt" style="display: none;"></div>
</section>

<?php include dirname(__FILE__) . '/../../components/layout/footer.php'; ?>
<script src="<?php echo htmlspecialchars($appBase); ?>/assets/js/quan-ly-nguyen-vong.js"></script>

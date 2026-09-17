<?php
$activePage = 'admission-result';
$displayName = 'Nguyễn Minh Anh';
$displayRole = 'Học sinh • SBD 100001';
include dirname(__FILE__) . '/../../components/layout/header.php';
?>

<link rel="stylesheet" href="<?php echo htmlspecialchars($appBase); ?>/assets/css/tra-cuu-ket-qua.css">

<section class="content workflow" data-page="tra-cuu-ket-qua">
    <!-- Tiêu đề trang -->
    <div class="page-heading">
        <div>
            <div class="eyebrow">HỌC SINH / KẾT QUẢ TUYỂN SINH</div>
            <h1>Tra cứu kết quả xét tuyển lớp 10</h1>
            <p>Xem kết quả xét tuyển chính thức, điểm thi chi tiết và thông tin trúng tuyển theo các nguyện vọng năm học 2026 - 2027.</p>
        </div>
        <span class="pill green">Đã công bố kết quả chính thức</span>
    </div>

    <!-- Thanh công cụ hỗ trợ kiểm thử mô phỏng Exception Flow 2.1 -->
    <div class="simulation-bar">
        <div>
            <strong>🔧 Thanh điều khiển mô phỏng kịch bản (Use Case 4):</strong>
            <span>Kiểm thử trạng thái khi hệ thống chưa công bố kết quả xét tuyển.</span>
        </div>
        <button type="button" id="togglePublishResultBtn" class="simulation-btn">
            Mô phỏng: Kết quả chưa công bố (Ca 2.1)
        </button>
    </div>

    <!-- Màn hình ngoại lệ: Kết quả xét tuyển chưa công bố (Exception Flow 2.1) -->
    <div id="unpublishedResultSection" style="display: none;">
        <div class="unpublished-banner">
            <div class="unpublished-icon" aria-hidden="true">⏳</div>
            <h2 class="unpublished-title">Kết quả xét tuyển chưa được công bố</h2>
            <p class="unpublished-desc">
                Hội đồng tuyển sinh Sở Giáo dục &amp; Đào tạo hiện đang trong giai đoạn tổng hợp điểm xét tuyển và phê duyệt điểm chuẩn chính thức của từng trường THPT.
                Kết quả dự kiến sẽ được công bố vào lúc <strong>08:00 ngày 25/06/2026</strong>.
            </p>
            <div class="summary-box" style="max-width: 480px; margin: 0 auto 16px;">
                <dl>
                    <dt>Thời gian công bố chính thức</dt>
                    <dd style="color: #1769e0;">08:00 ngày 25/06/2026</dd>
                    <dt>Trạng thái xét tuyển</dt>
                    <dd><span class="pill orange">Đang xét duyệt chỉ tiêu</span></dd>
                </dl>
            </div>
            <p class="hint">Học sinh vui lòng quay lại hệ thống sau thời điểm công bố để tra cứu kết quả.</p>
        </div>
    </div>

    <!-- Nội dung chính: Đã công bố kết quả (Basic Flow & Alternative Flow) -->
    <div id="publishedResultSection">
        <!-- Khung tra cứu số báo danh khác & Xử lý Exception Flow 2.2 -->
        <div class="search-other-sbd-box">
            <div style="font-size: 13px; color: #475569;">
                <strong>🔍 Tra cứu nhanh theo Số báo danh:</strong>
            </div>
            <div class="search-other-input-wrap">
                <input type="text" id="searchSbdInput" placeholder="Nhập Số báo danh (ví dụ: 100001, 100005, 100008, 999999)..." value="100001">
                <button type="button" id="btnSearchSbd" class="primary-button" style="white-space: nowrap;">Tra cứu</button>
            </div>
        </div>

        <!-- Thông báo ngoại lệ không tìm thấy kết quả (Exception Flow 2.2) -->
        <div id="sbdNotFoundAlert" class="wf-alert error" role="alert" hidden></div>

        <!-- Banner kết quả trúng tuyển tổng quan (Basic Flow 3) -->
        <div id="resultHeroBanner"></div>

        <!-- Thẻ điểm thi 3 môn và tổng điểm -->
        <div class="panel" style="margin-bottom: 24px;">
            <div class="panel-header">
                <div>
                    <h3>Kết quả điểm thi tuyển sinh lớp 10</h3>
                    <p>Điểm các môn thi chung và tổng điểm xét tuyển.</p>
                </div>
            </div>

            <div class="score-breakdown-grid">
                <div class="score-cell">
                    <span>Ngữ văn</span>
                    <h3 id="scoreLit">0.00</h3>
                </div>
                <div class="score-cell">
                    <span>Toán</span>
                    <h3 id="scoreMath">0.00</h3>
                </div>
                <div class="score-cell">
                    <span>Ngoại ngữ (Tiếng Anh)</span>
                    <h3 id="scoreEng">0.00</h3>
                </div>
                <div class="score-cell total">
                    <span>Tổng điểm xét tuyển</span>
                    <h3 id="scoreTotal">0.00</h3>
                </div>
            </div>
        </div>

        <!-- Bảng so sánh kết quả theo từng nguyện vọng (Alternative Flow 3.1) -->
        <div class="panel" style="margin-bottom: 24px;">
            <div class="panel-header">
                <div>
                    <h3>Kết quả xét tuyển theo từng nguyện vọng</h3>
                    <p>Nhấn vào bất kỳ nguyện vọng nào để xem phân tích chi tiết điểm chuẩn và điều kiện xét tuyển.</p>
                </div>
            </div>

            <div id="wishComparisonList" class="wish-comparison-list"></div>
        </div>

        <!-- Hướng dẫn thủ tục xác nhận nhập học -->
        <div id="enrollInstructionBox" class="enroll-instruction-box">
            <div class="enroll-instruction-header">
                <span>📋</span>
                <span>HƯỚNG DẪN THỦ TỤC XÁC NHẬN NHẬP HỌC TRỰC TUYẾN</span>
            </div>

            <div class="enroll-steps-list">
                <div class="enroll-step-item">
                    <div class="enroll-step-num">1</div>
                    <strong>In giấy báo trúng tuyển</strong>
                    <p class="hint" style="margin-top: 6px;">Bấm nút "In giấy báo" bên dưới để lưu phiếu xác nhận điểm và trường trúng tuyển.</p>
                </div>
                <div class="enroll-step-item">
                    <div class="enroll-step-num">2</div>
                    <strong>Chuẩn bị hồ sơ gốc</strong>
                    <p class="hint" style="margin-top: 6px;">Bản chính học bạ THCS, bản sao giấy khai sinh, giấy chứng nhận tốt nghiệp THCS tạm thời.</p>
                </div>
                <div class="enroll-step-item">
                    <div class="enroll-step-num">3</div>
                    <strong>Nộp hồ sơ tại trường THPT</strong>
                    <p class="hint" style="margin-top: 6px;">Đến trực tiếp trường THPT trúng tuyển trước <strong>17:00 ngày 05/07/2026</strong> để hoàn tất thủ tục.</p>
                </div>
            </div>

            <div class="actions" style="margin-top: 20px;">
                <button type="button" id="btnPrintLetter" class="primary-button" style="display: inline-flex; align-items: center; gap: 8px;">
                    <span>🖨️ In Giấy báo trúng tuyển</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Hộp thoại Modal xem chi tiết nguyện vọng (Alternative Flow 3.1) căn giữa màn hình -->
    <dialog id="wishDetailModal" class="action-confirm-dialog" aria-labelledby="modalWishTitle">
        <div class="dialog-header">
            <h3 id="modalWishTitle">Chi tiết nguyện vọng</h3>
            <button type="button" id="modalWishCloseBtn" class="modal-close-btn" style="color: #687282;" aria-label="Đóng">✕</button>
        </div>
        <div class="dialog-body" id="modalWishBody"></div>
        <div class="dialog-footer">
            <button type="button" id="modalWishFooterCloseBtn" class="secondary-button">Đóng</button>
        </div>
    </dialog>

    <!-- Khung ẩn phục vụ in Giấy báo trúng tuyển chính thức -->
    <div id="admissionLetterPrintArea" style="display: none;"></div>
</section>

<?php include dirname(__FILE__) . '/../../components/layout/footer.php'; ?>
<script src="<?php echo htmlspecialchars($appBase); ?>/assets/js/tra-cuu-ket-qua.js"></script>

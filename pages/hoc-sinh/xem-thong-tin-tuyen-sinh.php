<?php
$activePage = 'admission-info';
$displayName = 'Nguyễn Minh Anh';
$displayRole = 'Học sinh • SBD 100001';
include dirname(__FILE__) . '/../../components/layout/header.php';
?>

<link rel="stylesheet" href="<?php echo htmlspecialchars($appBase); ?>/assets/css/thong-tin-tuyen-sinh.css">

<section class="content workflow" data-page="xem-thong-tin-tuyen-sinh">
    <!-- Tiêu đề trang -->
    <div class="page-heading">
        <div>
            <div class="eyebrow">HỌC SINH / THÔNG TIN TUYỂN SINH</div>
            <h1>Xem thông tin tuyển sinh lớp 10</h1>
            <p>Tra cứu danh mục chỉ tiêu, trường THPT, hệ đào tạo, phương thức tuyển sinh và học phí năm học 2026 - 2027.</p>
        </div>
        <span class="pill blue">Kỳ thi tuyển sinh lớp 10 • 2026</span>
    </div>

    <!-- Thanh công cụ hỗ trợ kiểm thử mô phỏng Exception Flow 2.1 -->
    <div class="simulation-bar">
        <div>
            <strong>🔧 Thanh điều khiển kịch bản kiểm thử:</strong>
            <span>Hệ thống cho phép mô phỏng tình huống đặc tả Use Case.</span>
        </div>
        <button type="button" id="togglePublishedBtn" class="simulation-btn">
            Mô phỏng: Chuyển sang "Chưa công bố" (Test ca 2.1)
        </button>
    </div>

    <!-- Màn hình ngoại lệ: Chưa có thông tin tuyển sinh (Exception Flow 2.1) -->
    <div id="unpublishedContent" style="display: none;">
        <div class="unpublished-banner">
            <div class="unpublished-icon" aria-hidden="true">📅</div>
            <h2 class="unpublished-title">Chưa có thông tin tuyển sinh</h2>
            <p class="unpublished-desc">
                Hiện tại Sở Giáo dục &amp; Đào tạo và các trường THPT chưa tới kỳ công bố thông tin tuyển sinh chính thức cho năm học 2026 - 2027.
                Hệ thống sẽ cập nhật đầy đủ chỉ tiêu, phương thức tuyển sinh và học phí ngay khi có quyết định ban hành.
            </p>
            <div class="summary-box" style="max-width: 480px; margin: 0 auto 16px;">
                <dl>
                    <dt>Thời gian dự kiến công bố</dt>
                    <dd style="color: #1769e0;">Tháng 04/2026</dd>
                    <dt>Trạng thái tiếp nhận</dt>
                    <dd><span class="pill orange">Chưa mở cổng</span></dd>
                </dl>
            </div>
            <p class="hint">Vui lòng quay lại hệ thống sau khi kỳ tuyển sinh chính thức được kích hoạt.</p>
        </div>
    </div>

    <!-- Nội dung chính: Đã công bố thông tin tuyển sinh (Basic Flow & Alternative Flow) -->
    <div id="publishedContent">
        <!-- Khối thống kê tổng quan (Stat Cards) -->
        <div class="stat-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 22px;">
            <div class="stat-card">
                <div class="stat-icon blue" aria-hidden="true">▣</div>
                <div>
                    <span>Tổng trường THPT</span>
                    <h2>8</h2>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon green" aria-hidden="true">✓</div>
                <div>
                    <span>Tổng chỉ tiêu lớp 10</span>
                    <h2>5.800</h2>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon orange" aria-hidden="true">☆</div>
                <div>
                    <span>Hệ đào tạo</span>
                    <h2>3 hệ</h2>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon blue" aria-hidden="true">⌂</div>
                <div>
                    <span>Khu vực phủ sóng</span>
                    <h2>6 Quận/Huyện</h2>
                </div>
            </div>
        </div>

        <!-- Thanh công cụ tìm kiếm và bộ lọc đa tiêu chí (Alternative Flow 3.1) -->
        <div class="info-toolbar">
            <div class="toolbar-row">
                <!-- Thanh tìm kiếm nhanh -->
                <div class="search-box-wrap">
                    <span class="search-icon" aria-hidden="true">🔍</span>
                    <input type="text"
                           id="searchInput"
                           class="search-input"
                           placeholder="Tìm kiếm nhanh: tên trường, mã trường, quận/huyện..."
                           aria-label="Tìm kiếm trường THPT"
                           autocomplete="off">
                    <button type="button" id="clearSearchBtn" class="search-clear-btn" aria-label="Xóa từ khóa">✕</button>
                </div>

                <!-- Bộ lọc theo khu vực và hệ đào tạo -->
                <div class="filter-group">
                    <select id="filterDistrict" class="filter-select-item" aria-label="Lọc theo Quận/Huyện">
                        <option value="all">Tất cả Quận / Huyện</option>
                    </select>

                    <select id="filterTrack" class="filter-select-item" aria-label="Lọc theo Hệ đào tạo">
                        <option value="all">Tất cả hệ đào tạo</option>
                        <option value="regular">Công lập đại trà</option>
                        <option value="specialized">Trường Chuyên</option>
                        <option value="advanced">Tiên tiến hội nhập</option>
                        <option value="hybrid">Chuyên &amp; Đại trà</option>
                    </select>

                    <select id="sortSelect" class="filter-select-item" aria-label="Sắp xếp kết quả">
                        <option value="default">Sắp xếp mặc định</option>
                        <option value="quotaDesc">Chỉ tiêu: Giảm dần</option>
                        <option value="quotaAsc">Chỉ tiêu: Tăng dần</option>
                        <option value="benchmarkDesc">Điểm chuẩn: Cao đến thấp</option>
                        <option value="nameAsc">Tên trường: A → Z</option>
                    </select>

                    <!-- Chuyển chế độ xem Dạng Thẻ / Dạng Bảng -->
                    <div class="view-modes" role="group" aria-label="Chế độ hiển thị">
                        <button type="button" id="viewCardsBtn" class="view-btn active" title="Hiển thị dạng Thẻ (Grid)">
                            ⊞ Thẻ
                        </button>
                        <button type="button" id="viewTableBtn" class="view-btn" title="Hiển thị dạng Bảng (Table)">
                            ☰ Bảng
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Thanh tóm tắt kết quả lọc -->
        <div class="results-summary-bar">
            <div id="resultsCountText">Đang tải danh sách trường tuyển sinh...</div>
            <div class="active-filter-tags" id="activeFilterTags"></div>
        </div>

        <!-- Hiển thị Dạng Thẻ Card (Mặc định) -->
        <div id="schoolGridContainer" class="school-grid"></div>

        <!-- Hiển thị Dạng Bảng Tổng hợp (Table View) -->
        <div id="schoolTableContainer" class="panel" style="display: none;">
            <div class="wf-table-wrap">
                <table class="wf-table">
                    <thead>
                        <tr>
                            <th>Mã</th>
                            <th>Trường THPT</th>
                            <th>Hệ đào tạo</th>
                            <th>Chỉ tiêu</th>
                            <th>Phương thức</th>
                            <th>Điểm chuẩn 2025</th>
                            <th>Học phí</th>
                            <th>Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody id="schoolTableBody"></tbody>
                </table>
            </div>
        </div>

        <!-- Thông báo Không tìm thấy kết quả (Exception Flow 3.1) -->
        <div id="emptyStateBox" class="empty-state-box" style="display: none;">
            <div class="empty-state-icon">🔎</div>
            <h3 class="empty-state-title">Không tìm thấy thông tin phù hợp</h3>
            <p class="empty-state-desc">
                Không tìm thấy trường THPT hoặc danh mục nào khớp với từ khóa <span id="searchKeywordHighlight" style="font-weight: 700; color: #1769e0;"></span>.
                Vui lòng kiểm tra lại chính tả hoặc chọn lại các tiêu chí lọc khu vực.
            </p>
            <button type="button" id="resetSearchBtn" class="primary-button">
                Xóa tìm kiếm &amp; Thử lại
            </button>
        </div>
    </div>

    <!-- Hộp thoại Modal xem chi tiết thông tin tuyển sinh (Basic Flow 4 & 5) -->
    <dialog id="schoolDetailModal" class="school-modal-dialog" aria-labelledby="modalSchoolName">
        <div class="modal-header-banner">
            <div class="modal-school-heading">
                <h2 id="modalSchoolName">Tên trường THPT</h2>
                <p id="modalSchoolSubtitle">Mã trường • Quận/Huyện • Hệ đào tạo</p>
            </div>
            <button type="button" id="modalCloseBtn" class="modal-close-btn" aria-label="Đóng cửa sổ chi tiết">✕</button>
        </div>

        <div class="modal-body-content">
            <!-- 1. Thông tin chung -->
            <div class="modal-section">
                <div class="modal-section-title">
                    <span>🏢</span>
                    <span>1. Thông tin liên hệ &amp; Địa chỉ</span>
                </div>
                <dl class="modal-info-grid">
                    <div class="modal-info-cell">
                        <dt>Địa chỉ</dt>
                        <dd id="modalAddress">—</dd>
                    </div>
                    <div class="modal-info-cell">
                        <dt>Số điện thoại</dt>
                        <dd id="modalPhone">—</dd>
                    </div>
                    <div class="modal-info-cell">
                        <dt>Cổng thông tin / Website</dt>
                        <dd id="modalWebsite">—</dd>
                    </div>
                    <div class="modal-info-cell">
                        <dt>Lãnh đạo trường</dt>
                        <dd id="modalPrincipal">—</dd>
                    </div>
                </dl>
            </div>

            <!-- 2. Chỉ tiêu tuyển sinh & Các lớp đào tạo -->
            <div class="modal-section">
                <div class="modal-section-title">
                    <span>👥</span>
                    <span>2. Chỉ tiêu tuyển sinh &amp; Phân bổ lớp</span>
                </div>
                <div class="summary-box" style="margin: 0 0 12px 0;">
                    <dl>
                        <dt>Tổng chỉ tiêu được giao</dt>
                        <dd id="modalTotalQuota" style="color: #1769e0;">—</dd>
                        <dt>Điểm chuẩn tham khảo</dt>
                        <dd id="modalBenchmark">—</dd>
                    </dl>
                </div>
                <div class="wf-table-wrap">
                    <table class="modal-quota-table">
                        <thead>
                            <tr>
                                <th>Lớp / Khối tuyển sinh</th>
                                <th>Chỉ tiêu</th>
                                <th>Ghi chú tổ hợp</th>
                            </tr>
                        </thead>
                        <tbody id="modalQuotaTableBody"></tbody>
                    </table>
                </div>
            </div>

            <!-- 3. Phương thức tuyển sinh -->
            <div class="modal-section">
                <div class="modal-section-title">
                    <span>📝</span>
                    <span>3. Phương thức tuyển sinh &amp; Tiêu chí xét</span>
                </div>
                <div class="modal-info-cell" style="margin-bottom: 10px;">
                    <dt>Hình thức thi / xét</dt>
                    <dd id="modalMethod">—</dd>
                </div>
                <div class="modal-info-cell">
                    <dt>Quy chế &amp; Cách tính điểm</dt>
                    <dd id="modalCriteria" style="font-weight: normal; color: #46505f; line-height: 1.6;">—</dd>
                </div>
            </div>

            <!-- 4. Học phí & Chính sách hỗ trợ -->
            <div class="modal-section">
                <div class="modal-section-title">
                    <span>💵</span>
                    <span>4. Mức học phí &amp; Chính sách miễn giảm</span>
                </div>
                <dl class="modal-info-grid">
                    <div class="modal-info-cell">
                        <dt>Mức thu học phí</dt>
                        <dd id="modalTuition" style="color: #159465; font-size: 15px;">—</dd>
                    </div>
                    <div class="modal-info-cell">
                        <dt>Chế độ miễn giảm &amp; Học bổng</dt>
                        <dd id="modalPolicies" style="font-weight: normal; color: #46505f; line-height: 1.6;">—</dd>
                    </div>
                </dl>
            </div>
        </div>

        <div class="modal-footer-actions">
            <span class="hint">Dữ liệu công bố chính thức theo hướng dẫn tuyển sinh lớp 10 của Sở GD&amp;ĐT.</span>
            <button type="button" id="modalFooterCloseBtn" class="secondary-button">Đóng</button>
        </div>
    </dialog>
</section>

<?php include dirname(__FILE__) . '/../../components/layout/footer.php'; ?>
<script src="<?php echo htmlspecialchars($appBase); ?>/assets/js/thong-tin-tuyen-sinh.js"></script>

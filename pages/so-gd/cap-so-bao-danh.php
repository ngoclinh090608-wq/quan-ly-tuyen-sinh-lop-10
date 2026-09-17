<?php
$activePage = 'candidate-sbd';
$displayName = 'Ban Tuyển sinh Sở GD&ĐT';
$displayRole = 'Quản trị viên • Quản lý kỳ thi';
include dirname(__FILE__) . '/../../components/layout/header.php';
?>

<link rel="stylesheet" href="<?php echo htmlspecialchars($appBase); ?>/assets/css/cap-so-bao-danh.css">

<section class="content workflow" data-page="cap-so-bao-danh">
    <!-- Tiêu đề trang -->
    <div class="page-heading">
        <div>
            <div class="eyebrow">BAN TUYỂN SINH SỞ GD&amp;ĐT / QUẢN LÝ KỲ THI</div>
            <h1>Cấp số báo danh cho thí sinh</h1>
            <p>Đánh số báo danh tự động theo quy tắc Alphabet (A-B-C) toàn thành phố hoặc theo từng Hội đồng thi cụ thể.</p>
        </div>
        <span class="pill blue">Kỳ thi tuyển sinh lớp 10 • 2026</span>
    </div>

    <!-- Hộp thông báo trang -->
    <div id="sbdPageAlert" class="wf-alert" role="status" aria-live="polite" hidden></div>

    <!-- Thanh công cụ hỗ trợ kiểm thử mô phỏng các kịch bản ngoại lệ -->
    <div class="simulation-bar">
        <div>
            <strong>🔧 Thanh điều khiển mô phỏng kịch bản (Use Case 3):</strong>
            <span>Kiểm thử trạng thái thời hạn tiếp nhận và lỗi dữ liệu.</span>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" id="toggleRegClosedBtn" class="simulation-btn">
                Mô phỏng: Thời gian đăng ký vẫn đang mở (Ca 2.1)
            </button>
            <button type="button" id="toggleDataErrorBtn" class="simulation-btn">
                Mô phỏng: Dữ liệu thí sinh bị lỗi (Ca 6.1)
            </button>
        </div>
    </div>

    <!-- Banner kiểm tra tiền điều kiện (Tiền điều kiện: Chốt hồ sơ) -->
    <div id="regStatusBanner" class="wf-alert success">
        ✓ <strong>Thời gian đăng ký nguyện vọng đã kết thúc (Dữ liệu đã chốt)</strong>. Danh sách thí sinh đủ điều kiện đã được phê duyệt và sẵn sàng cấp Số báo danh.
    </div>

    <!-- Thẻ thống kê tổng quan (Basic Flow 2) -->
    <div class="stat-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 22px;">
        <div class="stat-card">
            <div class="stat-icon blue" aria-hidden="true">👥</div>
            <div>
                <span>Tổng thí sinh hợp lệ</span>
                <h2 id="statTotalValid">14</h2>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon green" aria-hidden="true">✓</div>
            <div>
                <span>Đã có Số báo danh</span>
                <h2 id="statAssigned">11</h2>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon orange" aria-hidden="true">⏳</div>
            <div>
                <span>Chưa có Số báo danh</span>
                <h2 id="statUnassigned">3</h2>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon blue" aria-hidden="true">🏫</div>
            <div>
                <span>Số Hội đồng thi</span>
                <h2 id="statClusters">3</h2>
            </div>
        </div>
    </div>

    <!-- Bảng điều khiển thiết lập cấp SBD -->
    <div class="sbd-control-panel">
        <div class="sbd-control-header">
            <div>
                <h2>
                    <span>⚙️</span>
                    <span>Thiết lập thông số &amp; Cấp số báo danh</span>
                </h2>
                <p class="hint" style="margin-top: 4px;">
                    Quy tắc cấp: Sắp xếp theo tên tiếng Việt (A-Z), tự động sinh mã SBD duy nhất 6 chữ số và gán phòng thi.
                </p>
            </div>
            <div id="assignStatusNotice"></div>
        </div>

        <div class="sbd-config-grid">
            <div class="sbd-config-item">
                <label for="sbdScopeSelect">Phạm vi cấp Số báo danh:</label>
                <select id="sbdScopeSelect" class="sbd-select">
                    <option value="all">Toàn thành phố (Tất cả Hội đồng thi)</option>
                    <option value="HĐT THPT Nguyễn Trãi">HĐT THPT Nguyễn Trãi</option>
                    <option value="HĐT THPT Lê Quý Đôn">HĐT THPT Lê Quý Đôn</option>
                    <option value="HĐT THPT Chuyên Lê Hồng Phong">HĐT THPT Chuyên Lê Hồng Phong</option>
                </select>
            </div>

            <div class="sbd-config-item">
                <label for="sbdRuleSelect">Tiêu chí sắp xếp và đánh số:</label>
                <select id="sbdRuleSelect" class="sbd-select">
                    <option value="name">Thứ tự bảng chữ cái A-B-C (Tên → Họ đệm → Ngày sinh)</option>
                    <option value="school">Theo Trường THCS và Tên thí sinh</option>
                </select>
            </div>

            <div class="sbd-config-item">
                <label for="sbdFormatInput">Định dạng dải số bắt đầu:</label>
                <input type="text" id="sbdFormatInput" class="sbd-input" value="100001" readonly title="Dải số báo danh bắt đầu từ 100001">
            </div>
        </div>

        <!-- Tùy chọn cấp bổ sung (Alternative Flow 3.1) -->
        <div class="sbd-option-toggle">
            <input type="checkbox" id="onlyUnassignedCheckbox" checked>
            <label for="onlyUnassignedCheckbox">
                <strong>Chỉ cấp số báo danh bổ sung cho thí sinh chưa có SBD (Alternative Flow 3.1)</strong>
                <span class="muted" style="display:block; font-size:11px;">Hệ thống sẽ sinh số tiếp nối theo dải số SBD hiện tại, không làm thay đổi các thí sinh đã có SBD.</span>
            </label>
        </div>

        <!-- Các nút thao tác cấp SBD, hủy và xuất danh sách -->
        <div class="sbd-action-buttons">
            <div class="sbd-btn-group-left">
                <button type="button" id="btnResetSbd" class="btn-danger-outline" title="Hủy và đưa toàn bộ thí sinh về trạng thái chưa có SBD">
                    🗑️ Hủy / Thu hồi toàn bộ SBD (Ca 7.1)
                </button>
                <button type="button" id="btnExportSbd" class="secondary-button" title="Xuất và in bảng niêm yết phòng thi">
                    📄 Xuất danh sách SBD (Ca 7.2)
                </button>
            </div>
            <div>
                <button type="button" id="btnStartAssign" class="primary-button" style="padding: 10px 22px; font-size: 14px;">
                    ⚡ Bắt đầu cấp Số báo danh
                </button>
            </div>
        </div>
    </div>

    <!-- Bảng danh sách thí sinh và số báo danh -->
    <div class="panel">
        <div class="panel-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
            <div>
                <h3>Danh sách thí sinh đủ điều kiện dự thi</h3>
                <p id="filteredCandidateCount">Đang tải danh sách thí sinh...</p>
            </div>
        </div>

        <!-- Bộ lọc và tìm kiếm danh sách thí sinh -->
        <div class="candidate-filter-bar">
            <div class="candidate-search-wrap">
                <input type="text" id="candidateSearchInput" placeholder="Tìm kiếm nhanh: Tên thí sinh, SBD, Trường THCS..." autocomplete="off">
            </div>

            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <select id="filterClusterSelect" class="sbd-select" style="width: auto;">
                    <option value="all">Tất cả Hội đồng thi</option>
                    <option value="HĐT THPT Nguyễn Trãi">HĐT THPT Nguyễn Trãi</option>
                    <option value="HĐT THPT Lê Quý Đôn">HĐT THPT Lê Quý Đôn</option>
                    <option value="HĐT THPT Chuyên Lê Hồng Phong">HĐT THPT Chuyên Lê Hồng Phong</option>
                </select>

                <select id="filterStatusSelect" class="sbd-select" style="width: auto;">
                    <option value="all">Tất cả trạng thái</option>
                    <option value="assigned">Đã có Số báo danh</option>
                    <option value="unassigned">Chưa có Số báo danh</option>
                </select>
            </div>
        </div>

        <div class="wf-table-wrap">
            <table class="wf-table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã hồ sơ</th>
                        <th>Họ và tên thí sinh</th>
                        <th>Ngày sinh</th>
                        <th>Giới tính</th>
                        <th>Trường THCS</th>
                        <th>Hội đồng thi</th>
                        <th>Số báo danh</th>
                        <th>Phòng thi</th>
                    </tr>
                </thead>
                <tbody id="candidateTableBody"></tbody>
            </table>
        </div>
    </div>

    <!-- Modal Hộp thoại xác nhận căn giữa màn hình (Basic Flow 4, Alt 7.1, Exception 2.1, 6.1) -->
    <dialog id="sbdConfirmModal" class="sbd-modal-dialog" aria-labelledby="sbdModalTitle">
        <div class="sbd-modal-header">
            <h3 id="sbdModalTitle">Xác nhận cấp Số báo danh</h3>
        </div>
        <div class="sbd-modal-body" id="sbdModalBody"></div>
        <div class="sbd-modal-footer">
            <button type="button" id="sbdModalCancelBtn" class="secondary-button">Hủy bỏ</button>
            <button type="button" id="sbdModalConfirmBtn" class="primary-button">Đồng ý</button>
        </div>
    </dialog>

    <!-- Khung ẩn phục vụ in danh sách SBD niêm yết (Alternative Flow 7.2) -->
    <div id="sbdPrintArea" style="display: none;"></div>
</section>

<?php include dirname(__FILE__) . '/../../components/layout/footer.php'; ?>
<script src="<?php echo htmlspecialchars($appBase); ?>/assets/js/cap-so-bao-danh.js"></script>

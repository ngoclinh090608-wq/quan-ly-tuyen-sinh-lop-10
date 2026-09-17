<?php
$activePage = 'nhap-diem-thi';
$displayName = 'Nguyễn Thị Thúy Vy';
$displayRole = 'Hội đồng chấm thi • Phân quyền: Nhập điểm thi';
include dirname(__FILE__) . '/../../components/layout/header.php';
?>

<link rel="stylesheet" href="<?php echo htmlspecialchars($appBase); ?>/assets/css/nhap-diem-thi.css">

<section class="content workflow" data-workflow="enter-scores">
    <!-- Tiêu đề trang (Basic Flow 1) -->
    <div class="page-heading">
        <div>
            <div class="eyebrow">HỘI ĐỒNG CHẤM THI / CÔNG TÁC CHẤM THI</div>
            <h1>Nhập điểm thi (Use Case 5)</h1>
            <p>Hệ thống hỗ trợ Hội đồng chấm thi nhập điểm bài thi theo kỳ thi và môn thi được phân công sau khi công tác chấm thi hoàn tất.</p>
        </div>
        <span class="pill blue">Kỳ thi tuyển sinh lớp 10 • 2026 - 2027</span>
    </div>

    <!-- Thông báo trạng thái trên trang -->
    <div id="scorePageAlert" class="wf-alert" role="status" aria-live="polite" hidden></div>

    <!-- Thanh công cụ kiểm thử mô phỏng các kịch bản của Use Case 5 -->
    <div class="simulation-bar">
        <div class="simulation-bar-info">
            <strong>🧪 Thanh kiểm thử kịch bản Use Case 5:</strong>
            <span>Nhấn nhanh các nút bên dưới để trải nghiệm các luồng nghiệp vụ &amp; ngoại lệ theo đặc tả.</span>
        </div>
        <div class="simulation-btn-group">
            <button type="button" id="btnSimulateBasic" class="simulation-btn" title="Điền sẵn điểm 8.75 cho bài thi hợp lệ">
                ✓ Thử Basic Flow (1-13)
            </button>
            <button type="button" id="btnSimulateNoPapers" class="simulation-btn" title="Chuyển sang môn Hóa học chưa có bài thi">
                ⚠ Ca 4.1: Không có bài thi
            </button>
            <button type="button" id="btnSimulateInvalid" class="simulation-btn" title="Thử nhập điểm 12.50 ngoài thang điểm">
                ✕ Ca 8.1: Điểm không hợp lệ
            </button>
            <button type="button" id="btnSimulateNotEligible" class="simulation-btn" title="Chọn bài thi chưa hoàn tất chấm vòng 2">
                ⛔ Ca 8.2: Bài chưa xong chấm
            </button>
            <button type="button" id="btnSimulateSaveError" class="simulation-btn" title="Bật mô phỏng lỗi lưu vào cơ sở dữ liệu">
                💾 Ca 10.1: Lỗi lưu hệ thống
            </button>
            <button type="button" id="btnSimulateLocked" class="simulation-btn" title="Chọn bài thi đã được xác nhận chính thức">
                🔒 Ca 10.2: Điểm đã chốt
            </button>
            <button type="button" id="btnResetData" class="simulation-btn" style="color: #c23939;" title="Khôi phục danh sách bài thi gốc">
                ↺ Khôi phục dữ liệu
            </button>
        </div>
    </div>

    <!-- Banner xác nhận tiền điều kiện (Preconditions) -->
    <div class="precondition-card">
        <div class="precondition-content">
            <div class="precondition-icon">✓</div>
            <div class="precondition-text">
                <h4>Tiền điều kiện đã được thỏa mãn đầy đủ</h4>
                <p>Cán bộ chấm thi: <strong><?php echo htmlspecialchars($displayName); ?></strong> | Đã đăng nhập và được cấp quyền nhập điểm thi. Danh sách kỳ thi, môn thi và công tác chấm thi tương ứng đã hoàn tất.</p>
            </div>
        </div>
        <span class="pill green">Hệ thống sẵn sàng tiếp nhận</span>
    </div>

    <!-- Thẻ thống kê tiến độ nhập điểm -->
    <div class="score-stat-grid">
        <div class="score-stat-card">
            <div class="score-stat-icon blue">📚</div>
            <div class="score-stat-info">
                <span>Tổng bài thi của môn</span>
                <h3 id="statTotalPapers">10</h3>
            </div>
        </div>
        <div class="score-stat-card">
            <div class="score-stat-icon green">✓</div>
            <div class="score-stat-info">
                <span>Đã nhập điểm</span>
                <h3 id="statEnteredScores">2 (20%)</h3>
            </div>
        </div>
        <div class="score-stat-card">
            <div class="score-stat-icon orange">⏳</div>
            <div class="score-stat-info">
                <span>Chờ nhập điểm</span>
                <h3 id="statPendingScores">6</h3>
            </div>
        </div>
        <div class="score-stat-card">
            <div class="score-stat-icon purple">🛡</div>
            <div class="score-stat-info">
                <span>Chưa xong chấm / Đã chốt</span>
                <h3 id="statNotEligible">2</h3>
            </div>
        </div>
    </div>

    <!-- Khối chọn Kỳ thi và Môn thi (Basic Flow 2 & 3) -->
    <div class="exam-selector-card">
        <div class="exam-selector-header">
            <h2><span>📋</span> Chọn kỳ thi và môn thi cần nhập điểm (Bước 2, 3)</h2>
            <div class="subject-rules-badge">
                <span>ℹ Quy định: Thang điểm 10.00 • Bước nhảy: 0.25 • Làm tròn 2 chữ số thập phân</span>
            </div>
        </div>
        <div class="exam-selector-grid">
            <div class="field" style="margin-bottom: 0;">
                <label for="examSelect">Kỳ thi tuyển sinh <span class="required">*</span></label>
                <select id="examSelect" class="filter-select" style="max-width: 100%;"></select>
            </div>
            <div class="field" style="margin-bottom: 0;">
                <label for="subjectSelect">Môn thi phân công <span class="required">*</span></label>
                <select id="subjectSelect" class="filter-select" style="max-width: 100%;"></select>
            </div>
            <div>
                <button type="button" class="secondary-button" onclick="location.reload();" style="height: 43px; display: flex; align-items: center; gap: 6px;">
                    <span>↻</span> Làm mới danh sách
                </button>
            </div>
        </div>
    </div>

    <!-- Bố cục 2 cột cho danh sách bài thi và bảng nhập điểm -->
    <div class="wf-grid">
        <!-- Cột trái: Danh sách bài thi cần nhập điểm (Basic Flow 4) -->
        <div class="panel">
            <div class="panel-header">
                <div>
                    <h2>Danh sách bài thi cần nhập điểm (Bước 4)</h2>
                    <p>Chọn một bài thi để kiểm tra thông tin và nhập điểm.</p>
                </div>
            </div>

            <!-- Thanh lọc & tìm kiếm bài thi -->
            <div class="exam-list-filter-bar">
                <div class="search-input-wrap">
                    <span class="search-icon">🔍</span>
                    <input type="text" id="searchInput" placeholder="Tìm theo mã phách, phòng thi, số túi..." aria-label="Tìm kiếm bài thi">
                </div>
                <div>
                    <select id="statusFilter" class="filter-select" aria-label="Lọc trạng thái">
                        <option value="all">Tất cả trạng thái</option>
                        <option value="chua_nhap">Chưa nhập điểm</option>
                        <option value="da_nhap">Đã nhập điểm</option>
                        <option value="chua_cham_xong">Chưa hoàn tất chấm thi</option>
                    </select>
                </div>
            </div>

            <!-- Bảng hiển thị bài thi -->
            <div class="wf-table-wrap" id="paperTableWrap">
                <table class="wf-table">
                    <thead>
                        <tr>
                            <th style="width: 40px;">STT</th>
                            <th>Mã phách / Túi bài</th>
                            <th>Điểm thi</th>
                            <th>Trạng thái</th>
                            <th>Người nhập &amp; Thời gian</th>
                            <th style="text-align: right;">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody id="paperTableBody">
                        <!-- Được render bởi JavaScript -->
                    </tbody>
                </table>
            </div>

            <!-- Hộp thông báo rỗng khi không có bài thi (Exception Flow 4.1) -->
            <div id="emptyPaperBox" class="empty-paper-box" hidden></div>
        </div>

        <!-- Cột phải: Khung nhập điểm bài thi (Basic Flow 6, 7, 8) -->
        <div class="panel input-score-panel" id="scoreInputPanel">
            <!-- Được render bởi JavaScript -->
        </div>
    </div>
</section>

<!-- Hộp thoại Modal Xác nhận nhập điểm (Basic Flow 9, Alternative Flow 9.1) -->
<dialog id="scoreConfirmModal" class="score-modal-dialog">
    <div class="score-modal-header">
        <h3><span>✓</span> Xác nhận nhập điểm thi (Bước 9)</h3>
        <button type="button" class="mobile-close" onclick="document.getElementById('scoreConfirmModal').close();" aria-label="Đóng">✕</button>
    </div>
    <div class="score-modal-body">
        <p style="margin-top: 0;">Vui lòng kiểm tra kỹ thông tin bài thi và điểm số trước khi hệ thống ghi nhận chính thức vào cơ sở dữ liệu:</p>
        
        <table class="confirm-summary-table">
            <tbody>
                <tr>
                    <td>Mã bài thi / Mã phách:</td>
                    <td><span class="phach-badge" id="confirmMaPhach">—</span></td>
                </tr>
                <tr>
                    <td>Môn thi:</td>
                    <td id="confirmMonThi">—</td>
                </tr>
                <tr>
                    <td>Phòng thi &amp; Túi:</td>
                    <td id="confirmPhongThi">—</td>
                </tr>
                <tr>
                    <td>Điểm trước đó:</td>
                    <td id="confirmOldScore">—</td>
                </tr>
                <tr>
                    <td>Điểm mới nhập:</td>
                    <td><span class="score-diff-tag" id="confirmNewScore">0.00</span></td>
                </tr>
                <tr>
                    <td>Cán bộ thực hiện:</td>
                    <td id="confirmActor">—</td>
                </tr>
                <tr>
                    <td>Thời điểm nhập:</td>
                    <td id="confirmTime">—</td>
                </tr>
            </tbody>
        </table>

        <div class="wf-alert" style="margin-bottom: 0; font-size: 12px;">
            ℹ Lưu ý: Sau khi xác nhận, điểm thi và thông tin cán bộ chấm thi sẽ được ghi nhận vào lịch sử hệ thống theo quy chế tuyển sinh.
        </div>
    </div>
    <div class="score-modal-footer">
        <!-- Alternative Flow 9.1: Điều chỉnh điểm trước khi lưu -->
        <button type="button" id="btnAdjustScore" class="secondary-button">
            ✕ Chỉnh sửa lại (Ca 9.1)
        </button>
        <!-- Basic Flow 10: Lưu điểm thi -->
        <button type="button" id="btnSaveScoreConfirmed" class="primary-button">
            ✓ Đồng ý &amp; Lưu điểm
        </button>
    </div>
</dialog>

<script src="<?php echo htmlspecialchars($appBase); ?>/assets/js/nhap-diem-thi.js"></script>

<?php include dirname(__FILE__) . '/../../components/layout/footer.php'; ?>

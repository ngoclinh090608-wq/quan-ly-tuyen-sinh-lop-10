<?php
$activePage = 'assign-rooms';
$displayName = 'Ban Tuyển sinh Sở GD&ĐT';
$displayRole = 'Quản trị viên • Phân phòng thi';
include dirname(__FILE__) . '/../../components/layout/header.php';
?>

<link rel="stylesheet" href="<?php echo htmlspecialchars($appBase); ?>/assets/css/phan-phong-thi.css">

<section class="content workflow" data-workflow="assign-exam-rooms">
    <!-- Tiêu đề trang (Basic Flow 1) -->
    <div class="page-heading">
        <div>
            <div class="eyebrow">BAN TUYỂN SINH SỞ GD&amp;ĐT / QUẢN LÝ KỲ THI</div>
            <h1>Phân phòng thi cho thí sinh (Use Case 7)</h1>
            <p>Hệ thống tự động xếp thí sinh vào các phòng thi thuộc điểm thi phù hợp theo khu vực trường THCS (cùng phường hoặc phường lân cận) và không vượt quá sức chứa quy định.</p>
        </div>
        <span class="pill blue">Kỳ thi tuyển sinh lớp 10 • 2026 - 2027</span>
    </div>

    <!-- Thông báo trang -->
    <div id="assignPageAlert" class="wf-alert" role="status" aria-live="polite" hidden></div>

    <!-- Thanh công cụ kiểm thử mô phỏng các kịch bản của Use Case 7 -->
    <div class="simulation-bar">
        <div class="simulation-bar-info">
            <strong>🧪 Thanh kiểm thử kịch bản Use Case 7:</strong>
            <span>Kiểm tra toàn bộ luồng nghiệp vụ phân phòng thi, điều chỉnh phòng và các tình huống ngoại lệ.</span>
        </div>
        <div class="simulation-btn-group">
            <button type="button" id="btnSimulateBasic" class="simulation-btn" title="Phân phòng tự động đúng quy tắc cho THPT Nguyễn Trãi">
                ✓ Thử Basic Flow (1-11)
            </button>
            <button type="button" id="btnSimulateAdjust" class="simulation-btn" title="Hướng dẫn điều chỉnh chuyển phòng cho thí sinh">
                ✏ Ca 9.1: Đổi phòng thí sinh
            </button>
            <button type="button" id="btnSimulateReAssign" class="simulation-btn" title="Xóa phân phòng cũ và chạy lại tự động">
                🔄 Ca 9.2: Phân phòng lại
            </button>
            <button type="button" id="btnSimulateNoRooms" class="simulation-btn" title="Chuyển sang điểm thi chưa có phòng thi">
                🚫 Ca 6.1: Chưa có phòng thi
            </button>
            <button type="button" id="btnSimulateOverCapacity" class="simulation-btn" title="Điểm thi có sức chứa nhỏ hơn số thí sinh">
                ⚠️ Ca 6.2: Sức chứa không đủ
            </button>
            <button type="button" id="btnSimulateConflictSchool" class="simulation-btn" title="Đưa thí sinh sai phường/quận vào điểm thi">
                📍 Ca 6.3: Sai địa bàn THCS
            </button>
            <button type="button" id="btnSimulateSaveError" class="simulation-btn" title="Bật/tắt mô phỏng lỗi máy chủ lưu trữ">
                💾 Ca 10.1: Lỗi lưu hệ thống
            </button>
            <button type="button" id="btnResetAssignData" class="simulation-btn" style="color: #c23939;" title="Khôi phục danh sách thí sinh và phòng thi ban đầu">
                ↺ Khôi phục dữ liệu
            </button>
        </div>
    </div>

    <!-- Banner xác nhận tiền điều kiện (Preconditions) -->
    <div class="precondition-card">
        <div class="precondition-content">
            <div class="precondition-icon">✓</div>
            <div class="precondition-text">
                <h4>Tiền điều kiện đã được đáp ứng đầy đủ</h4>
                <p>Cán bộ: <strong><?php echo htmlspecialchars($displayName); ?></strong> | Đã đăng nhập và có quyền phân phòng thi. Kỳ thi, điểm thi, phòng thi và danh sách thí sinh đã tồn tại; các trường THCS đã được xác định khu vực/phường để phục vụ phân bổ phù hợp.</p>
            </div>
        </div>
        <span class="pill green">Đủ điều kiện phân phòng</span>
    </div>

    <!-- Thẻ thống kê phân phòng thi -->
    <div class="assign-stat-grid">
        <div class="assign-stat-card">
            <div class="assign-stat-icon blue">👥</div>
            <div class="assign-stat-info">
                <span>Thí sinh tại điểm thi</span>
                <h3 id="statTotalCandidates">12</h3>
            </div>
        </div>
        <div class="assign-stat-card">
            <div class="assign-stat-icon green">✓</div>
            <div class="assign-stat-info">
                <span>Đã phân phòng</span>
                <h3 id="statAssignedCandidates">0 (0%)</h3>
            </div>
        </div>
        <div class="assign-stat-card">
            <div class="assign-stat-icon orange">⏳</div>
            <div class="assign-stat-info">
                <span>Chưa phân phòng</span>
                <h3 id="statUnassignedCandidates">12</h3>
            </div>
        </div>
        <div class="assign-stat-card">
            <div class="assign-stat-icon purple">🚪</div>
            <div class="assign-stat-info">
                <span>Tổng sức chứa điểm thi</span>
                <h3 id="statTotalVenueCapacity">18 chỗ (3 phòng)</h3>
            </div>
        </div>
    </div>

    <!-- Khối chọn Kỳ thi và Điểm thi cần phân phòng (Basic Flow 2 & 3) -->
    <div class="assign-selector-card">
        <div class="assign-selector-header">
            <h2><span>📋</span> Chọn kỳ thi và điểm thi cần phân phòng (Bước 2, 3)</h2>
            <span class="pill blue">Địa bàn tuyển sinh</span>
        </div>
        <div class="assign-selector-grid">
            <div class="field" style="margin-bottom: 0;">
                <label for="examSelect">Kỳ thi tuyển sinh <span class="required">*</span></label>
                <select id="examSelect" class="filter-select" style="max-width: 100%;"></select>
            </div>
            <div class="field" style="margin-bottom: 0;">
                <label for="venueSelect">Điểm thi cần phân phòng <span class="required">*</span></label>
                <select id="venueSelect" class="filter-select" style="max-width: 100%;"></select>
            </div>
            <div>
                <button type="button" class="secondary-button" onclick="location.reload();" style="height: 43px; display: flex; align-items: center; gap: 6px;">
                    <span>↻</span> Làm mới danh sách
                </button>
            </div>
        </div>
    </div>

    <!-- Thông tin điểm thi và Quy tắc khu vực trường THCS (Basic Flow 4, 6) -->
    <div class="venue-rule-card" id="venueRuleSection">
        <!-- Render bởi JS -->
    </div>

    <!-- Tình trạng sức chứa từng phòng thi tại điểm thi (Basic Flow 8) -->
    <div class="panel">
        <div class="panel-header">
            <div>
                <h2>Sức chứa &amp; Tiến độ xếp chỗ của các phòng thi (Bước 8)</h2>
                <p>Theo dõi sĩ số thí sinh được xếp vào từng phòng thi (bảo đảm không vượt quá sức chứa quy định).</p>
            </div>
        </div>
        <div class="rooms-overview-grid" id="roomsOverviewGrid">
            <!-- Render bởi JS -->
        </div>
    </div>

    <!-- Bảng danh sách thí sinh và kết quả phân phòng (Basic Flow 4, 5, 7, 8) -->
    <div class="panel">
        <div class="panel-header" style="flex-wrap: wrap; gap: 14px;">
            <div>
                <h2>Danh sách thí sinh và phân phòng thi (Bước 4, 7, 8)</h2>
                <p>Thực hiện phân bổ thí sinh vào các phòng thi phù hợp hoặc điều chỉnh thủ công nếu cần.</p>
            </div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
                <!-- Basic Flow 5, 7: Tiến hành phân phòng tự động -->
                <button type="button" id="btnStartAutoAssign" class="primary-button" style="padding: 10px 18px; font-size: 13px;">
                    ⚡ Tiến hành phân phòng tự động (Bước 5, 7)
                </button>
                <!-- Alternative Flow 9.2: Phân phòng lại -->
                <button type="button" id="btnReAssignAction" class="secondary-button" style="padding: 10px 16px; font-size: 13px;">
                    🔄 Phân phòng lại (Ca 9.2)
                </button>
                <!-- Basic Flow 9: Kiểm tra và lưu kết quả -->
                <button type="button" id="btnConfirmSaveAssignment" class="primary-button" style="background: #159465; border-color: #159465; padding: 10px 18px; font-size: 13px;">
                    ✓ Kiểm tra &amp; Lưu kết quả (Bước 9)
                </button>
                <!-- Basic Flow 11: In bảng niêm yết -->
                <button type="button" id="btnPrintRoomList" class="secondary-button" style="padding: 10px 16px; font-size: 13px;" title="In bảng niêm yết phòng thi chính thức">
                    🖨 In bảng niêm yết (Bước 11)
                </button>
            </div>
        </div>

        <!-- Bộ lọc & Tìm kiếm thí sinh -->
        <div class="candidate-filter-bar">
            <div class="candidate-filter-inputs">
                <input type="text" id="candidateSearchInput" class="candidate-search-input" placeholder="🔍 Tìm thí sinh theo họ tên, SBD hoặc trường THCS...">
                <select id="candidateRoomFilter" class="select-room-dropdown">
                    <option value="all">Tất cả trạng thái / Phòng thi</option>
                    <option value="assigned">✓ Đã được phân phòng thi</option>
                    <option value="unassigned">⏳ Chưa được phân phòng thi</option>
                </select>
            </div>
            <div style="font-size: 12px; color: #64748b;">
                Hiển thị: <strong id="filterShowingCount">12</strong> thí sinh
            </div>
        </div>

        <div class="wf-table-wrap">
            <table class="wf-table">
                <thead>
                    <tr>
                        <th style="width: 50px; text-align: center;">STT</th>
                        <th style="width: 110px;">Số báo danh</th>
                        <th>Họ và tên thí sinh</th>
                        <th>Ngày sinh (Giới tính)</th>
                        <th>Trường THCS (Khu vực / Phường)</th>
                        <th style="width: 150px;">Trạng thái</th>
                        <th style="width: 220px;">Phòng thi phân công (Ca 9.1)</th>
                    </tr>
                </thead>
                <tbody id="candidatesTableBody">
                    <!-- Render bởi JS -->
                </tbody>
            </table>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; font-size: 12px; color: #64748b; flex-wrap: wrap; gap: 10px;">
            <div>
                ℹ <em>Mẹo (Ca 9.1):</em> Bạn có thể click vào dropdown <strong>"Phòng thi phân công"</strong> ở cột cuối để điều chỉnh chuyển phòng cho từng thí sinh. Hệ thống sẽ tự động kiểm tra sức chứa phòng đích.
            </div>
            <div>
                <span class="pill green" style="font-size: 11px;">✓ Tuân thủ quy định 2-3 trường THCS lân cận</span>
            </div>
        </div>
    </div>
</section>

<!-- Hộp thoại Modal Xác nhận lưu kết quả phân phòng (Basic Flow 9, 10) -->
<dialog id="assignConfirmModal" class="assign-modal-dialog">
    <div class="assign-modal-header">
        <h3><span>✓</span> Xác nhận lưu kết quả phân phòng thi (Bước 9)</h3>
        <button type="button" class="mobile-close" onclick="document.getElementById('assignConfirmModal').close();" aria-label="Đóng">✕</button>
    </div>
    <div class="assign-modal-body">
        <p style="margin-top: 0;">Vui lòng kiểm tra lại tổng thể kết quả phân phòng thi trước khi hệ thống lưu chính thức vào cơ sở dữ liệu:</p>
        
        <table class="confirm-summary-table" style="margin-bottom: 14px;">
            <tbody>
                <tr>
                    <td style="width: 40%; color: #64748b; font-weight: 600;">Điểm thi:</td>
                    <td id="confirmAssignVenueName" style="font-weight: 700;">—</td>
                </tr>
                <tr>
                    <td style="color: #64748b; font-weight: 600;">Tổng số thí sinh:</td>
                    <td id="confirmAssignTotalCount" style="color: #1769e0; font-weight: 700;">—</td>
                </tr>
                <tr>
                    <td style="color: #64748b; font-weight: 600;">Số phòng thi phân bổ:</td>
                    <td id="confirmAssignRoomCount" style="color: #159465; font-weight: 700;">—</td>
                </tr>
            </tbody>
        </table>

        <div style="font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 8px;">Tình hình sĩ số từng phòng thi:</div>
        <div id="confirmAssignRoomsPreview" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; margin-bottom: 14px;">
            <!-- Render bởi JS -->
        </div>

        <div class="wf-alert" style="margin-bottom: 0; font-size: 12px;">
            ℹ Sau khi xác nhận lưu (Bước 10), danh sách phân phòng thi sẽ được lưu trữ chính thức và sẵn sàng để in bảng niêm yết tại điểm thi (Bước 11).
        </div>
    </div>
    <div class="assign-modal-footer">
        <button type="button" id="btnCancelConfirmAssign" class="secondary-button">
            ✕ Quay lại kiểm tra
        </button>
        <button type="button" id="btnExecuteSaveAssign" class="primary-button">
            ✓ Đồng ý &amp; Lưu kết quả phân phòng
        </button>
    </div>
</dialog>

<!-- Hộp thoại Modal In Bảng niêm yết phòng thi (Basic Flow 11) -->
<dialog id="printRoomModal" class="print-modal-dialog">
    <div class="assign-modal-header">
        <h3><span>🖨</span> Bảng niêm yết danh sách thí sinh theo phòng thi (Bước 11)</h3>
        <button type="button" class="mobile-close" onclick="document.getElementById('printRoomModal').close();" aria-label="Đóng">✕</button>
    </div>
    <div class="print-modal-body" id="printRosterContent">
        <!-- Render bởi JavaScript -->
    </div>
    <div class="assign-modal-footer">
        <button type="button" class="secondary-button" onclick="document.getElementById('printRoomModal').close();">
            Đóng
        </button>
        <button type="button" class="primary-button" onclick="window.print();">
            🖨 In bảng niêm yết (Print)
        </button>
    </div>
</dialog>

<script src="<?php echo htmlspecialchars($appBase); ?>/assets/js/phan-phong-thi.js"></script>

<?php include dirname(__FILE__) . '/../../components/layout/footer.php'; ?>

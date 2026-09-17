<?php
$activePage = 'exam-rooms';
$displayName = 'Ban Tuyển sinh Sở GD&ĐT';
$displayRole = 'Quản trị viên • Quản lý phòng thi';
include dirname(__FILE__) . '/../../components/layout/header.php';
?>

<link rel="stylesheet" href="<?php echo htmlspecialchars($appBase); ?>/assets/css/tao-thong-tin-phong-thi.css">

<section class="content workflow" data-workflow="create-exam-rooms">
    <!-- Tiêu đề trang (Basic Flow 1) -->
    <div class="page-heading">
        <div>
            <div class="eyebrow">BAN TUYỂN SINH SỞ GD&amp;ĐT / QUẢN LÝ THI</div>
            <h1>Tạo thông tin phòng thi (Use Case 6)</h1>
            <p>Thiết lập và tự động sinh danh sách phòng thi gắn với từng điểm thi trong kỳ thi tuyển sinh vào lớp 10.</p>
        </div>
        <span class="pill blue">Kỳ thi tuyển sinh lớp 10 • 2026 - 2027</span>
    </div>

    <!-- Thông báo trang -->
    <div id="roomPageAlert" class="wf-alert" role="status" aria-live="polite" hidden></div>

    <!-- Thanh công cụ kiểm thử mô phỏng các kịch bản của Use Case 6 -->
    <div class="simulation-bar">
        <div class="simulation-bar-info">
            <strong>🧪 Thanh kiểm thử kịch bản Use Case 6:</strong>
            <span>Kiểm tra toàn bộ luồng tạo phòng thi, tự động sinh và xử lý ngoại lệ theo đặc tả.</span>
        </div>
        <div class="simulation-btn-group">
            <button type="button" id="btnSimulateBasic" class="simulation-btn" title="Tự động sinh và chuẩn bị lưu 3 phòng thi mới cho THPT Nguyễn Trãi">
                ✓ Thử Basic Flow (1-10)
            </button>
            <button type="button" id="btnSimulateAddMore" class="simulation-btn" title="Tạo thêm phòng thi tại cùng điểm thi">
                ➕ Ca 10.1: Tạo thêm phòng
            </button>
            <button type="button" id="btnSimulateInvalid" class="simulation-btn" title="Thử để trống tên phòng hoặc sức chứa âm">
                ✕ Ca 6.1: Dữ liệu không hợp lệ
            </button>
            <button type="button" id="btnSimulateDuplicate" class="simulation-btn" title="Thử tạo phòng thi có mã trùng với phòng đã có">
                ⚠ Ca 8.1: Phòng thi bị trùng
            </button>
            <button type="button" id="btnSimulateSaveError" class="simulation-btn" title="Bật/tắt mô phỏng lỗi máy chủ lưu trữ">
                💾 Ca 9.1: Lỗi lưu hệ thống
            </button>
            <button type="button" id="btnResetRoomsData" class="simulation-btn" style="color: #c23939;" title="Khôi phục danh sách phòng thi mặc định ban đầu">
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
                <p>Cán bộ: <strong><?php echo htmlspecialchars($displayName); ?></strong> | Đã đăng nhập và có quyền quản lý phòng thi. Kỳ thi và các điểm thi đã tồn tại sẵn sàng trong hệ thống.</p>
            </div>
        </div>
        <span class="pill green">Đủ điều kiện tạo phòng</span>
    </div>

    <!-- Thẻ thống kê tổng quan -->
    <div class="room-stat-grid">
        <div class="room-stat-card">
            <div class="room-stat-icon blue">🏫</div>
            <div class="room-stat-info">
                <span>Tổng số điểm thi</span>
                <h3 id="statTotalVenues">4</h3>
            </div>
        </div>
        <div class="room-stat-card">
            <div class="room-stat-icon green">🚪</div>
            <div class="room-stat-info">
                <span>Tổng phòng thi đã tạo</span>
                <h3 id="statTotalRooms">12</h3>
            </div>
        </div>
        <div class="room-stat-card">
            <div class="room-stat-icon purple">👥</div>
            <div class="room-stat-info">
                <span>Tổng sức chứa (chỗ thi)</span>
                <h3 id="statTotalSeats">288</h3>
            </div>
        </div>
        <div class="room-stat-card">
            <div class="room-stat-icon orange">📍</div>
            <div class="room-stat-info">
                <span>Phòng tại điểm thi này</span>
                <h3 id="statVenueRooms">5</h3>
            </div>
        </div>
    </div>

    <!-- Khối chọn Kỳ thi và Điểm thi (Basic Flow 2 & 3) -->
    <div class="venue-selector-card">
        <div class="venue-selector-header">
            <h2><span>📋</span> Chọn kỳ thi và điểm thi cần tạo phòng (Bước 2, 3)</h2>
            <span class="pill blue">Thiết lập điểm thi</span>
        </div>
        <div class="venue-selector-grid">
            <div class="field" style="margin-bottom: 0;">
                <label for="examSelect">Kỳ thi tuyển sinh <span class="required">*</span></label>
                <select id="examSelect" class="filter-select" style="max-width: 100%;"></select>
            </div>
            <div class="field" style="margin-bottom: 0;">
                <label for="venueSelect">Điểm thi cần tạo phòng <span class="required">*</span></label>
                <select id="venueSelect" class="filter-select" style="max-width: 100%;"></select>
            </div>
            <div>
                <button type="button" class="secondary-button" onclick="location.reload();" style="height: 43px; display: flex; align-items: center; gap: 6px;">
                    <span>↻</span> Làm mới danh sách
                </button>
            </div>
        </div>
    </div>

    <!-- Thông tin chi tiết điểm thi đã chọn (Basic Flow 4) -->
    <div class="venue-info-box" id="venueInfoBox">
        <!-- Được render bởi JavaScript -->
    </div>

    <!-- Khối Tự động tạo thông tin phòng thi (Basic Flow 5 & 6) -->
    <div class="panel" id="draftRoomsSection">
        <div class="panel-header">
            <div>
                <h2>Tự động tạo thông tin phòng thi (Bước 5)</h2>
                <p>Hệ thống tự động sinh mã phòng, tên phòng và sức chứa chuẩn theo quy chế thi tuyển sinh.</p>
            </div>
            <span class="pill green" id="draftRoomsCountBadge">4 phòng</span>
        </div>

        <!-- Công cụ cấu hình sinh tự động -->
        <div class="generator-control-box">
            <div class="generator-control-header">
                <h3><span>⚙</span> Cấu hình quy tắc sinh phòng thi tự động</h3>
                <small style="color: #64748b;">Quy chuẩn Bộ GD&amp;ĐT: 24 thí sinh/phòng thi</small>
            </div>
            <div class="generator-inputs-grid">
                <div>
                    <label for="roomQuantityInput">Số lượng phòng cần tạo:</label>
                    <input type="number" id="roomQuantityInput" class="room-input" min="1" max="20" value="4">
                </div>
                <div>
                    <label for="defaultCapacityInput">Sức chứa mỗi phòng:</label>
                    <input type="number" id="defaultCapacityInput" class="room-input" min="12" max="40" value="24">
                </div>
                <div>
                    <label for="roomPrefixInput">Tiền tố mã phòng:</label>
                    <input type="text" id="roomPrefixInput" class="room-input" placeholder="Ví dụ: NT-P hoặc P" value="NT-P">
                </div>
                <div>
                    <button type="button" id="btnAutoGenerate" class="primary-button" style="height: 41px; width: 100%;">
                        ⚡ Tự động sinh phòng
                    </button>
                </div>
                <div>
                    <button type="button" id="btnAddSingleDraftRow" class="secondary-button" style="height: 41px;" title="Thêm một dòng phòng thi thủ công">
                        + Thêm dòng
                    </button>
                </div>
            </div>
        </div>

        <!-- Bảng danh sách phòng thi được tạo tự động (cho phép kiểm tra & chỉnh sửa trước khi lưu) -->
        <div class="wf-table-wrap">
            <table class="wf-table">
                <thead>
                    <tr>
                        <th style="width: 50px; text-align: center;">STT</th>
                        <th style="width: 180px;">Mã phòng thi <span class="required">*</span></th>
                        <th>Tên phòng thi <span class="required">*</span></th>
                        <th style="width: 130px; text-align: center;">Sức chứa <span class="required">*</span></th>
                        <th>Vị trí / Ghi chú</th>
                        <th style="width: 90px; text-align: right;">Thao tác</th>
                    </tr>
                </thead>
                <tbody id="draftRoomsTableBody">
                    <!-- Được render bởi JavaScript -->
                </tbody>
            </table>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px; flex-wrap: wrap; gap: 12px;">
            <div style="font-size: 12px; color: #64748b;">
                ℹ Bạn có thể chỉnh sửa trực tiếp mã phòng, tên phòng, sức chứa ngay trong bảng trước khi bấm xác nhận.
            </div>
            <div class="actions" style="margin-top: 0;">
                <button type="button" id="btnConfirmCreateRooms" class="primary-button" style="padding: 11px 24px; font-size: 14px;">
                    ✓ Xác nhận tạo phòng thi (Bước 7)
                </button>
            </div>
        </div>
    </div>

    <!-- Khung thông báo hỗ trợ Tạo thêm phòng thi tại điểm thi này (Alternative Flow 10.1) -->
    <div id="addMoreRoomsContainer" class="wf-alert success" style="margin-bottom: 22px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;" hidden>
        <div>
            <strong>✓ Phòng thi mới đã được lưu thành công vào điểm thi!</strong>
            <p style="margin: 3px 0 0 0; font-size: 12px;">Phòng thi đã sẵn sàng sử dụng cho việc phân phòng thi (Hậu điều kiện Use Case 6).</p>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" id="btnActionAddMore" class="secondary-button" style="background: #ffffff; color: #159465; border-color: #159465; font-weight: 700;">
                ➕ Tạo thêm phòng thi tại điểm thi này (Ca 10.1)
            </button>
            <a href="phan-phong-thi.php" class="primary-button" style="text-decoration: none; display: inline-flex; align-items: center; gap: 6px; font-weight: 700;">
                ➔ Phân phòng thi cho thí sinh (UC 7)
            </a>
        </div>
    </div>

    <!-- Bảng danh sách các phòng thi đã tồn tại ở điểm thi này (Hậu điều kiện: Đã gắn vào điểm thi, sẵn sàng phân phòng) -->
    <div class="panel">
        <div class="panel-header" style="flex-wrap: wrap; gap: 10px;">
            <div>
                <h2>Danh sách phòng thi hiện có tại điểm thi này</h2>
                <p>Các phòng thi đã được lưu và sẵn sàng sử dụng cho công tác phân phòng thi.</p>
            </div>
            <div>
                <a href="phan-phong-thi.php" class="primary-button" style="text-decoration: none; padding: 8px 14px; font-size: 12px; display: inline-flex; align-items: center; gap: 6px;">
                    <span>◎</span> Chuyển sang Phân phòng thi (UC 7)
                </a>
            </div>
        </div>
        <div class="wf-table-wrap">
            <table class="wf-table">
                <thead>
                    <tr>
                        <th style="width: 50px; text-align: center;">STT</th>
                        <th>Mã phòng</th>
                        <th>Tên phòng thi</th>
                        <th>Sức chứa</th>
                        <th>Vị trí phòng</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody id="existingRoomsTableBody">
                    <!-- Được render bởi JavaScript -->
                </tbody>
            </table>
        </div>
    </div>
</section>

<!-- Hộp thoại Modal Xác nhận tạo phòng thi (Basic Flow 7, 8, 9) -->
<dialog id="roomConfirmModal" class="room-modal-dialog">
    <div class="room-modal-header">
        <h3><span>✓</span> Xác nhận tạo phòng thi (Bước 7)</h3>
        <button type="button" class="mobile-close" onclick="document.getElementById('roomConfirmModal').close();" aria-label="Đóng">✕</button>
    </div>
    <div class="room-modal-body">
        <p style="margin-top: 0;">Hệ thống sẽ tiến hành kiểm tra trùng lặp và lưu thông tin các phòng thi sau vào cơ sở dữ liệu:</p>
        
        <table class="confirm-summary-table" style="margin-bottom: 14px;">
            <tbody>
                <tr>
                    <td style="width: 40%; color: #64748b; font-weight: 600;">Điểm thi gắn kèm:</td>
                    <td id="confirmVenueName" style="font-weight: 700;">—</td>
                </tr>
                <tr>
                    <td style="color: #64748b; font-weight: 600;">Số lượng phòng thi:</td>
                    <td id="confirmRoomCount" style="color: #1769e0; font-weight: 700;">—</td>
                </tr>
                <tr>
                    <td style="color: #64748b; font-weight: 600;">Tổng sức chứa bổ sung:</td>
                    <td id="confirmTotalCapacity" style="color: #159465; font-weight: 700;">—</td>
                </tr>
            </tbody>
        </table>

        <div style="font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 8px;">Danh sách phòng thi dự kiến tạo:</div>
        <div id="confirmRoomsPreviewList" style="max-height: 180px; overflow-y: auto; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; margin-bottom: 14px;">
            <!-- Render bởi JS -->
        </div>

        <div class="wf-alert" style="margin-bottom: 0; font-size: 12px;">
            ℹ Sau khi lưu, các phòng thi này sẽ chính thức sẵn sàng cho nghiệp vụ phân phòng thi thí sinh.
        </div>
    </div>
    <div class="room-modal-footer">
        <button type="button" id="btnCancelConfirmRoom" class="secondary-button">
            ✕ Hủy bỏ
        </button>
        <button type="button" id="btnExecuteSaveRoom" class="primary-button">
            ✓ Đồng ý &amp; Lưu phòng thi
        </button>
    </div>
</dialog>

<script src="<?php echo htmlspecialchars($appBase); ?>/assets/js/tao-thong-tin-phong-thi.js"></script>

<?php include dirname(__FILE__) . '/../../components/layout/footer.php'; ?>

/**
 * ==========================================================================
 * JavaScript: Tạo thông tin phòng thi (Use Case 6 - Ban Tuyển sinh Sở GD&ĐT)
 * Hệ thống Quản lý tuyển sinh lớp 10
 *
 * Đáp ứng đầy đủ đặc tả nghiệp vụ:
 * - Tiền điều kiện: Ban Tuyển sinh đã đăng nhập & có quyền; kỳ thi và điểm thi đã tồn tại.
 * - Hậu điều kiện: Thông tin phòng thi mới được lưu và gắn với đúng điểm thi; sẵn sàng phân phòng thi.
 * - Basic Flow (1-10): Yêu cầu tạo -> Hiển thị kỳ thi & điểm thi -> Chọn kỳ thi/điểm thi -> Hiển thị điểm thi
 *   -> Tự động tạo thông tin các phòng thi -> Kiểm tra đầy đủ & hợp lệ -> Xác nhận tạo -> Kiểm tra trùng phòng
 *   -> Lưu phòng thi gắn với điểm thi -> Thông báo thành công và kết thúc.
 * - Alternative Flow:
 *   + 10.1: Tạo thêm phòng thi tại cùng điểm thi sau khi tạo thành công.
 * - Exception Flow:
 *   + 6.1: Thông tin phòng thi được tạo không hợp lệ.
 *   + 8.1: Phòng thi đã tồn tại (trùng mã hoặc tên phòng trong điểm thi).
 *   + 9.1: Không thể lưu phòng thi (Mô phỏng lỗi lưu hệ thống).
 * ==========================================================================
 */

(() => {
    'use strict';

    const STORAGE_KEY = 'tuyensinh10.uc6_phongthi.v1';

    // Thông tin người dùng đăng nhập (Actor: Ban Tuyển sinh Sở GD&ĐT)
    const CURRENT_ACTOR = {
        name: 'Ban Tuyển sinh Sở GD&ĐT',
        role: 'Quản trị viên • Quản lý phòng thi',
        department: 'Phòng Khảo thí & Kiểm định chất lượng giáo dục',
        permission: 'PERMISSION_MANAGE_EXAM_ROOMS'
    };

    // Danh mục Kỳ thi (Basic Flow 2)
    const EXAMS = [
        {
            id: 'KT2026',
            name: 'Kỳ thi tuyển sinh vào lớp 10 THPT năm học 2026 - 2027',
            status: 'active',
            year: '2026 - 2027'
        },
        {
            id: 'KT2025',
            name: 'Kỳ thi tuyển sinh vào lớp 10 THPT năm học 2025 - 2026',
            status: 'closed',
            year: '2025 - 2026'
        }
    ];

    // Danh mục Điểm thi (Basic Flow 2)
    const VENUES = [
        {
            id: 'DT01',
            examId: 'KT2026',
            code: 'NT',
            name: 'Điểm thi THPT Nguyễn Trãi',
            schoolName: 'Trường THPT Nguyễn Trãi',
            address: '364 Nguyễn Tất Thành, Phường 18, Quận 4, TP.HCM',
            maxAllowedRooms: 25,
            defaultPrefix: 'NT-P'
        },
        {
            id: 'DT02',
            examId: 'KT2026',
            code: 'LQD',
            name: 'Điểm thi THPT Lê Quý Đôn',
            schoolName: 'Trường THPT Lê Quý Đôn',
            address: '110 Nguyễn Thị Minh Khai, Phường Võ Thị Sáu, Quận 3, TP.HCM',
            maxAllowedRooms: 30,
            defaultPrefix: 'LQD-P'
        },
        {
            id: 'DT03',
            examId: 'KT2026',
            code: 'TP',
            name: 'Điểm thi THPT Trần Phú',
            schoolName: 'Trường THPT Trần Phú',
            address: '18 Lê Thúc Hoạch, Phường Phú Thọ Hòa, Quận Tân Phú, TP.HCM',
            maxAllowedRooms: 35,
            defaultPrefix: 'TP-P'
        },
        {
            id: 'DT04',
            examId: 'KT2026',
            code: 'LHP',
            name: 'Điểm thi THPT Chuyên Lê Hồng Phong',
            schoolName: 'Trường THPT Chuyên Lê Hồng Phong',
            address: '235 Nguyễn Văn Cừ, Phường 4, Quận 5, TP.HCM',
            maxAllowedRooms: 40,
            defaultPrefix: 'LHP-P'
        }
    ];

    // Dữ liệu phòng thi ban đầu đã có trong hệ thống
    const DEFAULT_ROOMS = [
        // THPT Nguyễn Trãi (5 phòng thi mẫu có sẵn)
        { id: 'R-NT-01', examId: 'KT2026', venueId: 'DT01', code: 'NT-P01', name: 'Phòng thi số 01', capacity: 24, location: 'Tầng 1 - Khu A (Phòng 101)', status: 'ready', createdAt: '10/09/2026 08:30:00' },
        { id: 'R-NT-02', examId: 'KT2026', venueId: 'DT01', code: 'NT-P02', name: 'Phòng thi số 02', capacity: 24, location: 'Tầng 1 - Khu A (Phòng 102)', status: 'ready', createdAt: '10/09/2026 08:30:00' },
        { id: 'R-NT-03', examId: 'KT2026', venueId: 'DT01', code: 'NT-P03', name: 'Phòng thi số 03', capacity: 24, location: 'Tầng 1 - Khu A (Phòng 103)', status: 'ready', createdAt: '10/09/2026 08:30:00' },
        { id: 'R-NT-04', examId: 'KT2026', venueId: 'DT01', code: 'NT-P04', name: 'Phòng thi số 04', capacity: 24, location: 'Tầng 2 - Khu A (Phòng 201)', status: 'ready', createdAt: '10/09/2026 08:30:00' },
        { id: 'R-NT-05', examId: 'KT2026', venueId: 'DT01', code: 'NT-P05', name: 'Phòng thi số 05', capacity: 24, location: 'Tầng 2 - Khu A (Phòng 202)', status: 'ready', createdAt: '10/09/2026 08:30:00' },

        // THPT Lê Quý Đôn (4 phòng thi mẫu có sẵn)
        { id: 'R-LQD-01', examId: 'KT2026', venueId: 'DT02', code: 'LQD-P01', name: 'Phòng thi số 01', capacity: 24, location: 'Dãy B1 - Phòng B101', status: 'ready', createdAt: '11/09/2026 09:00:00' },
        { id: 'R-LQD-02', examId: 'KT2026', venueId: 'DT02', code: 'LQD-P02', name: 'Phòng thi số 02', capacity: 24, location: 'Dãy B1 - Phòng B102', status: 'ready', createdAt: '11/09/2026 09:00:00' },
        { id: 'R-LQD-03', examId: 'KT2026', venueId: 'DT02', code: 'LQD-P03', name: 'Phòng thi số 03', capacity: 24, location: 'Dãy B1 - Phòng B103', status: 'ready', createdAt: '11/09/2026 09:00:00' },
        { id: 'R-LQD-04', examId: 'KT2026', venueId: 'DT02', code: 'LQD-P04', name: 'Phòng thi số 04', capacity: 24, location: 'Dãy B2 - Phòng B201', status: 'ready', createdAt: '11/09/2026 09:00:00' },

        // THPT Trần Phú (3 phòng thi mẫu có sẵn)
        { id: 'R-TP-01', examId: 'KT2026', venueId: 'DT03', code: 'TP-P01', name: 'Phòng thi số 01', capacity: 24, location: 'Khu A - Phòng A11', status: 'ready', createdAt: '12/09/2026 10:15:00' },
        { id: 'R-TP-02', examId: 'KT2026', venueId: 'DT03', code: 'TP-P02', name: 'Phòng thi số 02', capacity: 24, location: 'Khu A - Phòng A12', status: 'ready', createdAt: '12/09/2026 10:15:00' },
        { id: 'R-TP-03', examId: 'KT2026', venueId: 'DT03', code: 'TP-P03', name: 'Phòng thi số 03', capacity: 24, location: 'Khu A - Phòng A13', status: 'ready', createdAt: '12/09/2026 10:15:00' }

        // THPT Chuyên Lê Hồng Phong: Chưa có phòng nào (DT04)
    ];

    // State ứng dụng
    let rooms = [];
    let currentExamId = 'KT2026';
    let currentVenueId = 'DT01';

    // Danh sách phòng thi đang được tự động sinh (chờ xác nhận tạo)
    let generatedDraftRooms = [];

    // Cờ mô phỏng kịch bản (Simulation Flags)
    let simulateSaveError = false; // Exception Flow 9.1

    // DOM Utilities
    const $ = id => document.getElementById(id);
    const esc = str => String(str ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    function formatNow() {
        const d = new Date();
        const pad = n => String(n).padStart(2, '0');
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    // Tải dữ liệu từ LocalStorage
    function loadData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    rooms = parsed;
                    return;
                }
            }
        } catch (_) {}
        rooms = JSON.parse(JSON.stringify(DEFAULT_ROOMS));
        saveData();
    }

    // Lưu dữ liệu vào LocalStorage
    function saveData() {
        if (simulateSaveError) {
            // Exception Flow 9.1: Giả lập lỗi lưu
            return false;
        }
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
            return true;
        } catch (_) {
            return false;
        }
    }

    // Toast thông báo trượt
    function showToast(text, type = 'success') {
        const existing = document.querySelector('.room-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `room-toast ${type}`;
        toast.innerHTML = `
            <span>${type === 'success' ? '✓' : '⚠'}</span>
            <span>${esc(text)}</span>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // Banner cảnh báo đầu trang
    function setPageAlert(text, type = 'error') {
        const alertBox = $('roomPageAlert');
        if (!alertBox) return;

        if (!text) {
            alertBox.hidden = true;
            alertBox.textContent = '';
            return;
        }

        alertBox.hidden = false;
        alertBox.className = `wf-alert ${type}`;
        alertBox.innerHTML = `<strong>${type === 'success' ? '✓ Thành công:' : type === 'warning' ? '⚠ Chú ý:' : '✖ Lỗi:'}</strong> ${esc(text)}`;
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Khởi tạo các bộ chọn Kỳ thi & Điểm thi (Basic Flow 2 & 3)
    function initSelectors() {
        const examSelect = $('examSelect');
        const venueSelect = $('venueSelect');

        if (examSelect) {
            examSelect.innerHTML = EXAMS.map(e => `
                <option value="${esc(e.id)}" ${e.id === currentExamId ? 'selected' : ''}>
                    ${esc(e.name)} (${esc(e.status === 'active' ? 'Đang tổ chức' : 'Đã kết thúc')})
                </option>
            `).join('');

            examSelect.addEventListener('change', () => {
                currentExamId = examSelect.value;
                setPageAlert('');
                render();
            });
        }

        if (venueSelect) {
            venueSelect.innerHTML = VENUES.map(v => `
                <option value="${esc(v.id)}" ${v.id === currentVenueId ? 'selected' : ''}>
                    [${esc(v.code)}] ${esc(v.name)}
                </option>
            `).join('');

            venueSelect.addEventListener('change', () => {
                currentVenueId = venueSelect.value;
                setPageAlert('');
                autoGenerateDraftRooms(); // Tự động sinh danh sách phòng dự kiến cho điểm thi mới chọn
                render();
            });
        }
    }

    // Cập nhật Thẻ Thống Kê
    function updateStats() {
        const totalVenues = VENUES.length;
        const totalRooms = rooms.filter(r => r.examId === currentExamId).length;
        const totalSeats = rooms.filter(r => r.examId === currentExamId).reduce((sum, r) => sum + (Number(r.capacity) || 0), 0);
        const venueRooms = rooms.filter(r => r.examId === currentExamId && r.venueId === currentVenueId).length;

        if ($('statTotalVenues')) $('statTotalVenues').textContent = totalVenues;
        if ($('statTotalRooms')) $('statTotalRooms').textContent = totalRooms;
        if ($('statTotalSeats')) $('statTotalSeats').textContent = totalSeats.toLocaleString('vi-VN');
        if ($('statVenueRooms')) $('statVenueRooms').textContent = venueRooms;
    }

    // Hiển thị thông tin điểm thi đã chọn (Basic Flow 4)
    function renderVenueDetails() {
        const venue = VENUES.find(v => v.id === currentVenueId);
        const infoBox = $('venueInfoBox');
        if (!venue || !infoBox) return;

        const existingRooms = rooms.filter(r => r.examId === currentExamId && r.venueId === currentVenueId);
        const currentSeats = existingRooms.reduce((sum, r) => sum + (Number(r.capacity) || 0), 0);

        infoBox.innerHTML = `
            <div class="venue-info-item">
                <span>Điểm thi đã chọn (Bước 4)</span>
                <strong>${esc(venue.name)} <span class="venue-badge">Mã: ${esc(venue.code)}</span></strong>
                <small style="display:block; color:#64748b; margin-top:2px;">${esc(venue.address)}</small>
            </div>
            <div class="venue-info-item">
                <span>Số phòng thi hiện có</span>
                <strong style="color:#1769e0; font-size:16px;">${existingRooms.length} / ${venue.maxAllowedRooms} phòng</strong>
            </div>
            <div class="venue-info-item">
                <span>Tổng sức chứa hiện tại</span>
                <strong style="color:#159465; font-size:16px;">${currentSeats} thí sinh</strong>
            </div>
            <div class="venue-info-item">
                <span>Trạng thái điểm thi</span>
                <strong style="color:#252b36;">✓ Đã kiểm tra CSVC</strong>
            </div>
        `;
    }

    // Tự động tạo thông tin các phòng thi (Basic Flow 5 & Alternative Flow 10.1)
    function autoGenerateDraftRooms(overrideCount = null) {
        const venue = VENUES.find(v => v.id === currentVenueId);
        if (!venue) return;

        // Đọc số lượng phòng cần tạo từ form cấu hình hoặc tham số
        const countInput = $('roomQuantityInput');
        const defaultCapacityInput = $('defaultCapacityInput');
        const prefixInput = $('roomPrefixInput');

        const quantity = overrideCount !== null ? overrideCount : parseInt(countInput?.value || '4', 10) || 4;
        const defaultCap = parseInt(defaultCapacityInput?.value || '24', 10) || 24;
        const prefix = (prefixInput?.value || venue.defaultPrefix || `${venue.code}-P`).trim();

        // Tìm số thứ tự phòng lớn nhất hiện có tại điểm thi này để sinh số tiếp theo không bị trùng
        const existingVenueRooms = rooms.filter(r => r.examId === currentExamId && r.venueId === currentVenueId);
        
        let maxIndex = 0;
        existingVenueRooms.forEach(r => {
            // Thử trích xuất số ở cuối mã phòng, ví dụ 'NT-P05' -> 5, hoặc 'P05' -> 5
            const match = r.code.match(/(\d+)$/);
            if (match) {
                const num = parseInt(match[1], 10);
                if (num > maxIndex) maxIndex = num;
            }
        });

        // Nếu điểm thi chưa có phòng nào, bắt đầu từ 1
        generatedDraftRooms = [];
        for (let i = 1; i <= quantity; i++) {
            const roomNum = maxIndex + i;
            const padNum = String(roomNum).padStart(2, '0');
            const roomCode = `${prefix}${padNum}`;
            const roomName = `Phòng thi số ${padNum}`;
            const floor = Math.ceil(roomNum / 4); // Cứ 4 phòng một tầng tượng trưng
            const location = `Tầng ${floor} - Phòng ${floor}0${(roomNum % 4) || 4}`;

            generatedDraftRooms.push({
                tempId: `DRAFT-${Date.now()}-${i}`,
                examId: currentExamId,
                venueId: currentVenueId,
                code: roomCode,
                name: roomName,
                capacity: defaultCap,
                location: location,
                note: 'Tự động tạo sẵn sàng phân phòng'
            });
        }
    }

    // Render Bảng phòng thi dự kiến được tự động tạo (Basic Flow 5 & 6)
    function renderDraftRoomsTable() {
        const tbody = $('draftRoomsTableBody');
        const countDisplay = $('draftRoomsCountBadge');
        if (!tbody) return;

        if (countDisplay) {
            countDisplay.textContent = `${generatedDraftRooms.length} phòng`;
        }

        if (generatedDraftRooms.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty">Chưa có phòng thi nào được tạo dự kiến. Vui lòng bấm "Tự động tạo thông tin phòng thi" ở trên.</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = generatedDraftRooms.map((draft, idx) => `
            <tr data-temp-id="${esc(draft.tempId)}">
                <td style="text-align: center; font-weight: bold; color: #64748b;">${idx + 1}</td>
                <td>
                    <input 
                        type="text" 
                        class="table-editable-input draft-code-input" 
                        value="${esc(draft.code)}" 
                        placeholder="Mã phòng..."
                        data-temp-id="${esc(draft.tempId)}"
                        style="font-family: 'Consolas', monospace; font-weight: 700; color: #1769e0;"
                    />
                </td>
                <td>
                    <input 
                        type="text" 
                        class="table-editable-input draft-name-input" 
                        value="${esc(draft.name)}" 
                        placeholder="Tên phòng thi..."
                        data-temp-id="${esc(draft.tempId)}"
                    />
                </td>
                <td>
                    <input 
                        type="number" 
                        class="table-editable-input draft-cap-input" 
                        value="${draft.capacity}" 
                        min="1" 
                        max="60"
                        data-temp-id="${esc(draft.tempId)}"
                        style="width: 80px; text-align: center; font-weight: 700;"
                    />
                </td>
                <td>
                    <input 
                        type="text" 
                        class="table-editable-input draft-loc-input" 
                        value="${esc(draft.location)}" 
                        placeholder="Vị trí / Dãy nhà..."
                        data-temp-id="${esc(draft.tempId)}"
                    />
                </td>
                <td style="text-align: right;">
                    <button type="button" class="text-button btn-remove-draft" data-temp-id="${esc(draft.tempId)}" style="color: #dc2626;" title="Xóa phòng thi này">
                        ✕ Xóa
                    </button>
                </td>
            </tr>
        `).join('');

        // Lắng nghe sự kiện chỉnh sửa trực tiếp trên từng dòng (Alternative 6.1 test)
        tbody.querySelectorAll('.draft-code-input').forEach(input => {
            input.addEventListener('input', e => {
                const tempId = input.getAttribute('data-temp-id');
                const target = generatedDraftRooms.find(r => r.tempId === tempId);
                if (target) {
                    target.code = input.value.trim();
                    input.classList.remove('is-invalid', 'is-duplicate');
                }
            });
        });

        tbody.querySelectorAll('.draft-name-input').forEach(input => {
            input.addEventListener('input', e => {
                const tempId = input.getAttribute('data-temp-id');
                const target = generatedDraftRooms.find(r => r.tempId === tempId);
                if (target) {
                    target.name = input.value.trim();
                    input.classList.remove('is-invalid');
                }
            });
        });

        tbody.querySelectorAll('.draft-cap-input').forEach(input => {
            input.addEventListener('input', e => {
                const tempId = input.getAttribute('data-temp-id');
                const target = generatedDraftRooms.find(r => r.tempId === tempId);
                if (target) {
                    target.capacity = input.value;
                    input.classList.remove('is-invalid');
                }
            });
        });

        tbody.querySelectorAll('.draft-loc-input').forEach(input => {
            input.addEventListener('input', e => {
                const tempId = input.getAttribute('data-temp-id');
                const target = generatedDraftRooms.find(r => r.tempId === tempId);
                if (target) target.location = input.value.trim();
            });
        });

        // Xóa một dòng phòng thi dự kiến
        tbody.querySelectorAll('.btn-remove-draft').forEach(btn => {
            btn.addEventListener('click', () => {
                const tempId = btn.getAttribute('data-temp-id');
                generatedDraftRooms = generatedDraftRooms.filter(r => r.tempId !== tempId);
                renderDraftRoomsTable();
            });
        });
    }

    // Render Bảng các phòng thi đã tồn tại ở điểm thi này
    function renderExistingRoomsTable() {
        const tbody = $('existingRoomsTableBody');
        if (!tbody) return;

        const existingVenueRooms = rooms.filter(r => r.examId === currentExamId && r.venueId === currentVenueId);

        if (existingVenueRooms.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty">Điểm thi này hiện chưa có phòng thi nào được thiết lập. Hãy tạo phòng thi mới ở bảng bên trên.</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = existingVenueRooms.map((room, idx) => `
            <tr>
                <td style="text-align: center; color: #64748b;">${idx + 1}</td>
                <td><span class="room-code-tag">${esc(room.code)}</span></td>
                <td><strong>${esc(room.name)}</strong></td>
                <td><span class="room-capacity-badge">${room.capacity} thí sinh</span></td>
                <td>${esc(room.location)}</td>
                <td><span class="pill green">Sẵn sàng phân phòng</span></td>
            </tr>
        `).join('');
    }

    // =========================================================================
    // KIỂM TRA ĐẦY ĐỦ, HỢP LỆ VÀ TRÙNG LẶP (Basic Flow 6, 8, Exception 6.1, 8.1)
    // =========================================================================
    function validateDraftRooms() {
        setPageAlert('');

        if (generatedDraftRooms.length === 0) {
            setPageAlert('Không có phòng thi nào trong danh sách tạo. Vui lòng nhấn "Tự động tạo phòng thi" trước khi xác nhận.', 'error');
            return { valid: false, message: 'Danh sách rỗng' };
        }

        const existingVenueRooms = rooms.filter(r => r.examId === currentExamId && r.venueId === currentVenueId);
        const existingCodes = new Set(existingVenueRooms.map(r => r.code.toUpperCase()));
        const existingNames = new Set(existingVenueRooms.map(r => r.name.toUpperCase()));

        const seenDraftCodes = new Set();
        const seenDraftNames = new Set();

        for (let i = 0; i < generatedDraftRooms.length; i++) {
            const draft = generatedDraftRooms[i];
            const rowNumber = i + 1;
            const code = String(draft.code || '').trim().toUpperCase();
            const name = String(draft.name || '').trim();
            const cap = parseInt(draft.capacity, 10);

            // Exception Flow 6.1: Thông tin phòng thi được tạo không hợp lệ
            if (!code) {
                setPageAlert(`Lỗi tại phòng số ${rowNumber}: Mã phòng thi không được để trống. Hệ thống không thể hoàn tất tạo phòng thi.`, 'error');
                highlightDraftError(draft.tempId, 'code');
                return { valid: false, type: 'INVALID' };
            }

            if (!name) {
                setPageAlert(`Lỗi tại phòng số ${rowNumber}: Tên phòng thi không được để trống. Hệ thống không thể hoàn tất tạo phòng thi.`, 'error');
                highlightDraftError(draft.tempId, 'name');
                return { valid: false, type: 'INVALID' };
            }

            if (isNaN(cap) || cap <= 0 || cap > 60) {
                setPageAlert(`Lỗi tại phòng số ${rowNumber}: Sức chứa phòng thi không hợp lệ (phải là số nguyên từ 1 đến 60 thí sinh).`, 'error');
                highlightDraftError(draft.tempId, 'cap');
                return { valid: false, type: 'INVALID' };
            }

            // Exception Flow 8.1: Phòng thi đã tồn tại (kiểm tra trùng mã hoặc tên trong điểm thi)
            if (existingCodes.has(code)) {
                setPageAlert(`Phòng thi đã tồn tại: Mã phòng [${draft.code}] đã có sẵn tại điểm thi này. Vui lòng điều chỉnh thông tin mã phòng thi.`, 'error');
                highlightDraftError(draft.tempId, 'code', true);
                return { valid: false, type: 'DUPLICATE' };
            }

            if (existingNames.has(name.toUpperCase())) {
                setPageAlert(`Phòng thi đã tồn tại: Tên phòng [${draft.name}] đã có sẵn tại điểm thi này. Vui lòng điều chỉnh lại tên phòng.`, 'error');
                highlightDraftError(draft.tempId, 'name', true);
                return { valid: false, type: 'DUPLICATE' };
            }

            // Trùng nhau ngay trong danh sách đang tạo
            if (seenDraftCodes.has(code)) {
                setPageAlert(`Trùng lặp: Mã phòng [${draft.code}] bị lặp lại nhiều lần trong danh sách vừa tạo. Vui lòng chỉnh sửa lại.`, 'error');
                highlightDraftError(draft.tempId, 'code', true);
                return { valid: false, type: 'DUPLICATE' };
            }

            if (seenDraftNames.has(name.toUpperCase())) {
                setPageAlert(`Trùng lặp: Tên phòng [${draft.name}] bị lặp lại nhiều lần trong danh sách vừa tạo. Vui lòng chỉnh sửa lại.`, 'error');
                highlightDraftError(draft.tempId, 'name', true);
                return { valid: false, type: 'DUPLICATE' };
            }

            seenDraftCodes.add(code);
            seenDraftNames.add(name.toUpperCase());
        }

        return { valid: true };
    }

    // Đánh dấu ô bị lỗi trên giao diện
    function highlightDraftError(tempId, fieldName, isDuplicate = false) {
        const row = document.querySelector(`tr[data-temp-id="${tempId}"]`);
        if (!row) return;

        const selector = fieldName === 'code' ? '.draft-code-input' : fieldName === 'name' ? '.draft-name-input' : '.draft-cap-input';
        const input = row.querySelector(selector);
        if (input) {
            input.classList.add(isDuplicate ? 'is-duplicate' : 'is-invalid');
            input.focus();
            input.select();
        }
    }

    // Mở Modal xác nhận tạo phòng thi (Basic Flow 7)
    function openConfirmModal() {
        const check = validateDraftRooms();
        if (!check.valid) return;

        const venue = VENUES.find(v => v.id === currentVenueId);
        const modal = $('roomConfirmModal');
        if (!modal || !venue) return;

        $('confirmVenueName').textContent = `${venue.name} (${venue.code})`;
        $('confirmRoomCount').textContent = `${generatedDraftRooms.length} phòng thi mới`;
        
        const totalCap = generatedDraftRooms.reduce((sum, r) => sum + parseInt(r.capacity, 10), 0);
        $('confirmTotalCapacity').textContent = `${totalCap} thí sinh`;

        // Render bảng tóm tắt
        const previewList = $('confirmRoomsPreviewList');
        previewList.innerHTML = generatedDraftRooms.map(r => `
            <div style="display:flex; justify-content:space-between; padding: 6px 0; border-bottom: 1px dashed #e2e8f0; font-size: 12px;">
                <span><strong>${esc(r.code)}</strong> - ${esc(r.name)} (${esc(r.location)})</span>
                <span class="room-capacity-badge">${r.capacity} chỗ</span>
            </div>
        `).join('');

        modal.showModal();

        // Nút Hủy modal
        $('btnCancelConfirmRoom').onclick = () => {
            modal.close();
        };

        // Nút Đồng ý lưu phòng thi (Basic Flow 9, Exception Flow 9.1)
        $('btnExecuteSaveRoom').onclick = () => {
            modal.close();
            executeSaveRooms();
        };
    }

    // Lưu thông tin phòng thi và gắn với điểm thi (Basic Flow 9, 10, Exception Flow 9.1)
    function executeSaveRooms() {
        const venue = VENUES.find(v => v.id === currentVenueId);
        if (!venue) return;

        // Exception Flow 9.1: Không thể lưu phòng thi
        if (simulateSaveError) {
            setPageAlert('Hệ thống không thể lưu thông tin phòng thi do lỗi máy chủ cơ sở dữ liệu. Phòng thi mới không được ghi nhận. Vui lòng kiểm tra lại.', 'error');
            showToast('Lỗi: Không thể lưu phòng thi!', 'error');
            return;
        }

        const now = formatNow();
        const newRoomsToAdd = generatedDraftRooms.map(draft => ({
            id: `R-${venue.code}-${Date.now()}-${Math.floor(Math.random()*1000)}`,
            examId: currentExamId,
            venueId: currentVenueId,
            code: draft.code.trim().toUpperCase(),
            name: draft.name.trim(),
            capacity: parseInt(draft.capacity, 10),
            location: draft.location.trim(),
            status: 'ready',
            createdAt: now
        }));

        // Basic Flow 9: Lưu phòng thi và gắn với điểm thi
        rooms.push(...newRoomsToAdd);
        const success = saveData();

        if (!success) {
            setPageAlert('Hệ thống không thể lưu thông tin phòng thi. Phòng thi mới không được ghi nhận.', 'error');
            showToast('Lỗi lưu trữ dữ liệu!', 'error');
            return;
        }

        // Basic Flow 10: Thông báo tạo phòng thi thành công và kết thúc Use Case
        const count = newRoomsToAdd.length;
        setPageAlert(`Đã tạo thành công ${count} phòng thi mới tại ${venue.name} và gắn với điểm thi tương ứng. Các phòng thi đã sẵn sàng để phân phòng thi.`, 'success');
        showToast(`Đã tạo thành công ${count} phòng thi mới!`, 'success');

        // Reset danh sách dự kiến và render lại
        generatedDraftRooms = [];
        updateStats();
        renderVenueDetails();
        renderDraftRoomsTable();
        renderExistingRoomsTable();

        // Hiển thị nút Tạo thêm phòng thi tại điểm thi này (Alternative Flow 10.1)
        const addMoreContainer = $('addMoreRoomsContainer');
        if (addMoreContainer) addMoreContainer.hidden = false;
    }

    // Alternative Flow 10.1: Tạo thêm phòng thi tại cùng điểm thi
    function handleAddMoreRooms() {
        setPageAlert('Kích hoạt Alternative Flow 10.1: Hệ thống tự động tạo thêm thông tin phòng thi tiếp theo tại cùng điểm thi theo quy tắc đã thiết lập.', 'warning');
        
        // Tự động sinh tiếp 2 hoặc 4 phòng tiếp theo
        autoGenerateDraftRooms(2);
        renderDraftRoomsTable();

        const tableSection = $('draftRoomsSection');
        if (tableSection) tableSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Cài đặt thanh công cụ mô phỏng kịch bản (Simulation Controls)
    function initSimulationControls() {
        // Ca 1: Basic Flow (1-10)
        $('btnSimulateBasic')?.addEventListener('click', () => {
            currentVenueId = 'DT01';
            $('venueSelect').value = 'DT01';
            autoGenerateDraftRooms(3);
            render();
            setPageAlert('Đã tải kịch bản Basic Flow (1-10): Hệ thống tự động sinh 3 phòng thi tiếp theo cho THPT Nguyễn Trãi. Bấm nút "Xác nhận tạo phòng thi" để tiếp tục.', 'warning');
        });

        // Ca 10.1: Tạo thêm phòng thi
        $('btnSimulateAddMore')?.addEventListener('click', () => {
            handleAddMoreRooms();
        });

        // Ca 6.1: Thông tin phòng thi không hợp lệ
        $('btnSimulateInvalid')?.addEventListener('click', () => {
            if (generatedDraftRooms.length === 0) autoGenerateDraftRooms(2);
            // Sửa phòng đầu tiên thành sức chứa âm và tên trống
            generatedDraftRooms[0].name = '';
            generatedDraftRooms[0].capacity = -5;
            renderDraftRoomsTable();
            setPageAlert('Kích hoạt Exception Flow 6.1: Cố tình để trống tên phòng và sức chứa = -5. Hãy nhấn "Xác nhận tạo phòng thi" để xem hệ thống bắt lỗi.', 'warning');
            validateDraftRooms();
        });

        // Ca 8.1: Phòng thi đã tồn tại (trùng phòng)
        $('btnSimulateDuplicate')?.addEventListener('click', () => {
            if (generatedDraftRooms.length === 0) autoGenerateDraftRooms(2);
            // Gán mã phòng đầu tiên trùng với phòng đã có 'NT-P01'
            generatedDraftRooms[0].code = 'NT-P01';
            renderDraftRoomsTable();
            setPageAlert('Kích hoạt Exception Flow 8.1: Cố tình đặt mã phòng NT-P01 (đã tồn tại tại THPT Nguyễn Trãi). Hãy nhấn "Xác nhận tạo phòng thi" để xem kiểm tra trùng phòng.', 'warning');
            validateDraftRooms();
        });

        // Ca 9.1: Không thể lưu phòng thi (Mô phỏng lỗi lưu)
        $('btnSimulateSaveError')?.addEventListener('click', () => {
            simulateSaveError = !simulateSaveError;
            const btn = $('btnSimulateSaveError');
            if (btn) {
                btn.classList.toggle('active-error', simulateSaveError);
                btn.textContent = simulateSaveError ? '⚠ Đang bật lỗi lưu (Ca 9.1)' : '💾 Ca 9.1: Lỗi lưu hệ thống';
            }
            setPageAlert(simulateSaveError ? 'Đã BẬT mô phỏng lỗi lưu hệ thống (Ca 9.1). Khi bấm Lưu phòng thi, hệ thống sẽ báo lỗi và không ghi nhận phòng mới.' : 'Đã tắt mô phỏng lỗi lưu hệ thống.', simulateSaveError ? 'error' : 'success');
        });

        // Khôi phục dữ liệu gốc
        $('btnResetRoomsData')?.addEventListener('click', () => {
            if (confirm('Bạn có chắc chắn muốn khôi phục lại danh sách phòng thi ban đầu không?')) {
                rooms = JSON.parse(JSON.stringify(DEFAULT_ROOMS));
                simulateSaveError = false;
                const btn = $('btnSimulateSaveError');
                if (btn) {
                    btn.classList.remove('active-error');
                    btn.textContent = '💾 Ca 9.1: Lỗi lưu hệ thống';
                }
                saveData();
                autoGenerateDraftRooms();
                setPageAlert('Đã khôi phục toàn bộ danh sách phòng thi ban đầu.', 'success');
                showToast('Dữ liệu phòng thi đã được khôi phục!', 'success');
                render();
            }
        });
    }

    // Render toàn trang
    function render() {
        updateStats();
        renderVenueDetails();
        renderDraftRoomsTable();
        renderExistingRoomsTable();
    }

    // Khởi tạo trang
    function init() {
        loadData();
        initSelectors();
        autoGenerateDraftRooms(); // Basic Flow 5: Tự động tạo sẵn phòng thi theo điểm thi ban đầu
        initSimulationControls();
        render();

        // Nút Tạo lại / Tự động sinh phòng theo số lượng nhập
        $('btnAutoGenerate')?.addEventListener('click', () => {
            autoGenerateDraftRooms();
            renderDraftRoomsTable();
            setPageAlert('Đã tự động tính toán và sinh lại thông tin phòng thi dự kiến.', 'success');
        });

        // Nút Thêm 1 phòng thủ công vào danh sách dự kiến
        $('btnAddSingleDraftRow')?.addEventListener('click', () => {
            const venue = VENUES.find(v => v.id === currentVenueId);
            const nextIndex = (generatedDraftRooms.length + 1) + 10;
            const pad = String(nextIndex).padStart(2, '0');
            generatedDraftRooms.push({
                tempId: `DRAFT-${Date.now()}`,
                examId: currentExamId,
                venueId: currentVenueId,
                code: `${venue ? venue.defaultPrefix : 'P'}${pad}`,
                name: `Phòng thi số ${pad}`,
                capacity: 24,
                location: 'Tầng 1',
                note: 'Bổ sung'
            });
            renderDraftRoomsTable();
        });

        // Nút Xác nhận tạo phòng thi (Basic Flow 7)
        $('btnConfirmCreateRooms')?.addEventListener('click', () => {
            openConfirmModal();
        });

        // Nút Tạo thêm phòng thi tại điểm thi này (Alternative Flow 10.1)
        $('btnActionAddMore')?.addEventListener('click', () => {
            handleAddMoreRooms();
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();

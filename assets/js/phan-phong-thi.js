/**
 * ==========================================================================
 * JavaScript: Phân phòng thi cho thí sinh (Use Case 7 - Ban Tuyển sinh Sở GD&ĐT)
 * Hệ thống Quản lý tuyển sinh lớp 10
 *
 * Đáp ứng đầy đủ đặc tả nghiệp vụ:
 * - Tiền điều kiện: Đã đăng nhập & phân quyền; kỳ thi, điểm thi, phòng thi, thí sinh tồn tại;
 *   trường THCS đã xác định phường/khu vực (2-3 trường THCS tại cùng phường hoặc lân cận).
 * - Hậu điều kiện: Thí sinh phân vào phòng phù hợp; kết quả được lưu; không vượt sức chứa phòng.
 * - Basic Flow (1-11):
 *   1. Yêu cầu thực hiện phân phòng thi cho thí sinh.
 *   2. Hiển thị các kỳ thi/đợt thi có thể thực hiện phân phòng.
 *   3. Chọn kỳ thi và điểm thi cần phân phòng.
 *   4. Hiển thị danh sách thí sinh và các phòng thi thuộc điểm thi đã chọn.
 *   5. Xác nhận yêu cầu phân phòng thi.
 *   6. Kiểm tra danh sách thí sinh, trường THCS của thí sinh, vị trí/phường của trường THCS, danh sách phòng thi và sức chứa của từng phòng.
 *   7. Phân thí sinh vào các phòng thi thuộc điểm thi phù hợp theo quy tắc đã thiết lập, bảo đảm mỗi điểm thi phục vụ thí sinh của 2–3 trường THCS tại cùng phường hoặc phường lân cận và không vượt quá sức chứa của từng phòng.
 *   8. Hiển thị kết quả phân phòng và số lượng thí sinh tại từng phòng.
 *   9. Kiểm tra và xác nhận kết quả phân phòng.
 *   10. Lưu kết quả phân phòng thi cho thí sinh.
 *   11. Thông báo phân phòng thành công và kết thúc Use Case.
 * - Alternative Flow:
 *   + 9.1: Điều chỉnh kết quả phân phòng (kiểm tra sức chứa phòng đích và khu vực trường).
 *   + 9.2: Thực hiện lại phân phòng theo quy tắc đã thiết lập, quay lại bước 9.
 * - Exception Flow:
 *   + 6.1: Điểm thi chưa có phòng thi -> Thông báo chưa đủ điều kiện -> Chuyển sang UC Tạo phòng thi.
 *   + 6.2: Tổng sức chứa phòng thi nhỏ hơn số thí sinh -> Thông báo số lượng chỗ còn thiếu -> Không lưu kết quả -> Kết thúc.
 *   + 6.3: Điểm thi không phù hợp với khu vực trường THCS của thí sinh -> Từ chối phân -> Cho phép chọn điểm thi phù hợp khác -> Quay lại bước 6.
 *   + 10.1: Không thể lưu kết quả phân phòng -> Báo kết quả chưa ghi nhận -> Dữ liệu chính thức giữ nguyên -> Quay lại bước 9.
 * ==========================================================================
 */

(() => {
    'use strict';

    const STORAGE_KEY = 'tuyensinh10.uc7_phanphong.v2';

    // Thông tin người dùng đăng nhập (Actor: Ban Tuyển sinh Sở GD&ĐT)
    const CURRENT_ACTOR = {
        name: 'Ban Tuyển sinh Sở GD&ĐT',
        role: 'Quản trị viên • Quản lý kỳ thi',
        department: 'Phòng Khảo thí & Kiểm định chất lượng giáo dục',
        permission: 'PERMISSION_ASSIGN_ROOMS'
    };

    // Danh mục Kỳ thi (Basic Flow 2)
    const EXAMS = [
        { id: 'KT2026', name: 'Kỳ thi tuyển sinh vào lớp 10 THPT năm học 2026 - 2027', status: 'active' },
        { id: 'KT2025', name: 'Kỳ thi tuyển sinh vào lớp 10 THPT năm học 2025 - 2026', status: 'closed' }
    ];

    // Danh mục Điểm thi và Quy tắc khu vực trường THCS (Tiền điều kiện & Basic Flow 6, 7)
    const VENUES = [
        {
            id: 'DT01',
            examId: 'KT2026',
            code: 'NT',
            name: 'Điểm thi THPT Nguyễn Trãi',
            address: '364 Nguyễn Tất Thành, Phường 18, Quận 4',
            district: 'Quận 4',
            ward: 'Phường 18',
            // Phục vụ thí sinh 2-3 trường THCS tại cùng phường hoặc lân cận:
            eligibleSchools: ['THCS Nguyễn Du', 'THCS Ba Đình', 'THCS Quang Trung'],
            schoolWards: {
                'THCS Nguyễn Du': 'Phường 18, Quận 4 (Cùng phường)',
                'THCS Ba Đình': 'Phường 13, Quận 4 (Phường lân cận)',
                'THCS Quang Trung': 'Phường 10, Quận 4 (Phường lân cận)'
            }
        },
        {
            id: 'DT02',
            examId: 'KT2026',
            code: 'LQD',
            name: 'Điểm thi THPT Lê Quý Đôn',
            address: '110 Nguyễn Thị Minh Khai, Phường Võ Thị Sáu, Quận 3',
            district: 'Quận 3',
            ward: 'Phường Võ Thị Sáu',
            eligibleSchools: ['THCS Lê Quý Đôn', 'THCS Chu Văn An', 'THCS Lương Thế Vinh'],
            schoolWards: {
                'THCS Lê Quý Đôn': 'Phường Võ Thị Sáu, Quận 3 (Cùng phường)',
                'THCS Chu Văn An': 'Phường Võ Thị Sáu, Quận 3 (Cùng phường)',
                'THCS Lương Thế Vinh': 'Phường 8, Quận 3 (Phường lân cận)'
            }
        },
        {
            id: 'DT03',
            examId: 'KT2026',
            code: 'TP',
            name: 'Điểm thi THPT Trần Phú (Sức chứa hạn chế)',
            address: '18 Lê Thúc Hoạch, Phường Phú Thọ Hòa, Quận Tân Phú',
            district: 'Quận Tân Phú',
            ward: 'Phường Phú Thọ Hòa',
            eligibleSchools: ['THCS Trần Phú', 'THCS Thoại Ngọc Hầu'],
            schoolWards: {
                'THCS Trần Phú': 'Phường Phú Thọ Hòa, Quận Tân Phú (Cùng phường)',
                'THCS Thoại Ngọc Hầu': 'Phường Phú Thạnh, Quận Tân Phú (Phường lân cận)'
            }
        },
        {
            id: 'DT04',
            examId: 'KT2026',
            code: 'LHP',
            name: 'Điểm thi THPT Chuyên Lê Hồng Phong (Chưa có phòng)',
            address: '235 Nguyễn Văn Cừ, Phường 4, Quận 5',
            district: 'Quận 5',
            ward: 'Phường 4',
            eligibleSchools: ['THCS Colette', 'THCS Trần Văn Ơn'],
            schoolWards: {
                'THCS Colette': 'Quận 3',
                'THCS Trần Văn Ơn': 'Quận 1'
            }
        }
    ];

    // Danh mục Phòng thi tại các điểm thi
    const VENUE_ROOMS = {
        'DT01': [
            { id: 'R-NT-01', code: 'NT-P01', name: 'Phòng thi 01', capacity: 6, location: 'Tầng 1 - Khu A' },
            { id: 'R-NT-02', code: 'NT-P02', name: 'Phòng thi 02', capacity: 6, location: 'Tầng 1 - Khu A' },
            { id: 'R-NT-03', code: 'NT-P03', name: 'Phòng thi 03', capacity: 6, location: 'Tầng 2 - Khu A' }
        ],
        'DT02': [
            { id: 'R-LQD-01', code: 'LQD-P01', name: 'Phòng thi 01', capacity: 6, location: 'Dãy B1' },
            { id: 'R-LQD-02', code: 'LQD-P02', name: 'Phòng thi 02', capacity: 6, location: 'Dãy B1' }
        ],
        'DT03': [
            // Sức chứa chỉ có 4 chỗ - trong khi có 8 thí sinh -> Dùng kiểm thử Exception 6.2
            { id: 'R-TP-01', code: 'TP-P01', name: 'Phòng thi 01 (Hạn chế)', capacity: 4, location: 'Khu A' }
        ],
        'DT04': [
            // Không có phòng thi nào -> Dùng kiểm thử Exception 6.1
        ]
    };

    // Danh sách thí sinh mẫu (đầy đủ thông tin trường THCS, phường/quận, SBD)
    const DEFAULT_CANDIDATES = [
        // --- Nhóm thí sinh tại Quận 4 (Phù hợp với Điểm thi DT01 - THPT Nguyễn Trãi) ---
        { id: 'HS001', sbd: '100001', name: 'Nguyễn Minh Anh', dob: '15/03/2011', gender: 'Nữ', school: 'THCS Nguyễn Du', district: 'Quận 4', venueId: 'DT01', roomId: null, status: 'unassigned' },
        { id: 'HS002', sbd: '100002', name: 'Trần Quốc Bảo', dob: '20/07/2011', gender: 'Nam', school: 'THCS Nguyễn Du', district: 'Quận 4', venueId: 'DT01', roomId: null, status: 'unassigned' },
        { id: 'HS003', sbd: '100003', name: 'Lê Ngọc Hà', dob: '11/01/2011', gender: 'Nữ', school: 'THCS Nguyễn Du', district: 'Quận 4', venueId: 'DT01', roomId: null, status: 'unassigned' },
        { id: 'HS004', sbd: '100004', name: 'Phạm Gia Huy', dob: '05/09/2011', gender: 'Nam', school: 'THCS Ba Đình', district: 'Quận 4', venueId: 'DT01', roomId: null, status: 'unassigned' },
        { id: 'HS005', sbd: '100005', name: 'Võ Khánh Linh', dob: '18/12/2011', gender: 'Nữ', school: 'THCS Ba Đình', district: 'Quận 4', venueId: 'DT01', roomId: null, status: 'unassigned' },
        { id: 'HS006', sbd: '100006', name: 'Đặng Tuấn Kiệt', dob: '22/04/2011', gender: 'Nam', school: 'THCS Ba Đình', district: 'Quận 4', venueId: 'DT01', roomId: null, status: 'unassigned' },
        { id: 'HS007', sbd: '100007', name: 'Bùi Bảo Ngọc', dob: '30/08/2011', gender: 'Nữ', school: 'THCS Quang Trung', district: 'Quận 4', venueId: 'DT01', roomId: null, status: 'unassigned' },
        { id: 'HS008', sbd: '100008', name: 'Đỗ Hoàng Nam', dob: '14/02/2011', gender: 'Nam', school: 'THCS Quang Trung', district: 'Quận 4', venueId: 'DT01', roomId: null, status: 'unassigned' },
        { id: 'HS009', sbd: '100009', name: 'Trương Thảo Vy', dob: '09/06/2011', gender: 'Nữ', school: 'THCS Quang Trung', district: 'Quận 4', venueId: 'DT01', roomId: null, status: 'unassigned' },
        { id: 'HS010', sbd: '100010', name: 'Ngô Đức Anh', dob: '27/10/2011', gender: 'Nam', school: 'THCS Nguyễn Du', district: 'Quận 4', venueId: 'DT01', roomId: null, status: 'unassigned' },
        { id: 'HS011', sbd: '100011', name: 'Phan Minh Châu', dob: '03/05/2011', gender: 'Nữ', school: 'THCS Ba Đình', district: 'Quận 4', venueId: 'DT01', roomId: null, status: 'unassigned' },
        
        // --- Thí sinh bị gán nhầm điểm thi (dùng test Exception 6.3: Sai khu vực THCS) ---
        { id: 'HS099', sbd: '100099', name: 'Lý Quốc Cường (Ca 6.3)', dob: '12/11/2011', gender: 'Nam', school: 'THCS Thoại Ngọc Hầu', district: 'Quận Tân Phú', venueId: 'DT01', roomId: null, status: 'unassigned' },

        // --- Nhóm thí sinh tại Quận Tân Phú (Điểm thi DT03 - THPT Trần Phú) ---
        { id: 'HS021', sbd: '100021', name: 'Vũ Hải Đăng', dob: '19/11/2011', gender: 'Nam', school: 'THCS Trần Phú', district: 'Quận Tân Phú', venueId: 'DT03', roomId: null, status: 'unassigned' },
        { id: 'HS022', sbd: '100022', name: 'Hoàng Yến Nhi', dob: '25/08/2011', gender: 'Nữ', school: 'THCS Trần Phú', district: 'Quận Tân Phú', venueId: 'DT03', roomId: null, status: 'unassigned' },
        { id: 'HS023', sbd: '100023', name: 'Đoàn Quang Minh', dob: '08/04/2011', gender: 'Nam', school: 'THCS Thoại Ngọc Hầu', district: 'Quận Tân Phú', venueId: 'DT03', roomId: null, status: 'unassigned' },
        { id: 'HS024', sbd: '100024', name: 'Tô Gia Bảo', dob: '14/10/2011', gender: 'Nam', school: 'THCS Thoại Ngọc Hầu', district: 'Quận Tân Phú', venueId: 'DT03', roomId: null, status: 'unassigned' },
        { id: 'HS025', sbd: '100025', name: 'Dương Mỹ Linh', dob: '03/02/2011', gender: 'Nữ', school: 'THCS Thoại Ngọc Hầu', district: 'Quận Tân Phú', venueId: 'DT03', roomId: null, status: 'unassigned' },
        { id: 'HS026', sbd: '100026', name: 'Trịnh Thế Vinh', dob: '29/07/2011', gender: 'Nam', school: 'THCS Thoại Ngọc Hầu', district: 'Quận Tân Phú', venueId: 'DT03', roomId: null, status: 'unassigned' },
        { id: 'HS027', sbd: '100027', name: 'Cao Phương Thảo', dob: '16/09/2011', gender: 'Nữ', school: 'THCS Trần Phú', district: 'Quận Tân Phú', venueId: 'DT03', roomId: null, status: 'unassigned' },
        { id: 'HS028', sbd: '100028', name: 'Mai Thành Đạt', dob: '22/12/2011', gender: 'Nam', school: 'THCS Trần Phú', district: 'Quận Tân Phú', venueId: 'DT03', roomId: null, status: 'unassigned' }
    ];

    // State ứng dụng
    let candidates = [];
    let currentExamId = 'KT2026';
    let currentVenueId = 'DT01';

    // State tìm kiếm & bộ lọc thí sinh
    let searchQuery = '';
    let filterStatus = 'all';

    // Cờ mô phỏng kịch bản (Simulation Flags)
    let simulateSaveError = false; // Exception Flow 10.1

    // DOM Utilities
    const $ = id => document.getElementById(id);
    const esc = str => String(str ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    // Tải dữ liệu từ LocalStorage
    function loadData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    candidates = parsed;
                    return;
                }
            }
        } catch (_) {}
        candidates = JSON.parse(JSON.stringify(DEFAULT_CANDIDATES));
        saveData();
    }

    // Lưu dữ liệu vào LocalStorage
    function saveData() {
        if (simulateSaveError) {
            // Exception Flow 10.1: Giả lập lỗi lưu
            return false;
        }
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
            return true;
        } catch (_) {
            return false;
        }
    }

    // Toast thông báo trượt
    function showToast(text, type = 'success') {
        const existing = document.querySelector('.assign-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `assign-toast ${type}`;
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
        const alertBox = $('assignPageAlert');
        if (!alertBox) return;

        if (!text) {
            alertBox.hidden = true;
            alertBox.textContent = '';
            return;
        }

        alertBox.hidden = false;
        alertBox.className = `wf-alert ${type}`;
        alertBox.innerHTML = `<strong>${type === 'success' ? '✓ Thành công:' : type === 'warning' ? '⚠ Chú ý:' : '✖ Cảnh báo / Lỗi:'}</strong> ${esc(text)}`;
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Khởi tạo các bộ chọn Kỳ thi & Điểm thi (Basic Flow 2 & 3)
    function initSelectors() {
        const examSelect = $('examSelect');
        const venueSelect = $('venueSelect');

        if (examSelect) {
            examSelect.innerHTML = EXAMS.map(e => `
                <option value="${esc(e.id)}" ${e.id === currentExamId ? 'selected' : ''}>
                    ${esc(e.name)}
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
                render();
            });
        }

        // Bộ lọc & tìm kiếm thí sinh
        const searchInput = $('candidateSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', e => {
                searchQuery = e.target.value.trim().toLowerCase();
                renderCandidatesTable();
            });
        }

        const roomFilter = $('candidateRoomFilter');
        if (roomFilter) {
            roomFilter.addEventListener('change', e => {
                filterStatus = e.target.value;
                renderCandidatesTable();
            });
        }
    }

    // Lấy danh sách phòng thi tại điểm thi hiện tại
    function getCurrentVenueRooms() {
        return VENUE_ROOMS[currentVenueId] || [];
    }

    // Lấy danh sách thí sinh thuộc điểm thi hiện tại
    function getCurrentVenueCandidates() {
        return candidates.filter(c => c.venueId === currentVenueId);
    }

    // Cập nhật Thẻ Thống Kê
    function updateStats() {
        const venueCandidates = getCurrentVenueCandidates();
        const venueRooms = getCurrentVenueRooms();
        const totalCapacity = venueRooms.reduce((sum, r) => sum + r.capacity, 0);
        const assignedCount = venueCandidates.filter(c => c.roomId !== null).length;
        const unassignedCount = venueCandidates.length - assignedCount;

        if ($('statTotalCandidates')) $('statTotalCandidates').textContent = venueCandidates.length;
        if ($('statAssignedCandidates')) {
            const pct = venueCandidates.length > 0 ? Math.round((assignedCount / venueCandidates.length) * 100) : 0;
            $('statAssignedCandidates').textContent = `${assignedCount} (${pct}%)`;
        }
        if ($('statUnassignedCandidates')) $('statUnassignedCandidates').textContent = unassignedCount;
        if ($('statTotalVenueCapacity')) $('statTotalVenueCapacity').textContent = `${totalCapacity} chỗ (${venueRooms.length} phòng)`;
    }

    // Render Khối Thông tin điểm thi và Quy tắc khu vực (Basic Flow 4)
    function renderVenueAndRules() {
        const venue = VENUES.find(v => v.id === currentVenueId);
        const venueRooms = getCurrentVenueRooms();
        const container = $('venueRuleSection');
        if (!venue || !container) return;

        const totalSeats = venueRooms.reduce((sum, r) => sum + r.capacity, 0);

        container.innerHTML = `
            <div class="venue-rule-grid">
                <div class="venue-rule-detail">
                    <h4><span>🏫</span> ${esc(venue.name)} <span class="rule-tag">${esc(venue.code)}</span></h4>
                    <p style="margin: 4px 0 8px 0; color: #64748b;">Địa chỉ: <strong>${esc(venue.address)}</strong></p>
                    <div style="display:flex; gap: 16px; font-size: 12px; margin-top: 10px; flex-wrap: wrap;">
                        <span>Số phòng thi: <strong style="color:#1769e0;">${venueRooms.length} phòng</strong></span>
                        <span>Tổng sức chứa: <strong style="color:#159465;">${totalSeats} thí sinh</strong></span>
                        <span>Quy chuẩn: <strong>Quy định 2-3 trường THCS lân cận</strong></span>
                    </div>
                </div>
                <div class="venue-rule-detail" style="border-left: 3px solid #1769e0;">
                    <h4><span>📍</span> Địa bàn trường THCS phục vụ theo quy định (Bước 6)</h4>
                    <span style="font-size: 11px; color: #64748b;">(Quy tắc: Cùng phường hoặc phường lân cận đã được xác định)</span>
                    <ul class="eligible-schools-list">
                        ${venue.eligibleSchools.map(sch => `
                            <li><strong>${esc(sch)}</strong> - ${esc(venue.schoolWards[sch] || '')}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    // Render Thẻ trạng thái từng phòng thi (Room Capacity Cards) (Basic Flow 8)
    function renderRoomCards() {
        const container = $('roomsOverviewGrid');
        const venueRooms = getCurrentVenueRooms();
        const venueCandidates = getCurrentVenueCandidates();
        if (!container) return;

        if (venueRooms.length === 0) {
            container.innerHTML = `
                <div class="wf-alert warning" style="grid-column: 1 / -1; margin-bottom: 0;">
                    <strong>⚠ Điểm thi này chưa có phòng thi nào.</strong> Vui lòng tạo phòng thi trước khi phân phòng thi (Ca ngoại lệ 6.1).
                </div>
            `;
            return;
        }

        container.innerHTML = venueRooms.map(room => {
            const currentCount = venueCandidates.filter(c => c.roomId === room.id).length;
            const pct = Math.min(100, Math.round((currentCount / room.capacity) * 100));
            const isFull = currentCount >= room.capacity;

            return `
                <div class="room-card-status ${isFull ? 'is-full' : 'has-space'}">
                    <div class="room-card-header">
                        <strong>${esc(room.code)}</strong>
                        <span class="pill ${isFull ? 'green' : 'blue'}">${currentCount} / ${room.capacity} chỗ</span>
                    </div>
                    <div style="font-size: 11px; color: #64748b;">${esc(room.name)} • ${esc(room.location)}</div>
                    <div class="room-card-meter">
                        <div class="room-card-fill ${isFull ? 'full' : ''}" style="width: ${pct}%;"></div>
                    </div>
                    <div class="room-card-footer">
                        <span>${isFull ? '✓ Đã đủ chỉ tiêu' : `Còn ${room.capacity - currentCount} chỗ trống`}</span>
                        <span>${pct}%</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Render Bảng danh sách thí sinh và phòng được phân (Basic Flow 4 & 8)
    function renderCandidatesTable() {
        const tbody = $('candidatesTableBody');
        const venueCandidates = getCurrentVenueCandidates();
        const venueRooms = getCurrentVenueRooms();
        const venue = VENUES.find(v => v.id === currentVenueId);
        if (!tbody) return;

        // Lọc theo tìm kiếm và trạng thái
        let filtered = venueCandidates.filter(c => {
            if (searchQuery) {
                const matchName = (c.name || '').toLowerCase().includes(searchQuery);
                const matchSbd = (c.sbd || '').toLowerCase().includes(searchQuery);
                const matchSchool = (c.school || '').toLowerCase().includes(searchQuery);
                if (!matchName && !matchSbd && !matchSchool) return false;
            }
            if (filterStatus === 'assigned') return c.roomId !== null;
            if (filterStatus === 'unassigned') return c.roomId === null;
            return true;
        });

        if ($('filterShowingCount')) {
            $('filterShowingCount').textContent = filtered.length;
        }

        if (venueCandidates.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty">Không có thí sinh nào đăng ký thi tại điểm thi này.</td>
                </tr>
            `;
            return;
        }

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="empty">Không tìm thấy thí sinh nào phù hợp với bộ lọc tìm kiếm.</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filtered.map((c, idx) => {
            const isEligible = venue && venue.eligibleSchools.includes(c.school);
            const assignedRoom = venueRooms.find(r => r.id === c.roomId);

            let statusBadge = '';
            let rowClass = '';

            if (!isEligible) {
                statusBadge = '<span class="pill" style="background:#fee2e2; color:#dc2626;">⚠ Sai khu vực THCS</span>';
                rowClass = 'candidate-row-conflict';
            } else if (c.roomId) {
                statusBadge = '<span class="pill green">✓ Đã phân phòng</span>';
                rowClass = 'candidate-row-assigned';
            } else {
                statusBadge = '<span class="pill orange">Chưa phân phòng</span>';
                rowClass = 'candidate-row-unassigned';
            }

            // Dropdown chọn phòng trực tiếp (Alternative Flow 9.1: Điều chỉnh phòng thi)
            const roomSelectOptions = `
                <select class="select-room-dropdown direct-room-changer" data-candidate-id="${esc(c.id)}" ${!isEligible ? 'disabled' : ''}>
                    <option value="">-- Chưa chọn phòng --</option>
                    ${venueRooms.map(r => {
                        const countInRoom = venueCandidates.filter(item => item.roomId === r.id).length;
                        const isCurrent = c.roomId === r.id;
                        const isRoomFull = countInRoom >= r.capacity && !isCurrent;
                        return `
                            <option value="${esc(r.id)}" ${isCurrent ? 'selected' : ''} ${isRoomFull ? 'disabled' : ''}>
                                ${esc(r.code)} (${countInRoom}/${r.capacity}${isRoomFull ? ' - ĐÃ ĐẦY' : ''})
                            </option>
                        `;
                    }).join('')}
                </select>
            `;

            return `
                <tr class="${rowClass}" data-candidate-id="${esc(c.id)}">
                    <td style="text-align: center; color: #64748b;">${idx + 1}</td>
                    <td><strong style="font-family: monospace; color:#1769e0;">${esc(c.sbd)}</strong></td>
                    <td><strong>${esc(c.name)}</strong></td>
                    <td>${esc(c.dob)} (${esc(c.gender)})</td>
                    <td>
                        <span class="school-badge ${!isEligible ? 'conflict' : ''}">${esc(c.school)}</span>
                        <small style="display:block; color:#64748b; margin-top:2px;">${esc(c.district)}</small>
                    </td>
                    <td>${statusBadge}</td>
                    <td>${roomSelectOptions}</td>
                </tr>
            `;
        }).join('');

        // Lắng nghe thay đổi phòng thi trực tiếp từ dropdown (Alternative Flow 9.1)
        tbody.querySelectorAll('.direct-room-changer').forEach(select => {
            select.addEventListener('change', () => {
                const candidateId = select.getAttribute('data-candidate-id');
                const newRoomId = select.value || null;
                handleDirectChangeRoom(candidateId, newRoomId);
            });
        });
    }

    // =========================================================================
    // THUẬT TOÁN PHÂN PHÒNG THI TỰ ĐỘNG (Basic Flow 6, 7 & Exception 6.1, 6.2, 6.3)
    // =========================================================================
    function executeAutoAssignRooms() {
        setPageAlert('');

        const venue = VENUES.find(v => v.id === currentVenueId);
        const venueRooms = getCurrentVenueRooms();
        const venueCandidates = getCurrentVenueCandidates();

        // 1. Exception Flow 6.1: Chưa có phòng thi
        if (venueRooms.length === 0) {
            setPageAlert(`Điểm thi ${venue.name} chưa có phòng thi. Hệ thống thông báo chưa đủ điều kiện phân phòng (Ca ngoại lệ 6.1). Ban Tuyển sinh Sở GD&ĐT vui lòng thực hiện Use Case "Tạo thông tin phòng thi" trước khi phân phòng.`, 'error');
            showToast('Chưa có phòng thi!', 'error');
            const alertBox = $('assignPageAlert');
            if (alertBox) {
                alertBox.innerHTML += `
                    <div style="margin-top: 10px;">
                        <a href="tao-thong-tin-phong-thi.php?venueId=${esc(currentVenueId)}" class="primary-button" style="text-decoration:none; display:inline-block; padding: 8px 14px; font-size:12px;">
                            ➔ Chuyển đến chức năng Tạo thông tin phòng thi (UC 6)
                        </a>
                    </div>
                `;
            }
            return false;
        }

        // 2. Exception Flow 6.3: Điểm thi không phù hợp với khu vực trường THCS
        const conflictingCandidates = venueCandidates.filter(c => !venue.eligibleSchools.includes(c.school));
        if (conflictingCandidates.length > 0) {
            const conflictNames = conflictingCandidates.map(c => `${c.name} (${c.school})`).join(', ');
            setPageAlert(
                `Điểm thi không phù hợp với khu vực trường THCS (Ca ngoại lệ 6.3): Phát hiện ${conflictingCandidates.length} thí sinh [${conflictNames}] không đáp ứng quy tắc phân thí sinh theo khu vực trường THCS tại ${venue.name}. Hệ thống không phân các thí sinh này vào điểm thi không phù hợp.`, 
                'error'
            );
            showToast('Phát hiện thí sinh không đúng địa bàn THCS!', 'error');

            const alertBox = $('assignPageAlert');
            if (alertBox) {
                alertBox.innerHTML += `
                    <div style="margin-top: 12px; display: flex; gap: 10px; flex-wrap: wrap;">
                        <button type="button" id="btnHandleConflictSwitchVenue" class="primary-button" style="padding: 7px 14px; font-size: 12px;">
                            ➔ Bước 4: Lựa chọn Điểm thi phù hợp khác (THPT Trần Phú - Tân Phú)
                        </button>
                        <button type="button" id="btnHandleConflictReassignOthers" class="secondary-button" style="padding: 7px 14px; font-size: 12px;">
                            ➔ Điều chuyển thí sinh sai tuyến về đúng điểm thi &amp; tiếp tục phân phòng (Bước 5, 6)
                        </button>
                    </div>
                `;
                $('btnHandleConflictSwitchVenue')?.addEventListener('click', () => {
                    currentVenueId = 'DT03';
                    if ($('venueSelect')) $('venueSelect').value = 'DT03';
                    render();
                    executeAutoAssignRooms();
                });
                $('btnHandleConflictReassignOthers')?.addEventListener('click', () => {
                    conflictingCandidates.forEach(c => {
                        c.venueId = 'DT03'; // Chuyển về đúng điểm thi Trần Phú
                        c.roomId = null;
                    });
                    saveData();
                    render();
                    executeAutoAssignRooms();
                });
            }
            return false;
        }

        // 3. Exception Flow 6.2: Sức chứa phòng thi không đủ
        const totalCapacity = venueRooms.reduce((sum, r) => sum + r.capacity, 0);
        if (totalCapacity < venueCandidates.length) {
            const missing = venueCandidates.length - totalCapacity;
            setPageAlert(`Sức chứa phòng thi không đủ (Ca ngoại lệ 6.2): Tổng sức chứa của các phòng thi (${totalCapacity} chỗ) nhỏ hơn số lượng thí sinh cần phân (${venueCandidates.length} thí sinh). Còn thiếu ${missing} chỗ thi. Hệ thống không thực hiện lưu kết quả phân phòng.`, 'error');
            showToast(`Thiếu ${missing} chỗ thi!`, 'error');

            const alertBox = $('assignPageAlert');
            if (alertBox) {
                alertBox.innerHTML += `
                    <div style="margin-top: 10px;">
                        <a href="tao-thong-tin-phong-thi.php?venueId=${esc(currentVenueId)}" class="secondary-button" style="text-decoration:none; display:inline-block; padding: 8px 14px; font-size:12px;">
                            ➕ Tạo thêm phòng thi để bổ sung ${missing} chỗ (UC 6)
                        </a>
                    </div>
                `;
            }
            return false;
        }

        // 4. Basic Flow 7: Phân thí sinh vào các phòng thi phù hợp
        // Sắp xếp thí sinh theo Tên hoặc Số báo danh
        const sortedCandidates = [...venueCandidates].sort((a, b) => a.sbd.localeCompare(b.sbd));

        let roomIndex = 0;
        let roomCountMap = {};
        venueRooms.forEach(r => { roomCountMap[r.id] = 0; });

        for (const candidate of sortedCandidates) {
            // Tìm phòng còn sức chứa
            while (roomIndex < venueRooms.length && roomCountMap[venueRooms[roomIndex].id] >= venueRooms[roomIndex].capacity) {
                roomIndex++;
            }

            if (roomIndex < venueRooms.length) {
                const assignedRoom = venueRooms[roomIndex];
                candidate.roomId = assignedRoom.id;
                candidate.status = 'assigned';
                roomCountMap[assignedRoom.id]++;
            } else {
                candidate.roomId = null;
                candidate.status = 'unassigned';
            }
        }

        // Basic Flow 8: Hiển thị kết quả phân phòng và số lượng thí sinh tại từng phòng
        setPageAlert(`Đã phân bổ tự động thành công ${venueCandidates.length} thí sinh vào ${venueRooms.length} phòng thi thuộc ${venue.name} (Bước 8). Bảo đảm mỗi phòng không vượt quá sức chứa quy định. Vui lòng kiểm tra lại trước khi xác nhận lưu kết quả (Bước 9).`, 'success');
        showToast('Đã hoàn tất phân phòng tự động!', 'success');

        render();
        return true;
    }

    // Alternative Flow 9.1: Điều chỉnh kết quả phân phòng của thí sinh
    function handleDirectChangeRoom(candidateId, newRoomId) {
        setPageAlert('');
        const candidate = candidates.find(c => c.id === candidateId);
        const venue = VENUES.find(v => v.id === currentVenueId);
        const venueRooms = getCurrentVenueRooms();
        if (!candidate || !venue) return;

        // Nếu bỏ gán phòng
        if (!newRoomId) {
            candidate.roomId = null;
            candidate.status = 'unassigned';
            render();
            showToast(`Đã hủy phân phòng cho thí sinh ${candidate.name}`, 'warning');
            return;
        }

        // 3. Hệ thống kiểm tra điểm thi có phù hợp với khu vực trường THCS của thí sinh
        if (!venue.eligibleSchools.includes(candidate.school)) {
            setPageAlert(`Không thể xếp phòng: Thí sinh ${candidate.name} thuộc trường ${candidate.school} không phù hợp với khu vực của điểm thi ${venue.name}.`, 'error');
            render();
            return;
        }

        // 3. Hệ thống kiểm tra sức chứa của phòng thi được chọn
        const targetRoom = venueRooms.find(r => r.id === newRoomId);
        if (!targetRoom) return;

        const currentInRoom = candidates.filter(c => c.venueId === currentVenueId && c.roomId === newRoomId && c.id !== candidateId).length;
        if (currentInRoom >= targetRoom.capacity) {
            setPageAlert(`Không thể chuyển phòng: Phòng ${targetRoom.code} đã đạt sức chứa tối đa (${targetRoom.capacity} thí sinh). Vui lòng chọn phòng thi khác còn chỗ trống.`, 'error');
            showToast('Phòng thi đã đầy sức chứa!', 'error');
            render(); // Render lại để reset select box
            return;
        }

        // 4. Hệ thống cập nhật kết quả phân phòng
        candidate.roomId = newRoomId;
        candidate.status = 'assigned';

        // 5. Quay lại bước 9
        setPageAlert(`✓ Ca 9.1 - Đã cập nhật kết quả phân phòng: Chuyển thí sinh ${candidate.name} sang phòng ${targetRoom.code} thành công. Quay lại bước 9 (Kiểm tra và xác nhận).`, 'success');
        showToast(`Đã chuyển sang phòng ${targetRoom.code}!`, 'success');

        render();
    }

    // Mở Modal xác nhận lưu kết quả phân phòng (Basic Flow 9)
    function openConfirmModal() {
        const venue = VENUES.find(v => v.id === currentVenueId);
        const venueCandidates = getCurrentVenueCandidates();
        const venueRooms = getCurrentVenueRooms();
        const modal = $('assignConfirmModal');
        if (!modal || !venue) return;

        const unassigned = venueCandidates.filter(c => c.roomId === null).length;
        if (unassigned > 0) {
            if (!confirm(`Hiện vẫn còn ${unassigned} thí sinh chưa được phân phòng thi. Bạn có chắc chắn muốn lưu kết quả phân phòng này không?`)) {
                return;
            }
        }

        $('confirmAssignVenueName').textContent = `${venue.name} (${venue.code})`;
        $('confirmAssignTotalCount').textContent = `${venueCandidates.length} thí sinh`;
        $('confirmAssignRoomCount').textContent = `${venueRooms.length} phòng thi`;

        // Render bảng tóm tắt từng phòng
        const previewList = $('confirmAssignRoomsPreview');
        previewList.innerHTML = venueRooms.map(room => {
            const count = venueCandidates.filter(c => c.roomId === room.id).length;
            return `
                <div style="display:flex; justify-content:space-between; padding: 7px 0; border-bottom: 1px dashed #e2e8f0; font-size: 12px;">
                    <span><strong>${esc(room.code)}</strong> (${esc(room.name)}) - ${esc(room.location)}</span>
                    <span class="pill ${count >= room.capacity ? 'green' : 'blue'}">${count} / ${room.capacity} thí sinh</span>
                </div>
            `;
        }).join('');

        modal.showModal();

        // Nút Hủy modal
        $('btnCancelConfirmAssign').onclick = () => {
            modal.close();
        };

        // Nút Đồng ý lưu (Basic Flow 10, Exception Flow 10.1)
        $('btnExecuteSaveAssign').onclick = () => {
            modal.close();
            executeSaveAssignment();
        };
    }

    // Lưu kết quả phân phòng thi cho thí sinh (Basic Flow 10, 11 & Exception Flow 10.1)
    function executeSaveAssignment() {
        const venue = VENUES.find(v => v.id === currentVenueId);
        if (!venue) return;

        // Exception Flow 10.1: Không thể lưu kết quả phân phòng
        if (simulateSaveError) {
            setPageAlert('Hệ thống không thể lưu kết quả phân phòng do lỗi máy chủ lưu trữ (Ca ngoại lệ 10.1). Thông báo kết quả chưa được ghi nhận. Dữ liệu phân phòng chính thức không bị thay đổi. Quay lại bước 9.', 'error');
            showToast('Lỗi: Không thể lưu kết quả phân phòng!', 'error');
            return;
        }

        const success = saveData();
        if (!success) {
            setPageAlert('Hệ thống không thể lưu kết quả phân phòng (Ca ngoại lệ 10.1). Kết quả chưa được ghi nhận. Dữ liệu phân phòng chính thức không bị thay đổi. Quay lại bước 9.', 'error');
            showToast('Lỗi lưu trữ dữ liệu!', 'error');
            return;
        }

        // Basic Flow 11: Thông báo phân phòng thành công và kết thúc Use Case
        setPageAlert(
            `Thông báo phân phòng thành công và kết thúc Use Case 7! Toàn bộ kết quả phân phòng cho điểm thi ${venue.name} đã được lưu trữ chính thức. Bạn có thể in bảng niêm yết phòng thi hoặc xuất danh sách niêm yết tại điểm thi.`, 
            'success'
        );
        showToast('Lưu kết quả phân phòng thành công! Kết thúc Use Case 7.', 'success');

        const alertBox = $('assignPageAlert');
        if (alertBox) {
            alertBox.innerHTML += `
                <div style="margin-top: 12px; display: flex; gap: 10px; flex-wrap: wrap;">
                    <button type="button" id="btnAlertPrintAction" class="primary-button" style="padding: 7px 14px; font-size: 12px;">
                        🖨 In ngay bảng niêm yết phòng thi (Bước 11)
                    </button>
                    <button type="button" class="secondary-button" onclick="window.scrollTo({top: 0, behavior: 'smooth'});" style="padding: 7px 14px; font-size: 12px;">
                        ✓ Xem lại thống kê
                    </button>
                </div>
            `;
            $('btnAlertPrintAction')?.addEventListener('click', openPrintRosterModal);
        }

        render();
    }

    // Mở Modal in bảng niêm yết danh sách thí sinh (Bước 11)
    function openPrintRosterModal() {
        const venue = VENUES.find(v => v.id === currentVenueId);
        const venueRooms = getCurrentVenueRooms();
        const venueCandidates = getCurrentVenueCandidates();
        const modal = $('printRoomModal');
        const container = $('printRosterContent');
        if (!modal || !container || !venue) return;

        let html = `
            <div class="official-print-paper">
                <div class="official-header-grid">
                    <div>
                        <strong>UBND THÀNH PHỐ HỒ CHÍ MINH</strong><br>
                        <strong>SỞ GIÁO DỤC VÀ ĐÀO TẠO</strong><br>
                        <span>HỘI ĐỒNG TUYỂN SINH LỚP 10 THPT</span>
                    </div>
                    <div>
                        <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
                        <strong>Độc lập - Tự do - Hạnh phúc</strong><br>
                        <span>------------------------</span>
                    </div>
                </div>

                <div class="official-print-title">DANH SÁCH THÍ SINH THEO PHÒNG THI</div>
                <div class="official-print-subtitle">(BẢNG NIÊM YẾT CHÍNH THỨC TẠI ĐIỂM THI)</div>

                <div style="margin-bottom: 16px; font-size: 13px;">
                    <div>Kỳ thi: <strong>Kỳ thi tuyển sinh vào lớp 10 THPT năm học 2026 - 2027</strong></div>
                    <div>Điểm thi: <strong>${esc(venue.name)} (${esc(venue.code)})</strong></div>
                    <div>Địa chỉ: <strong>${esc(venue.address)}</strong></div>
                </div>
        `;

        if (venueRooms.length === 0) {
            html += `<p style="text-align:center; color:#64748b;">Điểm thi chưa có phòng thi nào được thiết lập.</p>`;
        } else {
            venueRooms.forEach(room => {
                const roomCandidates = venueCandidates.filter(c => c.roomId === room.id);
                html += `
                    <div style="margin-top: 20px; margin-bottom: 6px; font-weight: bold; font-size: 14px;">
                        PHÒNG THI: ${esc(room.code)} - ${esc(room.name)} (${esc(room.location)}) | Sĩ số: ${roomCandidates.length}/${room.capacity} thí sinh
                    </div>
                    <table class="official-room-table">
                        <thead>
                            <tr>
                                <th style="width: 40px;">STT</th>
                                <th style="width: 90px;">Số báo danh</th>
                                <th>Họ và tên thí sinh</th>
                                <th style="width: 90px;">Ngày sinh</th>
                                <th style="width: 70px;">Giới tính</th>
                                <th>Trường THCS</th>
                                <th style="width: 100px;">Chữ ký thí sinh</th>
                                <th style="width: 80px;">Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${roomCandidates.length > 0 ? roomCandidates.map((c, idx) => `
                                <tr>
                                    <td style="text-align:center;">${idx + 1}</td>
                                    <td style="text-align:center; font-family: monospace; font-weight: bold;">${esc(c.sbd)}</td>
                                    <td><strong>${esc(c.name)}</strong></td>
                                    <td style="text-align:center;">${esc(c.dob)}</td>
                                    <td style="text-align:center;">${esc(c.gender)}</td>
                                    <td>${esc(c.school)}</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            `).join('') : `
                                <tr><td colspan="8" style="text-align:center; font-style:italic;">Chưa có thí sinh nào được xếp vào phòng này.</td></tr>
                            `}
                        </tbody>
                    </table>
                `;
            });
        }

        html += `
                <div class="official-signatures-grid">
                    <div>
                        <strong>THƯ KÝ ĐIỂM THI</strong><br>
                        <em>(Ký và ghi rõ họ tên)</em>
                    </div>
                    <div>
                        <em>TP. Hồ Chí Minh, ngày ..... tháng ..... năm 2026</em><br>
                        <strong>TRƯỞNG ĐIỂM THI</strong><br>
                        <em>(Ký, đóng dấu và ghi rõ họ tên)</em>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
        modal.showModal();
    }

    // Cài đặt thanh công cụ mô phỏng kịch bản (Simulation Controls)
    function initSimulationControls() {
        // Ca 1: Basic Flow (1-11)
        $('btnSimulateBasic')?.addEventListener('click', () => {
            currentVenueId = 'DT01';
            $('venueSelect').value = 'DT01';
            // Đảm bảo không có thí sinh vi phạm khu vực
            const bad = candidates.find(c => c.id === 'HS099');
            if (bad) bad.venueId = 'DT03'; // Chuyển về đúng Tân Phú

            render();
            executeAutoAssignRooms();
            setPageAlert('Đã tải kịch bản Basic Flow: Đã phân phòng tự động cho các thí sinh đúng khu vực tại THPT Nguyễn Trãi. Bấm nút "Kiểm tra & Lưu kết quả" (Bước 9) để hoàn tất.', 'warning');
        });

        // Ca 9.1: Điều chỉnh phòng thi
        $('btnSimulateAdjust')?.addEventListener('click', () => {
            setPageAlert('Kích hoạt Alternative Flow 9.1: Bạn có thể click trực tiếp vào ô dropdown "Phòng thi phân công" tại bất kỳ dòng thí sinh nào để điều chỉnh chuyển phòng thi. Hệ thống sẽ kiểm tra sức chứa phòng đích và quay lại bước 9.', 'warning');
            showToast('Hãy thử đổi phòng ở cột cuối cùng của bảng thí sinh!', 'warning');
        });

        // Ca 9.2: Thực hiện lại phân phòng
        $('btnSimulateReAssign')?.addEventListener('click', () => {
            // Reset các thí sinh về null
            getCurrentVenueCandidates().forEach(c => {
                c.roomId = null;
                c.status = 'unassigned';
            });
            executeAutoAssignRooms();
            setPageAlert('Kích hoạt Alternative Flow 9.2: Đã xóa kết quả cũ và thực hiện lại toàn bộ việc phân phòng theo quy tắc đã thiết lập. Quay lại bước 9.', 'warning');
        });

        // Ca 6.1: Chưa có phòng thi
        $('btnSimulateNoRooms')?.addEventListener('click', () => {
            currentVenueId = 'DT04';
            $('venueSelect').value = 'DT04';
            render();
            executeAutoAssignRooms(); // Sẽ kích hoạt Exception 6.1
        });

        // Ca 6.2: Sức chứa không đủ
        $('btnSimulateOverCapacity')?.addEventListener('click', () => {
            currentVenueId = 'DT03';
            $('venueSelect').value = 'DT03';
            render();
            executeAutoAssignRooms(); // Sẽ kích hoạt Exception 6.2 vì chỉ có 4 chỗ nhưng có 8 thí sinh
        });

        // Ca 6.3: Điểm thi không phù hợp với trường THCS
        $('btnSimulateConflictSchool')?.addEventListener('click', () => {
            currentVenueId = 'DT01';
            $('venueSelect').value = 'DT01';
            // Gán thí sinh HS099 (THCS Thoại Ngọc Hầu - Tân Phú) vào điểm thi Nguyễn Trãi (Quận 4)
            const bad = candidates.find(c => c.id === 'HS099');
            if (bad) {
                bad.venueId = 'DT01';
                bad.roomId = null;
            }
            render();
            executeAutoAssignRooms(); // Sẽ kích hoạt Exception 6.3
        });

        // Ca 10.1: Lỗi lưu hệ thống
        $('btnSimulateSaveError')?.addEventListener('click', () => {
            simulateSaveError = !simulateSaveError;
            const btn = $('btnSimulateSaveError');
            if (btn) {
                btn.classList.toggle('active-error', simulateSaveError);
                btn.textContent = simulateSaveError ? '⚠ Đang bật lỗi lưu (Ca 10.1)' : '💾 Ca 10.1: Lỗi lưu hệ thống';
            }
            setPageAlert(simulateSaveError ? 'Đã BẬT mô phỏng lỗi lưu hệ thống (Ca 10.1). Khi bấm Lưu kết quả, hệ thống sẽ báo lỗi và giữ nguyên kết quả cũ, quay lại bước 9.' : 'Đã tắt mô phỏng lỗi lưu hệ thống.', simulateSaveError ? 'error' : 'success');
        });

        // Khôi phục dữ liệu gốc
        $('btnResetAssignData')?.addEventListener('click', () => {
            if (confirm('Bạn có chắc chắn muốn khôi phục lại dữ liệu phân phòng ban đầu không?')) {
                candidates = JSON.parse(JSON.stringify(DEFAULT_CANDIDATES));
                simulateSaveError = false;
                const btn = $('btnSimulateSaveError');
                if (btn) {
                    btn.classList.remove('active-error');
                    btn.textContent = '💾 Ca 10.1: Lỗi lưu hệ thống';
                }
                saveData();
                setPageAlert('Đã khôi phục toàn bộ dữ liệu phân phòng thi mặc định.', 'success');
                showToast('Dữ liệu phân phòng đã được khôi phục!', 'success');
                render();
            }
        });
    }

    // Render toàn trang
    function render() {
        updateStats();
        renderVenueAndRules();
        renderRoomCards();
        renderCandidatesTable();
    }

    // Khởi tạo trang
    function init() {
        loadData();
        initSelectors();
        initSimulationControls();
        render();

        // Nút bấm Tiến hành phân phòng thi tự động (Basic Flow 5, 7)
        $('btnStartAutoAssign')?.addEventListener('click', () => {
            executeAutoAssignRooms();
        });

        // Nút bấm Thực hiện lại phân phòng (Alternative Flow 9.2)
        $('btnReAssignAction')?.addEventListener('click', () => {
            getCurrentVenueCandidates().forEach(c => {
                c.roomId = null;
                c.status = 'unassigned';
            });
            executeAutoAssignRooms();
        });

        // Nút bấm Mở modal xác nhận lưu (Basic Flow 9)
        $('btnConfirmSaveAssignment')?.addEventListener('click', () => {
            openConfirmModal();
        });

        // Nút bấm In bảng niêm yết (Bước 11)
        $('btnPrintRoomList')?.addEventListener('click', () => {
            openPrintRosterModal();
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();

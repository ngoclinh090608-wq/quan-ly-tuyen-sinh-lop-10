/**
 * Chức năng: Xem thông tin tuyển sinh lớp 10
 * Dành cho Học sinh (Actor: Học sinh)
 * Tuân thủ Use Case:
 * - Basic Flow: Hiển thị danh mục thông tin tuyển sinh (chỉ tiêu, trường, hệ đào tạo, phương thức, học phí) -> Xem chi tiết
 * - Alternative Flow 3.1: Tìm kiếm nhanh theo từ khóa (tên trường, mã trường, quận/huyện)
 * - Exception Flow 2.1: Trạng thái chưa công bố thông tin tuyển sinh
 * - Exception Flow 3.1: Không tìm thấy kết quả phù hợp từ khóa
 * - Đảm bảo tính toàn vẹn dữ liệu hệ thống (Chỉ đọc - Read-only)
 */
(() => {
    'use strict';

    // Dữ liệu danh mục thông tin tuyển sinh các trường THPT
    const admissionData = [
        {
            id: 'NT01',
            name: 'THPT Nguyễn Trãi',
            shortName: 'Nguyễn Trãi',
            district: 'Quận 4',
            track: 'regular',
            trackLabel: 'Công lập đại trà',
            quota: 675,
            method: 'Thi tuyển 3 môn (Toán, Ngữ văn, Ngoại ngữ)',
            tuition: '120.000 đ / tháng',
            benchmark2025: '23.75',
            benchmark2024: '23.25',
            address: '364 Nguyễn Tất Thành, Phường 18, Quận 4, TP. Hồ Chí Minh',
            phone: '(028) 3940 1234',
            website: 'thptnguyentrai.hcm.edu.vn',
            principal: 'ThS. Nguyễn Văn A',
            classes: [
                { name: 'Khối Tự nhiên (Toán, Lý, Hóa, Sinh)', quota: 315, note: 'Tổ hợp STEM nâng cao' },
                { name: 'Khối Xã hội (Văn, Sử, Địa, GDCD)', quota: 225, note: 'Định hướng Khoa học Xã hội' },
                { name: 'Khối Công nghệ & Ngoại ngữ', quota: 135, note: 'Tăng cường tiếng Anh' }
            ],
            admissionCriteria: 'Xét tổng điểm 3 môn thi chung (Toán + Ngữ văn + Ngoại ngữ). Không nhân hệ số. Thí sinh không có bài thi nào bị điểm 0.',
            policies: 'Thực hiện miễn giảm học phí cho học sinh diện chính sách, hộ nghèo theo Nghị định 81/2021/NĐ-CP của Chính phủ.'
        },
        {
            id: 'LQD02',
            name: 'THPT Lê Quý Đôn',
            shortName: 'Lê Quý Đôn',
            district: 'Quận 3',
            track: 'advanced',
            trackLabel: 'Tiên tiến hội nhập',
            quota: 540,
            method: 'Thi tuyển 3 môn (Toán, Ngữ văn, Ngoại ngữ)',
            tuition: '1.500.000 đ / tháng',
            benchmark2025: '25.50',
            benchmark2024: '25.00',
            address: '110 Nguyễn Thị Minh Khai, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh',
            phone: '(028) 3930 5678',
            website: 'thptlequydon.hcm.edu.vn',
            principal: 'TS. Lê Thị B',
            classes: [
                { name: 'Lớp Tiên tiến Quốc tế (IELTS & Tin học MOS)', quota: 270, note: 'Chuẩn đầu ra quốc tế' },
                { name: 'Lớp Khoa học Tự nhiên nâng cao', quota: 180, note: 'Tăng cường Toán, Lý, Hóa' },
                { name: 'Lớp Ngoại ngữ & Xã hội hiện đại', quota: 90, note: 'Ngoại ngữ 2: Tiếng Nhật/Đức' }
            ],
            admissionCriteria: 'Thí sinh dự thi tuyển sinh lớp 10 công lập đạt điểm chuẩn nguyện vọng vào trường. Ưu tiên thí sinh có chứng chỉ tiếng Anh quốc tế theo quy chế tuyển sinh.',
            policies: 'Học bổng tài năng trẻ Lê Quý Đôn hỗ trợ 50% - 100% học phí cho thí sinh đạt thủ khoa, á khoa đầu vào.'
        },
        {
            id: 'TP03',
            name: 'THPT Trần Phú',
            shortName: 'Trần Phú',
            district: 'Quận Tân Phú',
            track: 'regular',
            trackLabel: 'Công lập đại trà',
            quota: 765,
            method: 'Thi tuyển 3 môn (Toán, Ngữ văn, Ngoại ngữ)',
            tuition: '120.000 đ / tháng',
            benchmark2025: '24.25',
            benchmark2024: '23.80',
            address: '18 Lê Thúc Hoạch, Phường Phú Thọ Hòa, Quận Tân Phú, TP. Hồ Chí Minh',
            phone: '(028) 3860 9999',
            website: 'thpttranphu.hcm.edu.vn',
            principal: 'ThS. Trần Quốc C',
            classes: [
                { name: 'Lớp định hướng Tự nhiên (KHTN)', quota: 360, note: 'Chuyên ban Toán - Lý - Hóa' },
                { name: 'Lớp định hướng Xã hội (KHXH)', quota: 225, note: 'Chuyên ban Văn - Sử - Địa' },
                { name: 'Lớp Tăng cường Tiếng Anh', quota: 180, note: 'Chương trình tiếng Anh liên kết' }
            ],
            admissionCriteria: 'Xét tuyển theo kết quả kỳ thi chung 3 môn của Sở GD&ĐT. Điểm xét tuyển là tổng điểm 3 bài thi.',
            policies: 'Chế độ trợ cấp học tập, miễn giảm học phí cho con thương binh liệt sĩ, gia đình khó khăn.'
        },
        {
            id: 'LHP00',
            name: 'THPT Chuyên Lê Hồng Phong',
            shortName: 'Chuyên Lê Hồng Phong',
            district: 'Quận 5',
            track: 'specialized',
            trackLabel: 'Trường Chuyên',
            quota: 700,
            method: 'Thi 3 môn chung + 1 môn Chuyên (Hệ số 2)',
            tuition: 'Miễn học phí lớp chuyên',
            benchmark2025: '36.50',
            benchmark2024: '36.00',
            address: '235 Nguyễn Văn Cừ, Phường 4, Quận 5, TP. Hồ Chí Minh',
            phone: '(028) 3839 8506',
            website: 'thpt-lehongphong-tphcm.edu.vn',
            principal: 'PGS.TS. Hoàng Minh D',
            classes: [
                { name: 'Chuyên Toán, Chuyên Tin học', quota: 140, note: '2 lớp Toán, 1 lớp Tin' },
                { name: 'Chuyên Vật lý, Hóa học, Sinh học', quota: 210, note: 'Mỗi môn 2 lớp chuyên' },
                { name: 'Chuyên Ngữ văn, Chuyên Lịch sử, Địa lý', quota: 140, note: 'Chuyên ban Xã hội' },
                { name: 'Chuyên Tiếng Anh, Tiếng Pháp, Tiếng Trung, Tiếng Nhật', quota: 210, note: 'Chuyên Ngoại ngữ' }
            ],
            admissionCriteria: 'Điều kiện: Xếp loại học lực, hạnh kiểm cả năm các lớp 6, 7, 8, 9 từ Khá trở lên; tốt nghiệp THCS loại Giỏi. Điểm xét tuyển = Điểm Toán + Văn + Ngoại ngữ + (Điểm môn chuyên × 2).',
            policies: 'Học sinh các lớp chuyên được hưởng học bổng khuyến khích học tập theo quy định của trường chuyên trọng điểm quốc gia.'
        },
        {
            id: 'NTH05',
            name: 'THPT Nguyễn Thượng Hiền',
            shortName: 'Nguyễn Thượng Hiền',
            district: 'Quận Tân Bình',
            track: 'hybrid',
            trackLabel: 'Chuyên & Đại trà',
            quota: 630,
            method: 'Thi 3 môn chung (hoặc thêm môn Chuyên)',
            tuition: '120.000 đ / tháng',
            benchmark2025: '25.75',
            benchmark2024: '25.50',
            address: '544 Cách Mạng Tháng Tám, Phường 4, Quận Tân Bình, TP. Hồ Chí Minh',
            phone: '(028) 3844 1558',
            website: 'thptnguyenthuonghien.hcm.edu.vn',
            principal: 'ThS. Đỗ Tuấn E',
            classes: [
                { name: 'Lớp Chuyên (Toán, Lý, Hóa, Văn, Anh)', quota: 175, note: 'Xét theo điểm thi chuyên' },
                { name: 'Lớp Công lập đại trà KHTN', quota: 270, note: 'Xét theo nguyện vọng 1, 2, 3' },
                { name: 'Lớp Công lập đại trà KHXH', quota: 185, note: 'Xét theo nguyện vọng 1, 2, 3' }
            ],
            admissionCriteria: 'Đối với lớp chuyên: thi thêm môn chuyên. Đối với lớp thường: xét theo 3 nguyện vọng tuyển sinh vào lớp 10 thường.',
            policies: 'Đầy đủ chế độ miễn giảm học phí và khuyến học cho học sinh có thành tích xuất sắc.'
        },
        {
            id: 'BTX06',
            name: 'THPT Bùi Thị Xuân',
            shortName: 'Bùi Thị Xuân',
            district: 'Quận 1',
            track: 'regular',
            trackLabel: 'Công lập đại trà',
            quota: 675,
            method: 'Thi tuyển 3 môn (Toán, Ngữ văn, Ngoại ngữ)',
            tuition: '120.000 đ / tháng',
            benchmark2025: '24.75',
            benchmark2024: '24.50',
            address: '73 Bùi Thị Xuân, Phường Phạm Ngũ Lão, Quận 1, TP. Hồ Chí Minh',
            phone: '(028) 3839 1456',
            website: 'thptbuithixuan.hcm.edu.vn',
            principal: 'ThS. Vũ Hoàng F',
            classes: [
                { name: 'Lớp Tự nhiên định hướng STEM', quota: 315, note: 'Đổi mới giáo dục số' },
                { name: 'Lớp Xã hội & Nghệ thuật', quota: 180, note: 'Tổ hợp Văn - Sử - Địa - Âm nhạc' },
                { name: 'Lớp Tăng cường Ngoại ngữ', quota: 180, note: 'Tăng cường tiếng Anh' }
            ],
            admissionCriteria: 'Xét tuyển theo tổng điểm thi 3 môn Toán, Văn, Ngoại ngữ.',
            policies: 'Học bổng Bùi Thị Xuân tài trợ cho học sinh có hoàn cảnh khó khăn vươn lên học giỏi.'
        },
        {
            id: 'MC07',
            name: 'THPT Marie Curie',
            shortName: 'Marie Curie',
            district: 'Quận 3',
            track: 'regular',
            trackLabel: 'Công lập & Song ngữ',
            quota: 1000,
            method: 'Thi tuyển 3 môn (Toán, Ngữ văn, Ngoại ngữ)',
            tuition: '120.000 đ / tháng',
            benchmark2025: '23.50',
            benchmark2024: '23.00',
            address: '159 Nam Kỳ Khởi Nghĩa, Phường 7, Quận 3, TP. Hồ Chí Minh',
            phone: '(028) 3930 6534',
            website: 'mariecurie.biz',
            principal: 'ThS. Nguyễn Thị G',
            classes: [
                { name: 'Lớp Công lập đại trà', quota: 700, note: 'Chương trình GDPT 2018' },
                { name: 'Lớp Song ngữ Tiếng Pháp', quota: 150, note: 'Theo đề án song ngữ' },
                { name: 'Lớp Ngoại ngữ 2 Tiếng Nhật', quota: 150, note: 'Tăng cường tiếng Nhật' }
            ],
            admissionCriteria: 'Xét tuyển theo nguyện vọng 1, 2, 3 bằng điểm thi 3 môn bắt buộc.',
            policies: 'Chính sách hỗ trợ học sinh có hoàn cảnh đặc biệt, con em các gia đình chính sách.'
        },
        {
            id: 'GD08',
            name: 'THPT Gia Định',
            shortName: 'Gia Định',
            district: 'Quận Bình Thạnh',
            track: 'hybrid',
            trackLabel: 'Chuyên & Đại trà',
            quota: 810,
            method: 'Thi 3 môn chung (hoặc thêm môn Chuyên)',
            tuition: '120.000 đ / tháng',
            benchmark2025: '24.50',
            benchmark2024: '24.00',
            address: '44 Ung Văn Khiêm, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh',
            phone: '(028) 3899 1086',
            website: 'giadinh.edu.vn',
            principal: 'ThS. Phạm Văn H',
            classes: [
                { name: 'Lớp Chuyên (Toán, Lý, Hóa, Tin, Anh)', quota: 210, note: 'Chương trình chuyên sâu' },
                { name: 'Lớp Đại trà KHTN', quota: 360, note: 'Khoa học tự nhiên' },
                { name: 'Lớp Đại trà KHXH', quota: 240, note: 'Khoa học xã hội' }
            ],
            admissionCriteria: 'Tuyển cả lớp chuyên và lớp thường theo phân bổ chỉ tiêu công bố.',
            policies: 'Chính sách khuyến học Gia Định, khen thưởng định kỳ học kỳ cho học sinh giỏi.'
        }
    ];

    // Trạng thái hệ thống (Hỗ trợ mô phỏng kiểm thử Exception Flow 2.1)
    let isPublished = true;
    let currentView = 'cards'; // 'cards' hoặc 'table'
    let currentKeyword = '';
    let currentDistrict = 'all';
    let currentTrack = 'all';
    let currentSort = 'default';

    // Helper DOM
    const $ = id => document.getElementById(id);
    const esc = str => String(str ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    // Khởi tạo các bộ lọc dropdown
    function initFilters() {
        // Danh sách Quận/Huyện duy nhất
        const districts = Array.from(new Set(admissionData.map(s => s.district))).sort();
        const districtSelect = $('filterDistrict');
        districtSelect.innerHTML = '<option value="all">Tất cả Quận / Huyện</option>' +
            districts.map(d => `<option value="${esc(d)}">${esc(d)}</option>`).join('');

        // Sự kiện bộ lọc
        districtSelect.addEventListener('change', () => {
            currentDistrict = districtSelect.value;
            applyFiltersAndRender();
        });

        $('filterTrack').addEventListener('change', e => {
            currentTrack = e.target.value;
            applyFiltersAndRender();
        });

        $('sortSelect').addEventListener('change', e => {
            currentSort = e.target.value;
            applyFiltersAndRender();
        });

        // Tìm kiếm nhanh (Alternative Flow 3.1)
        const searchInput = $('searchInput');
        const clearBtn = $('clearSearchBtn');

        searchInput.addEventListener('input', e => {
            currentKeyword = e.target.value.trim();
            clearBtn.style.display = currentKeyword ? 'block' : 'none';
            applyFiltersAndRender();
        });

        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            currentKeyword = '';
            clearBtn.style.display = 'none';
            searchInput.focus();
            applyFiltersAndRender();
        });

        // Chuyển đổi chế độ xem (Cards / Table)
        $('viewCardsBtn').addEventListener('click', () => {
            currentView = 'cards';
            $('viewCardsBtn').classList.add('active');
            $('viewTableBtn').classList.remove('active');
            $('schoolGridContainer').style.display = 'grid';
            $('schoolTableContainer').style.display = 'none';
        });

        $('viewTableBtn').addEventListener('click', () => {
            currentView = 'table';
            $('viewTableBtn').classList.add('active');
            $('viewCardsBtn').classList.remove('active');
            $('schoolGridContainer').style.display = 'none';
            $('schoolTableContainer').style.display = 'block';
        });

        // Nút mô phỏng Exception Flow 2.1 (Chưa công bố thông tin tuyển sinh)
        $('togglePublishedBtn').addEventListener('click', () => {
            isPublished = !isPublished;
            renderPublishState();
        });
    }

    // Hiển thị trạng thái Công bố / Chưa công bố
    function renderPublishState() {
        const toggleBtn = $('togglePublishedBtn');
        const publishedContent = $('publishedContent');
        const unpublishedContent = $('unpublishedContent');

        if (!isPublished) {
            // Exception Flow 2.1
            toggleBtn.textContent = 'Mô phỏng: Chuyển sang "Đã công bố"';
            toggleBtn.style.background = '#e7f8f0';
            toggleBtn.style.color = '#159465';
            publishedContent.style.display = 'none';
            unpublishedContent.style.display = 'block';
        } else {
            toggleBtn.textContent = 'Mô phỏng: Chuyển sang "Chưa công bố" (Test ca 2.1)';
            toggleBtn.style.background = '#ffffff';
            toggleBtn.style.color = '#252b36';
            publishedContent.style.display = 'block';
            unpublishedContent.style.display = 'none';
            applyFiltersAndRender();
        }
    }

    // Lọc và sắp xếp danh sách
    function filterSchools() {
        return admissionData.filter(school => {
            // Lọc theo từ khóa: tên trường, mã trường, quận/huyện
            if (currentKeyword) {
                const kw = currentKeyword.toLowerCase();
                const matchName = school.name.toLowerCase().includes(kw);
                const matchShort = school.shortName.toLowerCase().includes(kw);
                const matchId = school.id.toLowerCase().includes(kw);
                const matchDistrict = school.district.toLowerCase().includes(kw);
                if (!matchName && !matchShort && !matchId && !matchDistrict) {
                    return false;
                }
            }

            // Lọc theo Quận/Huyện
            if (currentDistrict !== 'all' && school.district !== currentDistrict) {
                return false;
            }

            // Lọc theo Hệ đào tạo
            if (currentTrack !== 'all' && school.track !== currentTrack) {
                return false;
            }

            return true;
        }).sort((a, b) => {
            if (currentSort === 'quotaDesc') return b.quota - a.quota;
            if (currentSort === 'quotaAsc') return a.quota - b.quota;
            if (currentSort === 'benchmarkDesc') return parseFloat(b.benchmark2025) - parseFloat(a.benchmark2025);
            if (currentSort === 'nameAsc') return a.name.localeCompare(b.name, 'vi');
            return 0;
        });
    }

    // Badge định dạng hệ đào tạo
    function getTrackBadge(track, label) {
        let badgeClass = 'blue';
        if (track === 'specialized') badgeClass = 'orange';
        if (track === 'advanced') badgeClass = 'green';
        return `<span class="pill ${badgeClass}">${esc(label)}</span>`;
    }

    // Render danh sách trường và xử lý Exception Flow 3.1
    function applyFiltersAndRender() {
        if (!isPublished) return;

        const filtered = filterSchools();
        const totalQuota = filtered.reduce((sum, s) => sum + s.quota, 0);

        // Cập nhật thanh kết quả
        $('resultsCountText').innerHTML = `Tìm thấy <strong>${filtered.length}</strong> trường phù hợp (Tổng chỉ tiêu: <strong>${totalQuota.toLocaleString('vi-VN')}</strong>)`;

        // Hiển thị tags lọc đang áp dụng
        const tagBox = $('activeFilterTags');
        tagBox.innerHTML = '';
        if (currentKeyword) {
            tagBox.innerHTML += `<span class="filter-tag">Từ khóa: "${esc(currentKeyword)}" <button type="button" id="removeTagKeyword">✕</button></span>`;
        }
        if (currentDistrict !== 'all') {
            tagBox.innerHTML += `<span class="filter-tag">Khu vực: ${esc(currentDistrict)} <button type="button" id="removeTagDistrict">✕</button></span>`;
        }
        if (currentTrack !== 'all') {
            const trackOption = $('filterTrack').selectedOptions[0];
            tagBox.innerHTML += `<span class="filter-tag">Hệ: ${esc(trackOption ? trackOption.text : currentTrack)} <button type="button" id="removeTagTrack">✕</button></span>`;
        }

        // Bắt sự kiện xóa từng tag lọc
        if ($('removeTagKeyword')) {
            $('removeTagKeyword').onclick = () => {
                $('searchInput').value = '';
                currentKeyword = '';
                $('clearSearchBtn').style.display = 'none';
                applyFiltersAndRender();
            };
        }
        if ($('removeTagDistrict')) {
            $('removeTagDistrict').onclick = () => {
                $('filterDistrict').value = 'all';
                currentDistrict = 'all';
                applyFiltersAndRender();
            };
        }
        if ($('removeTagTrack')) {
            $('removeTagTrack').onclick = () => {
                $('filterTrack').value = 'all';
                currentTrack = 'all';
                applyFiltersAndRender();
            };
        }

        const gridContainer = $('schoolGridContainer');
        const tableBody = $('schoolTableBody');
        const emptyState = $('emptyStateBox');
        const searchKeywordHighlight = $('searchKeywordHighlight');

        // Kiểm tra Exception Flow 3.1: Không tìm thấy kết quả
        if (filtered.length === 0) {
            gridContainer.style.display = 'none';
            $('schoolTableContainer').style.display = 'none';
            emptyState.style.display = 'block';
            searchKeywordHighlight.textContent = currentKeyword ? `"${currentKeyword}"` : 'tiêu chí đã chọn';
            return;
        }

        // Có kết quả -> Ẩn empty state và hiển thị container theo chế độ
        emptyState.style.display = 'none';
        if (currentView === 'cards') {
            gridContainer.style.display = 'grid';
            $('schoolTableContainer').style.display = 'none';
        } else {
            gridContainer.style.display = 'none';
            $('schoolTableContainer').style.display = 'block';
        }

        // Render Dạng Card (Grid)
        gridContainer.innerHTML = filtered.map(school => `
            <article class="school-card" data-school-id="${esc(school.id)}">
                <div>
                    <div class="school-card-header">
                        <div class="school-badge-code" title="Mã trường: ${esc(school.id)}">${esc(school.id)}</div>
                        <div class="school-title-wrap">
                            <h3 class="school-card-title" title="${esc(school.name)}">${esc(school.name)}</h3>
                            <div class="school-meta-tags">
                                <span class="pill">${esc(school.district)}</span>
                                ${getTrackBadge(school.track, school.trackLabel)}
                            </div>
                        </div>
                    </div>

                    <dl class="school-info-list">
                        <div class="info-item">
                            <dt>Chỉ tiêu lớp 10</dt>
                            <dd class="highlight">${school.quota} học sinh</dd>
                        </div>
                        <div class="info-item">
                            <dt>Điểm chuẩn 2025</dt>
                            <dd>${esc(school.benchmark2025)} điểm</dd>
                        </div>
                        <div class="info-item">
                            <dt>Phương thức</dt>
                            <dd title="${esc(school.method)}" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${esc(school.method)}</dd>
                        </div>
                        <div class="info-item">
                            <dt>Học phí tham khảo</dt>
                            <dd>${esc(school.tuition)}</dd>
                        </div>
                    </dl>

                    <div class="school-address-text" title="${esc(school.address)}">
                        📍 ${esc(school.address)}
                    </div>
                </div>

                <div class="school-card-actions">
                    <button type="button" class="school-detail-btn" data-action="view-detail" data-id="${esc(school.id)}">
                        <span>Xem chi tiết tuyển sinh</span>
                        <span aria-hidden="true">→</span>
                    </button>
                </div>
            </article>
        `).join('');

        // Render Dạng Bảng (Table)
        tableBody.innerHTML = filtered.map(school => `
            <tr>
                <td><strong>${esc(school.id)}</strong></td>
                <td>
                    <strong>${esc(school.name)}</strong>
                    <small>📍 ${esc(school.district)} • ${esc(school.phone)}</small>
                </td>
                <td>${getTrackBadge(school.track, school.trackLabel)}</td>
                <td><strong style="color: #1769e0; font-size: 14px;">${school.quota}</strong></td>
                <td>${esc(school.method)}</td>
                <td><strong>${esc(school.benchmark2025)}</strong></td>
                <td>${esc(school.tuition)}</td>
                <td>
                    <button type="button" class="text-button" data-action="view-detail" data-id="${esc(school.id)}">
                        Chi tiết →
                    </button>
                </td>
            </tr>
        `).join('');

        // Gắn sự kiện xem chi tiết cho tất cả các thẻ và nút (Basic Flow 4 & 5)
        document.querySelectorAll('.school-card').forEach(card => {
            card.style.cursor = 'pointer';
            card.onclick = () => {
                const schoolId = card.dataset.schoolId;
                showSchoolDetails(schoolId);
            };
        });

        tableBody.querySelectorAll('tr').forEach(row => {
            row.style.cursor = 'pointer';
            row.onclick = () => {
                const btn = row.querySelector('[data-action="view-detail"]');
                if (btn) showSchoolDetails(btn.dataset.id);
            };
        });

        document.querySelectorAll('[data-action="view-detail"]').forEach(button => {
            button.onclick = (e) => {
                e.stopPropagation();
                const schoolId = button.dataset.id;
                showSchoolDetails(schoolId);
            };
        });
    }

    // Modal xem chi tiết thông tin tuyển sinh (Basic Flow 4 & 5)
    function showSchoolDetails(schoolId) {
        const school = admissionData.find(s => s.id === schoolId);
        if (!school) return;

        $('modalSchoolName').textContent = school.name;
        $('modalSchoolSubtitle').textContent = `Mã trường: ${school.id} • ${school.district} • ${school.trackLabel}`;

        // Thông tin chung
        $('modalAddress').textContent = school.address;
        $('modalPhone').textContent = school.phone;
        $('modalWebsite').innerHTML = `<a href="https://${school.website}" target="_blank" rel="noopener noreferrer" style="color:#1769e0;">${school.website} ↗</a>`;
        $('modalPrincipal').textContent = school.principal;
        $('modalTotalQuota').textContent = `${school.quota} chỉ tiêu`;
        $('modalTuition').textContent = school.tuition;
        $('modalMethod').textContent = school.method;
        $('modalCriteria').textContent = school.admissionCriteria;
        $('modalPolicies').textContent = school.policies;
        $('modalBenchmark').textContent = `Năm 2025: ${school.benchmark2025} điểm | Năm 2024: ${school.benchmark2024} điểm`;

        // Danh sách phân bổ chỉ tiêu từng lớp
        const quotaTableBody = $('modalQuotaTableBody');
        quotaTableBody.innerHTML = school.classes.map(c => `
            <tr>
                <td><strong>${esc(c.name)}</strong></td>
                <td><strong style="color:#1769e0;">${c.quota}</strong> chỉ tiêu</td>
                <td><span class="muted">${esc(c.note)}</span></td>
            </tr>
        `).join('');

        const dialog = $('schoolDetailModal');
        dialog.showModal();
        $('modalCloseBtn').focus();
    }

    // Khởi chạy khi DOM sẵn sàng
    function init() {
        const page = document.querySelector('[data-page="xem-thong-tin-tuyen-sinh"]');
        if (!page) return;

        initFilters();

        // Xử lý nút xóa trong Exception Flow 3.1
        $('resetSearchBtn').addEventListener('click', () => {
            $('searchInput').value = '';
            currentKeyword = '';
            $('filterDistrict').value = 'all';
            currentDistrict = 'all';
            $('filterTrack').value = 'all';
            currentTrack = 'all';
            $('clearSearchBtn').style.display = 'none';
            applyFiltersAndRender();
        });

        // Xử lý đóng modal
        const dialog = $('schoolDetailModal');
        $('modalCloseBtn').onclick = () => dialog.close();
        $('modalFooterCloseBtn').onclick = () => dialog.close();
        dialog.addEventListener('click', e => {
            if (e.target === dialog) dialog.close();
        });

        renderPublishState();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

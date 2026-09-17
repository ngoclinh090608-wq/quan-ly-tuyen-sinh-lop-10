/**
 * Chức năng: Quản lý nguyện vọng xét tuyển lớp 10 (Use Case 2)
 * Tác nhân: Học sinh (Nguyễn Minh Anh • SBD: 100001)
 *
 * Tuân thủ Use Case:
 * - Basic Flow (1-7): Xem danh sách, sửa thông tin, kiểm tra tính hợp lệ, lưu cập nhật thành công.
 * - Alternative Flow 3.1: Thêm nguyện vọng mới (tối đa 3 NV thường, 2 NV chuyên).
 * - Alternative Flow 5.1: Xóa nguyện vọng (xác nhận, xóa, tự động cập nhật lại thứ tự NV1, NV2, NV3).
 * - Alternative Flow 5.2: Hủy thao tác (khôi phục dữ liệu đã lưu).
 * - Exception Flow 4.1: Báo lỗi mã trường THPT không tồn tại.
 * - Exception Flow 4.2: Báo lỗi trùng lặp mã trường hoặc sai quy định.
 */
(() => {
    'use strict';

    // Danh mục các trường THPT trong hệ thống
    const schoolCatalog = [
        { id: 'NT01', name: 'THPT Nguyễn Trãi', district: 'Quận 4', benchmark: '23.75', hasSpecialized: false },
        { id: 'LQD02', name: 'THPT Lê Quý Đôn', district: 'Quận 3', benchmark: '25.50', hasSpecialized: false },
        { id: 'TP03', name: 'THPT Trần Phú', district: 'Quận Tân Phú', benchmark: '24.25', hasSpecialized: false },
        { id: 'LHP00', name: 'THPT Chuyên Lê Hồng Phong', district: 'Quận 5', benchmark: '36.50', hasSpecialized: true, subjects: ['Toán', 'Tin học', 'Vật lý', 'Hóa học', 'Sinh học', 'Ngữ văn', 'Tiếng Anh', 'Tiếng Pháp', 'Tiếng Trung', 'Tiếng Nhật'] },
        { id: 'NTH05', name: 'THPT Nguyễn Thượng Hiền', district: 'Quận Tân Bình', benchmark: '25.75', hasSpecialized: true, subjects: ['Toán', 'Vật lý', 'Hóa học', 'Ngữ văn', 'Tiếng Anh'] },
        { id: 'BTX06', name: 'THPT Bùi Thị Xuân', district: 'Quận 1', benchmark: '24.75', hasSpecialized: false },
        { id: 'MC07', name: 'THPT Marie Curie', district: 'Quận 3', benchmark: '23.50', hasSpecialized: false },
        { id: 'GD08', name: 'THPT Gia Định', district: 'Quận Bình Thạnh', benchmark: '24.50', hasSpecialized: true, subjects: ['Toán', 'Tin học', 'Vật lý', 'Hóa học', 'Tiếng Anh'] }
    ];

    const storageKey = 'tuyensinh10.wishes.100001';
    const mainWorkflowKey = 'tuyensinh10.workflow.v1';

    // Dữ liệu ban đầu mặc định của thí sinh Nguyễn Minh Anh
    const defaultData = {
        studentId: '100001',
        studentName: 'Nguyễn Minh Anh',
        regularWishes: [
            { id: 'NT01' },
            { id: 'LQD02' },
            { id: 'TP03' }
        ],
        hasSpecialized: false,
        specializedWishes: [],
        lastUpdated: new Date().toISOString()
    };

    // State hiện tại
    let currentData = clone(defaultData);
    let initialSnapshot = clone(defaultData);
    let isExpired = false; // Trạng thái mô phỏng hết hạn

    // Helper functions
    function $(id) { return document.getElementById(id); }
    function clone(obj) { return JSON.parse(JSON.stringify(obj)); }
    function esc(str) {
        return String(str ?? '').replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    // Tải dữ liệu từ LocalStorage
    function loadData() {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed.regularWishes)) {
                    currentData = parsed;
                    initialSnapshot = clone(parsed);
                    return;
                }
            }
        } catch (_) {}

        // Nếu chưa có trong storage riêng, thử đồng bộ từ workflow.v1
        try {
            const workflowSaved = localStorage.getItem(mainWorkflowKey);
            if (workflowSaved) {
                const wf = JSON.parse(workflowSaved);
                const candidate = wf.admission?.candidates?.find(c => c.id === '100001');
                if (candidate && Array.isArray(candidate.wishes)) {
                    // Map mã cũ A, B, C sang NT01, LQD02, TP03
                    const codeMap = { 'A': 'NT01', 'B': 'LQD02', 'C': 'TP03' };
                    currentData.regularWishes = candidate.wishes.map(w => ({ id: codeMap[w] || w }));
                    initialSnapshot = clone(currentData);
                    return;
                }
            }
        } catch (_) {}

        currentData = clone(defaultData);
        initialSnapshot = clone(defaultData);
    }

    // Lưu dữ liệu vào LocalStorage
    function saveData() {
        try {
            currentData.lastUpdated = new Date().toISOString();
            localStorage.setItem(storageKey, JSON.stringify(currentData));

            // Đồng bộ sang candidate.wishes trong tuyensinh10.workflow.v1 để luồng xét tuyển đồng bộ
            const workflowSaved = localStorage.getItem(mainWorkflowKey);
            if (workflowSaved) {
                const wf = JSON.parse(workflowSaved);
                const candidate = wf.admission?.candidates?.find(c => c.id === '100001');
                if (candidate) {
                    const reverseMap = { 'NT01': 'A', 'LQD02': 'B', 'TP03': 'C' };
                    candidate.wishes = currentData.regularWishes.map(w => reverseMap[w.id] || w.id);
                    localStorage.setItem(mainWorkflowKey, JSON.stringify(wf));
                }
            }

            initialSnapshot = clone(currentData);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    // Hiển thị thông báo trạng thái trang
    function showMessage(text, type = 'success') {
        const box = $('pageAlert');
        box.hidden = false;
        box.className = 'wf-alert ' + type;
        box.textContent = text;
        box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    function clearMessage() {
        const box = $('pageAlert');
        box.hidden = true;
        box.textContent = '';
    }

    // Modal Dialog trợ giúp
    function openConfirmDialog(title, contentHtml, onConfirm) {
        const dialog = $('actionConfirmModal');
        $('dialogTitle').textContent = title;
        $('dialogBody').innerHTML = contentHtml;

        const confirmBtn = $('dialogConfirmBtn');
        const cancelBtn = $('dialogCancelBtn');

        const handleConfirm = () => {
            dialog.close();
            cleanup();
            if (onConfirm) onConfirm();
        };

        const handleCancel = () => {
            dialog.close();
            cleanup();
        };

        function cleanup() {
            confirmBtn.removeEventListener('click', handleConfirm);
            cancelBtn.removeEventListener('click', handleCancel);
        }

        confirmBtn.addEventListener('click', handleConfirm);
        cancelBtn.addEventListener('click', handleCancel);

        dialog.showModal();
        confirmBtn.focus();
    }

    // Render danh sách nguyện vọng thường
    function renderRegularWishes() {
        const container = $('regularWishList');
        const count = currentData.regularWishes.length;

        $('regularWishCount').textContent = `${count} / 3 nguyện vọng`;
        $('addRegularWishBtn').disabled = count >= 3 || isExpired;

        if (count === 0) {
            container.innerHTML = `
                <div class="empty" style="background:#fafbfe; border: 1px dashed #cbd5e1; border-radius: 8px;">
                    Chưa có nguyện vọng thường nào được thêm. Hãy bấm <strong>"+ Thêm nguyện vọng thường"</strong> để bắt đầu.
                </div>
            `;
            return;
        }

        container.innerHTML = currentData.regularWishes.map((wish, index) => {
            const orderNum = index + 1;
            const badgeClass = `nv${orderNum}`;
            const school = schoolCatalog.find(s => s.id === wish.id);
            const isInvalidSchool = wish.id && !school;

            return `
                <div class="wish-item-card ${isInvalidSchool ? 'has-error' : ''}" data-index="${index}">
                    <!-- Cột 1: Thứ tự ưu tiên -->
                    <div>
                        <span class="order-badge ${badgeClass}">NV ${orderNum}</span>
                    </div>

                    <!-- Cột 2: Nhập mã trường (Exception Flow 4.1) -->
                    <div class="wish-code-input-wrap">
                        <input type="text"
                               class="wish-code-input"
                               placeholder="MÃ TRƯỜNG"
                               maxlength="10"
                               value="${esc(wish.id)}"
                               data-role="code-input"
                               data-index="${index}"
                               title="Nhập mã trường (ví dụ: NT01, LQD02...)"
                               ${isExpired ? 'disabled' : ''}>
                    </div>

                    <!-- Cột 3: Tên trường và Dropdown chọn nhanh -->
                    <div class="wish-school-info">
                        <select class="wish-school-select" data-role="school-select" data-index="${index}" ${isExpired ? 'disabled' : ''}>
                            <option value="">-- Chọn trường THPT --</option>
                            ${schoolCatalog.map(s => `
                                <option value="${s.id}" ${s.id === wish.id ? 'selected' : ''}>
                                    ${s.id} - ${s.name} (${s.district})
                                </option>
                            `).join('')}
                        </select>
                        <div class="wish-school-meta">
                            ${school ? `📍 ${school.district} • Điểm chuẩn 2025: <strong>${school.benchmark}</strong>` : '<span style="color:#ef4444;">Vui lòng nhập hoặc chọn trường THPT hợp lệ</span>'}
                        </div>
                    </div>

                    <!-- Cột 4: Điểm chuẩn tham khảo -->
                    <div class="wish-benchmark-cell">
                        <span>Điểm chuẩn</span>
                        <strong>${school ? school.benchmark : '—'}</strong>
                    </div>

                    <!-- Cột 5: Nút chuyển thứ tự và Xóa (Alternative Flow 5.1) -->
                    <div class="wish-actions-cell">
                        <button type="button"
                                class="icon-btn"
                                title="Đẩy lên trên"
                                data-action="move-up"
                                data-index="${index}"
                                ${index === 0 || isExpired ? 'disabled' : ''}>
                            ▲
                        </button>
                        <button type="button"
                                class="icon-btn"
                                title="Đẩy xuống dưới"
                                data-action="move-down"
                                data-index="${index}"
                                ${index === count - 1 || isExpired ? 'disabled' : ''}>
                            ▼
                        </button>
                        <button type="button"
                                class="icon-btn danger"
                                title="Xóa nguyện vọng này"
                                data-action="delete"
                                data-index="${index}"
                                ${isExpired ? 'disabled' : ''}>
                            ✕
                        </button>
                    </div>

                    <!-- Thông báo lỗi cục bộ của hàng nếu mã sai -->
                    <div class="wish-error-msg" id="errorMsg-${index}"></div>
                </div>
            `;
        }).join('');

        attachRegularWishEvents();
    }

    // Gắn sự kiện cho các hàng nguyện vọng thường
    function attachRegularWishEvents() {
        const container = $('regularWishList');

        // Bắt sự kiện gõ mã trường trực tiếp (Exception Flow 4.1)
        container.querySelectorAll('[data-role="code-input"]').forEach(input => {
            input.addEventListener('change', e => {
                const idx = parseInt(e.target.dataset.index, 10);
                const rawVal = e.target.value.trim().toUpperCase();
                currentData.regularWishes[idx].id = rawVal;
                renderRegularWishes();
                validateAllWishes(false);
            });
        });

        // Bắt sự kiện chọn từ dropdown
        container.querySelectorAll('[data-role="school-select"]').forEach(select => {
            select.addEventListener('change', e => {
                const idx = parseInt(e.target.dataset.index, 10);
                currentData.regularWishes[idx].id = e.target.value;
                renderRegularWishes();
                validateAllWishes(false);
            });
        });

        // Di chuyển thứ tự ưu tiên (Lên)
        container.querySelectorAll('[data-action="move-up"]').forEach(btn => {
            btn.onclick = () => {
                const idx = parseInt(btn.dataset.index, 10);
                if (idx > 0) {
                    const temp = currentData.regularWishes[idx];
                    currentData.regularWishes[idx] = currentData.regularWishes[idx - 1];
                    currentData.regularWishes[idx - 1] = temp;
                    renderRegularWishes();
                    validateAllWishes(false);
                }
            };
        });

        // Di chuyển thứ tự ưu tiên (Xuống)
        container.querySelectorAll('[data-action="move-down"]').forEach(btn => {
            btn.onclick = () => {
                const idx = parseInt(btn.dataset.index, 10);
                if (idx < currentData.regularWishes.length - 1) {
                    const temp = currentData.regularWishes[idx];
                    currentData.regularWishes[idx] = currentData.regularWishes[idx + 1];
                    currentData.regularWishes[idx + 1] = temp;
                    renderRegularWishes();
                    validateAllWishes(false);
                }
            };
        });

        // Xóa nguyện vọng (Alternative Flow 5.1)
        container.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.onclick = () => {
                const idx = parseInt(btn.dataset.index, 10);
                const wish = currentData.regularWishes[idx];
                const school = schoolCatalog.find(s => s.id === wish.id);
                const schoolName = school ? school.name : (wish.id || 'chưa chọn trường');

                openConfirmDialog(
                    'Xác nhận xóa nguyện vọng',
                    `<p>Bạn có chắc chắn muốn xóa <strong>Nguyện vọng ${idx + 1}</strong> (${esc(schoolName)}) không?</p>
                     <p class="hint">Hệ thống sẽ tự động cập nhật lại thứ tự các nguyện vọng phía sau.</p>`,
                    () => {
                        // Xóa phần tử và tự động dồn thứ tự (Alternative Flow 5.1)
                        currentData.regularWishes.splice(idx, 1);
                        renderRegularWishes();
                        validateAllWishes(false);
                        showMessage(`Đã xóa Nguyện vọng ${idx + 1}. Thứ tự các nguyện vọng đã được tự động cập nhật lại.`, 'success');
                    }
                );
            };
        });
    }

    // Render danh sách nguyện vọng chuyên
    function renderSpecializedWishes() {
        const wrap = $('specializedSection');
        const checkbox = $('enableSpecializedCheckbox');
        checkbox.checked = currentData.hasSpecialized;

        if (!currentData.hasSpecialized) {
            wrap.style.display = 'none';
            return;
        }

        wrap.style.display = 'block';
        const listContainer = $('specializedWishList');
        const count = currentData.specializedWishes.length;

        $('specializedWishCount').textContent = `${count} / 2 nguyện vọng chuyên`;
        $('addSpecializedWishBtn').disabled = count >= 2 || isExpired;

        const specializedSchools = schoolCatalog.filter(s => s.hasSpecialized);

        if (count === 0) {
            listContainer.innerHTML = `
                <div class="empty" style="background:#fafbfe; border: 1px dashed #cbd5e1; border-radius: 8px;">
                    Chưa có nguyện vọng chuyên nào. Hãy bấm <strong>"+ Thêm nguyện vọng chuyên"</strong> (Tối đa 2 NV).
                </div>
            `;
            return;
        }

        listContainer.innerHTML = currentData.specializedWishes.map((wish, index) => {
            const orderNum = index + 1;
            const school = specializedSchools.find(s => s.id === wish.id);
            const subjects = school ? school.subjects : [];

            return `
                <div class="wish-item-card" data-specialized-index="${index}">
                    <div>
                        <span class="order-badge nvc">NVC ${orderNum}</span>
                    </div>

                    <div style="grid-column: span 2;">
                        <select class="wish-school-select" data-role="specialized-school" data-index="${index}" ${isExpired ? 'disabled' : ''}>
                            <option value="">-- Chọn trường THPT Chuyên --</option>
                            ${specializedSchools.map(s => `
                                <option value="${s.id}" ${s.id === wish.id ? 'selected' : ''}>
                                    ${s.id} - ${s.name} (${s.district})
                                </option>
                            `).join('')}
                        </select>
                    </div>

                    <div>
                        <select class="wish-school-select" data-role="specialized-subject" data-index="${index}" ${!school || isExpired ? 'disabled' : ''}>
                            <option value="">-- Chọn môn chuyên --</option>
                            ${subjects.map(sub => `
                                <option value="${sub}" ${sub === wish.subject ? 'selected' : ''}>${sub}</option>
                            `).join('')}
                        </select>
                    </div>

                    <div class="wish-actions-cell">
                        <button type="button"
                                class="icon-btn danger"
                                title="Xóa nguyện vọng chuyên này"
                                data-action="delete-specialized"
                                data-index="${index}"
                                ${isExpired ? 'disabled' : ''}>
                            ✕
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        attachSpecializedEvents();
    }

    function attachSpecializedEvents() {
        const listContainer = $('specializedWishList');

        listContainer.querySelectorAll('[data-role="specialized-school"]').forEach(select => {
            select.addEventListener('change', e => {
                const idx = parseInt(e.target.dataset.index, 10);
                currentData.specializedWishes[idx].id = e.target.value;
                currentData.specializedWishes[idx].subject = ''; // Reset môn khi đổi trường
                renderSpecializedWishes();
                validateAllWishes(false);
            });
        });

        listContainer.querySelectorAll('[data-role="specialized-subject"]').forEach(select => {
            select.addEventListener('change', e => {
                const idx = parseInt(e.target.dataset.index, 10);
                currentData.specializedWishes[idx].subject = e.target.value;
                validateAllWishes(false);
            });
        });

        listContainer.querySelectorAll('[data-action="delete-specialized"]').forEach(btn => {
            btn.onclick = () => {
                const idx = parseInt(btn.dataset.index, 10);
                openConfirmDialog(
                    'Xác nhận xóa nguyện vọng chuyên',
                    `<p>Bạn có chắc muốn xóa <strong>Nguyện vọng Chuyên ${idx + 1}</strong> không?</p>`,
                    () => {
                        currentData.specializedWishes.splice(idx, 1);
                        renderSpecializedWishes();
                        validateAllWishes(false);
                        showMessage(`Đã xóa Nguyện vọng Chuyên ${idx + 1}.`, 'success');
                    }
                );
            };
        });
    }

    // Kiểm tra tính hợp lệ toàn bộ nguyện vọng (Exception Flows 4.1 & 4.2)
    function validateAllWishes(showInlineErrors = true) {
        let isValid = true;
        const errors = [];

        // 1. Kiểm tra số lượng nguyện vọng thường
        if (currentData.regularWishes.length === 0) {
            errors.push('Học sinh phải đăng ký ít nhất 1 nguyện vọng thường vào trường THPT công lập.');
            isValid = false;
        }

        // 2. Kiểm tra mã trường không tồn tại (Exception Flow 4.1) & Chưa chọn trường
        currentData.regularWishes.forEach((w, i) => {
            const errorElement = $(`errorMsg-${i}`);
            let rowError = '';

            if (!w.id) {
                rowError = `Nguyện vọng ${i + 1}: Chưa nhập mã hoặc chưa chọn trường THPT.`;
                errors.push(rowError);
                isValid = false;
            } else {
                const found = schoolCatalog.find(s => s.id === w.id);
                if (!found) {
                    rowError = `Mã trường "${w.id}" không tồn tại. Vui lòng kiểm tra lại. (Exception Flow 4.1)`;
                    errors.push(`Nguyện vọng ${i + 1}: Mã trường THPT không tồn tại.`);
                    isValid = false;
                }
            }

            if (errorElement && showInlineErrors) {
                if (rowError) {
                    errorElement.textContent = rowError;
                    errorElement.style.display = 'block';
                } else {
                    errorElement.style.display = 'none';
                }
            }
        });

        // 3. Kiểm tra trùng lặp mã trường trong nguyện vọng thường (Exception Flow 4.2)
        const chosenIds = currentData.regularWishes.map(w => w.id).filter(Boolean);
        const duplicateIds = chosenIds.filter((id, index) => chosenIds.indexOf(id) !== index);

        if (duplicateIds.length > 0) {
            const dupNames = Array.from(new Set(duplicateIds)).map(id => {
                const s = schoolCatalog.find(item => item.id === id);
                return s ? `${s.name} (${id})` : id;
            }).join(', ');
            errors.push(`Trùng lặp trường THPT: ${dupNames}. Theo quy định Sở GD&ĐT, các nguyện vọng thường không được chọn cùng một trường.`);
            isValid = false;
        }

        // 4. Kiểm tra nguyện vọng chuyên nếu được kích hoạt
        if (currentData.hasSpecialized) {
            if (currentData.specializedWishes.length === 0) {
                errors.push('Bạn đã chọn đăng ký thi Chuyên nhưng chưa thêm nguyện vọng chuyên nào.');
                isValid = false;
            }

            currentData.specializedWishes.forEach((w, i) => {
                if (!w.id || !w.subject) {
                    errors.push(`Nguyện vọng Chuyên ${i + 1}: Vui lòng chọn đầy đủ trường chuyên và môn chuyên.`);
                    isValid = false;
                }
            });

            // Kiểm tra trùng lặp chuyên (cùng trường và cùng môn)
            const specPairs = currentData.specializedWishes.map(w => `${w.id}_${w.subject}`).filter(p => !p.includes('_'));
            const dupSpecs = specPairs.filter((p, index) => specPairs.indexOf(p) !== index);
            if (dupSpecs.length > 0) {
                errors.push('Nguyện vọng chuyên bị trùng lặp môn chuyên ở cùng một trường.');
                isValid = false;
            }
        }

        // Cập nhật khung tổng hợp lỗi
        const summaryBox = $('validationSummaryBox');
        if (!isValid && showInlineErrors) {
            summaryBox.hidden = false;
            summaryBox.className = 'wf-alert error';
            summaryBox.innerHTML = `<strong>⚠️ Phát hiện sai sót cần điều chỉnh:</strong><ul style="margin: 6px 0 0 18px; line-height: 1.5;">${errors.map(e => `<li>${esc(e)}</li>`).join('')}</ul>`;
        } else if (isValid) {
            summaryBox.hidden = true;
            summaryBox.innerHTML = '';
        }

        return { isValid, errors };
    }

    // Khởi tạo và liên kết các sự kiện chính
    function init() {
        const page = document.querySelector('[data-page="quan-ly-nguyen-vong"]');
        if (!page) return;

        loadData();
        renderRegularWishes();
        renderSpecializedWishes();

        // Nút thêm nguyện vọng thường (Alternative Flow 3.1)
        $('addRegularWishBtn').addEventListener('click', () => {
            if (isExpired) return;
            if (currentData.regularWishes.length >= 3) {
                showMessage('Đã đạt số lượng tối đa 3 nguyện vọng thường theo quy định của Sở GD&ĐT.', 'warning');
                return;
            }
            // Thêm một hàng mới chưa chọn trường
            currentData.regularWishes.push({ id: '' });
            renderRegularWishes();
            showMessage(`Đã thêm Nguyện vọng ${currentData.regularWishes.length}. Vui lòng nhập mã hoặc chọn trường THPT.`, 'success');
        });

        // Checkbox bật/tắt thi chuyên
        $('enableSpecializedCheckbox').addEventListener('change', e => {
            if (isExpired) return;
            currentData.hasSpecialized = e.target.checked;
            if (currentData.hasSpecialized && currentData.specializedWishes.length === 0) {
                currentData.specializedWishes.push({ id: 'LHP00', subject: 'Toán' });
            }
            renderSpecializedWishes();
            validateAllWishes(false);
        });

        // Nút thêm nguyện vọng chuyên (Alternative Flow 3.1)
        $('addSpecializedWishBtn').addEventListener('click', () => {
            if (isExpired) return;
            if (currentData.specializedWishes.length >= 2) {
                showMessage('Đã đạt số lượng tối đa 2 nguyện vọng chuyên theo quy định.', 'warning');
                return;
            }
            currentData.specializedWishes.push({ id: '', subject: '' });
            renderSpecializedWishes();
        });

        // Nút Hủy thao tác / Nhập lại (Alternative Flow 5.2)
        $('cancelChangesBtn').addEventListener('click', () => {
            if (isExpired) return;
            openConfirmDialog(
                'Hủy thay đổi & Khôi phục ban đầu',
                `<p>Bạn có chắc chắn muốn hủy tất cả các điều chỉnh chưa lưu và khôi phục lại danh sách nguyện vọng ban đầu không?</p>`,
                () => {
                    currentData = clone(initialSnapshot);
                    renderRegularWishes();
                    renderSpecializedWishes();
                    validateAllWishes(false);
                    showMessage('Đã hủy bỏ thay đổi. Danh sách nguyện vọng đã được khôi phục về trạng thái đã lưu trước đó.', 'success');
                }
            );
        });

        // Nút Lưu nguyện vọng (Basic Flow 5 & 6)
        $('saveWishesBtn').addEventListener('click', () => {
            if (isExpired) {
                showMessage('Hệ thống đã hết thời hạn điều chỉnh. Không thể lưu thay đổi.', 'error');
                return;
            }

            const { isValid } = validateAllWishes(true);
            if (!isValid) {
                showMessage('Vui lòng sửa các lỗi được thông báo trước khi lưu nguyện vọng.', 'error');
                return;
            }

            // Tạo danh sách tóm tắt để học sinh kiểm tra lần cuối
            const regularSummary = currentData.regularWishes.map((w, i) => {
                const s = schoolCatalog.find(item => item.id === w.id);
                return `<li><span><strong>NV${i + 1}:</strong> ${esc(s ? s.name : w.id)}</span> <span>Mã: ${esc(w.id)}</span></li>`;
            }).join('');

            let specializedSummary = '';
            if (currentData.hasSpecialized && currentData.specializedWishes.length > 0) {
                specializedSummary = `
                    <p style="margin-top: 12px; font-weight: 700; color: #059669;">Nguyện vọng lớp 10 Chuyên:</p>
                    <ul class="summary-wish-list">
                        ${currentData.specializedWishes.map((w, i) => {
                            const s = schoolCatalog.find(item => item.id === w.id);
                            return `<li><span><strong>NVC${i + 1}:</strong> ${esc(s ? s.name : w.id)}</span> <span>Chuyên: ${esc(w.subject)}</span></li>`;
                        }).join('')}
                    </ul>
                `;
            }

            const confirmHtml = `
                <p>Vui lòng kiểm tra kỹ danh sách nguyện vọng trước khi xác nhận lưu:</p>
                <p style="margin-top: 8px; font-weight: 700; color: #1769e0;">Nguyện vọng THPT Công lập thường:</p>
                <ul class="summary-wish-list">${regularSummary}</ul>
                ${specializedSummary}
                <div class="wf-alert warning" style="margin-top: 12px; font-size: 12px;">
                    Sau khi lưu, bạn vẫn có thể điều chỉnh lại bất kỳ lúc nào trước khi thời hạn đăng ký kết thúc.
                </div>
            `;

            openConfirmDialog('Xác nhận lưu nguyện vọng xét tuyển', confirmHtml, () => {
                if (saveData()) {
                    showMessage('✓ Cập nhật nguyện vọng xét tuyển lớp 10 vào hệ thống thành công!', 'success');
                    renderPrintReceipt();
                } else {
                    showMessage('Không thể lưu dữ liệu vào hệ thống. Vui lòng kiểm tra bộ nhớ trình duyệt.', 'error');
                }
            });
        });

        // Nút in phiếu đăng ký nguyện vọng
        $('printReceiptBtn').addEventListener('click', () => {
            renderPrintReceipt();
            window.print();
        });

        // Mô phỏng kiểm thử: Hết hạn điều chỉnh nguyện vọng
        $('toggleDeadlineBtn').addEventListener('click', () => {
            isExpired = !isExpired;
            const btn = $('toggleDeadlineBtn');
            const deadlineNotice = $('deadlineNoticeText');

            if (isExpired) {
                btn.textContent = 'Mô phỏng: Mở lại thời hạn đăng ký';
                btn.style.background = '#fef2f2';
                btn.style.color = '#dc2626';
                deadlineNotice.innerHTML = '⚠️ <strong>Đã hết thời hạn đăng ký &amp; điều chỉnh nguyện vọng</strong>. Hệ thống hiện đang ở chế độ <strong>CHỈ XEM</strong>.';
                $('saveWishesBtn').disabled = true;
                $('cancelChangesBtn').disabled = true;
                $('addRegularWishBtn').disabled = true;
                showMessage('Hệ thống đang ở chế độ mô phỏng HẾT HẠN. Tất cả thao tác điều chỉnh đã bị khóa.', 'warning');
            } else {
                btn.textContent = 'Mô phỏng: Hết hạn điều chỉnh (Khóa sửa)';
                btn.style.background = '#ffffff';
                btn.style.color = '#1e293b';
                deadlineNotice.innerHTML = 'Thời hạn đăng ký &amp; điều chỉnh nguyện vọng: Đến <strong>17:00 ngày 20/05/2026</strong>. Trạng thái: <span class="pill green">Đang mở tiếp nhận</span>';
                $('saveWishesBtn').disabled = false;
                $('cancelChangesBtn').disabled = false;
                clearMessage();
            }

            renderRegularWishes();
            renderSpecializedWishes();
        });

        renderPrintReceipt();
    }

    // Chuẩn bị nội dung phiếu in
    function renderPrintReceipt() {
        const receipt = $('printableWishReceipt');
        if (!receipt) return;

        const regList = currentData.regularWishes.map((w, i) => {
            const s = schoolCatalog.find(item => item.id === w.id);
            return `<tr><td><strong>NV ${i + 1}</strong></td><td>${esc(w.id)}</td><td><strong>${esc(s ? s.name : '—')}</strong></td><td>${esc(s ? s.district : '—')}</td></tr>`;
        }).join('');

        let specList = '';
        if (currentData.hasSpecialized && currentData.specializedWishes.length > 0) {
            specList = `
                <h4 style="margin: 16px 0 8px;">2. Nguyện vọng lớp 10 Chuyên:</h4>
                <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 13px;">
                    <thead><tr style="background:#eee;"><th style="border: 1px solid #000; padding: 6px;">Thứ tự</th><th style="border: 1px solid #000; padding: 6px;">Mã trường</th><th style="border: 1px solid #000; padding: 6px;">Trường THPT Chuyên</th><th style="border: 1px solid #000; padding: 6px;">Môn Chuyên</th></tr></thead>
                    <tbody>${currentData.specializedWishes.map((w, i) => {
                        const s = schoolCatalog.find(item => item.id === w.id);
                        return `<tr><td style="border: 1px solid #000; padding: 6px; text-align:center;">NVC ${i + 1}</td><td style="border: 1px solid #000; padding: 6px; text-align:center;">${esc(w.id)}</td><td style="border: 1px solid #000; padding: 6px;"><strong>${esc(s ? s.name : '—')}</strong></td><td style="border: 1px solid #000; padding: 6px; text-align:center;">${esc(w.subject)}</td></tr>`;
                    }).join('')}</tbody>
                </table>
            `;
        }

        receipt.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="margin: 0; text-transform: uppercase;">SỞ GIÁO DỤC VÀ ĐÀO TẠO THÀNH PHỐ HỒ CHÍ MINH</h3>
                <h2 style="margin: 6px 0;">PHIẾU ĐĂNG KÝ NGUYỆN VỌNG XÉT TUYỂN LỚP 10</h2>
                <p style="margin: 0; font-style: italic;">Năm học 2026 - 2027</p>
            </div>
            <div style="margin-bottom: 16px; font-size: 14px; line-height: 1.6;">
                <p>Họ và tên thí sinh: <strong>${esc(currentData.studentName)}</strong></p>
                <p>Số báo danh: <strong>${esc(currentData.studentId)}</strong> | Trường THCS: <strong>THCS Nguyễn Du</strong></p>
                <p>Thời điểm ghi nhận trên hệ thống: <strong>${new Date(currentData.lastUpdated).toLocaleString('vi-VN')}</strong></p>
            </div>
            <h4 style="margin: 12px 0 8px;">1. Danh sách Nguyện vọng THPT Công lập:</h4>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 13px;">
                <thead><tr style="background:#eee;"><th style="border: 1px solid #000; padding: 6px;">Thứ tự</th><th style="border: 1px solid #000; padding: 6px;">Mã trường</th><th style="border: 1px solid #000; padding: 6px;">Tên trường THPT</th><th style="border: 1px solid #000; padding: 6px;">Khu vực (Quận/Huyện)</th></tr></thead>
                <tbody>${regList}</tbody>
            </table>
            ${specList}
            <div style="display: flex; justify-content: space-between; margin-top: 40px; text-align: center;">
                <div><p><strong>XÁC NHẬN CỦA TRƯỜNG THCS</strong></p><p style="margin-top: 50px;">(Ký và đóng dấu)</p></div>
                <div><p><strong>HỌC SINH VÀ PHỤ HUYNH</strong></p><p style="margin-top: 50px;">(Ký và ghi rõ họ tên)</p></div>
            </div>
        `;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

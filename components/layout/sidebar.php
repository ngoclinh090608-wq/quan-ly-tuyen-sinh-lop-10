<aside class="sidebar" id="appSidebar">
    <button class="mobile-close" aria-label="Đóng menu">✕</button>
    <div class="sidebar-logo">
        <div class="logo-icon">10</div>
        <div>
            <h2>TUYỂN SINH</h2>
            <span>Quản lý tuyển sinh lớp 10</span>
        </div>
    </div>

    <nav class="sidebar-menu">
        <a href="<?php echo htmlspecialchars($appBase); ?>/" class="menu-item">
            <span class="menu-icon">⌂</span>
            <span>Trang chủ</span>
        </a>

        <div class="menu-title">TUYỂN SINH</div>

        <a href="#" class="menu-item">
            <span class="menu-icon">▣</span>
            <span>Thông tin tuyển sinh</span>
        </a>

        <a href="#" class="menu-item">
            <span class="menu-icon">✓</span>
            <span>Nguyện vọng xét tuyển</span>
        </a>

        <a href="#" class="menu-item">
            <span class="menu-icon">▤</span>
            <span>Hồ sơ thí sinh</span>
        </a>

        <div class="menu-title">KỲ THI</div>

        <a href="#" class="menu-item">
            <span class="menu-icon">□</span>
            <span>Phòng thi</span>
        </a>

        <a href="#" class="menu-item">
            <span class="menu-icon">◎</span>
            <span>Phân phòng thi</span>
        </a>

        <a href="#" class="menu-item">
            <span class="menu-icon">✎</span>
            <span>Điểm thi</span>
        </a>

        <a href="<?php echo htmlspecialchars($appBase); ?>/pages/hoi-dong-phuc-khao/quan-ly-ket-qua-phuc-khao.php" class="menu-item <?php echo $activePage === 'review' ? 'active' : ''; ?>">
            <span class="menu-icon">↻</span>
            <span>Kết quả phúc khảo</span>
        </a>
        <a href="<?php echo htmlspecialchars($appBase); ?>/pages/hoc-sinh/gui-yeu-cau-phuc-khao.php" class="menu-item <?php echo $activePage === 'request' ? 'active' : ''; ?>">
            <span class="menu-icon">✉</span><span>Gửi yêu cầu phúc khảo</span>
        </a>

        <div class="menu-title">KẾT QUẢ</div>

        <a href="<?php echo htmlspecialchars($appBase); ?>/pages/hoi-dong-tuyen-sinh/xet-tuyen.php" class="menu-item <?php echo $activePage === 'admission' ? 'active' : ''; ?>">
            <span class="menu-icon">☆</span>
            <span>Xét tuyển NV1, NV2, NV3</span>
        </a>

        <a href="#" class="menu-item">
            <span class="menu-icon">▥</span>
            <span>Kết quả tuyển sinh</span>
        </a>
    </nav>
</aside>

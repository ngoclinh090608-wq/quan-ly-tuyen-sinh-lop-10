console.log("Hệ thống quản lý tuyển sinh lớp 10");
(() => {
 const sidebar = document.getElementById('appSidebar');
 const toggle = document.querySelector('.menu-button');
 const backdrop = document.getElementById('sidebarBackdrop');
 if (!sidebar || !toggle || !backdrop) return;
 const setOpen = open => { sidebar.classList.toggle('is-open', open); backdrop.classList.toggle('is-open', open); toggle.setAttribute('aria-expanded', String(open)); };
 toggle.addEventListener('click', () => setOpen(!sidebar.classList.contains('is-open')));
 backdrop.addEventListener('click', () => setOpen(false));
 sidebar.querySelector('.mobile-close').addEventListener('click', () => {setOpen(false); toggle.focus();});
 document.addEventListener('keydown', event => {if (event.key === 'Escape') setOpen(false);});
})();

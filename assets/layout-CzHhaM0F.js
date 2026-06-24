import{k as m,a as o,c as v,n as u,g as p}from"./index-DWj9LPsn.js";function g(){o("getPublicConfig").then(function(a){f(a)}).catch(function(){})}function f(a){var i=document.querySelector(".sidebar-brand span.brand-text");if(i&&a.NAMA_MASJID&&(i.textContent=a.NAMA_MASJID),a.LOGO_URL){var e=p(a.LOGO_URL),n=document.querySelector(".sidebar-brand .brand-icon"),t=document.querySelector(".sidebar-brand .brand-logo-img");n&&t&&(n.style.display="none",t.src=e,t.referrerPolicy="no-referrer",t.style.display="",t.classList.remove("d-none"))}var s=a.IS_MASJID!==!1&&a.IS_MASJID!=="false";document.querySelectorAll(".nav-masjid-only").forEach(function(d){d.style.display=s?"":"none"})}function L(a){var i=m(),e=i&&i.nama?i.nama.charAt(0).toUpperCase():"A",n=i?i.nama:"Admin";return setTimeout(g,100),`
    <!-- Sidebar Overlay (mobile) -->
    <div class="sidebar-overlay" id="sidebarOverlay"></div>

    <!-- SIDEBAR -->
    <aside class="admin-sidebar" id="adminSidebar">
      <div class="sidebar-brand">
        <img class="brand-logo-img d-none" style="width:28px;height:28px;border-radius:50%;object-fit:cover" alt="Logo">
        <i class="bi bi-building brand-icon"></i>
        <span class="brand-text">Masjid</span>
      </div>
      <div class="sidebar-nav">
        <div class="nav-label">Menu Utama</div>
        <div class="nav-item">
          <a href="/admin/dashboard" data-page="admin/dashboard" data-tooltip="Dashboard">
            <i class="bi bi-grid"></i> <span class="nav-text">Dashboard</span>
          </a>
        </div>

        <div class="nav-label">Konten</div>
        <div class="nav-item">
          <a href="javascript:void(0)" class="nav-toggle" data-submenu="berita" data-tooltip="Berita">
            <i class="bi bi-newspaper"></i> <span class="nav-text">Berita</span>
          </a>
          <div class="nav-submenu" id="submenuBerita">
            <a href="/admin/berita" data-page="admin/berita" data-tooltip="Daftar Berita">
              <i class="bi bi-list-ul"></i> <span class="nav-text">Daftar Berita</span>
            </a>
            <a href="/admin/berita/add" data-page="admin/berita/add" data-tooltip="Tambah Berita">
              <i class="bi bi-plus-circle"></i> <span class="nav-text">Tambah Berita</span>
            </a>
            <a href="/admin/kategori" data-page="admin/kategori" data-tooltip="Kategori">
              <i class="bi bi-tags"></i> <span class="nav-text">Kategori</span>
            </a>
            <a href="/admin/komentar" data-page="admin/komentar" data-tooltip="Komentar">
              <i class="bi bi-chat-dots"></i> <span class="nav-text">Komentar</span>
            </a>
          </div>
        </div>

        <div class="nav-label">Keuangan</div>
        <div class="nav-item">
          <a href="/admin/keuangan" data-page="admin/keuangan" data-tooltip="Laporan Keuangan">
            <i class="bi bi-cash-stack"></i> <span class="nav-text">Laporan Keuangan</span>
          </a>
        </div>

        <div class="nav-label">Kegiatan</div>
        <div class="nav-item">
          <a href="/admin/kajian" data-page="admin/kajian" data-tooltip="Kajian & Kegiatan">
            <i class="bi bi-calendar-event"></i> <span class="nav-text">Kajian & Kegiatan</span>
          </a>
        </div>
        <div class="nav-item nav-masjid-only">
          <a href="/admin/jumat" data-page="admin/jumat" data-tooltip="Petugas Jumat">
            <i class="bi bi-mic"></i> <span class="nav-text">Petugas Jumat</span>
          </a>
        </div>

        <div class="nav-label">Program</div>
        <div class="nav-item">
          <a href="/admin/infaq" data-page="admin/infaq" data-tooltip="Infaq / Bantuan">
            <i class="bi bi-hand-thumbs-up"></i> <span class="nav-text">Infaq / Bantuan</span>
          </a>
        </div>
        <div class="nav-item">
          <a href="/admin/ramadhan" data-page="admin/ramadhan" data-tooltip="Ramadhan">
            <i class="bi bi-moon-stars"></i> <span class="nav-text">Ramadhan</span>
          </a>
        </div>
        <div class="nav-item">
          <a href="/admin/qurban" data-page="admin/qurban" data-tooltip="Qurban">
            <i class="bi bi-shop"></i> <span class="nav-text">Qurban</span>
          </a>
        </div>

        <div class="nav-label">Pengaturan</div>
        <div class="nav-item">
          <a href="/admin/inventaris" data-page="admin/inventaris" data-tooltip="Inventaris">
            <i class="bi bi-box-seam"></i> <span class="nav-text">Inventaris</span>
          </a>
        </div>
        <div class="nav-item">
          <a href="/admin/mustahiq" data-page="admin/mustahiq" data-tooltip="Mustahiq">
            <i class="bi bi-people-fill"></i> <span class="nav-text">Mustahiq</span>
          </a>
        </div>
        <div class="nav-item">
          <a href="/admin/menu" data-page="admin/menu" data-tooltip="Menu Navigasi">
            <i class="bi bi-list-nested"></i> <span class="nav-text">Menu Navigasi</span>
          </a>
        </div>
        <div class="nav-item">
          <a href="/admin/users" data-page="admin/users" data-tooltip="Pengguna">
            <i class="bi bi-people"></i> <span class="nav-text">Pengguna</span>
          </a>
        </div>
        <div class="nav-item">
          <a href="/admin/settings" data-page="admin/settings" data-tooltip="Pengaturan">
            <i class="bi bi-gear"></i> <span class="nav-text">Pengaturan</span>
          </a>
        </div>
      </div>

      <div style="padding:12px 20px;border-top:1px solid rgba(255,255,255,0.12);font-size:0.75rem;color:rgba(255,255,255,0.4)">
        v2.0<br>
        <a href="https://instagram.com/siridwan11" target="_blank" style="color:rgba(255,255,255,0.4);text-decoration:none">@ dkm al-islah</a>
      </div>
    </aside>

    <!-- TOPBAR -->
    <header class="admin-topbar">
      <button class="topbar-toggle" id="btnToggleSidebar"><i class="bi bi-list"></i></button>
      <span class="topbar-title" id="topbarTitle">${a}</span>
      <div class="topbar-actions">
        <button class="theme-toggle-admin" id="adminThemeToggle" title="Ganti Tema">
          <i class="bi bi-moon-fill"></i>
        </button>
        <a href="/" target="_blank" class="btn btn-sm btn-outline-secondary" title="Lihat Website">
          <i class="bi bi-box-arrow-up-right"></i>
        </a>
        <div class="dropdown">
          <button class="btn btn-sm dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown" style="border:none;color:var(--admin-text)">
            <div class="user-avatar">${e}</div>
            <span class="d-none d-md-inline small">${n}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item small" href="javascript:void(0)" id="btnLogout"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
          </ul>
        </div>
      </div>
    </header>

    <!-- MAIN CONTENT -->
    <main class="admin-main"></main>
  `}function x(a){var i=document.getElementById("topbarTitle");i&&(i.textContent=a)}function I(a){document.body.classList.add("admin-body"),localStorage.getItem("sidebar_collapsed")==="true"&&window.innerWidth>991&&document.body.classList.add("sidebar-collapsed"),document.querySelectorAll(".admin-sidebar .nav-item a").forEach(function(b){b.classList.remove("active")});var i=document.querySelector('.admin-sidebar a[data-page="'+a+'"]');if(i){i.classList.add("active");var e=i.closest(".nav-submenu");if(e){e.classList.add("show");var n=e.previousElementSibling;n&&n.classList.add("open")}}var t=["admin/berita","admin/berita/add","admin/berita/edit","admin/kategori","admin/komentar"];if(t.indexOf(a)>=0){var s=document.getElementById("submenuBerita");s&&s.classList.add("show");var d=s?s.previousElementSibling:null;d&&d.classList.add("open")}h(),c(),r()}function h(){var a=document.getElementById("btnToggleSidebar");a&&!a._bound&&(a._bound=!0,a.addEventListener("click",l));var i=document.getElementById("sidebarOverlay");i&&!i._bound&&(i._bound=!0,i.addEventListener("click",l)),document.querySelectorAll(".nav-toggle").forEach(function(t){t._bound||(t._bound=!0,t.addEventListener("click",function(s){s.preventDefault(),this.classList.toggle("open");var d=this.nextElementSibling;d&&d.classList.toggle("show")}))});var e=document.getElementById("adminThemeToggle");e&&!e._bound&&(e._bound=!0,e.addEventListener("click",function(){var t=document.body.classList.toggle("admin-dark");localStorage.setItem("admin_theme",t?"dark":"light"),c()}));var n=document.getElementById("btnLogout");n&&!n._bound&&(n._bound=!0,n.addEventListener("click",function(){o("logout",{token:v()}).catch(function(){}),u(),navigate("/login")}))}function l(){var a=window.innerWidth<=991;if(a)document.getElementById("adminSidebar").classList.toggle("show"),document.getElementById("sidebarOverlay").classList.toggle("show");else{var i=document.body.classList.toggle("sidebar-collapsed");localStorage.setItem("sidebar_collapsed",i),r()}}function r(){var a=document.getElementById("btnToggleSidebar");if(a){var i=document.body.classList.contains("sidebar-collapsed");a.innerHTML=i?'<i class="bi bi-layout-sidebar-inset"></i>':'<i class="bi bi-list"></i>'}}function c(){var a=document.getElementById("adminThemeToggle");if(a){var i=document.body.classList.contains("admin-dark");a.innerHTML=i?'<i class="bi bi-sun-fill"></i>':'<i class="bi bi-moon-fill"></i>'}}export{L as render,I as updateSidebar,x as updateTitle};

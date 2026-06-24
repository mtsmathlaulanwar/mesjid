import{a as h,g as v}from"./index-49v1tazL.js";let p={};function x(){return`
    <!-- NAVBAR -->
    <div class="navbar-wrapper" id="navbarWrapper">
      <div class="container">
        <nav class="navbar navbar-expand-lg navbar-masjid" id="mainNav">
          <a class="navbar-brand d-flex align-items-center gap-2 fw-semibold" href="/">
            <img class="brand-logo-img d-none" style="width:32px;height:32px;border-radius:8px;object-fit:cover" alt="Logo">
            <i class="bi bi-building brand-logo-icon" style="font-size:1.4rem;color:var(--primary)"></i>
            <span id="navBrandName">Masjid</span>
          </a>
          <div class="d-flex align-items-center ms-auto gap-2 d-lg-none">
            <button class="theme-toggle" id="themeToggleMobile" title="Ganti Tema"><i class="bi bi-moon-fill"></i></button>
            <button class="navbar-toggler border-0 shadow-none p-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
              <span class="navbar-toggler-icon"></span>
            </button>
          </div>
          <div class="collapse navbar-collapse" id="navbarMain">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item"><a class="nav-link" href="/" data-nav="home">Beranda</a></li>
              <li class="nav-item"><a class="nav-link" href="/berita" data-nav="berita">Berita</a></li>
              <li class="nav-item"><a class="nav-link" href="/laporan" data-nav="laporan">Keuangan</a></li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="javascript:void(0)" role="button" data-bs-toggle="dropdown">Program</a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="/infaq"><i class="bi bi-hand-thumbs-up me-2"></i>Infaq / Bantuan</a></li>
                  <li><a class="dropdown-item" href="/ramadhan"><i class="bi bi-moon-stars me-2"></i>Ramadhan</a></li>
                  <li><a class="dropdown-item" href="/qurban"><i class="bi bi-shop me-2"></i>Qurban</a></li>
                </ul>
              </li>
            </ul>
            <div class="d-flex align-items-center gap-2">
              <button class="btn-donasi-nav" id="btnDonasiNav"><i class="bi bi-qr-code me-1"></i>Donasi</button>
              <button class="theme-toggle d-none d-lg-block" id="themeToggle" title="Ganti Tema"><i class="bi bi-moon-fill"></i></button>
            </div>
          </div>
        </nav>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div id="publicContent" class="main-content"></div>

    <!-- DONASI MODAL -->
    <div class="modal fade" id="donasiModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content donasi-modal-content">
          <div class="modal-header donasi-modal-header">
            <div>
              <h5 class="modal-title"><i class="bi bi-qr-code me-2"></i>Donasi QRIS</h5>
              <small style="opacity:.8">Scan dengan e-wallet atau mobile banking</small>
            </div>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center py-4">
            <img id="qrisModalImg" alt="QRIS" class="mx-auto" style="max-width:280px;width:100%;border-radius:12px;border:3px solid var(--primary-bg);display:none;margin:0 auto;">
            <p id="qrisModalNoImg" class="text-muted small">Memuat QRIS...</p>
            <div class="fw-bold mt-3" style="color:var(--primary);font-size:1.1rem" id="qrisModalName"></div>
            <p class="text-muted small mt-1 mb-3">Semoga Allah SWT membalas kebaikan Anda</p>
            <div class="d-flex justify-content-center gap-2 flex-wrap mb-4">
              <span class="donasi-wallet-badge">GoPay</span>
              <span class="donasi-wallet-badge">OVO</span>
              <span class="donasi-wallet-badge">DANA</span>
              <span class="donasi-wallet-badge">ShopeePay</span>
              <span class="donasi-wallet-badge">LinkAja</span>
            </div>
            <div style="border-top:1px solid rgba(0,0,0,.08);padding-top:1.5rem;margin:0 -1rem;">
              <a href="/donasi" class="btn btn-warning fw-semibold px-4 py-2" style="border-radius:50px;color:#856404;background-color:#f8d053;border:none;white-space:nowrap;font-size:0.9rem;" onclick="bootstrap.Modal.getInstance(document.getElementById('donasiModal')).hide()"><i class="bi bi-arrow-right me-2"></i>Lihat Program Donasi</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <footer class="footer-masjid">
      <div class="container py-5">
        <div class="row g-4">
          <div class="col-lg-4">
            <h6 class="d-flex align-items-center mb-2">
              <img class="footer-logo-img d-none me-2" style="width:24px;height:24px;border-radius:4px;object-fit:cover" alt="Logo">
              <i class="bi bi-building footer-logo-icon me-2"></i>
              <span id="footerName">Masjid</span>
            </h6>
            <p class="footer-desc" id="footerLokasi"></p>
            <div class="d-flex gap-2 mt-3">
              <a href="/donasi" class="btn-hero-primary" style="font-size:.82rem;padding:8px 18px"><i class="bi bi-qr-code"></i> Donasi Sekarang</a>
            </div>
          </div>
          <div class="col-lg-3">
            <h6>Navigasi</h6>
            <ul class="list-unstyled">
              <li class="mb-2"><a href="/"><i class="bi bi-chevron-right me-1" style="font-size:.7rem"></i>Beranda</a></li>
              <li class="mb-2"><a href="/berita"><i class="bi bi-chevron-right me-1" style="font-size:.7rem"></i>Berita</a></li>
              <li class="mb-2"><a href="/laporan"><i class="bi bi-chevron-right me-1" style="font-size:.7rem"></i>Laporan Keuangan</a></li>
              <li class="mb-2"><a href="/donasi"><i class="bi bi-chevron-right me-1" style="font-size:.7rem"></i>Donasi</a></li>
            </ul>
          </div>
          <div class="col-lg-5">
            <h6>Lokasi Masjid</h6>
            <div class="rounded overflow-hidden" style="border:1px solid rgba(255,255,255,.1)" id="footerMap"></div>
          </div>
        </div>
      </div>
      <div style="border-top:1px solid rgba(255,255,255,.1)">
        <div class="container py-3 d-flex justify-content-between align-items-center flex-wrap" style="gap:8px">
          <small style="color:rgba(255,255,255,.4)">&copy; ${new Date().getFullYear()} <span id="footerCopyName">Masjid</span>. All rights reserved.</small>
          <small><a href="https://instagram.com/siridwan11" target="_blank" style="color:rgba(255,255,255,.35);text-decoration:none">@ dkm al-islah 2026</a></small>
        </div>
      </div>
    </footer>
  `}function M(){document.body.classList.remove("admin-body"),h("getPublicConfig").then(function(a){p=a||{},y(p)}).catch(function(a){console.error("Failed to load config:",a)}),document.getElementById("btnDonasiNav").addEventListener("click",function(){new bootstrap.Modal(document.getElementById("donasiModal")).show()});var e=localStorage.getItem("front_theme")||"light";e==="dark"&&document.body.classList.add("theme-dark"),u(),["themeToggle","themeToggleMobile"].forEach(function(a){var t=document.getElementById(a);t&&t.addEventListener("click",function(){var i=document.body.classList.toggle("theme-dark");localStorage.setItem("front_theme",i?"dark":"light"),u()})}),window.addEventListener("scroll",function(){var a=document.getElementById("navbarWrapper");a&&a.classList.toggle("scrolled",window.scrollY>50)})}function u(){var e=document.body.classList.contains("theme-dark");document.querySelectorAll(".theme-toggle").forEach(function(a){a.innerHTML=e?'<i class="bi bi-sun-fill"></i>':'<i class="bi bi-moon-fill"></i>'})}function y(e){var a=e.NAMA_MASJID||"Masjid",t=["navBrandName","footerName","footerCopyName","qrisModalName"];t.forEach(function(f){var g=document.getElementById(f);g&&(g.textContent=a)});var i=document.getElementById("footerLokasi");if(i&&(i.textContent=e.LOKASI_MASJID||""),e.LOGO_URL){var s=v(e.LOGO_URL),c=document.querySelector(".brand-logo-icon"),l=document.querySelector(".brand-logo-img");c&&(c.style.display="none"),l&&(l.src=s,l.style.display="",l.classList.remove("d-none"));var m=document.querySelector(".footer-logo-icon"),n=document.querySelector(".footer-logo-img");m&&(m.style.display="none"),n&&(n.src=s,n.style.display="",n.classList.remove("d-none")),document.title="Sistem Informasi Masjid - "+a,o("og:title",document.title),o("twitter:title",document.title),o("og:site_name",a),document.querySelector('link[rel="icon"]').href=s,document.querySelector('link[rel="apple-touch-icon"]').href=s,o("og:image",s),o("twitter:image",s)}if(e.IFRAME_PETA){var b=document.getElementById("footerMap");b&&(b.innerHTML=e.IFRAME_PETA)}var d=document.getElementById("qrisModalImg"),r=document.getElementById("qrisModalNoImg");d&&r&&(e.QRIS_URL?(d.src=v(e.QRIS_URL),d.style.display="block",r.style.display="none"):r.textContent="Belum ada QRIS")}function o(e,a){var t=e.startsWith("og:")?"property":"name",i=document.querySelector("meta["+t+'="'+e+'"]');i&&i.setAttribute("content",a)}export{M as init,x as render};

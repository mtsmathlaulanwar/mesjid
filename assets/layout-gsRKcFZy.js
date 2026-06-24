import{a as k,g as M}from"./index-DWj9LPsn.js";let b={};function N(){return`
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
              <li class="nav-item"><a class="nav-link" href="/zakat" data-nav="zakat">Zakat</a></li>
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
              <h5 class="modal-title" id="donasiModalTitle"><i class="bi bi-qr-code me-2"></i>Donasi QRIS</h5>
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
              <a href="/donasi" id="donasiModalLink" class="btn btn-warning fw-semibold px-4 py-2" style="border-radius:50px;color:#856404;background-color:#f8d053;border:none;white-space:nowrap;font-size:0.9rem;" onclick="bootstrap.Modal.getInstance(document.getElementById('donasiModal')).hide()"><i class="bi bi-arrow-right me-2"></i>Lihat Program Donasi</a>
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
              <a href="/donasi" id="footerDonasiBtn" class="btn-hero-primary" style="font-size:.82rem;padding:8px 18px"><i class="bi bi-qr-code"></i> Donasi Sekarang</a>
            </div>
          </div>
          <div class="col-lg-3">
            <h6>Navigasi</h6>
            <ul class="list-unstyled" id="footerNavList">
              <li class="mb-2"><a href="/"><i class="bi bi-chevron-right me-1" style="font-size:.7rem"></i>Beranda</a></li>
              <li class="mb-2"><a href="/berita"><i class="bi bi-chevron-right me-1" style="font-size:.7rem"></i>Berita</a></li>
              <li class="mb-2"><a href="/laporan"><i class="bi bi-chevron-right me-1" style="font-size:.7rem"></i>Laporan Keuangan</a></li>
              <li class="mb-2"><a href="/donasi" id="footerDonasiLink"><i class="bi bi-chevron-right me-1" style="font-size:.7rem"></i>Donasi</a></li>
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
          <small><a href="https://instagram.com/siridwan11" target="_blank" style="color:rgba(255,255,255,.35);text-decoration:none">@ dkm al-islah</a></small>
        </div>
      </div>
    </footer>
  `}function D(){document.body.classList.remove("admin-body"),Promise.all([k("getPublicConfig").catch(function(){return{}}),k("getPublicMenu").catch(function(){return[]})]).then(function(e){b=e[0]||{};var i=e[1]||[];i.length>0&&(I(i),T(i,b)),E(b)}),document.getElementById("btnDonasiNav").addEventListener("click",function(){new bootstrap.Modal(document.getElementById("donasiModal")).show()});var t=localStorage.getItem("front_theme")||"light";t==="dark"&&document.body.classList.add("theme-dark"),L(),["themeToggle","themeToggleMobile"].forEach(function(e){var i=document.getElementById(e);i&&i.addEventListener("click",function(){var o=document.body.classList.toggle("theme-dark");localStorage.setItem("front_theme",o?"dark":"light"),L()})}),window.addEventListener("scroll",function(){var e=document.getElementById("navbarWrapper");e&&e.classList.toggle("scrolled",window.scrollY>50)})}function L(){var t=document.body.classList.contains("theme-dark");document.querySelectorAll(".theme-toggle").forEach(function(e){e.innerHTML=t?'<i class="bi bi-sun-fill"></i>':'<i class="bi bi-moon-fill"></i>'})}function E(t){var e=t.NAMA_MASJID||"Masjid",i=["navBrandName","footerName","footerCopyName","qrisModalName"];i.forEach(function(x){var w=document.getElementById(x);w&&(w.textContent=e)});var o=document.getElementById("footerLokasi");if(o&&(o.textContent=t.LOKASI_MASJID||""),t.LOGO_URL){var a=M(t.LOGO_URL),l=document.querySelector(".brand-logo-icon"),n=document.querySelector(".brand-logo-img");l&&(l.style.display="none"),n&&(n.src=a,n.referrerPolicy="no-referrer",n.style.display="",n.classList.remove("d-none"));var v=document.querySelector(".footer-logo-icon"),s=document.querySelector(".footer-logo-img");v&&(v.style.display="none"),s&&(s.src=a,s.referrerPolicy="no-referrer",s.style.display="",s.classList.remove("d-none")),document.title="Sistem Informasi Masjid - "+e,d("og:title",document.title),d("twitter:title",document.title),d("og:site_name",e),document.querySelector('link[rel="icon"]').href=a,document.querySelector('link[rel="apple-touch-icon"]').href=a,d("og:image",a),d("twitter:image",a)}if(t.IFRAME_PETA){var f=document.getElementById("footerMap");f&&(f.innerHTML=t.IFRAME_PETA)}var c=document.getElementById("qrisModalImg"),m=document.getElementById("qrisModalNoImg");c&&m&&(t.QRIS_URL?(c.src=M(t.QRIS_URL),c.style.display="block",m.style.display="none"):m.textContent="Belum ada QRIS");var r=t.DONASI_TEXT||"Donasi",g=document.getElementById("btnDonasiNav");g&&(g.innerHTML='<i class="bi bi-qr-code me-1"></i>'+r);var p=document.getElementById("donasiModalTitle");p&&(p.innerHTML='<i class="bi bi-qr-code me-2"></i>'+r+" QRIS");var u=document.getElementById("donasiModalLink");u&&(u.innerHTML='<i class="bi bi-arrow-right me-2"></i>Lihat Program '+r);var h=document.getElementById("footerDonasiBtn");h&&(h.innerHTML='<i class="bi bi-qr-code"></i> '+r+" Sekarang");var y=document.getElementById("footerDonasiLink");y&&(y.innerHTML='<i class="bi bi-chevron-right me-1" style="font-size:.7rem"></i>'+r)}function I(t){var e=document.querySelector("#navbarMain .navbar-nav");if(e){var i="";t.forEach(function(a){if(a.tipe==="dropdown"&&a.children&&a.children.length>0)i+='<li class="nav-item dropdown">',i+='<a class="nav-link dropdown-toggle" href="javascript:void(0)" role="button" data-bs-toggle="dropdown">'+a.nama+"</a>",i+='<ul class="dropdown-menu">',a.children.forEach(function(n){i+='<li><a class="dropdown-item" href="'+n.link+'">',n.icon&&(i+='<i class="'+n.icon+' me-2"></i>'),i+=n.nama+"</a></li>"}),i+="</ul></li>";else{var l=a.link==="/"?"home":a.link.replace(/^\//,"");i+='<li class="nav-item"><a class="nav-link" href="'+a.link+'" data-nav="'+l+'">'+a.nama+"</a></li>"}}),e.innerHTML=i;var o=window.location.pathname.replace(/^\/+/,"").replace(/\/+$/,"")||"home";e.querySelectorAll("a[data-nav]").forEach(function(a){a.getAttribute("data-nav")===o&&a.classList.add("active")})}}function T(t,e){var i=document.getElementById("footerNavList");if(i){var o=e&&e.DONASI_TEXT?e.DONASI_TEXT:"Donasi",a="";t.forEach(function(l){l.tipe==="dropdown"&&l.children?l.children.forEach(function(n){a+='<li class="mb-2"><a href="'+n.link+'"><i class="bi bi-chevron-right me-1" style="font-size:.7rem"></i>'+n.nama+"</a></li>"}):a+='<li class="mb-2"><a href="'+l.link+'"><i class="bi bi-chevron-right me-1" style="font-size:.7rem"></i>'+l.nama+"</a></li>"}),a+='<li class="mb-2"><a href="/donasi" id="footerDonasiLink"><i class="bi bi-chevron-right me-1" style="font-size:.7rem"></i>'+o+"</a></li>",i.innerHTML=a}}function d(t,e){var i=t.startsWith("og:")?"property":"name",o=document.querySelector("meta["+i+'="'+t+'"]');o&&o.setAttribute("content",e)}export{D as init,N as render};

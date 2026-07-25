import { a as m, t as u, l as v } from "./index-49v1tazL.js";
var b = "Berita", o = 1, a = "";

function p() {
  return `
    <div class="section-block">
      <div class="container">
        <div class="section-header">
          <div class="section-badge"><i class="bi bi-newspaper"></i> Berita</div>
          <h2 class="section-title">Semua Berita</h2>
        </div>
        <div class="mb-4" id="kategoriFilter"></div>
        <div id="beritaListContainer"><p class="text-center text-muted">Memuat berita...</p></div>
        <div id="paginationContainer" class="text-center mt-4"></div>
      </div>
    </div>
  `;
}

function f() {
  var l = new URLSearchParams(window.location.search),
      n = l.get("kategori");
  n ? a = n : a = "";

  m("getKategoriList").then(function(r) {
    var s = '<div class="d-flex gap-2 flex-wrap">';
    s += '<button class="btn btn-sm rounded-pill ' + (a ? "btn-outline-secondary" : "btn-success") + ' btn-kat-filter" data-kat="">Semua</button>';
    
    (r || []).forEach(function(i) {
      s += '<button class="btn btn-sm rounded-pill ' + (a === i.nama ? "btn-success" : "btn-outline-secondary") + ' btn-kat-filter" data-kat="' + i.nama + '">' + i.nama + "</button>";
    });

    var t = r || [];
    if (a && !t.find(function(i) { return i.nama === a; })) {
      s += '<button class="btn btn-sm rounded-pill btn-success btn-kat-filter" data-kat="' + a + '">' + a + "</button>";
    }
    s += "</div>";

    document.getElementById("kategoriFilter").innerHTML = s;

    $(document).off("click", ".btn-kat-filter").on("click", ".btn-kat-filter", function() {
      a = $(this).data("kat");
      o = 1;
      $(".btn-kat-filter").removeClass("btn-success").addClass("btn-outline-secondary");
      $(this).removeClass("btn-outline-secondary").addClass("btn-success");
      var i = window.location.pathname + (a ? "?kategori=" + a : "");
      window.history.pushState(null, "", i);
      d();
    });
  }).catch(function() {});

  d();
}

function d() {
  var l = { page: o, limit: 9 };
  if (a) l.kategori = a;

  m("getBeritaList", l).then(function(n) {
    var r = n.data || n || [];
    if (!Array.isArray(r)) r = [];
    var s = n.totalPages || 1;

    if (r.length === 0) {
      document.getElementById("beritaListContainer").innerHTML = '<div class="text-center py-5"><i class="bi bi-newspaper" style="font-size:3rem;color:var(--text-muted)"></i><p class="text-muted mt-2">Belum ada berita.</p></div>';
      document.getElementById("paginationContainer").innerHTML = "";
      return;
    }

    var t = '<div class="row g-4">';
    r.forEach(function(e) {
      t += '<div class="col-md-6 col-lg-4"><div class="news-card">';
      
      if (e.thumbnail) {
        t += '<div class="card-img-wrap"><img src="' + e.thumbnail + '" alt="' + (e.judul || "") + '"></div>';
      } else {
        t += '<div class="card-img-placeholder"><i class="bi bi-newspaper" style="font-size:3rem;color:var(--primary)"></i></div>';
      }

      t += '<div class="card-body">';
      t += '<span class="badge-kategori mb-2">' + (e.kategori || "Umum") + "</span>";

      // ---> PERBAIKAN 1: Deteksi otomatis jika artikel mengandung video YouTube <---
      var isVideo = e.konten && (e.konten.includes("youtube.com") || e.konten.includes("youtu.be") || e.konten.includes("iframe"));
      var judulIcon = isVideo ? '<i class="bi bi-play-btn-fill text-danger me-1" title="Mengandung Video"></i> ' : '';
      t += '<h6 class="card-title">' + judulIcon + (e.judul || "") + "</h6>";

      // ---> PERBAIKAN 2: Teks cuplikan tidak akan kosong jika artikel hanya berisi video <---
      var cleanText = e.konten ? e.konten.replace(/<[^>]+>/g, "").trim() : "";
      if (!cleanText && isVideo) cleanText = "[ Tayangan Video / Kajian ]";
      t += '<p class="card-text">' + u(cleanText, 100) + "</p>";

      t += '<div class="news-meta"><i class="bi bi-eye"></i> ' + (e.views || 0) + '<i class="bi bi-heart ms-2"></i> ' + (e.likes || 0) + '<span class="ms-auto">' + v(e.created_at) + "</span></div>";
      t += '<a href="/berita/' + (e.slug || e.id) + '" class="btn-primary-masjid mt-3 w-100 justify-content-center" style="font-size:.82rem">Baca Selengkapnya <i class="bi bi-arrow-right"></i></a>';
      t += "</div></div></div>";
    });
    t += "</div>";

    document.getElementById("beritaListContainer").innerHTML = t;

    if (s > 1) {
      var i = '<nav><ul class="pagination justify-content-center">';
      for (var c = 1; c <= s; c++) {
        i += '<li class="page-item ' + (c === o ? "active" : "") + '"><a class="page-link btn-page" href="javascript:void(0)" data-page="' + c + '">' + c + "</a></li>";
      }
      i += "</ul></nav>";
      document.getElementById("paginationContainer").innerHTML = i;

      $(document).off("click", ".btn-page").on("click", ".btn-page", function() {
        o = parseInt($(this).data("page"));
        d();
        window.scrollTo(0, 0);
      });
    } else {
      document.getElementById("paginationContainer").innerHTML = "";
    }
  }).catch(function(n) {
    document.getElementById("beritaListContainer").innerHTML = '<p class="text-center text-danger">Gagal memuat berita: ' + n.message + "</p>";
  });
}

export { f as init, b as pageTitle, p as render };
import { a as d, e as o, d as n } from "./index-49v1tazL.js";

// Judul halaman
var b = "Detail Berita";

/**
 * Membuat elemen HTML awal saat halaman pertama kali dimuat
 */
function v() {
  return `
    <div class="section-block">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div id="beritaDetailContent"><p class="text-center text-muted">Memuat berita...</p></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Mengubah link YouTube biasa di dalam teks berita menjadi pemutar video responsif
 * @param {string} konten - Isi teks berita
 */
function formatKontenVideo(konten) {
  if (!konten) return "";
  let formatted = konten;

  // 1. Ubah tag link <a> YouTube menjadi pemutar iframe
  const aTagRegex = /<a[^>]*href="[^"]*(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})"[^>]*>.*?<\/a>/gi;
  formatted = formatted.replace(aTagRegex, function(match, videoId) {
    return `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:15px 0;border-radius:12px;">
              <iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>
            </div>`;
  });

  // 2. Ubah teks link YouTube biasa menjadi pemutar iframe
  const textRegex = /(?<!["'=\/])(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(?!["'])/g;
  formatted = formatted.replace(textRegex, function(match, videoId) {
    return `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:15px 0;border-radius:12px;">
              <iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>
            </div>`;
  });

  // 3. Pastikan iframe bawaan otomatis berukuran 100% responsif
  formatted = formatted.replace(/<iframe(?:[^>]*src="[^"]*")[^>]*>/gi, function(iframeTag) {
    if (iframeTag.includes('position:absolute')) return iframeTag;
    return `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:15px 0;border-radius:12px;">
              ` + iframeTag.replace(/width="[^"]*"/i, 'width="100%"').replace(/height="[^"]*"/i, 'height="100%"').replace(/style="[^"]*"/i, 'style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"') + `
            </div>`;
  });

  return formatted;
}

/**
 * Inisialisasi utama untuk mengambil data berita dan komentar dari API
 * @param {Object} s - Parameter halaman berisi slug berita
 */
function p(s) {
  // Cek jika slug tidak ada
  if (!s || !s.slug) {
    document.getElementById("beritaDetailContent").innerHTML = '<p class="text-center text-danger">Berita tidak ditemukan.</p>';
    return;
  }

  // Panggil API untuk mengambil data berita berdasarkan slug
  d("getBeritaBySlug", { slug: s.slug }).then(function(e) {
    if (!e) {
      document.getElementById("beritaDetailContent").innerHTML = '<p class="text-center text-danger">Berita tidak ditemukan.</p>';
      return;
    }

    // Susun tampilan detail berita
    var t = '<a href="/berita" class="btn btn-sm btn-outline-secondary mb-3"><i class="bi bi-arrow-left me-1"></i>Kembali</a>';
    t += '<div class="news-detail-card" style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:16px;overflow:hidden">';
    if (e.thumbnail) {
      t += '<img src="' + e.thumbnail + '" style="width:100%;max-height:400px;object-fit:cover" alt="' + (e.judul || "") + '">';
    }
    t += '<div style="padding:24px">';
    t += '<span class="badge-kategori mb-2">' + (e.kategori || "Umum") + '</span>';
    t += '<h2 style="font-family:var(--font-display);margin-bottom:12px">' + (e.judul || "") + '</h2>';
    t += '<div class="d-flex gap-3 text-muted small mb-4">';
    t += '<span><i class="bi bi-calendar3 me-1"></i>' + o(e.created_at) + '</span>';
    t += '<span><i class="bi bi-eye me-1"></i>' + (e.views || 0) + ' views</span>';
    t += '<span><i class="bi bi-heart me-1"></i><span id="likeCount">' + (e.likes || 0) + '</span> likes</span>';
    t += '</div>';

    // Tampilkan isi berita yang sudah diformat videonya
    t += '<div class="berita-content" style="line-height:1.8;font-size:.95rem">' + formatKontenVideo(e.konten) + '</div>';

    t += '<div class="d-flex gap-2 mt-4">';
    t += '<button class="btn btn-sm btn-outline-danger" id="btnLike" data-id="' + e.id + '"><i class="bi bi-heart me-1"></i>Suka</button>';
    t += '</div>';
    t += '</div></div>';

    // Wadah bagian komentar & formulir input
    t += '<div class="mt-4" style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:16px;padding:24px">';
    t += '<h6 class="fw-bold mb-3"><i class="bi bi-chat-dots me-2"></i>Komentar</h6>';
    t += '<div id="komentarList" class="mb-3"><p class="text-muted small">Memuat komentar...</p></div>';
    t += '<div class="border-top pt-3">';
    t += '<div class="row g-2 mb-2"><div class="col-md-6"><input type="text" id="komNama" class="form-control form-control-sm" placeholder="Nama Anda"></div><div class="col-md-6"><input type="email" id="komEmail" class="form-control form-control-sm" placeholder="Email (opsional)"></div></div>';
    t += '<textarea id="komIsi" class="form-control form-control-sm mb-2" rows="3" placeholder="Tulis komentar..."></textarea>';
    t += '<button class="btn btn-sm btn-success" id="btnKomentar" data-berita-id="' + e.id + '"><i class="bi bi-send me-1"></i>Kirim Komentar</button>';
    t += '</div></div>';

    // Masukkan HTML ke dalam halaman
    document.getElementById("beritaDetailContent").innerHTML = t;

    // -------------------------------------------------------------
    // PROSES MENGAMBIL DAFTAR KOMENTAR DARI BACKEND
    // -------------------------------------------------------------
    d("getKomentarByBerita", { beritaId: e.id }).then(function(resKom) {
      var listKom = Array.isArray(resKom) ? resKom : (resKom && resKom.data ? resKom.data : []);
      if (listKom.length > 0) {
        var r = "";
        listKom.forEach(function(a) {
          r += '<div class="mb-3 pb-3 border-bottom"><div class="d-flex justify-content-between"><strong class="small">' + (a.nama || "Anonim") + '</strong><small class="text-muted">' + o(a.created_at) + '</small></div><p class="mb-0 small mt-1">' + a.komentar + '</p></div>';
        });
        document.getElementById("komentarList").innerHTML = r;
      } else {
        document.getElementById("komentarList").innerHTML = '<p class="text-muted small">Belum ada komentar.</p>';
      }
    }).catch(function() {
      document.getElementById("komentarList").innerHTML = '<p class="text-muted small">Belum ada komentar.</p>';
    });

    // Event listener untuk tombol Like
    document.getElementById("btnLike").addEventListener("click", function() {
      var a = this.dataset.id;
      d("likeBerita", {}, { id: a }).then(function(i) {
        document.getElementById("likeCount").textContent = i.likes || parseInt(document.getElementById("likeCount").textContent) + 1;
        n("Terima kasih!");
      }).catch(function() {});
    });

    // Event listener untuk tombol Kirim Komentar
    document.getElementById("btnKomentar").addEventListener("click", function() {
      var a = this.dataset.beritaId,
          i = document.getElementById("komNama").value.trim(),
          m = document.getElementById("komEmail").value.trim(),
          l = document.getElementById("komIsi").value.trim();

      if (!i || !l) {
        n("Nama dan komentar wajib diisi!", "warning");
        return;
      }

      d("saveKomentar", {}, { berita_id: a, nama: i, email: m, komentar: l }).then(function() {
        n("Komentar terkirim! Menunggu persetujuan admin.");
        document.getElementById("komNama").value = "";
        document.getElementById("komEmail").value = "";
        document.getElementById("komIsi").value = "";
      }).catch(function(c) {
        n("Gagal: " + c.message, "error");
      });
    });

  }).catch(function(e) {
    document.getElementById("beritaDetailContent").innerHTML = '<p class="text-center text-danger">Gagal memuat berita: ' + e.message + '</p>';
  });
}

export { p as init, b as pageTitle, v as render };

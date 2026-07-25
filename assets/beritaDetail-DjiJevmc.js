import { a as d, e as o, d as n } from "./index-DWj9LPsn.js";

var b = "Detail Berita";

/**
 * Membuat kerangka tampilan utama halaman detail berita
 * @returns {string} String HTML kerangka
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
 * Merapikan format video/iframe dari YouTube agar tampil responsif
 * @param {string} konten - Teks HTML isi berita
 * @returns {string} HTML yang sudah diformat videonya
 */
function formatKontenVideo(konten) {
  if (!konten) return "";
  let formatted = konten;
  
  // 1. Mengubah link YouTube berformat tag <a href="..."> menjadi embed iframe
  const aTagRegex = /<a[^>]*href="[^"]*(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})"[^>]*>.*?<\/a>/gi;
  formatted = formatted.replace(aTagRegex, function(match, videoId) {
    return `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:15px 0;border-radius:12px;">
              <iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>
            </div>`;
  });

  // 2. Mengubah link YouTube teks biasa menjadi embed iframe
  const textRegex = /(?<!["'=\/])(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(?!["'])/g;
  formatted = formatted.replace(textRegex, function(match, videoId) {
    return `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:15px 0;border-radius:12px;">
              <iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>
            </div>`;
  });

  // 3. Memastikan iframe bawaan editor berukuran 100% responsif
  formatted = formatted.replace(/<iframe(?:[^>]*src="[^"]*")[^>]*>/gi, function(iframeTag) {
    if (iframeTag.includes('position:absolute')) return iframeTag;
    return `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:15px 0;border-radius:12px;">
              ` + iframeTag.replace(/width="[^"]*"/i, 'width="100%"').replace(/height="[^"]*"/i, 'height="100%"').replace(/style="[^"]*"/i, 'style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"') + `
            </div>`;
  });

  return formatted;
}

/**
 * Inisialisasi halaman detail berita, mengambil data dari API, dan menampilkan komentar
 * @param {Object} s - Parameter halaman (berisi slug berita)
 */
function p(s) {
  if (!s || !s.slug) {
    document.getElementById("beritaDetailContent").innerHTML = '<p class="text-center text-danger">Berita tidak ditemukan.</p>';
    return;
  }
  
  // Mengambil data berita berdasarkan slug
  d("getBeritaBySlug", { slug: s.slug }).then(function(e) {
    if (!e) {
      document.getElementById("beritaDetailContent").innerHTML = '<p class="text-center text-danger">Berita tidak ditemukan.</p>';
      return;
    }
    
    // Menyusun tampilan detail berita
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
    
    t += '<div class="berita-content" style="line-height:1.8;font-size:.95rem">' + formatKontenVideo(e.konten) + '</div>';
    
    t += '<div class="d-flex gap-2 mt-4">';
    t += '<button class="btn btn-sm btn-outline-danger" id="btnLike" data-id="' + e.id + '"><i class="bi bi-heart me-1"></i>Suka</button>';
    t += '</div>';
    t += '</div></div>';
    
    // Menyusun wadah daftar komentar dan form kirim komentar
    t += '<div class="mt-4" style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:16px;padding:24px">';
    t += '<h6 class="fw-bold mb-3"><i class="bi bi-chat-dots me-2"></i>Komentar</h6>';
    t += '<div id="komentarList" class="mb-3"><p class="text-muted small">Memuat komentar...</p></div>';
    t += '<div class="border-top pt-3">';
    t += '<div class="row g-2 mb-2"><div class="col-md-6"><input type="text" id="komNama" class="form-control form-control-sm" placeholder="Nama Anda"></div><div class="col-md-6"><input type="email" id="komEmail" class="form-control form-control-sm" placeholder="Email (opsional)"></div></div>';
    t += '<textarea id="komIsi" class="form-control form-control-sm mb-2" rows="3" placeholder="Tulis komentar..."></textarea>';
    t += '<button class="btn btn-sm btn-success" id="btnKomentar" data-berita-id="' + e.id + '"><i class="bi bi-send me-1"></i>Kirim Komentar</button>';
    t += '</div></div>';
    
    document.getElementById("beritaDetailContent").innerHTML = t;
    
    // =========================================================
    // PROSES MENGAMBIL DAN MENAMPILKAN KOMENTAR PUBLIK
    // =========================================================
    d("getKomentarByBerita", { beritaId: e.id }).then(function(resKom) {
      // Memastikan format data yang diterima baik berupa Array langsung atau di dalam resKom.data
      var listKom = Array.isArray(resKom) ? resKom : (resKom && resKom.data ? resKom.data : []);
      
      if (listKom.length > 0) {
        var htmlKomentar = "";
        listKom.forEach(function(item) {
          htmlKomentar += '<div class="mb-3 pb-3 border-bottom">';
          htmlKomentar += '<div class="d-flex justify-content-between">';
          htmlKomentar += '<strong class="small">' + (item.nama || "Anonim") + '</strong>';
          htmlKomentar += '<small class="text-muted">' + o(item.created_at) + '</small>';
          htmlKomentar += '</div>';
          htmlKomentar += '<p class="mb-0 small mt-1">' + item.komentar + '</p>';
          htmlKomentar += '</div>';
        });
        document.getElementById("komentarList").innerHTML = htmlKomentar;
      } else {
        document.getElementById("komentarList").innerHTML = '<p class="text-muted small">Belum ada komentar.</p>';
      }
    }).catch(function() {
      document.getElementById("komentarList").innerHTML = '<p class="text-muted small">Belum ada komentar.</p>';
    });
    
    // Listener untuk tombol Suka (Like)
    document.getElementById("btnLike").addEventListener("click", function() {
      var beritaId = this.dataset.id;
      d("likeBerita", {}, { id: beritaId }).then(function(resLike) {
        document.getElementById("likeCount").textContent = resLike.likes || parseInt(document.getElementById("likeCount").textContent) + 1;
        n("Terima kasih!");
      }).catch(function() {});
    });
    
    // Listener untuk tombol Kirim Komentar
    document.getElementById("btnKomentar").addEventListener("click", function() {
      var beritaId = this.dataset.beritaId,
          nama = document.getElementById("komNama").value.trim(),
          email = document.getElementById("komEmail").value.trim(),
          isi = document.getElementById("komIsi").value.trim();
          
      if (!nama || !isi) {
        n("Nama dan komentar wajib diisi!", "warning");
        return;
      }
      
      d("saveKomentar", {}, { berita_id: beritaId, nama: nama, email: email, komentar: isi }).then(function() {
        n("Komentar terkirim! Menunggu persetujuan admin.");
        document.getElementById("komNama").value = "";
        document.getElementById("komEmail").value = "";
        document.getElementById("komIsi").value = "";
      }).catch(function(err) {
        n("Gagal: " + err.message, "error");
      });
    });
    
  }).catch(function(err) {
    document.getElementById("beritaDetailContent").innerHTML = '<p class="text-center text-danger">Gagal memuat berita: ' + err.message + '</p>';
  });
}

export { p as init, b as pageTitle, v as render };

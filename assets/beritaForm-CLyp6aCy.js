import { a as s, h as b, c as m, i as d, d as r, k as g } from "./index-DWj9LPsn.js";
var h = "Tambah Berita", o = null;

function B(t) {
  var i = t && t.id;
  h = i ? "Edit Berita" : "Tambah Berita";
  return `
    <div class="admin-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold mb-0">
          <i class="bi bi-${i ? "pencil" : "plus-circle"} me-2"></i>
          ${i ? "Edit Berita" : "Tambah Berita Baru"}
        </h6>
        <a href="/admin/berita" class="btn btn-sm btn-outline-secondary">
          <i class="bi bi-arrow-left me-1"></i>Kembali
        </a>
      </div>

      <form id="formBerita">
        <input type="hidden" id="beritaId" value="">

        <div class="mb-3">
          <label class="form-label fw-bold">Judul <span class="text-danger">*</span></label>
          <input type="text" id="judul" class="form-control" placeholder="Masukkan judul berita" required>
        </div>

        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <label class="form-label fw-bold">Kategori</label>
            <select id="kategori" class="form-select">
              <option value="">-- Pilih Kategori --</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold">Status</label>
            <select id="status" class="form-select">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Thumbnail</label>
          <input type="file" id="thumbnailFile" class="form-control" accept=".jpg,.jpeg,.png,.webp">
          <small class="text-muted">Max 10MB. Format: jpg, jpeg, png, webp</small>
          <div id="thumbnailPreview" class="mt-2"></div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Konten <span class="text-danger">*</span></label>
          <textarea id="konten"></textarea>
        </div>

        <button type="submit" class="btn btn-admin-primary w-100" id="btnSaveBerita">
          <i class="bi bi-save me-2"></i>Simpan Berita
        </button>
      </form>
    </div>
  `;
}

function w(t) {
  var i = t && t.id;
  o = null;
  s("getKategoriList").then(function(e) {
    var n = document.getElementById("kategori");
    (e || []).forEach(function(a) {
      var l = document.createElement("option");
      l.value = a.nama;
      l.textContent = a.nama;
      n.appendChild(l);
    });
    if (o && o.kategori) n.value = o.kategori;
  }).catch(function() {});

  if (i) {
    b("Memuat data...");
    s("getBeritaById", { id: t.id, token: m() }).then(function(e) {
      d();
      o = e;
      document.getElementById("beritaId").value = e.id || "";
      document.getElementById("judul").value = e.judul || "";
      document.getElementById("kategori").value = e.kategori || "";
      document.getElementById("status").value = e.status || "published";
      if (e.thumbnail) {
        document.getElementById("thumbnailPreview").innerHTML = '<img src="' + e.thumbnail + '" style="max-width:200px;border-radius:8px">';
      }
      $("#konten").summernote("code", e.konten || "");
      document.getElementById("btnSaveBerita").innerHTML = '<i class="bi bi-save me-2"></i>Update Berita';
    }).catch(function(e) {
      d();
      r("Gagal memuat: " + e.message, "error");
    });
  }

  // ---> PERBAIKAN SUMMERNOTE: dialogsInBody agar layar TIDAK BERGETAR! <---
  $("#konten").summernote({
    height: 400,
    dialogsInBody: true, // WAJIB ADA untuk mengatasi bentrokan modal bootstrap 5 & getaran layar
    placeholder: "Tulis konten berita di sini...",
    tabsize: 2,
    toolbar: [
      ["style", ["style"]],
      ["font", ["bold", "underline", "italic", "clear", "strikethrough"]],
      ["fontname", ["fontname"]],
      ["fontsize", ["fontsize"]],
      ["color", ["color"]],
      ["para", ["ul", "ol", "paragraph", "height"]],
      ["table", ["table"]],
      ["insert", ["link", "picture", "video", "hr"]],
      ["view", ["fullscreen", "codeview", "help"]]
    ],
    callbacks: {
      onImageUpload: function(e) {
        k(e[0]);
      },
      // Perbaikan agar saat pasang video tidak error/melompat
      onInit: function() {
        $(document).off('focusin.modal'); // Lepaskan jebakan fokus Bootstrap
      }
    },
    codemirror: {
      mode: "text/html",
      htmlMode: !0,
      lineNumbers: !0,
      theme: "monokai"
    }
  });

  $("#thumbnailFile").on("change", function() {
    var e = this.files[0];
    if (e) {
      var n = new FileReader;
      n.onload = function(a) {
        $("#thumbnailPreview").html('<img src="' + a.target.result + '" style="max-width:200px;border-radius:8px">');
      };
      n.readAsDataURL(e);
    }
  });

  $("#formBerita").on("submit", function(e) {
    e.preventDefault();
    var n = $("#judul").val().trim(),
        a = $("#konten").summernote("code");
    if (!n || !a || a === "<p><br></p>") {
      r("Judul dan konten wajib diisi!", "warning");
      return;
    }
    b("Menyimpan berita...");
    var l = document.getElementById("thumbnailFile").files[0];
    if (l) {
      var c = new FileReader;
      c.onload = function(p) {
        var v = p.target.result.split(",")[1];
        s("uploadImage", {}, { base64Data: v, filename: l.name, mimeType: l.type, token: m() }).then(function(u) {
          f(u.url || u);
        }).catch(function(u) {
          d();
          r("Gagal upload gambar: " + u.message, "error");
        });
      };
      c.readAsDataURL(l);
    } else {
      f(o && o.thumbnail ? o.thumbnail : "");
    }
  });
}

// Fungsi Simpan Berita dengan Auto-Format Video YouTube
function f(t) {
  var i = g(),
      rawKonten = $("#konten").summernote("code");

  // ---> PERBAIKAN: AUTO-CONVERT BERBAGAI JENIS LINK YOUTUBE <---
  var cleanKonten = rawKonten;
  
  // Deteksi link di dalam tag <a>
  var aTagRegex = /<a[^>]*href="[^"]*(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})"[^>]*>.*?<\/a>/gi;
  cleanKonten = cleanKonten.replace(aTagRegex, function(match, videoId) {
    return `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:15px 0;border-radius:12px;">
              <iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>
            </div>`;
  });

  // Deteksi link berupa teks mentah
  var textRegex = /(?<!["'=\/])(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(?!["'])/g;
  cleanKonten = cleanKonten.replace(textRegex, function(match, videoId) {
    return `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:15px 0;border-radius:12px;">
              <iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>
            </div>`;
  });

  var e = {
    id: $("#beritaId").val(),
    judul: $("#judul").val().trim(),
    kategori: $("#kategori").val(),
    konten: cleanKonten,
    status: $("#status").val(),
    thumbnail: t,
    created_by: i ? i.username : "admin",
    token: m()
  };

  s("saveBerita", {}, e).then(function() {
    d();
    r(e.id ? "Berita berhasil diupdate!" : "Berita berhasil disimpan!");
    setTimeout(function() {
      navigate("/admin/berita");
    }, 1500);
  }).catch(function(n) {
    d();
    r("Gagal: " + n.message, "error");
  });
}

function k(t) {
  var i = new FileReader;
  i.onload = function(e) {
    var n = e.target.result.split(",")[1];
    s("uploadImage", {}, { base64Data: n, filename: t.name, mimeType: t.type, token: m() }).then(function(a) {
      $("#konten").summernote("insertImage", a.url || a);
    }).catch(function(a) {
      r("Gagal upload gambar: " + a.message, "error");
    });
  };
  i.readAsDataURL(t);
}

function x() {
  if ($("#konten").length && $("#konten").summernote) {
    try {
      $("#konten").summernote("destroy");
    } catch {}
  }
}

export { x as destroy, w as init, h as pageTitle, B as render };
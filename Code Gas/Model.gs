/**
 * Masjid v2 - Model.gs
 * Data Access Layer - Semua operasi CRUD ke Google Sheets
 */

// ==================== HELPER MODEL ====================

function getSheet_(spreadsheetId, sheetName) {
  const ss = SpreadsheetApp.openById(spreadsheetId);
  return ss.getSheetByName(sheetName);
}

function generateId_() {
  return Utilities.getUuid().replace(/-/g, '').substring(0, 12);
}

function sheetToObjects_(sheet) {
  if (!sheet || sheet.getLastRow() < 2) return [];
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function findRowIndex_(sheet, id) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) return i + 1;
  }
  return -1;
}

function ensureColumn_(sheet, colName) {
  if (!sheet || sheet.getLastRow() < 1) return;
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  if (headers.indexOf(colName) === -1) {
    sheet.getRange(1, headers.length + 1).setValue(colName);
  }
}

// ==================== BERITA MODEL ====================

function getBeritaList(kategori, page, limit) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_BERITA_ID, 'Berita');
  if (!sheet) return { data: [], total: 0 };

  let items = sheetToObjects_(sheet).filter(b => b.status === 'published');
  
  if (kategori) {
    items = items.filter(b => b.kategori === kategori);
  }
  
  items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  const total = items.length;
  const start = ((page || 1) - 1) * (limit || APP_CONFIG.ITEMS_PER_PAGE);
  const data = items.slice(start, start + (limit || APP_CONFIG.ITEMS_PER_PAGE));
  
  return { data, total, page: page || 1, totalPages: Math.ceil(total / (limit || APP_CONFIG.ITEMS_PER_PAGE)) };
}

function getBeritaBySlug(slug) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_BERITA_ID, 'Berita');
  if (!sheet) return null;
  const items = sheetToObjects_(sheet);
  return items.find(b => b.slug === slug) || null;
}

function getBeritaById(id) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_BERITA_ID, 'Berita');
  if (!sheet) return null;
  const items = sheetToObjects_(sheet);
  return items.find(b => String(b.id) === String(id)) || null;
}

function getAllBerita() {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_BERITA_ID, 'Berita');
  if (!sheet) return [];
  return sheetToObjects_(sheet).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function saveBerita(data) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_BERITA_ID, 'Berita');
  const now = new Date().toISOString();

  if (data.id) {
    // Update
    const rowIdx = findRowIndex_(sheet, data.id);
    if (rowIdx === -1) throw new Error('Berita not found');
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    headers.forEach((h, i) => {
      if (h === 'id' || h === 'created_at' || h === 'created_by') return;
      if (h === 'updated_at') { sheet.getRange(rowIdx, i + 1).setValue(now); return; }
      if (data[h] !== undefined) sheet.getRange(rowIdx, i + 1).setValue(data[h]);
    });
    return { ...data, updated_at: now };
  } else {
    // Create
    const id = generateId_();
    const slug = createSlug_(data.judul);
    const row = [id, data.judul, slug, data.konten || '', data.kategori || 'Umum', 
                 data.thumbnail || '', 0, 0, data.status || 'published', 
                 data.created_by || 'admin', now, now];
    sheet.appendRow(row);
    return { id, slug, ...data, created_at: now };
  }
}

function deleteBerita(id) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_BERITA_ID, 'Berita');
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx === -1) throw new Error('Berita not found');
  sheet.deleteRow(rowIdx);
  return true;
}

function incrementBeritaView(id) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_BERITA_ID, 'Berita');
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx === -1) return;
  const current = sheet.getRange(rowIdx, 7).getValue() || 0;
  sheet.getRange(rowIdx, 7).setValue(current + 1);
}

function likeBerita(id) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_BERITA_ID, 'Berita');
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx === -1) throw new Error('Berita not found');
  const current = sheet.getRange(rowIdx, 8).getValue() || 0;
  sheet.getRange(rowIdx, 8).setValue(current + 1);
  return current + 1;
}

// ==================== KATEGORI MODEL ====================

function getKategoriList() {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_BERITA_ID, 'Kategori');
  if (!sheet) return [];
  return sheetToObjects_(sheet);
}

function saveKategori(data) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_BERITA_ID, 'Kategori');
  const now = new Date().toISOString();

  if (data.id) {
    const rowIdx = findRowIndex_(sheet, data.id);
    if (rowIdx === -1) throw new Error('Kategori not found');
    sheet.getRange(rowIdx, 2).setValue(data.nama);
    sheet.getRange(rowIdx, 3).setValue(createSlug_(data.nama));
    return data;
  } else {
    const id = generateId_();
    sheet.appendRow([id, data.nama, createSlug_(data.nama), now]);
    return { id, ...data };
  }
}

function deleteKategori(id) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_BERITA_ID, 'Kategori');
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx === -1) throw new Error('Kategori not found');
  sheet.deleteRow(rowIdx);
  return true;
}

// ==================== KOMENTAR MODEL ====================

/**
 * Mengambil daftar komentar yang approved berdasarkan beritaId atau Slug berita.
 * @param {string|number} beritaIdOrSlug - ID atau Slug berita yang dicari.
 * @returns {Array} List komentar yang berstatus approved.
 */
function getKomentarByBerita(beritaIdOrSlug) {
  if (!beritaIdOrSlug) return [];

  const config = getConfig();
  const sheetKomentar = getSheet_(config.SHEET_BERITA_ID, 'Komentar');
  if (!sheetKomentar) return [];

  let targetId = String(beritaIdOrSlug).trim();

  // 1. CARI ID ASLI JIKA PARAMETER BERUPA SLUG BERITA
  const sheetBerita = getSheet_(config.SHEET_BERITA_ID, 'Berita');
  if (sheetBerita) {
    const dataBerita = sheetToObjects_(sheetBerita);
    const foundBerita = dataBerita.find(b => 
      String(b.slug || '').trim() === targetId || 
      String(b.id || '').trim() === targetId
    );
    if (foundBerita && foundBerita.id) {
      targetId = String(foundBerita.id).trim(); // Gunakan ID berita asli
    }
  }

  // 2. FILTER KOMENTAR BERDASARKAN TARGET ID ATAU SLUG
  return sheetToObjects_(sheetKomentar)
    .filter(k => {
      const kBeritaId = String(k.berita_id || '').trim();
      
      // Cek apakah ID Komentar cocok dengan ID Berita asli ATAU Slug
      const isMatchBerita = (kBeritaId === targetId) || (kBeritaId === String(beritaIdOrSlug).trim());
      
      // Cek status approved (bebas spasi dan huruf besar/kecil)
      const statusStr = String(k.status || '').toLowerCase().trim();
      const isApproved = statusStr === 'approved' || statusStr === 'true' || k.status === true;

      return isMatchBerita && isApproved;
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function getAllKomentar() {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_BERITA_ID, 'Komentar');
  if (!sheet) return [];
  return sheetToObjects_(sheet).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function saveKomentar(data) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_BERITA_ID, 'Komentar');
  const id = generateId_();
  const now = new Date().toISOString();
  sheet.appendRow([id, data.berita_id, sanitizeHtml_(data.nama), sanitizeHtml_(data.email), 
                   sanitizeHtml_(data.komentar), 'pending', now]);
  return { id, status: 'pending' };
}

function updateKomentarStatus(id, status) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_BERITA_ID, 'Komentar');
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx === -1) throw new Error('Komentar not found');
  sheet.getRange(rowIdx, 6).setValue(status);
  return true;
}

function deleteKomentar(id) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_BERITA_ID, 'Komentar');
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx === -1) throw new Error('Komentar not found');
  sheet.deleteRow(rowIdx);
  return true;
}

// ==================== KEUANGAN MODEL ====================

function getKeuanganByYear(year) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_KEUANGAN_ID, String(year));
  if (!sheet) return [];
  return sheetToObjects_(sheet).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
}

function getKeuanganSummary() {
  const config = getConfig();
  const ss = SpreadsheetApp.openById(config.SHEET_KEUANGAN_ID);
  const sheets = ss.getSheets();
  const summary = [];
  
  sheets.forEach(sheet => {
    const name = sheet.getName();
    if (!/^\d{4}$/.test(name)) return;
    const data = sheetToObjects_(sheet);
    let pemasukan = 0, pengeluaran = 0;
    data.forEach(d => {
      if (d.jenis === 'pemasukan') pemasukan += Number(d.jumlah) || 0;
      else pengeluaran += Number(d.jumlah) || 0;
    });
    summary.push({ tahun: name, pemasukan, pengeluaran, saldo: pemasukan - pengeluaran });
  });
  
  return summary.sort((a, b) => b.tahun - a.tahun);
}

function getAvailableYears() {
  const config = getConfig();
  const ss = SpreadsheetApp.openById(config.SHEET_KEUANGAN_ID);
  return ss.getSheets().map(s => s.getName()).filter(n => /^\d{4}$/.test(n)).sort().reverse();
}

function saveKeuangan(data) {
  const config = getConfig();
  const year = data.tahun || new Date().getFullYear().toString();
  let sheet = getSheet_(config.SHEET_KEUANGAN_ID, year);
  
  if (!sheet) {
    const ss = SpreadsheetApp.openById(config.SHEET_KEUANGAN_ID);
    sheet = ss.insertSheet(year);
    sheet.appendRow(['id', 'tanggal', 'keterangan', 'jenis', 'jumlah', 'created_by', 'created_at']);
  }
  
  const now = new Date().toISOString();
  
  if (data.id) {
    const rowIdx = findRowIndex_(sheet, data.id);
    if (rowIdx === -1) throw new Error('Keuangan not found');
    sheet.getRange(rowIdx, 2).setValue(data.tanggal);
    sheet.getRange(rowIdx, 3).setValue(data.keterangan);
    sheet.getRange(rowIdx, 4).setValue(data.jenis);
    sheet.getRange(rowIdx, 5).setValue(Number(data.jumlah));
    return data;
  } else {
    const id = generateId_();
    sheet.appendRow([id, data.tanggal, data.keterangan, data.jenis, Number(data.jumlah), data.created_by || 'admin', now]);
    return { id, ...data };
  }
}

function deleteKeuangan(id, year) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_KEUANGAN_ID, String(year));
  if (!sheet) throw new Error('Year sheet not found');
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx === -1) throw new Error('Keuangan not found');
  sheet.deleteRow(rowIdx);
  return true;
}

// ==================== INFAQ MODEL ====================

function getInfaqPrograms() {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_INFAQ_ID, 'Program');
  if (!sheet) return [];
  return sheetToObjects_(sheet).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function getInfaqProgramById(id) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_INFAQ_ID, 'Program');
  if (!sheet) return null;
  return sheetToObjects_(sheet).find(p => String(p.id) === String(id)) || null;
}

function saveInfaqProgram(data) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_INFAQ_ID, 'Program');
  const now = new Date().toISOString();
  
  // Dynamic column: qris_url
  ensureColumn_(sheet, 'qris_url');
  
  if (data.id) {
    const rowIdx = findRowIndex_(sheet, data.id);
    if (rowIdx === -1) throw new Error('Program not found');
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    headers.forEach((h, i) => {
      if (h === 'id' || h === 'created_at' || h === 'created_by' || h === 'terkumpul') return;
      if (h === 'updated_at') { sheet.getRange(rowIdx, i + 1).setValue(now); return; }
      if (data[h] !== undefined) sheet.getRange(rowIdx, i + 1).setValue(h === 'target' ? Number(data[h]) || 0 : data[h]);
    });
    return data;
  } else {
    const id = generateId_();
    sheet.appendRow([id, data.judul, data.deskripsi || '', Number(data.target) || 0, 0, 'active', data.created_by || 'admin', now, now, data.qris_url || '']);
    return { id, ...data };
  }
}

function deleteInfaqProgram(id) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_INFAQ_ID, 'Program');
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx === -1) throw new Error('Program not found');
  sheet.deleteRow(rowIdx);
  return true;
}

function getInfaqDonasi(programId) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_INFAQ_ID, 'Donasi');
  if (!sheet) return [];
  return sheetToObjects_(sheet)
    .filter(d => String(d.program_id) === String(programId))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function saveInfaqDonasi(data) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_INFAQ_ID, 'Donasi');
  const now = new Date().toISOString();
  
  if (data.id) {
    const rowIdx = findRowIndex_(sheet, data.id);
    if (rowIdx === -1) throw new Error('Donasi not found');
    sheet.getRange(rowIdx, 3).setValue(data.nama);
    sheet.getRange(rowIdx, 4).setValue(Number(data.jumlah));
    sheet.getRange(rowIdx, 5).setValue(data.tanggal);
    return data;
  } else {
    const id = generateId_();
    sheet.appendRow([id, data.program_id, data.nama, Number(data.jumlah), data.tanggal || now.split('T')[0], data.admin_input || 'admin', now]);
    // Update terkumpul
    recalcInfaqTerkumpul_(data.program_id);
    return { id, ...data };
  }
}

function deleteInfaqDonasi(id, programId) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_INFAQ_ID, 'Donasi');
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx === -1) throw new Error('Donasi not found');
  sheet.deleteRow(rowIdx);
  if (programId) recalcInfaqTerkumpul_(programId);
  return true;
}

function recalcInfaqTerkumpul_(programId) {
  const config = getConfig();
  const donasiSheet = getSheet_(config.SHEET_INFAQ_ID, 'Donasi');
  const programSheet = getSheet_(config.SHEET_INFAQ_ID, 'Program');
  if (!donasiSheet || !programSheet) return;
  
  const donasi = sheetToObjects_(donasiSheet).filter(d => String(d.program_id) === String(programId));
  const total = donasi.reduce((sum, d) => sum + (Number(d.jumlah) || 0), 0);
  
  const rowIdx = findRowIndex_(programSheet, programId);
  if (rowIdx > 0) programSheet.getRange(rowIdx, 5).setValue(total);
}

// ==================== RAMADHAN MODEL ====================

function getRamadhanPrograms() {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_RAMADHAN_ID, 'Program');
  if (!sheet) return [];
  return sheetToObjects_(sheet).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function saveRamadhanProgram(data) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_RAMADHAN_ID, 'Program');
  const now = new Date().toISOString();
  
  // Dynamic column: qris_url
  ensureColumn_(sheet, 'qris_url');
  
  if (data.id) {
    const rowIdx = findRowIndex_(sheet, data.id);
    if (rowIdx === -1) throw new Error('Program not found');
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    headers.forEach((h, i) => {
      if (h === 'id' || h === 'created_at' || h === 'created_by') return;
      if (data[h] !== undefined) sheet.getRange(rowIdx, i + 1).setValue(data[h]);
    });
    return data;
  } else {
    const id = generateId_();
    sheet.appendRow([id, data.judul, data.tahun || new Date().getFullYear(), 'active', data.created_by || 'admin', now, data.qris_url || '']);
    return { id, ...data };
  }
}

function deleteRamadhanProgram(id) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_RAMADHAN_ID, 'Program');
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx === -1) throw new Error('Program not found');
  sheet.deleteRow(rowIdx);
  return true;
}

function getRamadhanPemasukan(programId) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_RAMADHAN_ID, 'Pemasukan');
  if (!sheet) return [];
  return sheetToObjects_(sheet)
    .filter(d => String(d.program_id) === String(programId))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function saveRamadhanPemasukan(data) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_RAMADHAN_ID, 'Pemasukan');
  const now = new Date().toISOString();
  
  if (data.id) {
    const rowIdx = findRowIndex_(sheet, data.id);
    if (rowIdx === -1) throw new Error('Pemasukan not found');
    sheet.getRange(rowIdx, 3).setValue(data.nama);
    sheet.getRange(rowIdx, 4).setValue(Number(data.jumlah));
    sheet.getRange(rowIdx, 5).setValue(data.tanggal);
    return data;
  } else {
    const id = generateId_();
    sheet.appendRow([id, data.program_id, data.nama, Number(data.jumlah), data.tanggal || now.split('T')[0], data.admin_input || 'admin', now]);
    return { id, ...data };
  }
}

function deleteRamadhanPemasukan(id) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_RAMADHAN_ID, 'Pemasukan');
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx === -1) throw new Error('Not found');
  sheet.deleteRow(rowIdx);
  return true;
}

function getRamadhanPengeluaran(programId) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_RAMADHAN_ID, 'Pengeluaran');
  if (!sheet) return [];
  return sheetToObjects_(sheet)
    .filter(d => String(d.program_id) === String(programId))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function saveRamadhanPengeluaran(data) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_RAMADHAN_ID, 'Pengeluaran');
  const now = new Date().toISOString();
  
  if (data.id) {
    const rowIdx = findRowIndex_(sheet, data.id);
    if (rowIdx === -1) throw new Error('Pengeluaran not found');
    sheet.getRange(rowIdx, 3).setValue(data.keterangan);
    sheet.getRange(rowIdx, 4).setValue(Number(data.jumlah));
    sheet.getRange(rowIdx, 5).setValue(data.tanggal);
    return data;
  } else {
    const id = generateId_();
    sheet.appendRow([id, data.program_id, data.keterangan, Number(data.jumlah), data.tanggal || now.split('T')[0], data.admin_input || 'admin', now]);
    return { id, ...data };
  }
}

function deleteRamadhanPengeluaran(id) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_RAMADHAN_ID, 'Pengeluaran');
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx === -1) throw new Error('Not found');
  sheet.deleteRow(rowIdx);
  return true;
}

// ==================== QURBAN MODEL ====================

function getQurbanPrograms() {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_QURBAN_ID, 'Program');
  if (!sheet) return [];
  return sheetToObjects_(sheet).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function saveQurbanProgram(data) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_QURBAN_ID, 'Program');
  const now = new Date().toISOString();
  
  // Dynamic column: qris_url
  ensureColumn_(sheet, 'qris_url');
  
  if (data.id) {
    const rowIdx = findRowIndex_(sheet, data.id);
    if (rowIdx === -1) throw new Error('Program not found');
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    headers.forEach((h, i) => {
      if (h === 'id' || h === 'created_at' || h === 'created_by') return;
      if (data[h] !== undefined) sheet.getRange(rowIdx, i + 1).setValue(data[h]);
    });
    return data;
  } else {
    const id = generateId_();
    sheet.appendRow([id, data.judul, data.tahun || new Date().getFullYear(), data.tanggal_qurban || '', 'active', data.created_by || 'admin', now, data.qris_url || '']);
    return { id, ...data };
  }
}

function deleteQurbanProgram(id) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_QURBAN_ID, 'Program');
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx === -1) throw new Error('Program not found');
  sheet.deleteRow(rowIdx);
  return true;
}

function getQurbanPeserta(programId) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_QURBAN_ID, 'Peserta');
  if (!sheet) return [];
  return sheetToObjects_(sheet)
    .filter(d => String(d.program_id) === String(programId))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function saveQurbanPeserta(data) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_QURBAN_ID, 'Peserta');
  const now = new Date().toISOString();
  
  if (data.id) {
    const rowIdx = findRowIndex_(sheet, data.id);
    if (rowIdx === -1) throw new Error('Peserta not found');
    sheet.getRange(rowIdx, 3).setValue(data.nama);
    sheet.getRange(rowIdx, 4).setValue(Number(data.harga));
    sheet.getRange(rowIdx, 5).setValue(data.kelompok || '');
    sheet.getRange(rowIdx, 6).setValue(data.tanggal);
    return data;
  } else {
    const id = generateId_();
    sheet.appendRow([id, data.program_id, data.nama, Number(data.harga), data.kelompok || '', data.tanggal || now.split('T')[0], data.admin_input || 'admin', now]);
    return { id, ...data };
  }
}

function deleteQurbanPeserta(id) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_QURBAN_ID, 'Peserta');
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx === -1) throw new Error('Peserta not found');
  sheet.deleteRow(rowIdx);
  return true;
}

// ==================== PROGRAM MUSTAHIQ MODEL ====================
// Generic per-program mustahiq (penerima bantuan) for infaq/ramadhan/qurban

function getSheetIdByType_(type) {
  const config = getConfig();
  if (type === 'infaq') return config.SHEET_INFAQ_ID;
  if (type === 'ramadhan') return config.SHEET_RAMADHAN_ID;
  if (type === 'qurban') return config.SHEET_QURBAN_ID;
  throw new Error('Unknown program type: ' + type);
}

function ensureSheetExists_(ssId, sheetName, headers) {
  const ss = SpreadsheetApp.openById(ssId);
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
  }
  return sheet;
}

function getProgramMustahiq(type, programId) {
  const ssId = getSheetIdByType_(type);
  const sheet = getSheet_(ssId, 'Mustahiq');
  if (!sheet) return [];
  return sheetToObjects_(sheet)
    .filter(d => String(d.program_id) === String(programId))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function saveProgramMustahiq(data) {
  const ssId = getSheetIdByType_(data.type);
  const sheet = ensureSheetExists_(ssId, 'Mustahiq', ['id', 'program_id', 'nama', 'nominal', 'alamat', 'keterangan', 'admin_input', 'created_at']);
  ensureColumn_(sheet, 'nominal');
  const now = new Date().toISOString();

  if (data.id) {
    const rowIdx = findRowIndex_(sheet, data.id);
    if (rowIdx === -1) throw new Error('Mustahiq not found');
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    headers.forEach((h, i) => {
      if (h === 'id' || h === 'program_id' || h === 'admin_input' || h === 'created_at') return;
      if (h === 'nominal' && data[h] !== undefined) { sheet.getRange(rowIdx, i + 1).setValue(Number(data[h]) || 0); return; }
      if (data[h] !== undefined) sheet.getRange(rowIdx, i + 1).setValue(data[h]);
    });
    return data;
  } else {
    const id = generateId_();
    sheet.appendRow([id, data.program_id, data.nama, Number(data.nominal) || 0, data.alamat || '', data.keterangan || '', data.admin_input || 'admin', now]);
    return { id, ...data, created_at: now };
  }
}

function deleteProgramMustahiq(id, type) {
  const ssId = getSheetIdByType_(type);
  const sheet = getSheet_(ssId, 'Mustahiq');
  if (!sheet) throw new Error('Sheet not found');
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx === -1) throw new Error('Mustahiq not found');
  sheet.deleteRow(rowIdx);
  return true;
}

// ==================== PROGRAM BELANJA MODEL ====================
// Generic per-program belanja/pembelian for infaq/ramadhan/qurban

function getProgramBelanja(type, programId) {
  const ssId = getSheetIdByType_(type);
  const sheet = getSheet_(ssId, 'Belanja');
  if (!sheet) return [];
  return sheetToObjects_(sheet)
    .filter(d => String(d.program_id) === String(programId))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function saveProgramBelanja(data) {
  const ssId = getSheetIdByType_(data.type);
  const sheet = ensureSheetExists_(ssId, 'Belanja', ['id', 'program_id', 'nama_barang', 'jumlah', 'qty', 'keterangan', 'tanggal', 'admin_input', 'created_at']);
  const now = new Date().toISOString();

  if (data.id) {
    const rowIdx = findRowIndex_(sheet, data.id);
    if (rowIdx === -1) throw new Error('Belanja not found');
    sheet.getRange(rowIdx, 3).setValue(data.nama_barang);
    sheet.getRange(rowIdx, 4).setValue(Number(data.jumlah) || 0);
    sheet.getRange(rowIdx, 5).setValue(Number(data.qty) || 1);
    sheet.getRange(rowIdx, 6).setValue(data.keterangan || '');
    sheet.getRange(rowIdx, 7).setValue(data.tanggal);
    return data;
  } else {
    const id = generateId_();
    sheet.appendRow([id, data.program_id, data.nama_barang, Number(data.jumlah) || 0, Number(data.qty) || 1, data.keterangan || '', data.tanggal || now.split('T')[0], data.admin_input || 'admin', now]);
    return { id, ...data, created_at: now };
  }
}

function deleteProgramBelanja(id, type) {
  const ssId = getSheetIdByType_(type);
  const sheet = getSheet_(ssId, 'Belanja');
  if (!sheet) throw new Error('Sheet not found');
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx === -1) throw new Error('Belanja not found');
  sheet.deleteRow(rowIdx);
  return true;
}

// ==================== USERS MODEL ====================

function getUsers() {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_BERITA_ID, 'Users');
  if (!sheet) return [];
  return sheetToObjects_(sheet).map(u => {
    const { password, ...rest } = u;
    return rest;
  });
}

function saveUser(data) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_BERITA_ID, 'Users');
  const now = new Date().toISOString();
  
  if (data.id) {
    const rowIdx = findRowIndex_(sheet, data.id);
    if (rowIdx === -1) throw new Error('User not found');
    sheet.getRange(rowIdx, 2).setValue(data.username);
    if (data.password) sheet.getRange(rowIdx, 3).setValue(data.password);
    sheet.getRange(rowIdx, 4).setValue(data.nama);
    sheet.getRange(rowIdx, 5).setValue(data.role || 'admin');
    sheet.getRange(rowIdx, 6).setValue(data.status || 'active');
    return { id: data.id, username: data.username, nama: data.nama, role: data.role };
  } else {
    const id = generateId_();
    sheet.appendRow([id, data.username, data.password, data.nama, data.role || 'admin', 'active', now]);
    return { id, username: data.username, nama: data.nama, role: data.role };
  }
}

function deleteUser(id) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_BERITA_ID, 'Users');
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx === -1) throw new Error('User not found');
  sheet.deleteRow(rowIdx);
  return true;
}

// ==================== KAJIAN / KEGIATAN MODEL ====================

function getKajianList() {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_KEGIATAN_ID, 'Kajian');
  if (!sheet) return [];
  return sheetToObjects_(sheet).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
}

function getKajianAktif() {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_KEGIATAN_ID, 'Kajian');
  if (!sheet) return [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return sheetToObjects_(sheet)
    .filter(k => {
      const tgl = new Date(k.tanggal);
      tgl.setHours(0, 0, 0, 0);
      return tgl >= now || k.status === 'rutin';
    })
    .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
}

function saveKajian(data) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_KEGIATAN_ID, 'Kajian');
  const now = new Date().toISOString();

  // Handle poster column if it doesn't exist yet
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  let posterIdx = headers.indexOf('poster') + 1;
  if (posterIdx === 0) {
    posterIdx = headers.length + 1;
    sheet.getRange(1, posterIdx).setValue('poster');
  }

  if (data.id) {
    const rowIdx = findRowIndex_(sheet, data.id);
    if (rowIdx === -1) throw new Error('Kajian not found');
    sheet.getRange(rowIdx, 2).setValue(data.judul);
    sheet.getRange(rowIdx, 3).setValue(data.pemateri);
    sheet.getRange(rowIdx, 4).setValue(data.tanggal);
    sheet.getRange(rowIdx, 5).setValue(data.waktu || '');
    sheet.getRange(rowIdx, 6).setValue(data.tempat || '');
    sheet.getRange(rowIdx, 7).setValue(data.deskripsi || '');
    sheet.getRange(rowIdx, 8).setValue(data.status || 'upcoming');
    sheet.getRange(rowIdx, posterIdx).setValue(data.poster || '');
    return data;
  } else {
    const id = generateId_();
    
    // Create an empty row of the right size
    const newRow = new Array(posterIdx).fill('');
    newRow[0] = id;
    newRow[1] = data.judul;
    newRow[2] = data.pemateri;
    newRow[3] = data.tanggal;
    newRow[4] = data.waktu || '';
    newRow[5] = data.tempat || '';
    newRow[6] = data.deskripsi || '';
    newRow[7] = data.status || 'upcoming';
    newRow[8] = data.created_by || 'admin';
    newRow[9] = now;
    newRow[posterIdx - 1] = data.poster || '';
    
    sheet.appendRow(newRow);
    return { id, ...data };
  }
}

function deleteKajian(id) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_KEGIATAN_ID, 'Kajian');
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx === -1) throw new Error('Kajian not found');
  sheet.deleteRow(rowIdx);
  return true;
}

// ==================== JUMAT (PETUGAS SHOLAT JUMAT) MODEL ====================

function getJumatList() {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_KEGIATAN_ID, 'Jumat');
  if (!sheet) return [];
  return sheetToObjects_(sheet).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
}

function getJumatTerdekat() {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_KEGIATAN_ID, 'Jumat');
  if (!sheet) return null;
  const items = sheetToObjects_(sheet).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  if (items.length === 0) return null;
  // Return the most recent entry (could be upcoming or last Friday)
  return items[0];
}

function saveJumat(data) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_KEGIATAN_ID, 'Jumat');
  const now = new Date().toISOString();

  if (data.id) {
    const rowIdx = findRowIndex_(sheet, data.id);
    if (rowIdx === -1) throw new Error('Data Jumat not found');
    sheet.getRange(rowIdx, 2).setValue(data.tanggal);
    sheet.getRange(rowIdx, 3).setValue(data.khotib);
    sheet.getRange(rowIdx, 4).setValue(data.imam);
    sheet.getRange(rowIdx, 5).setValue(data.muadzin);
    sheet.getRange(rowIdx, 6).setValue(data.tema || '');
    return data;
  } else {
    const id = generateId_();
    sheet.appendRow([id, data.tanggal, data.khotib, data.imam, data.muadzin, data.tema || '', data.created_by || 'admin', now]);
    return { id, ...data };
  }
}

function deleteJumat(id) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_KEGIATAN_ID, 'Jumat');
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx === -1) throw new Error('Data Jumat not found');
  sheet.deleteRow(rowIdx);
  return true;
}

// ==================== INVENTARIS MODEL ====================

function getInventarisList() {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_INVENTARIS_ID, 'Inventaris');
  if (!sheet) return [];
  return sheetToObjects_(sheet).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function saveInventaris(data) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_INVENTARIS_ID, 'Inventaris');
  const now = new Date().toISOString();

  if (data.id) {
    const rowIdx = findRowIndex_(sheet, data.id);
    if (rowIdx === -1) throw new Error('Inventaris not found');
    sheet.getRange(rowIdx, 2).setValue(data.nama_barang);
    sheet.getRange(rowIdx, 3).setValue(Number(data.jumlah) || 1);
    sheet.getRange(rowIdx, 4).setValue(data.kondisi || 'Baik');
    sheet.getRange(rowIdx, 5).setValue(data.lokasi || '');
    sheet.getRange(rowIdx, 6).setValue(data.tanggal_pembelian || '');
    sheet.getRange(rowIdx, 7).setValue(Number(data.harga) || 0);
    sheet.getRange(rowIdx, 8).setValue(data.keterangan || '');
    return data;
  } else {
    const id = generateId_();
    sheet.appendRow([id, data.nama_barang, Number(data.jumlah) || 1, data.kondisi || 'Baik', data.lokasi || '', data.tanggal_pembelian || '', Number(data.harga) || 0, data.keterangan || '', data.created_by || 'admin', now]);
    return { id, ...data };
  }
}

function deleteInventaris(id) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_INVENTARIS_ID, 'Inventaris');
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx === -1) throw new Error('Inventaris not found');
  sheet.deleteRow(rowIdx);
  return true;
}

// ==================== MUSTAHIQ MODEL ====================

function getMustahiqList() {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_INVENTARIS_ID, 'Mustahiq');
  if (!sheet) return [];
  return sheetToObjects_(sheet).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function saveMustahiq(data) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_INVENTARIS_ID, 'Mustahiq');
  const now = new Date().toISOString();

  if (data.id) {
    const rowIdx = findRowIndex_(sheet, data.id);
    if (rowIdx === -1) throw new Error('Mustahiq not found');
    sheet.getRange(rowIdx, 2).setValue(data.nama);
    sheet.getRange(rowIdx, 3).setValue(data.alamat || '');
    sheet.getRange(rowIdx, 4).setValue(data.kategori_asnaf || '');
    sheet.getRange(rowIdx, 5).setValue(data.no_hp || '');
    sheet.getRange(rowIdx, 6).setValue(data.jumlah_bantuan || 0);
    sheet.getRange(rowIdx, 7).setValue(data.tanggal_terakhir || '');
    sheet.getRange(rowIdx, 8).setValue(data.keterangan || '');
    sheet.getRange(rowIdx, 9).setValue(data.status || 'aktif');
    return data;
  } else {
    const id = generateId_();
    sheet.appendRow([id, data.nama, data.alamat || '', data.kategori_asnaf || '', data.no_hp || '', Number(data.jumlah_bantuan) || 0, data.tanggal_terakhir || '', data.keterangan || '', data.status || 'aktif', data.created_by || 'admin', now]);
    return { id, ...data };
  }
}

function deleteMustahiq(id) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_INVENTARIS_ID, 'Mustahiq');
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx === -1) throw new Error('Mustahiq not found');
  sheet.deleteRow(rowIdx);
  return true;
}

// ==================== MENU MODEL ====================

function getMenuList() {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_BERITA_ID, 'Menu');
  if (!sheet) return [];
  return sheetToObjects_(sheet).sort((a, b) => Number(a.urutan) - Number(b.urutan));
}

function getPublicMenu() {
  const all = getMenuList();
  const visible = all.filter(m => String(m.tampil) === 'true' || m.tampil === true);
  
  // Separate parents and children
  const parents = visible.filter(m => m.tipe !== 'child').sort((a, b) => Number(a.urutan) - Number(b.urutan));
  const children = visible.filter(m => m.tipe === 'child');
  
  return parents.map(p => {
    const item = { id: p.id, nama: p.nama, link: p.link, icon: p.icon, urutan: p.urutan, tipe: p.tipe };
    if (p.tipe === 'dropdown') {
      item.children = children
        .filter(c => c.parent_id === p.id)
        .sort((a, b) => Number(a.urutan) - Number(b.urutan))
        .map(c => ({ id: c.id, nama: c.nama, link: c.link, icon: c.icon, urutan: c.urutan }));
    }
    return item;
  });
}

function saveMenu(data) {
  const config = getConfig();
  let sheet = getSheet_(config.SHEET_BERITA_ID, 'Menu');
  if (!sheet) {
    const ss = SpreadsheetApp.openById(config.SHEET_BERITA_ID);
    sheet = ss.insertSheet('Menu');
    sheet.appendRow(['id', 'nama', 'link', 'icon', 'urutan', 'tampil', 'tipe', 'parent_id', 'created_at']);
  }
  const now = new Date().toISOString();

  if (data.id) {
    const rowIdx = findRowIndex_(sheet, data.id);
    if (rowIdx === -1) throw new Error('Menu not found');
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    headers.forEach((h, i) => {
      if (h === 'id' || h === 'created_at') return;
      if (data[h] !== undefined) sheet.getRange(rowIdx, i + 1).setValue(data[h]);
    });
    return data;
  } else {
    const id = generateId_();
    sheet.appendRow([id, data.nama || '', data.link || '', data.icon || '', Number(data.urutan) || 0, data.tampil !== false && data.tampil !== 'false', data.tipe || 'item', data.parent_id || '', now]);
    return { id, ...data };
  }
}

function deleteMenu(id) {
  const config = getConfig();
  const sheet = getSheet_(config.SHEET_BERITA_ID, 'Menu');
  const rowIdx = findRowIndex_(sheet, id);
  if (rowIdx === -1) throw new Error('Menu not found');
  // Also delete children if this is a dropdown
  const all = sheetToObjects_(sheet);
  const childIds = all.filter(m => m.parent_id === id).map(c => c.id);
  // Delete from bottom to top to avoid row shifting
  const rowsToDelete = [rowIdx];
  childIds.forEach(cid => {
    const cr = findRowIndex_(sheet, cid);
    if (cr !== -1) rowsToDelete.push(cr);
  });
  rowsToDelete.sort((a, b) => b - a);
  rowsToDelete.forEach(r => sheet.deleteRow(r));
  return true;
}

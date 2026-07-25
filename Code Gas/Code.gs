/**
 * Masjid v2 - Code.gs
 * Main Router - Pure JSON API (Headless Backend)
 * All responses are JSON. No HTML serving.
 */

function doGet(e) {
  return handleRequest_(e);
}

function doPost(e) {
  return handleRequest_(e);
}

function handleRequest_(e) {
  const params = e.parameter || {};
  const action = params.action || '';
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  try {
    let postData = {};
    if (e.postData) {
      try { postData = JSON.parse(e.postData.contents); } catch (err) { /* ignore */ }
    }

    const token = params.token || postData.token || '';
    let result;

    switch (action) {
      // === AUTH ===
      case 'login':
        result = handleLogin_(postData);
        break;
      case 'logout':
        result = handleLogout_(token);
        break;
      case 'validateToken':
        result = handleValidateToken_(token);
        break;

      // === PUBLIC: CONFIG ===
      case 'getPublicConfig':
        result = handleGetPublicConfig_();
        break;
      case 'getJadwalShalat':
        result = { status: 'success', data: getJadwalShalat() };
        break;
      case 'getLogoDataUrl':
        result = { status: 'success', data: getLogoDataUrl() };
        break;
      case 'getQrisDataUrl':
        result = { status: 'success', data: getQrisDataUrl() };
        break;

      // === PUBLIC: BERITA ===
      case 'getBeritaList':
        result = { status: 'success', data: getBeritaList(params.kategori, Number(params.page) || 1, Number(params.limit)) };
        break;
      case 'getBeritaBySlug':
        const berita = getBeritaBySlug(params.slug);
        if (berita) incrementBeritaView(berita.id);
        result = { status: berita ? 'success' : 'error', data: berita };
        break;
      case 'likeBerita':
        result = { status: 'success', data: { likes: likeBerita(params.id || postData.id) } };
        break;
      case 'saveKomentar':
        result = { status: 'success', data: saveKomentar(postData) };
        break;
      // ---> TAMBAHKAN KODE INI:
      case 'getKomentarByBerita':
        result = { status: 'success', data: getKomentarByBerita(params.beritaId || params.id) };
        break;
      // <--- SAMPAI SINI

      // === PUBLIC: KATEGORI ===
      case 'getKategoriList':
        result = { status: 'success', data: getKategoriList() };
        break;

      // === PUBLIC: KEUANGAN ===
      case 'getKeuanganByYear':
        result = { status: 'success', data: getKeuanganByYear(params.year || new Date().getFullYear()) };
        break;
      case 'getKeuanganSummary':
        result = { status: 'success', data: getKeuanganSummary() };
        break;
      case 'getAvailableYears':
        result = { status: 'success', data: getAvailableYears() };
        break;

      // === PUBLIC: INFAQ ===
      case 'getInfaqPrograms':
        result = { status: 'success', data: getInfaqPrograms() };
        break;
      case 'getInfaqProgramById':
        result = { status: 'success', data: getInfaqProgramById(params.id) };
        break;
      case 'getInfaqDonasi':
        result = { status: 'success', data: getInfaqDonasi(params.programId) };
        break;

      // === PUBLIC: RAMADHAN ===
      case 'getRamadhanPrograms':
        result = { status: 'success', data: getRamadhanPrograms() };
        break;
      case 'getRamadhanPemasukan':
        result = { status: 'success', data: getRamadhanPemasukan(params.programId) };
        break;
      case 'getRamadhanPengeluaran':
        result = { status: 'success', data: getRamadhanPengeluaran(params.programId) };
        break;

      // === PUBLIC: QURBAN ===
      case 'getQurbanPrograms':
        result = { status: 'success', data: getQurbanPrograms() };
        break;
      case 'getQurbanPeserta':
        result = { status: 'success', data: getQurbanPeserta(params.programId) };
        break;

      // === ADMIN: BERITA ===
      case 'getAllBerita':
        requireAuth_(token);
        result = { status: 'success', data: getAllBerita() };
        break;
      case 'getBeritaById':
        requireAuth_(token);
        result = { status: 'success', data: getBeritaById(params.id) };
        break;
      case 'saveBerita':
        const authBerita = requireAuth_(token);
        requireWriteAccess_();
        postData.created_by = authBerita.username;
        result = { status: 'success', data: saveBerita(postData) };
        break;
      case 'deleteBerita':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: deleteBerita(params.id || postData.id) };
        break;
      case 'uploadImage':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: uploadImageToDrive(postData.base64Data, postData.filename, postData.mimeType) };
        break;

      // === ADMIN: KATEGORI ===
      case 'saveKategori':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: saveKategori(postData) };
        break;
      case 'deleteKategori':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: deleteKategori(params.id || postData.id) };
        break;

      // === ADMIN: KOMENTAR ===
      case 'getAllKomentar':
        requireAuth_(token);
        result = { status: 'success', data: getAllKomentar() };
        break;
      case 'updateKomentarStatus':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: updateKomentarStatus(postData.id, postData.status) };
        break;
      case 'deleteKomentar':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: deleteKomentar(params.id || postData.id) };
        break;

      // === ADMIN: KEUANGAN ===
      case 'saveKeuangan':
        const authKeu = requireAuth_(token);
        requireWriteAccess_();
        postData.created_by = authKeu.username;
        result = { status: 'success', data: saveKeuangan(postData) };
        break;
      case 'deleteKeuangan':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: deleteKeuangan(postData.id, postData.year) };
        break;

      // === ADMIN: INFAQ ===
      case 'saveInfaqProgram':
        const authInfaq = requireAuth_(token);
        requireWriteAccess_();
        postData.created_by = authInfaq.username;
        result = { status: 'success', data: saveInfaqProgram(postData) };
        break;
      case 'deleteInfaqProgram':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: deleteInfaqProgram(params.id || postData.id) };
        break;
      case 'saveInfaqDonasi':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: saveInfaqDonasi(postData) };
        break;
      case 'deleteInfaqDonasi':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: deleteInfaqDonasi(postData.id, postData.programId) };
        break;

      // === ADMIN: RAMADHAN ===
      case 'saveRamadhanProgram':
        const authRam = requireAuth_(token);
        requireWriteAccess_();
        postData.created_by = authRam.username;
        result = { status: 'success', data: saveRamadhanProgram(postData) };
        break;
      case 'deleteRamadhanProgram':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: deleteRamadhanProgram(params.id || postData.id) };
        break;
      case 'saveRamadhanPemasukan':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: saveRamadhanPemasukan(postData) };
        break;
      case 'deleteRamadhanPemasukan':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: deleteRamadhanPemasukan(postData.id) };
        break;
      case 'saveRamadhanPengeluaran':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: saveRamadhanPengeluaran(postData) };
        break;
      case 'deleteRamadhanPengeluaran':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: deleteRamadhanPengeluaran(postData.id) };
        break;

      // === ADMIN: QURBAN ===
      case 'saveQurbanProgram':
        const authQur = requireAuth_(token);
        requireWriteAccess_();
        postData.created_by = authQur.username;
        result = { status: 'success', data: saveQurbanProgram(postData) };
        break;
      case 'deleteQurbanProgram':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: deleteQurbanProgram(params.id || postData.id) };
        break;
      case 'saveQurbanPeserta':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: saveQurbanPeserta(postData) };
        break;
      case 'deleteQurbanPeserta':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: deleteQurbanPeserta(postData.id) };
        break;

      // === PUBLIC: PROGRAM MUSTAHIQ & BELANJA ===
      case 'getProgramMustahiq':
        result = { status: 'success', data: getProgramMustahiq(params.type, params.programId) };
        break;
      case 'getProgramBelanja':
        result = { status: 'success', data: getProgramBelanja(params.type, params.programId) };
        break;

      // === ADMIN: PROGRAM MUSTAHIQ & BELANJA ===
      case 'saveProgramMustahiq':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: saveProgramMustahiq(postData) };
        break;
      case 'deleteProgramMustahiq':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: deleteProgramMustahiq(postData.id, postData.type) };
        break;
      case 'saveProgramBelanja':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: saveProgramBelanja(postData) };
        break;
      case 'deleteProgramBelanja':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: deleteProgramBelanja(postData.id, postData.type) };
        break;

      // === ADMIN: USERS ===
      case 'getUsers':
        requireAuth_(token);
        result = { status: 'success', data: getUsers() };
        break;
      case 'saveUser':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: saveUser(postData) };
        break;
      case 'deleteUser':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: deleteUser(params.id || postData.id) };
        break;

      // === PUBLIC: KAJIAN & JUMAT ===
      case 'getKajianAktif':
        result = { status: 'success', data: getKajianAktif() };
        break;
      case 'getJumatTerdekat':
        result = { status: 'success', data: getJumatTerdekat() };
        break;

      // === PUBLIC: MENU ===
      case 'getPublicMenu':
        result = { status: 'success', data: getPublicMenu() };
        break;

      // === ADMIN: KAJIAN ===
      case 'getKajianList':
        requireAuth_(token);
        result = { status: 'success', data: getKajianList() };
        break;
      case 'saveKajian':
        const authKajian = requireAuth_(token);
        requireWriteAccess_();
        postData.created_by = authKajian.username;
        result = { status: 'success', data: saveKajian(postData) };
        break;
      case 'deleteKajian':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: deleteKajian(params.id || postData.id) };
        break;

      // === ADMIN: JUMAT ===
      case 'getJumatList':
        requireAuth_(token);
        result = { status: 'success', data: getJumatList() };
        break;
      case 'saveJumat':
        const authJumat = requireAuth_(token);
        requireWriteAccess_();
        postData.created_by = authJumat.username;
        result = { status: 'success', data: saveJumat(postData) };
        break;
      case 'deleteJumat':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: deleteJumat(params.id || postData.id) };
        break;

      // === ADMIN: INVENTARIS ===
      case 'getInventarisList':
        requireAuth_(token);
        result = { status: 'success', data: getInventarisList() };
        break;
      case 'saveInventaris':
        const authInv = requireAuth_(token);
        requireWriteAccess_();
        postData.created_by = authInv.username;
        result = { status: 'success', data: saveInventaris(postData) };
        break;
      case 'deleteInventaris':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: deleteInventaris(params.id || postData.id) };
        break;

      // === ADMIN: MUSTAHIQ ===
      case 'getMustahiqList':
        requireAuth_(token);
        result = { status: 'success', data: getMustahiqList() };
        break;
      case 'saveMustahiq':
        const authMust = requireAuth_(token);
        requireWriteAccess_();
        postData.created_by = authMust.username;
        result = { status: 'success', data: saveMustahiq(postData) };
        break;
      case 'deleteMustahiq':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: deleteMustahiq(params.id || postData.id) };
        break;

      // === ADMIN: MENU ===
      case 'getMenuList':
        requireAuth_(token);
        result = { status: 'success', data: getMenuList() };
        break;
      case 'saveMenu':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: saveMenu(postData) };
        break;
      case 'deleteMenu':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: deleteMenu(params.id || postData.id) };
        break;

      // === ADMIN: CONFIG ===
      case 'getConfig':
        requireAuth_(token);
        result = { status: 'success', data: getConfig() };
        break;
      case 'saveConfig':
        requireAuth_(token);
        requireWriteAccess_();
        result = { status: 'success', data: saveConfig(postData.config || postData) };
        break;

      // === ADMIN: DASHBOARD ===
      case 'getDashboardStats':
        requireAuth_(token);
        result = { status: 'success', data: getDashboardStats() };
        break;

      // === SETUP ===
      case 'setup':
        result = { status: 'success', data: runSetup() };
        break;

      default:
        result = { status: 'error', message: 'Unknown action: ' + action, availableActions: 'login, getBeritaList, getKeuanganSummary, etc.' };
    }

    return jsonOutput_(result, headers);

  } catch (err) {
    const status = err.message === 'UNAUTHORIZED' ? 401 : 500;
    return jsonOutput_({ status: 'error', code: status, message: err.message }, headers);
  }
}

// ==================== AUTH HANDLERS ====================

/**
 * Cek apakah DEMO_MODE aktif. Jika ya, tolak semua operasi tulis (save/delete/update).
 * Digunakan agar website demo bisa dilihat tapi tidak bisa diubah datanya.
 */
function requireWriteAccess_() {
  const config = getConfig();
  if (config.DEMO_MODE === true || config.DEMO_MODE === 'true') {
    throw new Error('Mode demo aktif. Operasi simpan, ubah, dan hapus dinonaktifkan.');
  }
}

function handleLogin_(data) {
  const { username, password } = data;
  if (!username || !password) {
    return { status: 'error', message: 'Username dan password harus diisi' };
  }
  
  const user = authenticateUser(username, password);
  if (!user) {
    return { status: 'error', message: 'Username atau password salah' };
  }
  
  const token = createJWT_({ sub: user.id, username: user.username, nama: user.nama, role: user.role });
  return { status: 'success', data: { token, user } };
}

function handleLogout_(token) {
  if (token) {
    // Blacklist token
    CacheService.getScriptCache().put('blacklist_' + token, 'true', APP_CONFIG.JWT_EXPIRY);
  }
  return { status: 'success', message: 'Logged out' };
}

function handleValidateToken_(token) {
  const payload = verifyJWT_(token);
  if (!payload) {
    return { status: 'error', message: 'Token invalid or expired' };
  }
  return { status: 'success', data: { username: payload.username, nama: payload.nama, role: payload.role } };
}

function handleGetPublicConfig_() {
  const config = getConfig();
  return {
    status: 'success',
    data: {
      NAMA_MASJID: config.NAMA_MASJID,
      LOKASI_MASJID: config.LOKASI_MASJID,
      LATITUDE: config.LATITUDE,
      LONGITUDE: config.LONGITUDE,
      IFRAME_PETA: config.IFRAME_PETA,
      PRIMARY_COLOR: config.PRIMARY_COLOR,
      LOGO_URL: config.LOGO_URL,
      QRIS_URL: config.QRIS_URL,
      DONASI_TEXT: config.DONASI_TEXT || '',
      DEMO_MODE: config.DEMO_MODE || false,
      IS_MASJID: config.IS_MASJID !== false,
      APP_VERSION: APP_CONFIG.APP_VERSION
    }
  };
}

// ==================== RESPONSE HELPER ====================

function jsonOutput_(data, headers) {
  const output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}

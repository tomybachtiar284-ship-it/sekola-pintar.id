/**
 * Sekolah Pintar - Vanilla JS Implementation
 * Migrated from React/Vite/TypeScript
 */

// ==========================================
// DATA & TYPES (Migrated from db.ts & types.ts)
// ==========================================

const UserRole = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN_SEKOLAH: 'Admin Sekolah',
    GURU: 'Guru',
    STAFF_SCAN: 'Staff Scan'
};

const AttendanceStatus = {
    HADIR: 'Hadir',
    TERLAMBAT: 'Terlambat',
    ALPHA: 'Alpha'
};

const STORAGE_KEY = 'qr_presensi_db';
const USER_KEY = 'qr_user';

const initialDB = {
    users: [
        { id: '1', name: 'Super Admin', email: 'admin@system.com', role: UserRole.SUPER_ADMIN },
        { id: '2', name: 'Admin Sekolah A', email: 'admin@sekolah-a.com', role: UserRole.ADMIN_SEKOLAH, sekolahId: 's1' },
        { id: '3', name: 'Budi Santoso (Guru)', email: 'budi@sekolah-a.com', role: UserRole.GURU, sekolahId: 's1' },
        { id: '4', name: 'Petugas Scan', email: 'scanner@sekolah-a.com', role: UserRole.STAFF_SCAN, sekolahId: 's1' },
    ],
    sekolah: [
        { id: 's1', nama: 'SMA Negeri 1 Jakarta', alamat: 'Jl. Merdeka No. 1', logo: 'https://picsum.photos/100/100' },
        { id: 's2', nama: 'SMK Bangsa 2', alamat: 'Jl. Pemuda No. 45', logo: 'https://picsum.photos/101/101' },
    ],
    siswa: [
        {
            id: 'st1',
            nis: '1001',
            nisn: '0012345678',
            nik: '3201010101010001',
            nama: 'Adi Pratama',
            gender: 'L',
            tempatLahir: 'Jakarta',
            tanggalLahir: '2007-05-20',
            agama: 'Islam',
            alamat: 'Jl. Merpati No. 10',
            provinsi: 'DKI Jakarta',
            kabupaten: 'Jakarta Selatan',
            kecamatan: 'Tebet',
            kodePos: '12810',
            foto: '',
            statusAktif: true,
            statusSiswa: 'Aktif',
            kelasId: 'k1',
            tingkat: '12',
            jurusan: 'MIPA',
            tahunAjaran: '2024/2025',
            semester: 'Genap',
            waliKelasId: '3',
            sekolahId: 's1',
            qrCode: '1001'
        },
        {
            id: 'st2',
            nis: '1002',
            nisn: '0012345679',
            nik: '3201010101010002',
            nama: 'Siti Aminah',
            gender: 'P',
            tempatLahir: 'Bandung',
            tanggalLahir: '2007-08-15',
            agama: 'Islam',
            alamat: 'Jl. Kenari No. 5',
            provinsi: 'Jawa Barat',
            kabupaten: 'Bandung',
            kecamatan: 'Cicendo',
            kodePos: '40173',
            foto: '',
            statusAktif: true,
            statusSiswa: 'Aktif',
            kelasId: 'k1',
            tingkat: '12',
            jurusan: 'MIPA',
            tahunAjaran: '2024/2025',
            semester: 'Genap',
            waliKelasId: '3',
            sekolahId: 's1',
            qrCode: '1002'
        },
    ],
    kelas: [
        { id: 'k1', nama: 'XII IPA 1', tingkat: '12', jurusan: 'MIPA', waliKelasId: '3', sekolahId: 's1' },
        { id: 'k2', nama: 'XI IPS 2', tingkat: '11', jurusan: 'IPS', waliKelasId: '', sekolahId: 's1' }
    ],
    mapel: [
        { id: 'm1', nama: 'Matematika Wajib', kode: 'MTK-W', sekolahId: 's1' },
        { id: 'm2', nama: 'Bahasa Indonesia', kode: 'BIN', sekolahId: 's1' },
        { id: 'm3', nama: 'Fisika', kode: 'FIS', sekolahId: 's1' }
    ],
    jadwal: [
        { id: 'j1', kelasId: 'k1', mapelId: 'm1', hari: 'Senin', jamMulai: '07:00', jamSelesai: '08:30', guruId: '3', sekolahId: 's1', status: 'approved' }
    ],
    pengumuman: [
        { id: 'p1', judul: 'Libur Awal Puasa', isi: 'Sekolah diliburkan mulai tanggal 1 Maret untuk menyambut bulan suci Ramadhan.', tanggal: '2025-03-01', authorId: '2', sekolahId: 's1' }
    ],
    pengaturan: {
        namaSekolah: 'SMA Negeri 1 Jakarta',
        alamat: 'Jl. Merdeka No. 1',
        tahunAjaran: '2024/2025',
        semester: 'Genap',
        jamMasuk: '07:00',
        zonaWaktu: 'WIB'
    },
    presensi: [],
    pelanggaran: [
        { id: 'v1', siswaId: 'st1', tanggal: '2025-01-10', jenis: 'Terlambat Masuk Sekolah', kategori: 'Ringan', poin: 5, keterangan: 'Datang jam 07:15', guruId: '3' },
        { id: 'v2', siswaId: 'st2', tanggal: '2025-01-11', jenis: 'Tidak Membawa Buku', kategori: 'Ringan', poin: 5, keterangan: 'Buku Paket Matematika', guruId: '3' },
        { id: 'v3', siswaId: 'st1', tanggal: '2025-01-12', jenis: 'Merokok di Kantin', kategori: 'Berat', poin: 50, keterangan: 'Tertangkap basah jam istirahat', guruId: '3' }
    ],
    prestasi: [
        { id: 'pr1', siswaId: 'st1', tanggal: '2024-12-15', judul: 'Juara 1 Lomba Futsal', tingkat: 'Kota', kategori: 'Non-Akademik', keterangan: 'Kapten Tim Sekolah' },
        { id: 'pr2', siswaId: 'st2', tanggal: '2025-01-05', judul: 'Olimpiade Matematika', tingkat: 'Provinsi', kategori: 'Akademik', keterangan: 'Medali Perak' }
    ],
    teachingArtifacts: []
};

// ==========================================
// STATE MANAGEMENT
// ==========================================

const getTabFromHash = () => window.location.hash.replace('#', '') || localStorage.getItem('activeTab') || 'dashboard';

let state = {
    db: null,
    user: null,
    activeTab: getTabFromHash(),
    scanMessage: null,
    isSidebarOpen: false,
    expandedMenus: (() => {
        try {
            return JSON.parse(localStorage.getItem('expandedMenus')) || [];
        } catch (e) {
            return [];
        }
    })()
};

// Initialize DB
function getDB() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        return initialDB;
    }
    // Migration: Add new fields if they don't exist in stored DB
    const db = JSON.parse(stored);
    if (!db.kelas) db.kelas = initialDB.kelas;
    if (!db.mapel) db.mapel = initialDB.mapel;
    if (!db.jadwal) db.jadwal = initialDB.jadwal;
    if (!db.pengumuman) db.pengumuman = initialDB.pengumuman;
    if (!db.pengaturan) db.pengaturan = initialDB.pengaturan;
    if (!db.pelanggaran) db.pelanggaran = initialDB.pelanggaran;
    if (!db.prestasi) db.prestasi = initialDB.prestasi;
    if (!db.teachingArtifacts) db.teachingArtifacts = initialDB.teachingArtifacts;

    // Migration: Ensure new roles/users exist
    const scannerUser = initialDB.users.find(u => u.role === UserRole.STAFF_SCAN);
    if (scannerUser && !db.users.find(u => u.role === UserRole.STAFF_SCAN)) {
        db.users.push(scannerUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); // Force save
    }

    return db;
}

function saveDB(db) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    state.db = db; // Update local state reference
}

function getUser() {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
}

function setUser(user) {
    if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(USER_KEY);
    }
    state.user = user;
    renderApp();
}

// ==========================================
// CORE APP LOGIC
// ==========================================

// Navigation Helper
window.navigate = (tabId) => {
    state.activeTab = tabId;
    window.location.hash = tabId;
    localStorage.setItem('activeTab', tabId);
    state.isSidebarOpen = false;
    expandParentMenu(tabId);
    renderApp();
};

window.toggleMenu = (menuId) => {
    const index = state.expandedMenus.indexOf(menuId);
    if (index === -1) {
        state.expandedMenus.push(menuId);
    } else {
        state.expandedMenus.splice(index, 1);
    }
    localStorage.setItem('expandedMenus', JSON.stringify(state.expandedMenus));
    renderApp(); // Re-render to update UI
};

// Handle Back/Forward Browser Buttons
window.addEventListener('hashchange', () => {
    const newTab = window.location.hash.replace('#', '');
    if (newTab && newTab !== state.activeTab) {
        state.activeTab = newTab;
        expandParentMenu(newTab);
        renderApp();
    }
});

function initApp() {
    state.db = getDB();
    state.user = getUser();

    // Priority: 1. Hash, 2. LocalStorage, 3. Dashboard
    const rawHash = window.location.hash.replace('#', '');
    const storedTab = localStorage.getItem('activeTab');

    if (rawHash) {
        state.activeTab = rawHash;
        localStorage.setItem('activeTab', rawHash);
    } else if (storedTab) {
        state.activeTab = storedTab;
        window.location.hash = storedTab;
    } else {
        state.activeTab = 'dashboard';
        window.location.hash = 'dashboard';
        localStorage.setItem('activeTab', 'dashboard');
    }

    // Force URL update to ensure consistency
    if (state.activeTab && window.location.hash.replace('#', '') !== state.activeTab) {
        window.location.hash = state.activeTab;
    }

    expandParentMenu(state.activeTab);

    renderApp();
}

// Global Event Listeners
window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && state.isSidebarOpen) {
        state.isSidebarOpen = false;
        renderApp();
    }
});


function renderApp() {
    const root = document.getElementById('root');
    root.innerHTML = '';

    if (!state.user) {
        root.appendChild(renderLogin());
    } else {
        root.appendChild(renderLayout());
        initIcons();
        if (state.activeTab === 'dashboard') initDashboardCharts();
        if (state.activeTab === 'scan') initScanner();
    }

    // Ensure Hash always matches State
    const currentHash = window.location.hash.replace('#', '');
    if (state.activeTab && currentHash !== state.activeTab) {
        window.location.hash = state.activeTab;
    }
}

function initIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// ==========================================
// COMPONENTS
// ==========================================

function getMenuItems() {
    return [
        { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN_SEKOLAH, UserRole.GURU, UserRole.STAFF_SCAN] },
        { id: 'schools', label: 'Sekolah', icon: 'school', roles: [UserRole.SUPER_ADMIN] },
        { id: 'teachers', label: 'Guru', icon: 'user-check', roles: [UserRole.ADMIN_SEKOLAH] },
        { id: 'students', label: 'Siswa', icon: 'users', roles: [UserRole.ADMIN_SEKOLAH, UserRole.GURU] },
        { id: 'classes', label: 'Data Kelas', icon: 'layout-grid', roles: [UserRole.ADMIN_SEKOLAH, UserRole.GURU] },
        { id: 'subjects', label: 'Mata Pelajaran', icon: 'book', roles: [UserRole.ADMIN_SEKOLAH, UserRole.GURU] },
        { id: 'scan', label: 'Scan Presensi', icon: 'qr-code', roles: [UserRole.STAFF_SCAN] },
        { id: 'schedules', label: 'Jadwal Pelajaran', icon: 'calendar-clock', roles: [UserRole.ADMIN_SEKOLAH, UserRole.GURU] },
        { id: 'reports', label: 'Laporan', icon: 'file-text', roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN_SEKOLAH, UserRole.GURU] },
        { id: 'announcements', label: 'Pengumuman', icon: 'megaphone', roles: [UserRole.ADMIN_SEKOLAH, UserRole.GURU] },
        {
            id: 'behavior',
            label: 'Catatan Sikap',
            icon: 'clipboard-list',
            roles: [UserRole.GURU],
            subItems: [
                { id: 'violations', label: 'Pelanggaran', icon: 'alert-triangle' },
                { id: 'achievements', label: 'Prestasi', icon: 'award' }
            ]
        },
        {
            id: 'learning-docs',
            label: 'Dokumen Pembelajaran',
            icon: 'book-open',
            roles: [UserRole.ADMIN_SEKOLAH, UserRole.GURU],
            subItems: [
                { id: 'teaching-modules', label: 'Modul Ajar', icon: 'file-text' },
                { id: 'rpp', label: 'RPP', icon: 'file-check' },
                { id: 'syllabus', label: 'Silabus', icon: 'list' }
            ]
        },
        {
            id: 'teaching-journal',
            label: 'Jurnal Mengajar',
            icon: 'book',
            roles: [UserRole.ADMIN_SEKOLAH, UserRole.GURU],
            subItems: [
                { id: 'todays-material', label: 'Materi Hari Ini', icon: 'book-open' },
                { id: 'teaching-hours', label: 'Jam Mengajar', icon: 'clock' },
                { id: 'class-notes', label: 'Catatan Kelas', icon: 'clipboard' },
                { id: 'create-quiz', label: 'Bank Soal', icon: 'file-question' }
            ]
        },
        { id: 'settings', label: 'Pengaturan', icon: 'settings', roles: [UserRole.ADMIN_SEKOLAH] },
    ];
}

function expandParentMenu(tabId) {
    const items = getMenuItems();
    for (const item of items) {
        if (item.subItems) {
            const hasChild = item.subItems.some(sub => sub.id === tabId);
            if (hasChild) {
                if (!state.expandedMenus.includes(item.id)) {
                    state.expandedMenus.push(item.id);
                    localStorage.setItem('expandedMenus', JSON.stringify(state.expandedMenus));
                }
            }
        }
    }
}

// --- LOGIN COMPONENT ---
function renderLogin() {
    const container = document.createElement('div');
    container.className = "min-h-screen flex flex-col items-center justify-center bg-indigo-900 p-6";

    container.innerHTML = `
        <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div class="bg-indigo-600 p-8 text-white text-center">
            <div class="w-auto h-24 flex items-center justify-center mx-auto mb-4">
              <img src="assets/logo.png" alt="Logo Sekolah Pintar" class="h-full object-contain filter drop-shadow-md" />
            </div>
            <h1 class="text-2xl font-bold">sekolah-pintar.id</h1>
            <p class="text-indigo-100 mt-2">Sistem Multi-Role Presensi</p>
          </div>
          <form id="loginForm" class="p-8">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input type="email" id="emailInput" placeholder="admin@sekolah-a.com" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" required />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <input type="password" value="123456" disabled class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400" />
              </div>
            </div>
            <button type="submit" class="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all transform active:scale-[0.98]">
              Masuk Sekarang
            </button>
            <div class="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
              <p>Admin Sekolah: admin@sekolah-a.com</p>
              <p>Guru Sekolah: budi@sekolah-a.com</p>
              <p>Staff Scan: scanner@sekolah-a.com</p>
              <p>Super Admin: admin@system.com</p>
            </div>
          </form>
        </div>
    `;

    setTimeout(() => {
        const form = container.querySelector('#loginForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('emailInput').value.toLowerCase();
            const foundUser = state.db.users.find(u => u.email === email);
            if (foundUser) {
                setUser(foundUser);
                setUser(foundUser);
            } else {
                alert('Email tidak ditemukan. Coba: admin@sekolah-a.com, budi@sekolah-a.com, atau scanner@sekolah-a.com');
            }
        });
        initIcons();
    }, 0);

    return container;
}

// --- LAYOUT COMPONENT ---
function renderLayout() {
    const wrapper = document.createElement('div');
    wrapper.className = "flex h-screen bg-gray-50 overflow-hidden font-sans";

    // Sidebar Content Logic
    const menuItems = getMenuItems();

    // Badge Logic
    const announcements = state.db.pengumuman.filter(a => a.sekolahId === state.user.sekolahId && a.status === 'sent');
    const lastRead = localStorage.getItem(`last_read_announcements_${state.user.id}`) || '1970-01-01';
    const unreadCount = announcements.filter(a => new Date(a.tanggal) > new Date(lastRead)).length;

    const menuWithBadges = menuItems.map(item => {
        if (item.id === 'announcements' && unreadCount > 0) {
            return { ...item, badge: unreadCount };
        }
        return item;
    });

    const filteredItems = menuWithBadges.filter(item => item.roles.includes(state.user.role));
    const activeItem = filteredItems.find(i => i.id === state.activeTab);
    const pageTitle = activeItem ? activeItem.label : 'Aplikasi Presensi';

    const getSidebarHTML = () => `
        <div class="flex flex-col h-full bg-[#1e3a5f] text-white w-64 shrink-0 transition-all duration-300 relative z-40">
            <!-- Brand -->
            <!-- Brand -->
            <!-- Brand -->
            <div class="p-6 pb-2 text-center">
                <div class="flex items-center justify-center mb-5">
                     <div class="w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-2xl border-[5px] border-white/10 relative overflow-hidden group hover:scale-105 transition-transform duration-300">
                        <div class="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-blue-100 opacity-50"></div>
                        <img src="assets/logo.png" alt="Logo" class="w-[85%] h-[85%] object-contain relative z-10 drop-shadow-md" />
                     </div>
                </div>
                 <p class="text-blue-200 text-[10px] uppercase font-bold tracking-[0.2em] border-b border-blue-800/50 pb-4">
                    ${state.user.role.replace('_', ' ')}
                </p>
            </div>

            <!-- Nav -->
            <nav class="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar py-4">
                ${filteredItems.map(item => {
        if (item.subItems) {

            const isChildActive = item.subItems.some(sub => sub.id === state.activeTab);
            const isExpanded = state.expandedMenus.includes(item.id);

            return `
                        <div class="mb-2">
                             <button type="button" onclick="window.toggleMenu('${item.id}')" class="w-full flex items-center justify-between gap-3 px-4 py-3 text-blue-200 uppercase tracking-wider text-[10px] font-bold mt-2 mb-1 hover:text-white group">
                                <span class="flex-1 text-left">${item.label}</span>
                                <i data-lucide="chevron-down" class="w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}"></i>
                            </button>
                            <div class="space-y-1 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}"> 
                                ${item.subItems.map(sub => `
                                    <button type="button" onclick="window.navigate('${sub.id}')"
                                        class="w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 group relative overflow-hidden ${state.activeTab === sub.id
                    ? 'ribbon-menu bg-[#22d3ee] text-[#1e3a5f] font-bold shadow-lg ml-2'
                    : 'text-blue-200 hover:bg-white/5 hover:text-white rounded-xl'
                }">
                                        <div class="relative z-10 flex items-center gap-3 w-full pl-2">
                                            <i data-lucide="${sub.icon}" class="w-4 h-4 transition-transform group-hover:scale-110"></i>
                                            <span class="text-sm tracking-wide">${sub.label}</span>
                                        </div>
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                        `;
        }

        return `
                    <button type="button" onclick="window.navigate('${item.id}')"
                        class="w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 group relative overflow-hidden ${state.activeTab === item.id
                ? 'ribbon-menu bg-[#22d3ee] text-[#1e3a5f] font-bold shadow-lg -mr-4 pr-8 pl-6'
                : 'text-blue-200 hover:bg-white/5 hover:text-white rounded-xl'
            }">
                        <div class="relative z-10 flex items-center gap-3 w-full">
                            <i data-lucide="${item.icon}" class="w-5 h-5 transition-transform group-hover:scale-110"></i>
                            <span class="text-sm tracking-wide">${item.label}</span>
                             ${item.id === 'scan' ? '<span class="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>' : ''}
                             ${item.badge ? `<span class="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm animate-pulse">${item.badge}</span>` : ''}
                        </div>
                    </button>
                `}).join('')}
            </nav>

            <!-- Bottom User Info with Decorative Footer -->
            <div class="relative mt-auto">
                <!-- Decorative Wave SVG -->
                <div class="absolute bottom-0 left-0 w-full h-24 overflow-hidden pointer-events-none z-0">
                    <svg preserveAspectRatio="none" viewBox="0 0 300 100" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <!-- Teal Accent -->
                        <path d="M0 100 V60 Q80 40 160 70 T320 60 V100 Z" fill="#22d3ee" opacity="0.2" />
                        <!-- White Accent -->
                        <path d="M0 100 V80 Q100 60 200 85 T320 80 V100 Z" fill="#ffffff" opacity="0.1" />
                    </svg>
                </div>

                 <div class="relative z-10 p-4 bg-gradient-to-t from-[#0f2440] to-transparent">
                     <button onclick="window.logout()" class="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 text-xs font-bold uppercase tracking-widest group border border-transparent hover:border-red-400/30">
                        <i data-lucide="log-out" class="w-4 h-4 group-hover:-translate-x-1 transition-transform text-red-400 group-hover:text-red-200"></i>
                        <span>Keluar Aplikasi</span>
                    </button>
                    <p class="text-[9px] text-center text-blue-400/60 mt-2 font-mono">v2.4.0-stable</p>
                </div>
            </div>
        </div>
    `;

    // Wrapper innerHTML
    wrapper.innerHTML = `
        <!-- Overlay for mobile -->
        <div id="sidebarOverlay" class="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity ${state.isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}" onclick="window.toggleSidebar()"></div>

        <!-- Sidebar Container -->
        <div class="fixed inset-y-0 left-0 z-50 transform md:transform-none md:static transition-transform duration-300 ease-in-out ${state.isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 bg-[#1e3a5f] flex flex-col h-full shadow-2xl">
            ${getSidebarHTML()}
        </div>

        <!-- Content Area -->
        <div class="flex-1 flex flex-col min-w-0 bg-gray-50 h-screen relative">
            
            <!-- HEADER -->
            <header class="relative h-auto md:h-24 shrink-0 z-30 pt-4 px-4 bg-transparent overflow-visible">
                
                <div class="relative h-full flex flex-col md:flex-row items-start md:items-center justify-between pointer-events-none">
                     
                     <!-- Left Ribbon (Title) -->
                    <div class="ribbon-left bg-[#1e3a5f] text-white py-3 md:py-4 pl-6 md:pl-8 pr-12 md:pr-16 shadow-lg relative z-20 pointer-events-auto min-w-[280px] md:min-w-[400px]">
                        <div class="flex items-center gap-3 md:gap-4">
                             <button class="md:hidden p-1 text-white hover:bg-white/20 rounded focus:outline-none focus:ring-2 focus:ring-white/50" onclick="window.toggleSidebar()">
                                <i data-lucide="menu" class="w-6 h-6"></i>
                            </button>
                            <div>
                                 <h2 class="text-xl md:text-2xl font-black uppercase tracking-wider leading-none font-sans drop-shadow-md">
                                    ${pageTitle}
                                </h2>
                                <p class="text-[10px] text-blue-200 font-bold tracking-[0.2em] mt-1 border-t border-blue-400/30 pt-1 inline-block">SEKOLAH PINTAR INDONESIA</p>
                            </div>
                        </div>
                    </div>

                    <!-- Right Ribbon (User Info) -->
                    <!-- Right Ribbon (User Info) & Logo -->
                    <div class="flex items-center self-end md:self-auto -mt-2 md:mt-0 md:-ml-8 z-10 pointer-events-auto relative">
                        <!-- Logo Dinas -->
                         <img src="assets/logo_dinas.png" alt="Logo Dinas" class="h-24 w-24 object-contain filter drop-shadow-[0_8px_8px_rgba(0,0,0,0.3)] relative z-20 mr-4 mb-2 md:mb-0 animate-float" />

                        <div class="ribbon-right bg-[#22d3ee] py-2 md:py-3 pl-12 md:pl-16 pr-6 md:pr-8 shadow-lg relative z-10 min-w-[260px] md:min-w-[350px]">
                            <div class="flex items-center justify-end gap-3 md:gap-4 text-right">
                                <div class="hidden sm:block">
                                     <p class="text-[10px] font-black text-[#0f2440] uppercase tracking-widest leading-tight">
                                        ${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
                                    </p>
                                    <p class="text-sm font-bold text-[#1e3a5f] leading-tight">
                                        ${state.user.name}
                                    </p>
                                </div>
                                <div class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center font-bold text-sm md:text-lg border-2 border-white shadow-sm uppercase shrink-0">
                                    ${state.user.name.charAt(0)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- MAIN SCROLLABLE CONTENT -->
            <main id="mainContent" class="flex-1 overflow-y-auto w-full max-w-full p-6 pb-20 scroll-smooth">
                <!-- Content injected here -->
            </main>

            <!-- FOOTER -->
            <footer class="mt-auto z-30 shrink-0">
                <div class="flex justify-end">
                     <div class="ribbon-right bg-[#1e3a5f] text-white py-2 px-12 md:px-20 shadow-[-5px_-5px_15px_rgba(0,0,0,0.1)] mb-4 mr-0 md:mr-8 min-w-[300px] text-right">
                        <p class="text-[10px] font-medium tracking-wider">
                            &copy; 2026 <span class="text-cyan-400 font-bold">SEKOLAH-PINTAR.ID</span>
                        </p>
                     </div>
                </div>
            </footer>
        </div>
    `;

    // Inject active content
    const mainContent = wrapper.querySelector('#mainContent');
    mainContent.appendChild(renderContent());

    return wrapper;
}


function renderContent() {
    switch (state.activeTab) {
        case 'dashboard': return renderDashboard();
        case 'scan': return renderScan();
        case 'students': return renderStudents();
        case 'teachers': return renderTeachers();
        case 'schools': return renderList('schools');
        case 'classes': return renderClasses();
        case 'subjects': return renderSubjects();
        case 'schedules': return renderSchedule();
        case 'announcements': return renderAnnouncements();
        case 'settings': return renderSettings();
        case 'reports': return renderReports();
        case 'violations': return renderViolations();
        case 'achievements': return renderAchievements();
        case 'teaching-modules': return renderTeachingModules();
        case 'rpp': return renderRPP();
        case 'syllabus': return renderSyllabus();
        case 'todays-material': return renderTodaysMaterial();
        case 'teaching-hours': return renderTeachingHours();
        case 'class-notes': return renderClassNotes();
        case 'create-quiz': return renderCreateQuiz();
        default: return renderDashboard();
    }
}

// --- DASHBOARD COMPONENT ---
function renderDashboard() {
    const container = document.createElement('div');
    container.className = "space-y-8 fade-in";

    // Stats calculation
    const today = new Date().toISOString().split('T')[0];
    let relevantPresensi = state.db.presensi;
    let relevantSiswa = state.db.siswa;

    if (state.user?.role === UserRole.ADMIN_SEKOLAH || state.user?.role === UserRole.GURU) {
        relevantPresensi = state.db.presensi.filter(p => p.sekolahId === state.user.sekolahId);
        relevantSiswa = state.db.siswa.filter(s => s.sekolahId === state.user.sekolahId);
    }

    const todayPresensi = relevantPresensi.filter(p => p.tanggal === today);
    const totalSiswa = relevantSiswa.length;
    const hadir = todayPresensi.filter(p => p.status === AttendanceStatus.HADIR).length;
    const terlambat = todayPresensi.filter(p => p.status === AttendanceStatus.TERLAMBAT).length;
    const tidakHadir = totalSiswa - (hadir + terlambat);

    // HTML Construction
    let adminScanButton = '';
    if (state.user.role === UserRole.STAFF_SCAN) {
        adminScanButton = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button type="button" onclick="window.navigate('scan')" class="md:col-span-2 bg-[#1e3a5f] rounded-2xl p-8 text-white shadow-xl shadow-slate-900/20 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group transition-all hover:bg-[#162c46] pointer">
            <!-- Decorative Wave SVG (Bottom) -->
            <div class="absolute bottom-0 left-0 w-full h-24 overflow-hidden pointer-events-none z-0">
                <svg preserveAspectRatio="none" viewBox="0 0 300 100" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <!-- Teal Accent -->
                    <path d="M0 100 V60 Q80 40 160 70 T320 60 V100 Z" fill="#22d3ee" opacity="0.2" />
                    <!-- White Accent -->
                    <path d="M0 100 V80 Q100 60 200 85 T320 80 V100 Z" fill="#ffffff" opacity="0.1" />
                </svg>
            </div>
            
            <div class="relative z-10 text-center md:text-left">
              <div class="flex items-center justify-center md:justify-start gap-2 mb-3">
                <span class="px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1 border border-white/10">
                  <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  ADMIN SCANNER
                </span>
              </div>
              </div>
              <h3 class="text-3xl font-extrabold mb-2">Mulai Scan Presensi</h3>
              <p class="text-slate-300 text-sm max-w-sm">Akses khusus Staff Scan untuk memproses absensi siswa.</p>
            </div>
            <div class="relative z-10 bg-white p-5 rounded-2xl text-[#1e3a5f] shadow-xl group-hover:scale-110 transition-transform">
              <i data-lucide="qr-code" class="w-12 h-12"></i>
            </div>
          </button>
          
           <div class="flex flex-col gap-4">
             <button type="button" onclick="window.navigate('students')" class="flex-1 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
                <div class="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <i data-lucide="users" class="w-6 h-6"></i>
                </div>
                <div class="text-left">
                  <p class="font-bold text-gray-900">Data Siswa</p>
                  <p class="text-xs text-gray-500">Kelola daftar siswa</p>
                </div>
             </button>
             <button type="button" onclick="window.navigate('reports')" class="flex-1 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
                <div class="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <i data-lucide="clipboard-list" class="w-6 h-6"></i>
                </div>
                <div class="text-left">
                  <p class="font-bold text-gray-900">Rekap Laporan</p>
                  <p class="text-xs text-gray-500">Lihat histori absen</p>
                </div>
             </button>
          </div>
        </div>
        `;
    } else {
        adminScanButton = `
        <div class="bg-white border border-indigo-100 rounded-2xl p-6 flex items-center justify-between">
           <div>
              <h3 className="text-xl font-bold text-gray-900">Selamat Datang, ${state.user.name}</h3>
              <p className="text-gray-500 text-sm">Role Anda: <span className="font-bold text-indigo-600">${state.user.role.replace('_', ' ')}</span></p>
           </div>
           ${state.user.role === UserRole.GURU ? `
             <div class="text-right text-xs text-amber-600 font-medium bg-amber-50 px-3 py-2 rounded-lg border border-amber-100 italic">
               Akses scan hanya tersedia bagi Admin Sekolah
             </div>
           ` : ''}
        </div>
        `;
    }

    const activityList = relevantPresensi.length === 0 ? `
        <div class="text-center py-12 text-gray-400">
            <i data-lucide="alert-circle" class="w-12 h-12 mx-auto mb-2 opacity-20"></i>
            <p>Belum ada data</p>
        </div>
    ` : relevantPresensi.slice(-5).reverse().map(p => {
        const student = state.db.siswa.find(s => s.id === p.siswaId);
        return `
            <div class="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-indigo-600 font-bold">
                    ${student?.nama.charAt(0)}
                </div>
                <div>
                    <p class="text-sm font-bold text-gray-900">${student?.nama}</p>
                    <p class="text-[10px] text-gray-500 uppercase font-medium">${student?.kelas} • ${p.jamMasuk}</p>
                </div>
                </div>
                <span class="text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide ${p.status === AttendanceStatus.HADIR ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
                    ${p.status}
                </span>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        ${adminScanButton}

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div class="w-10 h-10 mb-3 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><i data-lucide="users" class="w-5 h-5"></i></div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Siswa</p>
                <p class="text-2xl font-bold text-gray-900">${totalSiswa}</p>
            </div>
            <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div class="w-10 h-10 mb-3 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><i data-lucide="check-circle-2" class="w-5 h-5"></i></div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Hadir</p>
                <p class="text-2xl font-bold text-gray-900">${hadir}</p>
            </div>
            <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div class="w-10 h-10 mb-3 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><i data-lucide="clock" class="w-5 h-5"></i></div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Terlambat</p>
                <p class="text-2xl font-bold text-gray-900">${terlambat}</p>
            </div>
             <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div class="w-10 h-10 mb-3 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center"><i data-lucide="x-circle" class="w-5 h-5"></i></div>
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Absen</p>
                <p class="text-2xl font-bold text-gray-900">${tidakHadir}</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 class="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <i data-lucide="calendar" class="w-5 h-5 text-indigo-500"></i>
                    Statistik Kehadiran
                </h3>
                <div class="chart-container">
                    <canvas id="attendanceChart"></canvas>
                </div>
            </div>

            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 class="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <i data-lucide="clock" class="w-5 h-5 text-indigo-500"></i>
                    Aktivitas Terakhir
                </h3>
                <div class="space-y-3">
                    ${activityList}
                </div>
            </div>
        </div>
    `;
    return container;
}

function initDashboardCharts() {
    // Stats re-calc for chart
    const today = new Date().toISOString().split('T')[0];
    let relevantPresensi = state.db.presensi;
    let relevantSiswa = state.db.siswa;
    if (state.user?.role === UserRole.ADMIN_SEKOLAH || state.user?.role === UserRole.GURU) {
        relevantPresensi = state.db.presensi.filter(p => p.sekolahId === state.user.sekolahId);
        relevantSiswa = state.db.siswa.filter(s => s.sekolahId === state.user.sekolahId);
    }
    const todayPresensi = relevantPresensi.filter(p => p.tanggal === today);
    const totalSiswa = relevantSiswa.length;
    const hadir = todayPresensi.filter(p => p.status === AttendanceStatus.HADIR).length;
    const terlambat = todayPresensi.filter(p => p.status === AttendanceStatus.TERLAMBAT).length;
    const tidakHadir = totalSiswa - (hadir + terlambat);

    const ctx = document.getElementById('attendanceChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Hadir', 'Terlambat', 'Absen'],
                datasets: [{
                    label: 'Siswa',
                    data: [hadir, terlambat, tidakHadir],
                    backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
                    borderRadius: 6,
                    barThickness: 40
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, grid: { display: false } },
                    x: { grid: { display: false } }
                }
            }
        });
    }
}

// --- SCANNER COMPONENT ---
function renderScan() {
    const container = document.createElement('div');
    container.className = "max-w-2xl mx-auto space-y-8 fade-in";
    container.innerHTML = `
        <div class="text-center">
            <h3 class="text-2xl font-bold text-gray-900">Halaman Scan Admin</h3>
            <p class="text-gray-500 mt-2">Posisikan QR Code siswa di dalam area kotak scanner</p>
        </div>

        <div class="relative w-full max-w-md mx-auto aspect-square overflow-hidden rounded-2xl bg-black shadow-xl ring-4 ring-indigo-500/20">
            <div id="reader" class="w-full h-full"></div>
            <div id="scanOverlay" class="absolute inset-0 z-10 bg-black/60 flex flex-col items-center justify-center text-white p-4 text-center hidden">
                 <i data-lucide="refresh-cw" class="w-12 h-12 animate-spin text-indigo-400 mb-4"></i>
                 <p class="font-medium">Memproses Presensi...</p>
            </div>
            <div class="absolute bottom-4 left-0 right-0 z-10 flex justify-center">
                <div class="px-4 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-white text-xs font-medium flex items-center gap-2">
                    <i data-lucide="camera" class="w-3.5 h-3.5"></i>
                    Arahkan QR Code ke Kotak
                </div>
            </div>
        </div>

        <div id="scanResult" class="hidden p-4 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in duration-300 border-2"></div>

        <div class="bg-amber-50 p-6 rounded-2xl border border-amber-100">
            <h4 class="font-bold text-amber-900 mb-3 flex items-center gap-2 text-sm uppercase">
                <i data-lucide="alert-circle" class="w-4 h-4"></i>
                Kontrol Keamanan
            </h4>
            <p class="text-xs text-amber-700">
                Fitur scan ini hanya dapat dioperasikan oleh akun <strong>Admin Sekolah</strong>. 
                Pastikan Anda memiliki izin akses kamera sebelum memulai sesi scan.
            </p>
        </div>
    `;
    return container;
}

// --- LEARNING DOCUMENTS & JOURNAL IMPLEMENTATION ---
function renderTeachingModules() {
    return renderArtifactsPage('modul-ajar', 'Modul Ajar', 'Kelola semua modul ajar Anda.');
}

function renderRPP() {
    return renderArtifactsPage('rpp', 'RPP', 'Rencana Pelaksanaan Pembelajaran.');
}

function renderSyllabus() {
    return renderArtifactsPage('silabus', 'Silabus', 'Arsip silabus pembelajaran.');
}

function renderTodaysMaterial() {
    return renderArtifactsPage('materi-harian', 'Materi Hari Ini', 'Log materi yang diajarkan.');
}

function renderTeachingHours() {
    return renderArtifactsPage('jam-mengajar', 'Jam Mengajar', 'Laporan jam mengajar.');
}

function renderClassNotes() {
    return renderArtifactsPage('catatan-kelas', 'Catatan Kelas', 'Catatan penting kejadian di kelas.');
}

function renderCreateQuiz() {
    return renderArtifactsPage('soal', 'Bank Soal', 'Kelola bank soal dan kuis Anda.');
}

// --- GENERIC ARTIFACT SYSTEM ---
function renderArtifactsPage(type, title, subtitle) {
    const container = document.createElement('div');
    container.className = "space-y-6 fade-in";

    // Data Filtering
    let artifacts = state.db.teachingArtifacts.filter(a => a.type === type && a.sekolahId === state.user.sekolahId);

    // Role Based Visibility
    const isGuru = state.user.role === UserRole.GURU;
    const isAdmin = state.user.role === UserRole.ADMIN_SEKOLAH;

    if (isGuru) {
        // Teachers see ONLY their own artifacts
        artifacts = artifacts.filter(a => a.guruId === state.user.id);
    } else if (isAdmin) {
        // Admins see SENT and RECEIVED artifacts
        artifacts = artifacts.filter(a => a.status === 'sent' || a.status === 'received');

        // Apply Filters
        if (window.artifactFilterMonth) {
            artifacts = artifacts.filter(a => new Date(a.tanggal).getMonth() + 1 === parseInt(window.artifactFilterMonth));
        }
        if (window.artifactFilterTeacher) {
            artifacts = artifacts.filter(a => a.guruId === window.artifactFilterTeacher);
        }
    }

    // Sort by Date Descending
    artifacts.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    // Helper for Teacher Name (for Admin View)
    const getTeacherName = (id) => {
        const t = state.db.users.find(u => u.id === id);
        return t ? t.name : 'Unknown Guru';
    };

    container.innerHTML = `
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-900">${title}</h2>
                <p class="text-gray-500 text-sm">${subtitle}</p>
            </div>
            ${isGuru ? `
            <button onclick="window.showArtifactModal('${type}', '${title}')" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-200 transition-all flex items-center gap-2">
                <i data-lucide="plus-circle" class="w-5 h-5"></i>
                Buat Baru
            </button>
            ` : ''}
        </div>

        ${isAdmin ? `
        <!-- Admin Filters -->
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Filter:</span>
            
            <select onchange="window.artifactFilterMonth = this.value; renderApp()" class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Semua Bulan</option>
                ${['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map((m, i) => `<option value="${i + 1}" ${window.artifactFilterMonth == i + 1 ? 'selected' : ''}>${m}</option>`).join('')}
            </select>

            <select onchange="window.artifactFilterTeacher = this.value; renderApp()" class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Semua Guru</option>
                ${state.db.users.filter(u => u.role === UserRole.GURU && u.sekolahId === state.user.sekolahId).map(t => `<option value="${t.id}" ${window.artifactFilterTeacher === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
            </select>
        </div>
        ` : ''}

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${artifacts.length === 0 ? `
                <div class="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <i data-lucide="folder-open" class="w-12 h-12 mx-auto mb-3 opacity-20"></i>
                    <p>${isGuru ? 'Belum ada dokumen. Silakan buat baru.' : 'Belum ada dokumen yang dikirimkan oleh guru.'}</p>
                </div>
            ` : artifacts.map(item => `
                 <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group relative">
                    <!-- Action Menu (Guru) -->
                    ${isGuru ? `
                    <div class="absolute top-4 right-4 z-20">
                        <button onclick="window.toggleActionMenu('${item.id}', event)" class="bg-white/80 backdrop-blur-sm action-menu-btn text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-white shadow-sm border border-transparent hover:border-gray-100">
                            <i data-lucide="more-vertical" class="w-5 h-5"></i>
                        </button>
                         <div id="menu-${item.id}" class="action-menu hidden absolute right-0 top-8 w-40 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                            <div class="py-1">
                                ${item.status === 'draft' ? `
                                <button onclick="window.sendArtifact('${item.id}')" class="w-full text-left px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2">
                                    <i data-lucide="send" class="w-4 h-4 text-emerald-500"></i> Kirim ke Admin
                                </button>
                                <button onclick="window.showArtifactModal('${type}', '${title}', '${item.id}')" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                    <i data-lucide="edit-3" class="w-4 h-4 text-gray-400"></i> Edit
                                </button>
                                ` : `
                                <div class="px-4 py-2 text-xs text-gray-400 italic text-center border-b border-gray-50">
                                    ${item.status === 'received' ? 'Sudah Diterima' : 'Menunggu Review'}
                                </div>
                                `}
                                <button onclick="window.deleteArtifact('${item.id}')" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-50">
                                    <i data-lucide="trash-2" class="w-4 h-4 text-red-400"></i> Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                    ` : ''}

                    <div class="flex items-start justify-between mb-4 pr-8">
                        ${getStatusBadge(item.status)}
                        <span class="text-xs text-gray-400 font-medium">${item.tanggal}</span>
                    </div>
                    
                    <h3 class="text-lg font-bold text-gray-900 mb-2 leading-tight line-clamp-2">${item.judul}</h3>
                    <p class="text-sm text-gray-500 mb-4 line-clamp-3">${item.deskripsi || 'Tidak ada deskripsi'}</p>
                    
                    ${item.url ? `
                    <a href="${item.url}" target="_blank" class="inline-flex items-center gap-2 text-sm text-indigo-600 font-medium hover:underline mb-4">
                        <i data-lucide="link" class="w-4 h-4"></i> Lihat Lampiran
                    </a>
                    ` : ''}

                    <div class="pt-4 border-t border-dashed border-gray-100">
                        ${isAdmin ? `
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2 text-xs text-gray-500">
                                <i data-lucide="user" class="w-3 h-3"></i>
                                <span>Oleh: <strong>${getTeacherName(item.guruId)}</strong></span>
                            </div>
                            ${item.status === 'sent' ? `
                            <button onclick="window.markArtifactAsReceived('${item.id}')" class="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                                Terima
                            </button>
                            ` : `
                            <div class="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase rounded-lg border border-emerald-100">
                                Diterima
                            </div>
                            `}
                        </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    setTimeout(initIcons, 0);
    return container;
}

function getStatusBadge(status) {
    if (status === 'draft') return `<span class="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border bg-gray-100 text-gray-500 border-gray-200">DRAFT</span>`;
    if (status === 'sent') return `<span class="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border bg-amber-50 text-amber-600 border-amber-100">TERKIRIM</span>`;
    return `<span class="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border bg-emerald-50 text-emerald-600 border-emerald-100">DITERIMA</span>`;
}

// --- ARTIFACT ACTIONS ---
window.showArtifactModal = (type, typeLabel, id = null) => {
    window.currentArtifactType = type;
    const isEdit = !!id;
    let data = {};
    if (isEdit) {
        data = state.db.teachingArtifacts.find(a => a.id === id) || {};
    }

    const formHTML = `
        <form id="artifactForm" class="space-y-4">
             <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">Judul Dokumen</label>
                <input type="text" id="art_judul" value="${data.judul || ''}" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="Contoh: Modul Ajar Bab 1" required>
            </div>
             <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">Tanggal</label>
                <input type="date" id="art_tanggal" value="${data.tanggal || new Date().toISOString().split('T')[0]}" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" required>
            </div>
             <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">Deskripsi / Isi Ringkas</label>
                <textarea id="art_deskripsi" rows="4" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="Jelaskan isi dokumen ini...">${data.deskripsi || ''}</textarea>
            </div>
             <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">Link File (Opsional)</label>
                <input type="url" id="art_url" value="${data.url || ''}" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="https://drive.google.com/...">
                <p class="text-[10px] text-gray-400 mt-1">Masukkan link Google Drive, Dropbox, atau lainnya.</p>
            </div>
            
            <div class="pt-4">
                 <button type="button" onclick="window.saveArtifactAction('${id || ''}')" class="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 cursor-pointer">
                    ${isEdit ? 'Simpan Perubahan' : 'Simpan Draft'}
                 </button>
            </div>
        </form>
    `;

    showModal(isEdit ? `Edit ${typeLabel}` : `Buat ${typeLabel} Baru`, formHTML, null);
};

window.saveArtifactAction = (id) => {
    const form = document.getElementById('artifactForm');
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const type = window.currentArtifactType;
    const newData = {
        id: id || Math.random().toString(36).substr(2, 9),
        type: type,
        judul: document.getElementById('art_judul').value,
        tanggal: document.getElementById('art_tanggal').value,
        deskripsi: document.getElementById('art_deskripsi').value,
        url: document.getElementById('art_url').value,
        guruId: state.user.id,
        sekolahId: state.user.sekolahId,
        status: id ? (state.db.teachingArtifacts.find(a => a.id === id)?.status || 'draft') : 'draft'
    };

    let newArtifacts = state.db.teachingArtifacts || [];
    if (id) {
        newArtifacts = newArtifacts.map(a => a.id === id ? newData : a);
    } else {
        newArtifacts.push(newData);
    }

    saveDB({ ...state.db, teachingArtifacts: newArtifacts });
    if (typeof closeModal === 'function') closeModal();
    renderApp();
    alert('Dokumen berhasil disimpan sebagai Draft.');
};

window.sendArtifact = (id) => {
    if (confirm('Apakah Anda yakin ingin mengirim dokumen ini ke Admin? Dokumen yang sudah dikirim tidak dapat diedit kembali, tetapi Admin akan dapat melihatnya.')) {
        const artifacts = state.db.teachingArtifacts.map(a => {
            if (a.id === id) return { ...a, status: 'sent' };
            return a;
        });
        saveDB({ ...state.db, teachingArtifacts: artifacts });
        renderApp();
        alert('Dokumen berhasil dikirim ke Admin.');
    }
};

window.markArtifactAsReceived = (id) => {
    if (confirm('Tandai dokumen ini sebagai "Diterima"?')) {
        const artifacts = state.db.teachingArtifacts.map(a => {
            if (a.id === id) return { ...a, status: 'received' };
            return a;
        });
        saveDB({ ...state.db, teachingArtifacts: artifacts });
        renderApp();
        alert('Dokumen berhasil diterima.');
    }
};

window.deleteArtifact = (id) => {
    if (confirm('Hapus dokumen ini?')) {
        const artifacts = state.db.teachingArtifacts.filter(a => a.id !== id);
        saveDB({ ...state.db, teachingArtifacts: artifacts });
        renderApp();
    }
};

function renderPlaceholderPage(title, subtitle) {
    const container = document.createElement('div');
    container.className = "p-6 fade-in";
    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div class="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i data-lucide="file-text" class="w-8 h-8"></i>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">${title}</h2>
            <p class="text-gray-500 max-w-md mx-auto mb-8">${subtitle}</p>
            <button class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-600/20">
                <i data-lucide="plus" class="w-4 h-4 inline-block mr-2"></i>
                Tambah Dokumen Baru
            </button>
        </div>
    `;
    return container;
}

let html5QrCode;
function initScanner() {
    if (html5QrCode) {
        html5QrCode.stop().catch(() => { }).then(() => {
            startScannerInstance();
        });
    } else {
        startScannerInstance();
    }
}

function startScannerInstance() {
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => handleScan(decodedText),
        (errorMessage) => { /* user ignores minor errors */ }
    ).catch(err => {
        console.error("Error starting scanner", err);
        const reader = document.getElementById('reader');
        if (reader) reader.innerHTML = `<div class="text-white text-center p-10">Kamera tidak dapat diakses: ${err}</div>`;
    });
}

function handleScan(decodedText) {
    if (!state.user || state.user.role !== UserRole.ADMIN_SEKOLAH) return;

    // Pause scanning
    html5QrCode.pause();
    const overlay = document.getElementById('scanOverlay');
    if (overlay) overlay.classList.remove('hidden');

    const student = state.db.siswa.find(s => (s.qrCode === decodedText || s.id === decodedText || s.nis === decodedText) && s.sekolahId === state.user.sekolahId);

    // Process delay for UX
    setTimeout(() => {
        if (overlay) overlay.classList.add('hidden');

        if (!student) {
            showScanMessage('error', 'Siswa tidak ditemukan di sekolah ini.');
        } else {
            const today = new Date().toISOString().split('T')[0];
            const existing = state.db.presensi.find(p => p.siswaId === student.id && p.tanggal === today);

            if (existing) {
                showScanMessage('error', `${student.nama} sudah absen hari ini.`);
            } else {
                const now = new Date();
                const hours = now.getHours();
                const minutes = now.getMinutes();
                const jamMasuk = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                const status = (hours > 8 || (hours === 8 && minutes > 0)) ? AttendanceStatus.TERLAMBAT : AttendanceStatus.HADIR;

                const newPresensi = {
                    id: Math.random().toString(36).substr(2, 9),
                    siswaId: student.id,
                    tanggal: today,
                    jamMasuk,
                    status,
                    guruId: state.user.id,
                    sekolahId: state.user.sekolahId
                };

                const newDB = { ...state.db, presensi: [...state.db.presensi, newPresensi] };
                saveDB(newDB);
                showScanMessage('success', `Presensi Berhasil: ${student.nama} (${status})`);
            }
        }

        // Resume scanning
        setTimeout(() => html5QrCode.resume(), 2000);
    }, 500);
}

function showScanMessage(type, text) {
    const resultDiv = document.getElementById('scanResult');
    if (!resultDiv) return;

    resultDiv.className = `p-4 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in duration-300 border-2 ${type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`;
    resultDiv.innerHTML = `
        <i data-lucide="${type === 'success' ? 'check-circle-2' : 'x-circle'}" class="w-6 h-6"></i>
        <p class="font-bold">${text}</p>
    `;
    resultDiv.classList.remove('hidden');
    initIcons();

    setTimeout(() => {
        resultDiv.classList.add('hidden');
    }, 3000);
}

// --- TOGGLE ATTENDANCE STATUS ---
window.toggleAttendanceStatus = (studentId, dateStr) => {
    const existingIndex = state.db.presensi.findIndex(p => p.siswaId === studentId && p.tanggal === dateStr);
    const existing = state.db.presensi[existingIndex];

    let newPresensiList = [...state.db.presensi];

    if (!existing) {
        // Empty -> J (Hadir)
        newPresensiList.push({
            id: Math.random().toString(36).substr(2, 9),
            siswaId: studentId,
            tanggal: dateStr,
            jamMasuk: '07:00', // Default
            status: AttendanceStatus.HADIR,
            guruId: state.user.id,
            sekolahId: state.user.sekolahId
        });
    } else {
        // Cycle: Hadir -> Terlambat -> Alpha -> Delete (Empty)
        if (existing.status === AttendanceStatus.HADIR) {
            newPresensiList[existingIndex] = { ...existing, status: AttendanceStatus.TERLAMBAT, jamMasuk: '07:30' };
        } else if (existing.status === AttendanceStatus.TERLAMBAT) {
            newPresensiList[existingIndex] = { ...existing, status: 'Alpha', jamMasuk: '-' };
        } else {
            newPresensiList.splice(existingIndex, 1); // Delete
        }
    }

    saveDB({ ...state.db, presensi: newPresensiList });
    renderApp(); // Re-render to show changes
};

// --- TOGGLE ATTENDANCE STATUS ---
window.toggleAttendanceStatus = (studentId, dateStr) => {
    const existingIndex = state.db.presensi.findIndex(p => p.siswaId === studentId && p.tanggal === dateStr);
    const existing = state.db.presensi[existingIndex];

    let newPresensiList = [...state.db.presensi];

    if (!existing) {
        // Empty -> J (Hadir)
        newPresensiList.push({
            id: Math.random().toString(36).substr(2, 9),
            siswaId: studentId,
            tanggal: dateStr,
            jamMasuk: '07:00', // Default
            status: AttendanceStatus.HADIR,
            guruId: state.user.id,
            sekolahId: state.user.sekolahId
        });
    } else {
        // Cycle: Hadir -> Terlambat -> Alpha -> Delete (Empty)
        if (existing.status === AttendanceStatus.HADIR) {
            newPresensiList[existingIndex] = { ...existing, status: AttendanceStatus.TERLAMBAT, jamMasuk: '07:30' };
        } else if (existing.status === AttendanceStatus.TERLAMBAT) {
            newPresensiList[existingIndex] = { ...existing, status: 'Alpha', jamMasuk: '-' };
        } else {
            newPresensiList.splice(existingIndex, 1); // Delete
        }
    }

    saveDB({ ...state.db, presensi: newPresensiList });
    renderApp(); // Re-render to show changes
};

// --- EXCEL DOWNLOAD ---
window.downloadAttendanceReport = () => {
    const selectedMonth = parseInt(window.reportFilterMonth);
    const selectedYear = parseInt(window.reportFilterYear);
    const monthName = new Date(selectedYear, selectedMonth).toLocaleString('id-ID', { month: 'long' });
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    // Filter Students
    let students = state.db.siswa.filter(s => s.sekolahId === state.user.sekolahId && s.statusSiswa === 'Aktif');
    if (window.reportFilterClass) {
        students = students.filter(s => s.kelasId === window.reportFilterClass);
    }
    students.sort((a, b) => a.nama.localeCompare(b.nama));

    // Styles
    const borderStyle = {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
    };

    const headerStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F46E5" } }, // Indigo-600
        alignment: { horizontal: "center", vertical: "center" },
        border: borderStyle
    };

    const cellStyle = {
        border: borderStyle,
        alignment: { vertical: "center" }
    };

    const centerCellStyle = {
        border: borderStyle,
        alignment: { horizontal: "center", vertical: "center" }
    };

    // Attendance Status Colors
    const styleHadir = { ...centerCellStyle, fill: { fgColor: { rgb: "10B981" } }, font: { color: { rgb: "FFFFFF" } } }; // Emerald-500
    const styleTerlambat = { ...centerCellStyle, fill: { fgColor: { rgb: "F59E0B" } }, font: { color: { rgb: "FFFFFF" } } }; // Amber-500
    const styleAlpha = { ...centerCellStyle, fill: { fgColor: { rgb: "F43F5E" } }, font: { color: { rgb: "FFFFFF" } } }; // Rose-500

    // Build Data & Apply Styles
    const sheetData = [];

    // Header 1: Title
    const titleRow = [`Laporan Absensi - ${monthName} ${selectedYear}`];
    sheetData.push(titleRow.map(t => ({ v: t, s: { font: { bold: true, sz: 14 } } })));
    sheetData.push([]); // Empty row

    // Header 2: Column Names
    const headers = ['No', 'Nama Siswa', 'NIS', 'Kelas'];
    for (let i = 1; i <= daysInMonth; i++) headers.push(String(i));
    headers.push('Hadir', 'Terlambat', 'Alpha');

    sheetData.push(headers.map(h => ({ v: h, s: headerStyle })));

    // Rows
    students.forEach((student, index) => {
        const className = student.kelasId ? (state.db.kelas.find(k => k.id === student.kelasId)?.nama || '-') : '-';
        const row = [
            { v: index + 1, s: centerCellStyle },
            { v: student.nama, s: cellStyle },
            { v: student.nis || '-', s: centerCellStyle },
            { v: className, s: centerCellStyle }
        ];

        let h = 0, t = 0, a = 0;

        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const presensi = state.db.presensi.find(p => p.siswaId === student.id && p.tanggal === dateStr);

            if (presensi) {
                if (presensi.status === AttendanceStatus.HADIR) {
                    const val = window.reportViewMode === 'time' ? presensi.jamMasuk : 'H';
                    row.push({ v: val, s: styleHadir });
                    h++;
                } else if (presensi.status === AttendanceStatus.TERLAMBAT) {
                    const val = window.reportViewMode === 'time' ? presensi.jamMasuk : 'T';
                    row.push({ v: val, s: styleTerlambat });
                    t++;
                } else {
                    row.push({ v: 'A', s: styleAlpha });
                    a++;
                }
            } else {
                row.push({ v: '', s: cellStyle });
            }
        }
        // Totals
        row.push({ v: h, s: centerCellStyle });
        row.push({ v: t, s: centerCellStyle });
        row.push({ v: a, s: centerCellStyle });

        sheetData.push(row);
    });

    // Create Worksheet
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    // Auto-width for columns
    const wscols = [
        { wch: 5 }, // No
        { wch: 30 }, // Nama
        { wch: 15 }, // NIS
        { wch: 15 }, // Kelas
    ];
    for (let i = 0; i < daysInMonth; i++) wscols.push({ wch: 4 }); // Days (wider for time)
    wscols.push({ wch: 6 }, { wch: 6 }, { wch: 6 }); // Totals
    ws['!cols'] = wscols;

    // Merge Title
    ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Absensi");

    // Save
    XLSX.writeFile(wb, `Laporan-Absensi-${monthName}-${selectedYear}.xlsx`);
};

// --- LIST COMPONENT (Students/Teachers/Schools) ---
function renderList(type) {
    const container = document.createElement('div');
    container.className = "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden fade-in";

    let items = [];
    let title = '';

    if (type === 'students') {
        items = state.user.role === UserRole.SUPER_ADMIN ? state.db.siswa : state.db.siswa.filter(s => s.sekolahId === state.user.sekolahId);
        title = 'Data Siswa';
    } else if (type === 'teachers') {
        items = state.db.users.filter(u => u.role === UserRole.GURU && u.sekolahId === state.user.sekolahId);
        title = 'Data Guru';
    } else {
        items = state.db.sekolah;
        title = 'Data Sekolah';
    }

    const rows = items.length === 0 ? `
        <tr><td colspan="4" class="px-6 py-12 text-center text-gray-400 italic text-xs">Belum ada data</td></tr>
    ` : items.map(item => `
        <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                    ${(item.nama || item.name).charAt(0)}
                </div>
                <span class="font-bold text-gray-900">${item.nama || item.name}</span>
                </div>
            </td>
            <td class="px-6 py-4">
                ${type === 'students' ? `<span class="bg-gray-100 px-2 py-1 rounded text-[10px] font-medium uppercase tracking-tight">${item.nis} • ${item.kelas}</span>` : (item.email || item.alamat)}
            </td>
            ${type === 'students' ? `<td class="px-6 py-4">${item.jurusan}</td>` : ''}
            <td class="px-6 py-4 text-center">
                <button class="p-2 hover:bg-gray-200 rounded-full text-gray-400">
                    <i data-lucide="more-horizontal" class="w-4 h-4"></i>
                </button>
            </td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 class="text-lg font-bold text-gray-800">${title}</h3>
          <div class="flex gap-2">
            <div class="relative">
              <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></i>
              <input type="text" placeholder="Cari..." class="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm outline-none w-full sm:w-auto" />
            </div>
            ${state.user.role === UserRole.ADMIN_SEKOLAH ? `
              <button class="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors shadow-sm">
                <i data-lucide="plus" class="w-5 h-5"></i>
              </button>
            ` : ''}
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th class="px-6 py-4">Nama</th>
                <th class="px-6 py-4">${type === 'students' ? 'NIS / Kelas' : type === 'teachers' ? 'Email' : 'Lokasi'}</th>
                ${type === 'students' ? '<th class="px-6 py-4">Jurusan</th>' : ''}
                <th class="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-sm text-gray-600">
                ${rows}
            </tbody>
          </table>
        </div>
    `;
    return container;
}

// --- REPORTS COMPONENT ---
// --- REPORTS COMPONENT ---
// --- REPORTS COMPONENT ---
function renderReports() {
    // Initialize filters
    if (!window.reportFilterMonth) window.reportFilterMonth = new Date().getMonth();
    if (!window.reportFilterYear) window.reportFilterYear = new Date().getFullYear();
    if (!window.reportFilterClass) window.reportFilterClass = '';
    if (!window.reportFilterTeacher) window.reportFilterTeacher = '';
    if (!window.reportFilterSubject) window.reportFilterSubject = '';
    if (window.reportDataVisible === undefined) window.reportDataVisible = false;

    const container = document.createElement('div');
    container.className = "space-y-6 fade-in";

    // Data Sources
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear - 1, currentYear - 2];

    // --- ROLE BASED ACCESS CONTROL (RBAC) ---
    const isGuru = state.user.role === UserRole.GURU;
    let guruHomeroomClass = null;

    if (isGuru) {
        // Find the ONE class where user is Wali Kelas
        guruHomeroomClass = (state.db.kelas || []).find(k => k.waliKelasId === state.user.id);

        // Auto-set filter to this class
        if (guruHomeroomClass) {
            window.reportFilterClass = guruHomeroomClass.id;
        } else {
            // If Guru but no class assigned
            container.innerHTML = `
                <div class="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 text-orange-500 mb-4">
                        <i data-lucide="alert-circle" class="w-8 h-8"></i>
                    </div>
                    <h3 class="text-lg font-bold text-gray-800">Tidak Ada Kelas Binaan</h3>
                    <p class="text-gray-500 mt-2">Anda belum ditugaskan sebagai Wali Kelas untuk kelas manapun.<br>Silakan hubungi Administrator.</p>
                </div>
            `;
            setTimeout(initIcons, 0);
            return container;
        }
    }

    // Get Lists (Only needed for Admin)
    let classes = [];
    let teachers = [];
    let subjects = [];

    if (!isGuru) {
        classes = (state.db.kelas || []).filter(k => k.sekolahId === state.user.sekolahId).sort((a, b) => a.nama.localeCompare(b.nama));
        teachers = (state.db.users || []).filter(u => u.role === UserRole.GURU && u.sekolahId === state.user.sekolahId).sort((a, b) => a.name.localeCompare(b.name));
        subjects = (state.db.mapel || []).filter(m => m.sekolahId === state.user.sekolahId).sort((a, b) => a.nama.localeCompare(b.nama));
    }

    // Filter Logic HTML
    let filtersHTML = '';

    if (isGuru) {
        // --- GURU VIEW (SIMPLIFIED) ---
        filtersHTML = `
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
                <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <i data-lucide="file-text" class="w-5 h-5 text-indigo-600"></i>
                            Laporan Kelas: <span class="text-indigo-600">${guruHomeroomClass ? guruHomeroomClass.nama : '-'}</span>
                        </h3>
                        <p class="text-sm text-gray-400 mt-1">Anda melihat data siswa perwalian Anda.</p>
                    </div>
                    
                    <div class="flex items-center gap-3">
                         <div class="flex gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                           <select onchange="window.reportFilterMonth = this.value; window.reportDataVisible = false; renderApp()" class="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-300 transition-all cursor-pointer">
                               ${months.map((m, i) => `<option value="${i}" ${window.reportFilterMonth == i ? 'selected' : ''}>${m}</option>`).join('')}
                           </select>
                           <select onchange="window.reportFilterYear = this.value; window.reportDataVisible = false; renderApp()" class="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-300 transition-all cursor-pointer">
                               ${years.map(y => `<option value="${y}" ${window.reportFilterYear == y ? 'selected' : ''}>${y}</option>`).join('')}
                           </select>
                       </div>

                        <button onclick="window.reportDataVisible = true; renderApp()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all">
                            <i data-lucide="search" class="w-4 h-4"></i>
                            Tampilkan
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else {
        // --- ADMIN VIEW (FULL) ---
        filtersHTML = `
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
                <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <i data-lucide="filter" class="w-5 h-5 text-indigo-600"></i>
                    Filter Laporan
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Month Data -->
                    <div>
                       <label class="block text-xs font-bold text-gray-500 mb-1">Bulan & Tahun</label>
                       <div class="flex gap-2">
                           <select onchange="window.reportFilterMonth = this.value; window.reportDataVisible = false; renderApp()" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                               ${months.map((m, i) => `<option value="${i}" ${window.reportFilterMonth == i ? 'selected' : ''}>${m}</option>`).join('')}
                           </select>
                           <select onchange="window.reportFilterYear = this.value; window.reportDataVisible = false; renderApp()" class="w-24 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                               ${years.map(y => `<option value="${y}" ${window.reportFilterYear == y ? 'selected' : ''}>${y}</option>`).join('')}
                           </select>
                       </div>
                    </div>

                    <!-- Teacher Filter -->
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Guru</label>
                        <select onchange="window.reportFilterTeacher = this.value; window.reportDataVisible = false; renderApp()" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                             <option value="">Semua Guru</option>
                             ${teachers.map(t => `<option value="${t.id}" ${window.reportFilterTeacher === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
                        </select>
                    </div>

                     <!-- Class Filter -->
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Kelas</label>
                        <select onchange="window.reportFilterClass = this.value; window.reportDataVisible = false; renderApp()" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="">Semua Kelas</option>
                            ${classes.map(c => `<option value="${c.id}" ${window.reportFilterClass === c.id ? 'selected' : ''}>${c.nama}</option>`).join('')}
                        </select>
                    </div>

                     <!-- Subject Filter -->
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Mata Pelajaran</label>
                        <select onchange="window.reportFilterSubject = this.value; window.reportDataVisible = false; renderApp()" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="">Semua Mapel</option>
                            ${subjects.map(s => `<option value="${s.id}" ${window.reportFilterSubject === s.id ? 'selected' : ''}>${s.nama}</option>`).join('')}
                        </select>
                    </div>
                </div>
                
                <div class="mt-6 flex justify-end">
                    <button onclick="window.reportDataVisible = true; renderApp()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all">
                        <i data-lucide="search" class="w-4 h-4"></i>
                        Tampilkan Data
                    </button>
                </div>
            </div>
        `;
    }

    // Empty State if Not Visible
    if (!window.reportDataVisible) {
        container.innerHTML = `
            ${filtersHTML}
            <div class="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 text-indigo-200 mb-4">
                    <i data-lucide="bar-chart-2" class="w-8 h-8"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-700">Laporan Belum Ditampilkan</h3>
                <p class="text-gray-400 text-sm max-w-md mx-auto mt-2">Silakan pilih filter, lalu klik tombol "Tampilkan" / "Tampilkan Data".</p>
            </div>
        `;
        return container;
    }

    // --- DATA PROCESSING ---
    const selectedMonth = parseInt(window.reportFilterMonth);
    const selectedYear = parseInt(window.reportFilterYear);
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const monthName = months[selectedMonth];

    // 1. Get Base Students
    let filteredStudents = state.db.siswa.filter(s => s.sekolahId === state.user.sekolahId && s.statusSiswa === 'Aktif');

    // 2. Apply Filters
    if (isGuru) {
        // STRICT: Only show students from the homeroom class
        if (guruHomeroomClass) {
            filteredStudents = filteredStudents.filter(s => s.kelasId === guruHomeroomClass.id);
        } else {
            filteredStudents = []; // Should not reach here due to early return, but safe fallback
        }
    } else {
        // ADMIN LOGIC (Existing)
        if (window.reportFilterClass) {
            filteredStudents = filteredStudents.filter(s => s.kelasId === window.reportFilterClass);
        }
        if (window.reportFilterTeacher) {
            const teacherScheduleClasses = state.db.jadwal
                .filter(j => j.guruId === window.reportFilterTeacher && j.status === 'approved')
                .map(j => j.kelasId);

            filteredStudents = filteredStudents.filter(s => {
                const isHomeroom = s.waliKelasId === window.reportFilterTeacher;
                const isInTaughtClass = teacherScheduleClasses.includes(s.kelasId);
                return isHomeroom || isInTaughtClass;
            });
        }
        if (window.reportFilterSubject) {
            const subjectClasses = state.db.jadwal
                .filter(j => j.mapelId === window.reportFilterSubject && j.status === 'approved')
                .map(j => j.kelasId);

            filteredStudents = filteredStudents.filter(s => subjectClasses.includes(s.kelasId));
        }
    }

    // Sort
    filteredStudents.sort((a, b) => a.nama.localeCompare(b.nama));

    // --- STATISTICS CALCULATION ---
    let totalHadir = 0;
    let totalTerlambat = 0;
    let totalAlpha = 0;
    let dailyTrend = Array(daysInMonth).fill(0);
    let alphaStudents = [];

    // Iterate through all filtered students to aggregate stats
    filteredStudents.forEach(student => {
        let studentAlphaCount = 0;
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const presensi = state.db.presensi.find(p => p.siswaId === student.id && p.tanggal === dateStr);
            if (presensi) {
                if (presensi.status === AttendanceStatus.HADIR) {
                    totalHadir++;
                    dailyTrend[i - 1]++;
                } else if (presensi.status === AttendanceStatus.TERLAMBAT) {
                    totalTerlambat++;
                    dailyTrend[i - 1]++;
                } else {
                    totalAlpha++;
                    studentAlphaCount++;
                }
            }
        }
        if (studentAlphaCount > 0) {
            alphaStudents.push({ name: student.nama, count: studentAlphaCount, class: state.db.kelas.find(c => c.id === student.kelasId)?.nama || '-' });
        }
    });

    // Top Alpha Students (Descending)
    alphaStudents.sort((a, b) => b.count - a.count);
    const topAlpha = alphaStudents.slice(0, 3);

    // Attendance Percentage
    const totalRecords = totalHadir + totalTerlambat + totalAlpha;
    const attendancePercentage = totalRecords > 0 ? Math.round(((totalHadir + totalTerlambat) / totalRecords) * 100) : 0;

    // --- ANALYTICS HTML ---
    const analyticsHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 mb-6">
            <!-- Card 1: Attendance Rate -->
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
                <div>
                    <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Tingkat Kehadiran</p>
                    <p class="text-2xl font-black text-gray-900 mt-1">${attendancePercentage}%</p>
                    <p class="text-[10px] text-gray-400 mt-1">Bulan ${monthName}</p>
                </div>
                <div class="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <i data-lucide="percent" class="w-5 h-5"></i>
                </div>
            </div>

            <!-- Card 2: Total Late -->
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
                <div>
                    <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Terlambat</p>
                    <p class="text-2xl font-black text-gray-900 mt-1">${totalTerlambat}</p>
                    <p class="text-[10px] text-gray-400 mt-1">Kejadian</p>
                </div>
                <div class="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                    <i data-lucide="clock" class="w-5 h-5"></i>
                </div>
            </div>
            
            <!-- Card 3: Total Alpha -->
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
                 <div>
                    <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Alpha/Izin</p>
                    <p class="text-2xl font-black text-gray-900 mt-1">${totalAlpha}</p>
                    <p class="text-[10px] text-gray-400 mt-1">Ketidakhadiran</p>
                </div>
                <div class="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                    <i data-lucide="x-circle" class="w-5 h-5"></i>
                </div>
            </div>

             <!-- Card 4: Attention Needed -->
            <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Perlu Perhatian (Alpha)</p>
                ${topAlpha.length > 0 ? `
                    <div class="space-y-2">
                        ${topAlpha.map((s, i) => `
                            <div class="flex justify-between items-center text-xs">
                                <span class="font-bold text-gray-700 truncate max-w-[100px]" title="${s.name}">${s.name}</span>
                                <span class="bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold">${s.count}x</span>
                            </div>
                        `).join('')}
                    </div>
                ` : `<p class="text-xs text-center text-gray-400 italic py-2">Tidak ada data alpha signifikan</p>`}
            </div>
        </div>

        <!-- CHARTS SECTION -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
                <h4 class="font-bold text-gray-800 text-sm mb-4">Tren Kehadiran Harian</h4>
                <div class="h-64">
                    <canvas id="dailyTrendChart"></canvas>
                </div>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 class="font-bold text-gray-800 text-sm mb-4">Komposisi Kehadiran</h4>
                <div class="h-64 flex items-center justify-center">
                    <canvas id="compositionChart"></canvas>
                </div>
            </div>
        </div>
    `;

    // Generate Headers
    let dateHeaders = '';
    for (let i = 1; i <= daysInMonth; i++) {
        dateHeaders += `<th class="px-1 py-1 text-center border border-gray-200 w-8 text-[9px] text-gray-500">${i}</th>`;
    }

    // Generate Rows
    const rows = filteredStudents.length === 0 ? `
        <tr><td colspan="${daysInMonth + 4}" class="text-center py-8 text-gray-400 italic">Tidak ada data siswa yang cocok dengan filter</td></tr>
    ` : filteredStudents.map((student, index) => {
        let cells = '';
        let totalPresence = 0;

        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const presensi = state.db.presensi.find(p => p.siswaId === student.id && p.tanggal === dateStr);

            // Base style
            let cellContent = `<div class="w-full h-6 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors" onclick="window.toggleAttendanceStatus('${student.id}', '${dateStr}')"><div class="w-1.5 h-1.5 rounded-full bg-gray-200"></div></div>`;

            if (presensi) {
                if (presensi.status === AttendanceStatus.HADIR) {
                    cellContent = `<div class="w-full h-6 bg-emerald-500 flex items-center justify-center text-white text-[9px] font-bold cursor-pointer" title="Hadir: ${presensi.jamMasuk}" onclick="window.toggleAttendanceStatus('${student.id}', '${dateStr}')">H</div>`;
                    totalPresence++;
                } else if (presensi.status === AttendanceStatus.TERLAMBAT) {
                    cellContent = `<div class="w-full h-6 bg-amber-500 flex items-center justify-center text-white text-[9px] font-bold cursor-pointer" title="Terlambat: ${presensi.jamMasuk}" onclick="window.toggleAttendanceStatus('${student.id}', '${dateStr}')">T</div>`;
                    totalPresence++;
                } else {
                    cellContent = `<div class="w-full h-6 bg-rose-500 flex items-center justify-center text-white text-[9px] font-bold cursor-pointer" title="${presensi.status}" onclick="window.toggleAttendanceStatus('${student.id}', '${dateStr}')">A</div>`;
                }
            }
            cells += `<td class="p-0 border border-gray-100 align-middle">${cellContent}</td>`;
        }

        const className = state.db.kelas.find(k => k.id === student.kelasId)?.nama || '-';

        return `
            <tr class="hover:bg-indigo-50/30 transition-colors group">
                <td class="px-4 py-2 border border-gray-100 text-center font-bold text-xs text-gray-500 bg-gray-50 group-hover:bg-indigo-50/50 sticky left-0 z-10">${index + 1}</td>
                <td class="px-4 py-2 border border-gray-100 text-xs font-bold text-gray-800 bg-white group-hover:bg-indigo-50/50 sticky left-[50px] z-10 min-w-[200px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    <div class="truncate">${student.nama}</div>
                    <div class="text-[9px] text-gray-400 font-normal">${className}</div>
                </td>
                ${cells}
                <td class="px-4 py-2 border border-gray-100 text-center font-bold text-xs text-indigo-600 bg-gray-50 group-hover:bg-indigo-50/50">
                    ${totalPresence}
                </td>
            </tr>
        `;
    }).join('');

    container.innerHTML = `
        ${filtersHTML}
        ${analyticsHTML}
        
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div class="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h4 class="font-bold text-gray-700 text-sm uppercase tracking-wide">Detail Data Presensi</h4>
                <div class="flex gap-4 text-[10px] text-gray-500 font-medium">
                     <div class="flex items-center gap-1"><div class="w-3 h-3 bg-emerald-500 rounded-sm"></div> Hadir</div>
                     <div class="flex items-center gap-1"><div class="w-3 h-3 bg-amber-500 rounded-sm"></div> Terlambat</div>
                     <div class="flex items-center gap-1"><div class="w-3 h-3 bg-rose-500 rounded-sm"></div> Alpha</div>
                </div>
             </div>

          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr>
                    <th rowspan="2" class="border border-gray-200 w-[50px] bg-gray-100 sticky left-0 z-20"></th>
                    <th rowspan="2" class="px-4 py-2 border border-gray-200 text-left bg-gray-100 sticky left-[50px] z-20 min-w-[200px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] text-xs font-bold text-gray-600 uppercase">Siswa</th>
                    <th colspan="${daysInMonth}" class="px-2 py-1 border border-gray-200 text-center bg-indigo-50 text-[10px] font-bold text-indigo-800 uppercase tracking-widest">
                        Tanggal Absensi
                    </th>
                    <th rowspan="2" class="px-2 py-2 border border-gray-200 text-center w-[60px] bg-gray-100 text-[10px] font-bold text-gray-600">Total</th>
                </tr>
                <tr class="bg-gray-50">
                    ${dateHeaders}
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                ${rows}
              </tbody>
            </table>
          </div>
          
           <div class="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button onclick="window.downloadAttendanceReport()" class="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm">
                    <i data-lucide="file-spreadsheet" class="w-4 h-4"></i>
                    Download Excel Laporan Ini
                </button>
           </div>
        </div>
    `;

    // Render Charts after DOM injection
    setTimeout(() => {
        const trendCtx = document.getElementById('dailyTrendChart');
        const compCtx = document.getElementById('compositionChart');

        if (trendCtx && compCtx && window.Chart) {
            // Trend Chart
            new Chart(trendCtx, {
                type: 'line',
                data: {
                    labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
                    datasets: [{
                        label: 'Kehadiran Harian',
                        data: dailyTrend,
                        borderColor: '#4f46e5', // indigo-600
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { borderDash: [2, 2] } },
                        x: { grid: { display: false } }
                    }
                }
            });

            // Composition Chart
            new Chart(compCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Hadir', 'Terlambat', 'Alpha'],
                    datasets: [{
                        data: [totalHadir, totalTerlambat, totalAlpha],
                        backgroundColor: ['#10b981', '#f59e0b', '#f43f5e'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: { position: 'bottom', labels: { usePointStyle: true, font: { size: 10 } } }
                    }
                }
            });
        }
    }, 100);

    return container;
}



// --- CLASSES COMPONENT ---
// --- CLASSES COMPONENT ---
function renderClasses() {
    const classes = state.db.kelas ? state.db.kelas.filter(k => k.sekolahId === state.user.sekolahId) : [];
    const isGuru = state.user.role === UserRole.GURU;

    // Calculate Stats
    let totalStudentsInClasses = 0;
    const classesWithCount = classes.map(c => {
        const count = state.db.siswa.filter(s => s.kelasId === c.id && s.statusSiswa === 'Aktif').length;
        totalStudentsInClasses += count;
        return { ...c, studentCount: count };
    });

    const avgStudents = classes.length > 0 ? Math.round(totalStudentsInClasses / classes.length) : 0;

    // Expose functions globaly
    window.showClassModal = showClassModal;
    window.editClass = editClass;
    window.deleteClass = deleteClass;

    const rows = classesWithCount.length === 0 ? `
        <tr><td colspan="6" class="px-6 py-12 text-center text-gray-400 italic text-xs">Belum ada data kelas</td></tr>
    ` : classesWithCount.map(item => {
        const wali = state.db.users.find(u => u.id === item.waliKelasId);
        const waliName = wali ? wali.name : '<span class="text-gray-400 italic">Belum ditentukan</span>';

        const isWali = isGuru && item.waliKelasId === state.user.id;
        const rowClass = isWali ? 'bg-amber-50 hover:bg-amber-100 ring-1 ring-amber-200' : 'hover:bg-gray-50';

        return `
        <tr class="${rowClass} transition-colors">
            <td class="px-6 py-4 border border-gray-200 font-bold text-gray-900">
                ${item.nama}
                ${isWali ? '<span class="ml-2 text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded-md font-extrabold uppercase tracking-wide">Kelas Saya</span>' : ''}
            </td>
            <td class="px-6 py-4 border border-gray-200">${item.tingkat}</td>
            <td class="px-6 py-4 border border-gray-200">
                 <span class="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight">${item.jurusan || '-'}</span>
            </td>
            <td class="px-6 py-4 border border-gray-200 text-sm">${waliName}</td>
            <td class="px-6 py-4 border border-gray-200">
                <div class="flex items-center gap-1.5">
                    <i data-lucide="users" class="w-3 h-3 text-gray-400"></i>
                    <span class="font-bold text-gray-700">${item.studentCount}</span>
                    <span class="text-xs text-gray-400">Siswa</span>
                </div>
            </td>
            <td class="px-6 py-4 border border-gray-200 text-center">
                 ${!isGuru ? `
                 <div class="flex items-center justify-center gap-2">
                    <button type="button" onclick="window.editClass('${item.id}')" class="p-2 hover:bg-indigo-50 rounded-full text-indigo-600 transition-colors cursor-pointer" title="Edit">
                        <i data-lucide="edit-3" class="w-4 h-4 pointer-events-none"></i>
                    </button>
                    <button type="button" onclick="window.deleteClass('${item.id}')" class="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors cursor-pointer" title="Hapus">
                        <i data-lucide="trash-2" class="w-4 h-4 pointer-events-none"></i>
                    </button>
                </div>
                ` : `<span class="text-xs text-gray-400 italic">Read Only</span>`}
            </td>
        </tr>
    `}).join('');

    const container = document.createElement('div');
    container.className = "space-y-6 fade-in";

    // Stats HTML
    const statsHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
                <div>
                    <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Kelas</p>
                    <p class="text-2xl font-black text-gray-900 mt-1">${classes.length}</p>
                </div>
                <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <i data-lucide="layout-grid" class="w-5 h-5"></i>
                </div>
            </div>
             <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
                <div>
                    <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">Rata-rata Siswa</p>
                    <p class="text-2xl font-black text-gray-900 mt-1">~${avgStudents}</p>
                    <p class="text-[10px] text-gray-400 mt-1">Per Kelas</p>
                </div>
                <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <i data-lucide="users" class="w-5 h-5"></i>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = `
        ${statsHTML}

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 class="text-lg font-bold text-gray-800">Data Kelas</h3>
            ${!isGuru ? `
            <button type="button" onclick="window.showClassModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2 text-sm font-bold cursor-pointer">
                <i data-lucide="plus" class="w-4 h-4 pointer-events-none"></i>
                Tambah Kelas
            </button>
            ` : ''}
            </div>
            <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead class="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <tr>
                    <th class="px-6 py-4 border border-gray-200">Nama Kelas</th>
                    <th class="px-6 py-4 border border-gray-200">Tingkat</th>
                    <th class="px-6 py-4 border border-gray-200">Jurusan</th>
                    <th class="px-6 py-4 border border-gray-200">Wali Kelas</th>
                    <th class="px-6 py-4 border border-gray-200">Jumlah Siswa</th>
                    <th class="px-6 py-4 border border-gray-200 text-center">Aksi</th>
                </tr>

                </thead>
                <tbody class="divide-y divide-gray-100 text-sm text-gray-600">
                    ${rows}
                </tbody>
            </table>
            </div>
        </div>
    `;
    return container;
}

function showClassModal(classData = null) {
    const isEdit = !!classData;
    const c = classData || {};

    // Get Teachers for Wali Kelas dropdown
    const teachers = state.db.users.filter(u => u.role === UserRole.GURU && u.sekolahId === state.user.sekolahId);
    const teacherOptions = teachers.map(t => `<option value="${t.id}" ${c.waliKelasId === t.id ? 'selected' : ''}>${t.name}</option>`).join('');

    const formHTML = `
        <form class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">Nama Kelas</label>
                <input type="text" name="nama" value="${c.nama || ''}" required class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="Contoh: XII IPA 1">
            </div>
            <div class="grid grid-cols-2 gap-4">
                 <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1">Tingkat</label>
                    <input type="text" name="tingkat" value="${c.tingkat || ''}" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="Contoh: 10, 11, 12">
                </div>
                 <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1">Jurusan</label>
                    <input type="text" name="jurusan" value="${c.jurusan || ''}" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="MIPA/IPS">
                </div>
            </div>
             <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">Wali Kelas</label>
                <select name="waliKelasId" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                    <option value="">-- Pilih Wali Kelas --</option>
                    ${teacherOptions}
                </select>
            </div>
            <div class="pt-4">
                 <button type="submit" class="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 cursor-pointer">
                    ${isEdit ? 'Simpan Perubahan' : 'Tambah Kelas'}
                 </button>
            </div>
        </form>
    `;

    showModal(isEdit ? 'Edit Data Kelas' : 'Tambah Kelas Baru', formHTML, (formData) => {
        const newData = {
            ...(c || {}),
            id: c.id || `k${Date.now()}`,
            sekolahId: state.user.sekolahId,
            nama: formData.get('nama'),
            tingkat: formData.get('tingkat'),
            jurusan: formData.get('jurusan'),
            waliKelasId: formData.get('waliKelasId')
        };

        if (isEdit) {
            const index = state.db.kelas.findIndex(item => item.id === c.id);
            const updated = [...state.db.kelas];
            updated[index] = newData;
            saveDB({ ...state.db, kelas: updated });
        } else {
            saveDB({ ...state.db, kelas: [...(state.db.kelas || []), newData] });
        }
        renderApp();
    });
}

function editClass(id) {
    const cls = state.db.kelas.find(c => c.id === id);
    if (cls) showClassModal(cls);
}

function deleteClass(id) {
    if (confirm('Hapus kelas ini?')) {
        saveDB({ ...state.db, kelas: state.db.kelas.filter(c => c.id !== id) });
        renderApp();
    }
}

// Expose Class functions
window.showClassModal = showClassModal;
window.editClass = editClass;
window.deleteClass = deleteClass;

// --- SUBJECTS COMPONENT ---
function showSubjectModal(subject = null) {
    const isEdit = !!subject;
    const s = subject || {};

    const formHTML = `
        <form class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">Kode Mapel</label>
                <input type="text" name="kode" value="${s.kode || ''}" required class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="Contoh: MAT-XII">
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">Nama Mata Pelajaran</label>
                <input type="text" name="nama" value="${s.nama || ''}" required class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="Contoh: Matematika Wajib">
            </div>
            <div class="pt-4">
                 <button type="submit" class="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 cursor-pointer">
                    ${isEdit ? 'Simpan Perubahan' : 'Tambah Mapel'}
                 </button>
            </div>
        </form>
    `;

    showModal(isEdit ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran', formHTML, (formData) => {
        const newData = {
            ...(s || {}),
            id: s.id || `m${Date.now()}`,
            sekolahId: state.user.sekolahId,
            kode: formData.get('kode'),
            nama: formData.get('nama')
        };

        if (isEdit) {
            const index = state.db.mapel.findIndex(item => item.id === s.id);
            const updated = [...state.db.mapel];
            updated[index] = newData;
            saveDB({ ...state.db, mapel: updated });
        } else {
            saveDB({ ...state.db, mapel: [...(state.db.mapel || []), newData] });
        }
        renderApp();
    });
}

function editSubject(id) {
    const subject = state.db.mapel.find(s => s.id === id);
    if (subject) showSubjectModal(subject);
}

function deleteSubject(id) {
    if (confirm('Hapus mata pelajaran ini?')) {
        saveDB({ ...state.db, mapel: state.db.mapel.filter(s => s.id !== id) });
        renderApp();
    }
}

window.showSubjectModal = showSubjectModal;
window.editSubject = editSubject;
window.deleteSubject = deleteSubject;
function renderSubjects() {
    const subjects = state.db.mapel.filter(m => m.sekolahId === state.user.sekolahId);

    const rows = subjects.length === 0 ? `
        <tr><td colspan="3" class="px-6 py-12 text-center text-gray-400 italic text-xs">Belum ada data mata pelajaran</td></tr>
    ` : subjects.map(item => `
        <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 border border-gray-200">
                <span class="font-mono bg-gray-100 px-2 py-1 rounded text-xs text-gray-600 font-bold">${item.kode}</span>
            </td>
             <td class="px-6 py-4 border border-gray-200 font-bold text-gray-900">${item.nama}</td>
             <td class="px-6 py-4 border border-gray-200 text-center">
                <div class="flex items-center justify-center gap-2">
                    <button type="button" onclick="window.editSubject('${item.id}')" class="p-2 hover:bg-indigo-50 rounded-full text-indigo-600 transition-colors cursor-pointer" title="Edit">
                        <i data-lucide="edit-3" class="w-4 h-4 pointer-events-none"></i>
                    </button>
                    <button type="button" onclick="window.deleteSubject('${item.id}')" class="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors cursor-pointer" title="Hapus">
                        <i data-lucide="trash-2" class="w-4 h-4 pointer-events-none"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    const container = document.createElement('div');
    container.className = "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden fade-in";
    container.innerHTML = `
        <div class="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 class="text-lg font-bold text-gray-800">Mata Pelajaran</h3>
          <button onclick="window.showSubjectModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2 text-sm font-bold cursor-pointer">
            <i data-lucide="plus" class="w-4 h-4 pointer-events-none"></i>
            Tambah Mapel
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th class="px-6 py-4 border border-gray-200">Kode</th>
                <th class="px-6 py-4 border border-gray-200">Nama Mata Pelajaran</th>
                <th class="px-6 py-4 border border-gray-200 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-sm text-gray-600">
                ${rows}
            </tbody>
          </table>
        </div>
    `;
    return container;
}

// --- SCHEDULE COMPONENT (Approval Workflow) ---
function renderSchedule() {
    const isTeacher = state.user.role === UserRole.GURU;
    const isAdmin = state.user.role === UserRole.ADMIN_SEKOLAH;

    // Expose Global Functions
    window.submitSchedule = (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const newSchedule = {
            id: `j${Date.now()}`,
            kelasId: formData.get('kelasId'),
            mapelId: formData.get('mapelId'),
            hari: formData.get('hari'),
            jamMulai: formData.get('jamMulai'),
            jamSelesai: formData.get('jamSelesai'),
            guruId: state.user.id,
            sekolahId: state.user.sekolahId,
            status: 'pending' // Default status
        };

        saveDB({ ...state.db, jadwal: [...state.db.jadwal, newSchedule] });
        renderApp();
    };

    window.approveSchedule = (id) => {
        if (!confirm('Setujui jadwal ini?')) return;
        const updated = state.db.jadwal.map(j => j.id === id ? { ...j, status: 'approved' } : j);
        saveDB({ ...state.db, jadwal: updated });
        renderApp();
    };

    window.rejectSchedule = (id) => {
        if (!confirm('Tolak jadwal ini? Data akan dihapus dari antrian.')) return;
        saveDB({ ...state.db, jadwal: state.db.jadwal.filter(j => j.id !== id) });
        renderApp();
    };

    window.deleteSchedule = (id) => {
        if (!confirm('Hapus jadwal ini permanen?')) return;
        saveDB({ ...state.db, jadwal: state.db.jadwal.filter(j => j.id !== id) });
        renderApp();
    };

    window.requestDeleteSchedule = (id) => {
        if (!confirm('Ajukan penghapusan jadwal ini ke Admin?')) return;
        const updated = state.db.jadwal.map(j => j.id === id ? { ...j, status: 'request_delete' } : j);
        saveDB({ ...state.db, jadwal: updated });
        renderApp();
    };

    window.approveDeleteSchedule = (id) => {
        if (!confirm('Setujui penghapusan jadwal ini?')) return;
        saveDB({ ...state.db, jadwal: state.db.jadwal.filter(j => j.id !== id) });
        renderApp();
    };

    window.rejectDeleteSchedule = (id) => {
        if (!confirm('Tolak penghapusan? Jadwal akan kembali aktif.')) return;
        const updated = state.db.jadwal.map(j => j.id === id ? { ...j, status: 'approved' } : j);
        saveDB({ ...state.db, jadwal: updated });
        renderApp();
    };

    // --- TEACHER VIEW ---
    if (isTeacher) {
        const mySchedules = state.db.jadwal.filter(j => j.guruId === state.user.id);

        // Helper to get names
        const getNames = (s) => {
            const k = state.db.kelas.find(c => c.id === s.kelasId);
            const m = state.db.mapel.find(mp => mp.id === s.mapelId);
            return { kelas: k ? k.nama : '?', mapel: m ? m.nama : '?' };
        };

        return createTeacherScheduleView(mySchedules, getNames);
    }

    // --- ADMIN VIEW ---
    if (isAdmin) {
        const pending = state.db.jadwal.filter(j => j.sekolahId === state.user.sekolahId && j.status === 'pending');
        const approved = state.db.jadwal.filter(j => j.sekolahId === state.user.sekolahId && j.status === 'approved');
        const deleteRequests = state.db.jadwal.filter(j => j.sekolahId === state.user.sekolahId && j.status === 'request_delete');

        // Helper to get Details
        const getDetails = (s) => {
            const k = state.db.kelas.find(c => c.id === s.kelasId);
            const m = state.db.mapel.find(mp => mp.id === s.mapelId);
            const g = state.db.users.find(u => u.id === s.guruId);
            return {
                kelas: k ? k.nama : '?',
                mapel: m ? m.nama : '?',
                guru: g ? g.name : '?'
            };
        };

        return createAdminScheduleView(pending, approved, deleteRequests, getDetails);
    }

    return createPlaceholder('Jadwal Pelajaran', 'Akses tidak tersedia.');
}

function createTeacherScheduleView(schedules, getNames) {
    const container = document.createElement('div');
    container.className = "grid grid-cols-1 lg:grid-cols-3 gap-8 fade-in";

    // Form Section
    const classOptions = state.db.kelas.filter(c => c.sekolahId === state.user.sekolahId)
        .map(c => `<option value="${c.id}">${c.nama}</option>`).join('');
    const mapelOptions = state.db.mapel.filter(m => m.sekolahId === state.user.sekolahId)
        .map(m => `<option value="${m.id}">${m.nama} (${m.kode})</option>`).join('');

    const formHTML = `
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i data-lucide="plus-circle" class="w-5 h-5 text-indigo-600"></i> Ajukan Jadwal
            </h3>
            <form onsubmit="window.submitSchedule(event)" class="space-y-4">
                <div>
                    <div class="flex justify-between items-center mb-1">
                        <label class="text-xs font-bold text-gray-500">Kelas</label>
                        <button type="button" onclick="window.showClassModal()" class="text-[10px] text-indigo-600 font-bold hover:underline flex items-center gap-1 cursor-pointer">
                            <i data-lucide="plus" class="w-3 h-3"></i> Buat Baru
                        </button>
                    </div>
                    <select name="kelasId" required class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option value="">Pilih Kelas</option>
                        ${classOptions}
                    </select>
                </div>
                 <div>
                    <div class="flex justify-between items-center mb-1">
                        <label class="text-xs font-bold text-gray-500">Mata Pelajaran</label>
                        <button type="button" onclick="window.showSubjectModal()" class="text-[10px] text-indigo-600 font-bold hover:underline flex items-center gap-1 cursor-pointer">
                            <i data-lucide="plus" class="w-3 h-3"></i> Buat Baru
                        </button>
                    </div>
                    <select name="mapelId" required class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option value="">Pilih Mata Pelajaran</option>
                        ${mapelOptions}
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1">Hari</label>
                    <select name="hari" required class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option value="Senin">Senin</option>
                        <option value="Selasa">Selasa</option>
                        <option value="Rabu">Rabu</option>
                        <option value="Kamis">Kamis</option>
                        <option value="Jumat">Jumat</option>
                        <option value="Sabtu">Sabtu</option>
                    </select>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Jam Mulai</label>
                        <input type="time" name="jamMulai" required class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                    </div>
                     <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Jam Selesai</label>
                        <input type="time" name="jamSelesai" required class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                    </div>
                </div>
                <button type="submit" class="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 mt-4 cursor-pointer">
                    Ajukan Jadwal
                </button>
            </form>
        </div>
    `;

    // List Section
    const listRows = schedules.length === 0 ? `
        <tr><td colspan="5" class="px-6 py-8 text-center text-gray-400 italic text-sm">Belum ada jadwal diajukan</td></tr>
    ` : schedules.map(s => {
        const { kelas, mapel } = getNames(s);
        let statusBadge = '<span class="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-[10px] font-bold uppercase">Pending</span>';
        if (s.status === 'approved') statusBadge = '<span class="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase">Disetujui</span>';
        if (s.status === 'request_delete') statusBadge = '<span class="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-bold uppercase">Menunggu Hapus</span>';

        let actionBtn = '';
        if (s.status === 'pending') {
            actionBtn = `<button onclick="window.deleteSchedule('${s.id}')" class="text-red-400 hover:text-red-600 cursor-pointer" title="Batalkan"><i data-lucide="trash-2" class="w-4 h-4"></i></button>`;
        } else if (s.status === 'approved') {
            actionBtn = `<button onclick="window.requestDeleteSchedule('${s.id}')" class="text-red-400 hover:text-red-600 cursor-pointer text-xs font-bold border border-red-200 px-2 py-1 rounded bg-red-50" title="Ajukan Hapus">Ajukan Hapus</button>`;
        }

        return `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3 font-bold text-gray-900">${mapel}</td>
                <td class="px-4 py-3">${kelas}</td>
                <td class="px-4 py-3 text-gray-600">${s.hari}, ${s.jamMulai}-${s.jamSelesai}</td>
                <td class="px-4 py-3">${statusBadge}</td>
                <td class="px-4 py-3 text-center">
                    ${actionBtn}
                </td>
            </tr>
        `;
    }).join('');

    const listHTML = `
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <div class="p-6 border-b border-gray-100">
                <h3 class="text-lg font-bold text-gray-800">Jadwal Saya</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead class="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <tr>
                            <th class="px-4 py-3">Mapel</th>
                            <th class="px-4 py-3">Kelas</th>
                            <th class="px-4 py-3">Waktu</th>
                            <th class="px-4 py-3">Status</th>
                            <th class="px-4 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        ${listRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    container.innerHTML = formHTML + listHTML;
    return container;
}

function createAdminScheduleView(pending, approved, deleteRequests, getDetails) {
    const container = document.createElement('div');
    container.className = "space-y-8 fade-in";

    // 1. Pending Approval Section
    const pendingRows = pending.length === 0 ? `
        <tr><td colspan="5" class="px-6 py-8 text-center text-gray-400 italic text-sm">Tidak ada jadwal menunggu persetujuan</td></tr>
    ` : pending.map(s => {
        const { kelas, mapel, guru } = getDetails(s);
        return `
            <tr class="bg-yellow-50/50 hover:bg-yellow-50 transition-colors border-l-4 border-yellow-400">
                <td class="px-6 py-4 border border-gray-200">
                    <div class="font-bold text-gray-900">${guru}</div>
                    <div class="text-xs text-gray-500">Mengajukan jadwal</div>
                </td>
                <td class="px-6 py-4 border border-gray-200 font-bold text-gray-800">${mapel}</td>
                <td class="px-6 py-4 border border-gray-200">${kelas}</td>
                <td class="px-6 py-4 border border-gray-200 text-gray-600 font-mono text-xs"><span class="font-bold bg-white px-2 py-1 rounded border">${s.hari}</span> ${s.jamMulai} - ${s.jamSelesai}</td>
                <td class="px-6 py-4 border border-gray-200 text-center">
                    <div class="flex items-center justify-center gap-2">
                        <button onclick="window.approveSchedule('${s.id}')" class="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer">
                            <i data-lucide="check" class="w-3 h-3"></i> Setujui
                        </button>
                         <button onclick="window.rejectSchedule('${s.id}')" class="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                            <i data-lucide="x" class="w-3 h-3"></i> Tolak
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');



    // 2. Deletion Requests Section
    const deletionRows = deleteRequests.length === 0 ? `
         <tr><td colspan="5" class="px-6 py-8 text-center text-gray-400 italic text-sm">Tidak ada permintaan hapus</td></tr>
    ` : deleteRequests.map(s => {
        const { kelas, mapel, guru } = getDetails(s);
        return `
            <tr class="bg-red-50/50 hover:bg-red-50 transition-colors border-l-4 border-red-400">
                <td class="px-6 py-4 border border-gray-200">
                    <div class="font-bold text-gray-900">${guru}</div>
                    <div class="text-xs text-gray-500">Request Hapus</div>
                </td>
                <td class="px-6 py-4 border border-gray-200 font-bold text-gray-800">${mapel}</td>
                <td class="px-6 py-4 border border-gray-200">${kelas}</td>
                <td class="px-6 py-4 border border-gray-200 text-gray-600 font-mono text-xs"><span class="font-bold bg-white px-2 py-1 rounded border">${s.hari}</span> ${s.jamMulai} - ${s.jamSelesai}</td>
                <td class="px-6 py-4 border border-gray-200 text-center">
                    <div class="flex items-center justify-center gap-2">
                        <button onclick="window.approveDeleteSchedule('${s.id}')" class="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer">
                            <i data-lucide="trash-2" class="w-3 h-3"></i> Hapus
                        </button>
                         <button onclick="window.rejectDeleteSchedule('${s.id}')" class="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                            <i data-lucide="x" class="w-3 h-3"></i> Batalkan
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    const deletionHTML = `
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${deleteRequests.length === 0 ? 'hidden' : ''}">
             <div class="p-6 border-b border-gray-100 flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
                <h3 class="text-lg font-bold text-gray-800">Permintaan Hapus (${deleteRequests.length})</h3>
            </div>
             <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <tr>
                            <th class="px-6 py-3">Guru</th>
                            <th class="px-6 py-3">Mapel</th>
                            <th class="px-6 py-3">Kelas</th>
                            <th class="px-6 py-3">Jadwal</th>
                            <th class="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        ${deletionRows}
                    </tbody>
                </table>
             </div>
        </div>
    `;


    const pendingHTML = `
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div class="p-6 border-b border-gray-100 flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                <h3 class="text-lg font-bold text-gray-800">Menunggu Persetujuan (${pending.length})</h3>
            </div>
             <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <tr>
                            <th class="px-6 py-3">Guru</th>
                            <th class="px-6 py-3">Mapel</th>
                            <th class="px-6 py-3">Kelas</th>
                            <th class="px-6 py-3">Jadwal</th>
                            <th class="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        ${pendingRows}
                    </tbody>
                </table>
             </div>
        </div>
    `;

    // 2. Approved Section
    const approvedRows = approved.length === 0 ? `
         <tr><td colspan="5" class="px-6 py-8 text-center text-gray-400 italic text-sm">Belum ada jadwal aktif</td></tr>
    ` : approved.map(s => {
        const { kelas, mapel, guru } = getDetails(s);
        return `
            <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 border border-gray-200 font-bold text-gray-900">${mapel}</td>
                <td class="px-6 py-4 border border-gray-200">${kelas}</td>
                <td class="px-6 py-4 border border-gray-200 text-gray-600">${s.hari}, ${s.jamMulai} - ${s.jamSelesai}</td>
                <td class="px-6 py-4 border border-gray-200 text-sm">${guru}</td>
                 <td class="px-6 py-4 border border-gray-200 text-center">
                    <button onclick="window.deleteSchedule('${s.id}')" class="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors cursor-pointer" title="Hapus Jadwal">
                        <i data-lucide="trash-2" class="w-4 h-4 pointer-events-none"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    const approvedHTML = `
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div class="p-6 border-b border-gray-100 bg-gray-50/50">
                <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <i data-lucide="calendar-check" class="w-5 h-5 text-emerald-600"></i> Jadwal Aktif
                </h3>
            </div>
             <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <tr>
                            <th class="px-6 py-3 border border-gray-200">Mapel</th>
                            <th class="px-6 py-3 border border-gray-200">Kelas</th>
                            <th class="px-6 py-3 border border-gray-200">Waktu</th>
                            <th class="px-6 py-3 border border-gray-200">Pengajar</th>
                            <th class="px-6 py-3 border border-gray-200 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 text-sm">
                        ${approvedRows}
                    </tbody>
                </table>
             </div>
        </div>
    `;

    container.innerHTML = deletionHTML + pendingHTML + approvedHTML;
    return container;
}

// --- ANNOUNCEMENTS COMPONENT ---
// --- ANNOUNCEMENTS COMPONENT ---
function showAnnouncementModal(announcement = null) {
    const s = announcement || {};
    const formHTML = `
        <form class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">Judul Pengumuman</label>
                <input type="text" name="judul" value="${s.judul || ''}" required class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="Contoh: Libur Hari Raya">
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">Isi Pengumuman</label>
                <textarea name="isi" required rows="4" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="Tulis pengumuman di sini...">${s.isi || ''}</textarea>
            </div>
            <div class="pt-4 grid grid-cols-2 gap-2">
                 <button type="button" onclick="window.saveAnnouncementRequest(this.form, 'draft')" class="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">
                    Simpan Draft
                 </button>
                 <button type="button" onclick="window.saveAnnouncementRequest(this.form, 'sent')" class="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 cursor-pointer flex items-center justify-center gap-2">
                    <i data-lucide="send" class="w-4 h-4"></i> Kirim
                 </button>
            </div>
        </form>
    `;

    showModal('Buat Pengumuman', formHTML);

    window.saveAnnouncementRequest = (form, status) => {
        const formData = new FormData(form);
        const judul = formData.get('judul');
        const isi = formData.get('isi');

        if (!judul || !isi) {
            alert('Harap lengkapi semua bidang!');
            return;
        }

        const newData = {
            id: s.id || `p${Date.now()}`,
            sekolahId: state.user.sekolahId,
            judul,
            isi,
            tanggal: new Date().toISOString(),
            status: status // 'draft' or 'sent'
        };

        if (s.id) {
            const index = state.db.pengumuman.findIndex(item => item.id === s.id);
            const updated = [...state.db.pengumuman];
            updated[index] = newData;
            saveDB({ ...state.db, pengumuman: updated });
        } else {
            saveDB({ ...state.db, pengumuman: [newData, ...(state.db.pengumuman || [])] });
        }

        renderApp();
        closeModal();

        if (status === 'sent') {
            alert('Pengumuman berhasil dikirim ke semua Guru!');
        } else {
            alert('Pengumuman disimpan sebagai Draft.');
        }
    };
}

function deleteAnnouncement(id) {
    if (confirm('Hapus pengumuman ini?')) {
        saveDB({ ...state.db, pengumuman: state.db.pengumuman.filter(a => a.id !== id) });
        renderApp();
    }
}

function editAnnouncement(id) {
    const a = state.db.pengumuman.find(item => item.id === id);
    if (a) showAnnouncementModal(a);
}

// Expose
window.showAnnouncementModal = showAnnouncementModal;
window.editAnnouncement = editAnnouncement;
window.deleteAnnouncement = deleteAnnouncement;

function renderAnnouncements() {
    let announcements = state.db.pengumuman.filter(a => a.sekolahId === state.user.sekolahId);

    // Filter for Guru: Only show 'sent' announcements
    // Filter for Guru: Only show 'sent' announcements
    if (state.user.role === UserRole.GURU) {
        announcements = announcements.filter(a => a.status === 'sent');

        // Mark as read when viewing
        localStorage.setItem(`last_read_announcements_${state.user.id}`, new Date().toISOString());

        // Dispatch event to update sidebar badge immediately if needed (optional, but renderApp handles it)
    }

    const items = announcements.length === 0 ? `
        <div class="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100 col-span-1">
            <i data-lucide="megaphone" class="w-12 h-12 mx-auto mb-2 opacity-20"></i>
            <p>Belum ada pengumuman</p>
        </div>
    ` : announcements.map(item => {
        const isDraft = item.status === 'draft';
        return `
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group ${isDraft ? 'border-l-4 border-l-gray-300' : 'border-l-4 border-l-indigo-500'}">
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full ${isDraft ? 'bg-gray-100 text-gray-500' : 'bg-orange-50 text-orange-600'} flex items-center justify-center">
                        <i data-lucide="${isDraft ? 'file-text' : 'megaphone'}" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h4 class="font-bold text-gray-900 flex items-center gap-2">
                            ${item.judul}
                            ${isDraft ? '<span class="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded uppercase tracking-wider">Draft</span>' : ''}
                        </h4>
                        <p class="text-xs text-gray-500">${new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                </div>
                ${state.user.role !== UserRole.GURU ? `
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="window.editAnnouncement('${item.id}')" class="text-gray-400 hover:text-indigo-600 p-1 cursor-pointer" title="Edit">
                        <i data-lucide="edit-3" class="w-4 h-4"></i>
                    </button>
                    <button onclick="window.deleteAnnouncement('${item.id}')" class="text-gray-400 hover:text-red-500 p-1 cursor-pointer" title="Hapus">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
                ` : ''}
            </div>
            <p class="text-gray-600 text-sm leading-relaxed mb-4 whitespace-pre-line">${item.isi}</p>
            <div class="flex items-center gap-2 text-xs font-medium text-gray-400 border-t pt-4 border-gray-50">
               <i data-lucide="user" class="w-3 h-3"></i>
               <span>Diposting oleh Admin</span>
               ${!isDraft && state.user.role !== UserRole.GURU ? '<span class="ml-auto text-emerald-600 flex items-center gap-1"><i data-lucide="check-circle" class="w-3 h-3"></i> Terkirim</span>' : ''}
            </div>
        </div>
    `}).join('');

    const container = document.createElement('div');
    container.className = "space-y-6 fade-in";
    container.innerHTML = `
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-800">Pengumuman Sekolah</h3>
          ${state.user.role !== UserRole.GURU ? `
            <button onclick="window.showAnnouncementModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2 text-sm font-bold cursor-pointer">
                <i data-lucide="plus" class="w-4 h-4 pointer-events-none"></i>
                Buat Pengumuman
            </button>
          ` : ''}
        </div>
        <div class="grid grid-cols-1 gap-4">
            ${items}
        </div>
    `;
    return container;
}

// --- SETTINGS COMPONENT ---
function renderSettings() {
    const settings = state.db.pengaturan;

    // We create a container that handles the form logic simply
    const container = document.createElement('div');
    container.className = "max-w-3xl mx-auto fade-in";

    container.innerHTML = `
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100 bg-gray-50/50">
             <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
                <i data-lucide="settings" class="w-5 h-5 text-indigo-500"></i>
                Pengaturan Sekolah
             </h3>
             <p class="text-sm text-gray-500 mt-1">Konfigurasi profil umum sekolah dan tahun ajaran.</p>
        </div>
        
        <form id="settingsForm" class="p-8 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                    <label class="block text-sm font-bold text-gray-700">Nama Sekolah</label>
                    <input type="text" name="namaSekolah" value="${settings.namaSekolah}" class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                </div>
                <div class="space-y-2">
                    <label class="block text-sm font-bold text-gray-700">Alamat</label>
                    <input type="text" name="alamat" value="${settings.alamat}" class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                </div>
                <div class="space-y-2">
                    <label class="block text-sm font-bold text-gray-700">Tahun Ajaran</label>
                    <input type="text" name="tahunAjaran" value="${settings.tahunAjaran}" class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                </div>
                <div class="space-y-2">
                    <label class="block text-sm font-bold text-gray-700">Semester</label>
                    <select name="semester" class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
                        <option value="Ganjil" ${settings.semester === 'Ganjil' ? 'selected' : ''}>Ganjil</option>
                        <option value="Genap" ${settings.semester === 'Genap' ? 'selected' : ''}>Genap</option>
                    </select>
                </div>
                 <div class="space-y-2">
                    <label class="block text-sm font-bold text-gray-700">Jam Masuk</label>
                    <input type="time" name="jamMasuk" value="${settings.jamMasuk}" class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
                </div>
                 <div class="space-y-2">
                    <label class="block text-sm font-bold text-gray-700">Zona Waktu</label>
                    <select name="zonaWaktu" class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
                        <option value="WIB" ${settings.zonaWaktu === 'WIB' ? 'selected' : ''}>WIB (Indonesia Barat)</option>
                        <option value="WITA" ${settings.zonaWaktu === 'WITA' ? 'selected' : ''}>WITA (Indonesia Tengah)</option>
                        <option value="WIT" ${settings.zonaWaktu === 'WIT' ? 'selected' : ''}>WIT (Indonesia Timur)</option>
                    </select>
                </div>
            </div>

            <div class="pt-6 border-t border-gray-100 flex justify-end">
                <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all transform active:scale-95 flex items-center gap-2">
                    <i data-lucide="save" class="w-4 h-4"></i>
                    Simpan Perubahan
                </button>
            </div>
        </form>
      </div>
    `;


    setTimeout(() => {
        const form = container.querySelector('#settingsForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const newSettings = {
                ...state.db.pengaturan,
                namaSekolah: formData.get('namaSekolah'),
                alamat: formData.get('alamat'),
                tahunAjaran: formData.get('tahunAjaran'),
                semester: formData.get('semester'),
                jamMasuk: formData.get('jamMasuk'),
                zonaWaktu: formData.get('zonaWaktu')
            };

            const newDB = { ...state.db, pengaturan: newSettings };
            saveDB(newDB);
            alert('Pengaturan berhasil disimpan!');
        });
    }, 0);

    return container;
}


// --- CREATE QUIZ COMPONENT ---
// --- CREATE QUIZ COMPONENT ---
function renderCreateQuiz() {
    // Mode toggling state (simple local state approach)
    // Modes: 'list' | 'editor'
    if (!window.currentQuizMode) window.currentQuizMode = 'list';

    const container = document.createElement('div');
    container.className = "fade-in pb-20";

    // --- VIEW: LIST OF QUIZZES ---
    if (window.currentQuizMode === 'list') {
        const exams = state.db.exams || [];

        container.innerHTML = `
            <div class="flex flex-col gap-6">
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                         <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <i data-lucide="file-question" class="w-6 h-6 text-indigo-600"></i>
                            Bank Soal Saya
                        </h3>
                        <p class="text-sm text-gray-500 mt-1">Kelola daftar ujian yang telah Anda buat</p>
                    </div>
                    <button onclick="window.startNewQuiz()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2">
                        <i data-lucide="plus-circle" class="w-5 h-5"></i>
                        Buat Soal Baru
                    </button>
                </div>

                ${exams.length === 0 ? `
                    <div class="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <div class="w-16 h-16 bg-indigo-50 text-indigo-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i data-lucide="file-question" class="w-8 h-8"></i>
                        </div>
                        <h4 class="text-lg font-bold text-gray-800">Belum ada soal</h4>
                        <p class="text-gray-400 text-sm mt-1">Mulai buat ujian pertama Anda sekarang</p>
                    </div>
                ` : `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${exams.map(exam => `
                            <div onclick="window.editQuiz('${exam.id}')" class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group relative cursor-pointer flex flex-col justify-between h-full">
                                <div class="absolute top-4 right-4 flex gap-2 z-10">
                                    <button onclick="event.stopPropagation(); window.previewQuizFromList('${exam.id}')" class="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors" title="Preview">
                                        <i data-lucide="eye" class="w-4 h-4"></i>
                                    </button>
                                    <button onclick="event.stopPropagation(); window.downloadQuizFromList('${exam.id}')" class="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Download Word">
                                        <i data-lucide="file-text" class="w-4 h-4"></i>
                                    </button>
                                    <button onclick="event.stopPropagation(); window.deleteQuiz('${exam.id}')" class="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors" title="Hapus">
                                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                                    </button>
                                </div>
                                
                                <div class="flex items-center gap-3 mb-4 pr-10">
                                    <div class="w-12 h-12 flex-shrink-0 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm border border-orange-100 overflow-hidden" title="Kelas: ${exam.header.class}">
                                        ${exam.header.class.substring(0, 4)}
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <h4 class="font-bold text-gray-800 truncate text-base leading-tight" title="${exam.header.title}">${exam.header.title || 'Tanpa Judul'}</h4>
                                        <p class="text-xs text-gray-500 truncate mt-0.5" title="${exam.header.subject}">${exam.header.subject || 'Tanpa Mapel'}</p>
                                    </div>
                                </div>
                                <div class="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3 mt-auto">
                                    <span class="flex items-center gap-1.5">
                                        <i data-lucide="calendar" class="w-3.5 h-3.5"></i> 
                                        ${new Date(exam.created).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                    <span class="font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md text-[10px]">
                                        ${exam.questions.length} Soal
                                    </span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        `;

        setTimeout(() => window.lucide.createIcons(), 50);
        return container;
    }

    // --- VIEW: EDITOR ---
    // Make sure we have a fresh start if creating new, or loaded data if editing
    if (!window.currentQuizQuestions) {
        window.currentQuizQuestions = [];
    }

    container.className = "flex flex-col gap-8 fade-in pb-20";

    // Back button logic added to header
    const editorHeader = `
        <div class="flex items-center gap-4 mb-2">
            <button onclick="window.cancelQuizEditor()" class="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <i data-lucide="arrow-left" class="w-6 h-6 text-gray-700"></i>
            </button>
            <h2 class="text-2xl font-bold text-gray-800">Editor Soal</h2>
        </div>
    `;

    // 1. HEADER EDITOR SECTION
    const defaultLabels = {
        school: 'NAMA SEKOLAH / INSTANSI',
        title: 'JUDUL UJIAN',
        subject: 'MATA PELAJARAN',
        class: 'KELAS',
        date: 'HARI / TANGGAL',
        time: 'WAKTU',
        code: 'KODE SOAL',
        skill: 'KOMP. KEAHLIAN',
        year: 'TAHUN PELAJARAN',
        instructions: 'PETUNJUK PENGERJAAN'
    };

    const headerHTML = `
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <i data-lucide="layout-template" class="w-5 h-5 text-indigo-600"></i>
                    Identitas Ujian (Kop Surat)
                </h3>
                <div class="flex items-center gap-2">
                    <label class="text-xs font-bold text-gray-500 uppercase">Font:</label>
                    <select id="quizFont" class="text-sm border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-1.5 bg-gray-50">
                        <option value="'Times New Roman', serif">Times New Roman (Standar)</option>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="'Calibri', sans-serif">Calibri</option>
                        <option value="'Verdana', sans-serif">Verdana</option>
                        <option value="'Tahoma', sans-serif">Tahoma</option>
                        <option value="'Courier New', monospace">Courier New</option>
                    </select>
                </div>
            </div>
            <p class="text-xs text-gray-400 mb-6 italic">*Klik pada label (teks judul kecil) untuk mengubah bahasanya.</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div class="space-y-3">
                    <input type="text" id="labelSchool" value="${defaultLabels.school}" class="block text-xs font-bold text-gray-500 uppercase w-full border-none p-0 focus:ring-0 bg-transparent mb-1 hover:text-indigo-600 transition-colors" placeholder="Label Sekolah">
                    <input type="text" id="quizSchoolName" value="${state.db.pengaturan.namaSekolah || 'SMK BANI MUSLIM PATI'}" class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>
                <div class="space-y-3">
                    <input type="text" id="labelTitle" value="${defaultLabels.title}" class="block text-xs font-bold text-gray-500 uppercase w-full border-none p-0 focus:ring-0 bg-transparent mb-1 hover:text-indigo-600 transition-colors" placeholder="Label Judul">
                    <input type="text" id="quizTitle" value="ULANGAN SEMESTER GENAP" class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>
                 <div class="space-y-3">
                    <input type="text" id="labelSubject" value="${defaultLabels.subject}" class="block text-xs font-bold text-gray-500 uppercase w-full border-none p-0 focus:ring-0 bg-transparent mb-1 hover:text-indigo-600 transition-colors" placeholder="Label Mapel">
                    <input type="text" id="quizSubject" placeholder="Contoh: PAI & BTQ" class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>
                 <div class="space-y-3">
                    <input type="text" id="labelClass" value="${defaultLabels.class}" class="block text-xs font-bold text-gray-500 uppercase w-full border-none p-0 focus:ring-0 bg-transparent mb-1 hover:text-indigo-600 transition-colors" placeholder="Label Kelas">
                    <input type="text" id="quizClass" placeholder="Contoh: X (Sepuluh)" class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>
                <div class="space-y-3">
                    <input type="text" id="labelDate" value="${defaultLabels.date}" class="block text-xs font-bold text-gray-500 uppercase w-full border-none p-0 focus:ring-0 bg-transparent mb-1 hover:text-indigo-600 transition-colors" placeholder="Label Tanggal">
                    <input type="text" id="quizDate" placeholder="Contoh: Jum'at, 08-06-2012" class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>
                 <div class="space-y-3">
                    <input type="text" id="labelTime" value="${defaultLabels.time}" class="block text-xs font-bold text-gray-500 uppercase w-full border-none p-0 focus:ring-0 bg-transparent mb-1 hover:text-indigo-600 transition-colors" placeholder="Label Waktu">
                    <input type="text" id="quizTime" placeholder="Contoh: 07.00 - 08.30 WIB" class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>
                 <div class="space-y-3">
                    <input type="text" id="labelCode" value="${defaultLabels.code}" class="block text-xs font-bold text-gray-500 uppercase w-full border-none p-0 focus:ring-0 bg-transparent mb-1 hover:text-indigo-600 transition-colors" placeholder="Label Kode">
                    <input type="text" id="quizCode" placeholder="Contoh: 1/5/X/SPS/2012" class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>
                 <div class="space-y-3">
                    <input type="text" id="labelSkill" value="${defaultLabels.skill}" class="block text-xs font-bold text-gray-500 uppercase w-full border-none p-0 focus:ring-0 bg-transparent mb-1 hover:text-indigo-600 transition-colors" placeholder="Label Skill">
                    <input type="text" id="quizSkill" placeholder="Contoh: SEMUA JURUSAN" class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>
                 <div class="space-y-3">
                    <input type="text" id="labelYear" value="${defaultLabels.year}" class="block text-xs font-bold text-gray-500 uppercase w-full border-none p-0 focus:ring-0 bg-transparent mb-1 hover:text-indigo-600 transition-colors" placeholder="Label Tahun">
                    <input type="text" id="quizYear" value="${state.db.pengaturan.tahunAjaran || '2025/2026'}" class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>
            </div>
            
            <div class="mt-6 space-y-3">
                <input type="text" id="labelInstructions" value="${defaultLabels.instructions}" class="block text-xs font-bold text-gray-500 uppercase w-full border-none p-0 focus:ring-0 bg-transparent mb-1 hover:text-indigo-600 transition-colors" placeholder="Label Petunjuk">
                <textarea id="quizInstructions" class="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]" placeholder="Tuliskan petunjuk pengerjaan (pisahkan dengan baris baru)...">a. Semua jawaban dikerjakan pada lembar jawab yang tersedia
b. Nama/Nomor tes ditulis pada sudut kanan atas lembar jawab</textarea>
                <p class="text-[10px] text-gray-400">Setiap baris baru akan menjadi poin (a, b, c, dst) otomatis.</p>
            </div>
        </div>
    `;

    // 2. QUESTION BUILDER SECTION
    const questionsHTML = `
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <i data-lucide="list-checks" class="w-5 h-5 text-indigo-600"></i>
                    Daftar Soal
                </h3>
            </div>
            
            <div id="questions-list" class="space-y-6">
                <!-- Questions will be added here -->
                 <div class="text-center py-12 text-gray-400 italic bg-gray-50 rounded-xl border border-dashed border-gray-200" id="empty-state">
                    Belum ada soal. Klik tombol "Tambah Soal" untuk memulai.
                </div>
            </div>
        </div>

        <!-- ADD QUESTION FORM -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i data-lucide="plus-circle" class="w-5 h-5 text-indigo-600"></i>
                Tambah Soal
            </h3>
            
            <div class="mb-4">
                <label class="block text-sm font-bold text-gray-700 mb-2">Tipe Soal</label>
                <div class="flex gap-4">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="questionType" value="pg" checked onchange="window.toggleQuestionType('pg')" class="text-indigo-600 focus:ring-indigo-500">
                        <span class="text-sm font-medium">Pilihan Ganda</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="questionType" value="essay" onchange="window.toggleQuestionType('essay')" class="text-indigo-600 focus:ring-indigo-500">
                        <span class="text-sm font-medium">Esai / Uraian</span>
                    </label>
                </div>
            </div>

            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">Pertanyaan</label>
                    <textarea id="questionText" rows="3" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="Tulis pertanyaan disini..."></textarea>
                </div>
                
                <div id="optionsContainer" class="space-y-2">
                    <label class="block text-sm font-bold text-gray-700 mb-1">Pilihan Jawaban</label>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-gray-400 w-6">A.</span>
                            <input type="text" id="optA" class="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500" placeholder="Pilihan A">
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-gray-400 w-6">B.</span>
                            <input type="text" id="optB" class="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500" placeholder="Pilihan B">
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-gray-400 w-6">C.</span>
                            <input type="text" id="optC" class="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500" placeholder="Pilihan C">
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-gray-400 w-6">D.</span>
                            <input type="text" id="optD" class="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500" placeholder="Pilihan D">
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="font-bold text-gray-400 w-6">E.</span>
                            <input type="text" id="optE" class="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500" placeholder="Pilihan E">
                        </div>
                    </div>
                </div>

                <div id="keyContainer">
                    <label class="block text-sm font-bold text-gray-700 mb-1">Kunci Jawaban</label>
                    <select id="keyAnswer" class="w-full md:w-1/3 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500">
                        <option value="">Pilih Kunci Jawaban</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                    </select>
                </div>

                <div class="flex justify-end pt-2">
                    <button onclick="window.addQuestion()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95">
                        <i data-lucide="check-circle" class="w-5 h-5"></i>
                        Simpan Soal
                    </button>
                </div>
            </div>
        </div>
    `;

    // 3. ACTIONS
    const actionsHTML = `
        <div class="fixed bottom-0 right-0 left-0 md:left-64 bg-white border-t border-gray-100 p-4 flex justify-between items-center z-40 shadow-lg px-8">
            <p class="text-sm text-gray-500 font-medium">Total Soal: <span id="total-questions" class="text-indigo-600 font-bold">0</span></p>
            <div class="flex gap-3">
                 <button onclick="window.previewQuiz()" class="bg-white border-2 border-gray-200 hover:border-indigo-600 hover:text-indigo-600 text-gray-600 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2">
                    <i data-lucide="eye" class="w-4 h-4"></i> Preview
                </button>
                <button onclick="window.saveQuiz()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 flex items-center gap-2">
                    <i data-lucide="save" class="w-4 h-4"></i> Simpan
                </button>
            </div>
        </div>
    `;

    container.innerHTML = editorHeader + headerHTML + questionsHTML + actionsHTML;

    // Initialize with one empty question if list is empty
    setTimeout(() => {
        if (window.currentQuizQuestions.length > 0) {
            renderAllQuestions();
        }
        updateTotalQuestions(); // Ensure total count is updated on load
        window.lucide.createIcons();
    }, 0);

    return container;
}

// --- QUIZ HELPERS ---

window.refreshView = () => {
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        mainContent.innerHTML = '';
        mainContent.appendChild(renderContent());
    }
    window.lucide.createIcons();
}

window.startNewQuiz = () => {
    window.currentQuizMode = 'editor';
    window.currentQuizId = null; // Clear edit ID
    window.currentQuizQuestions = []; // Clear questions
    window.refreshView(); // Re-render to show editor
}

window.cancelQuizEditor = () => {
    if (confirm('Apakah Anda yakin ingin keluar? Perubahan yang belum disimpan akan hilang.')) {
        window.currentQuizMode = 'list';
        window.currentQuizQuestions = [];
        window.refreshView();
    }
}

window.editQuiz = (id) => {
    const exam = state.db.exams.find(e => e.id === id);
    if (!exam) return;

    window.currentQuizMode = 'editor';
    window.currentQuizId = id; // Store ID for updating
    window.currentQuizQuestions = JSON.parse(JSON.stringify(exam.questions)); // Deep copy

    // We need to wait for render to populate inputs
    window.refreshView();

    // Populate inputs after render
    setTimeout(() => {
        if (document.getElementById('quizSchoolName')) document.getElementById('quizSchoolName').value = exam.header.school;
        if (document.getElementById('quizTitle')) document.getElementById('quizTitle').value = exam.header.title;
        if (document.getElementById('quizYear')) document.getElementById('quizYear').value = exam.header.year;
        if (document.getElementById('quizSubject')) document.getElementById('quizSubject').value = exam.header.subject;
        if (document.getElementById('quizClass')) document.getElementById('quizClass').value = exam.header.class;
        if (document.getElementById('quizDate')) document.getElementById('quizDate').value = exam.header.date;
        if (document.getElementById('quizTime')) document.getElementById('quizTime').value = exam.header.time;
        if (document.getElementById('quizCode')) document.getElementById('quizCode').value = exam.header.code;
        if (document.getElementById('quizSkill')) document.getElementById('quizSkill').value = exam.header.skill;
        if (document.getElementById('quizInstructions')) document.getElementById('quizInstructions').value = exam.header.instructions;
        if (document.getElementById('quizFont')) document.getElementById('quizFont').value = exam.header.font || "'Times New Roman', serif";

        // Populate Labels if they exist
        if (exam.header.labels) {
            if (document.getElementById('labelSchool')) document.getElementById('labelSchool').value = exam.header.labels.school || 'NAMA SEKOLAH / INSTANSI';
            if (document.getElementById('labelTitle')) document.getElementById('labelTitle').value = exam.header.labels.title || 'JUDUL UJIAN';
            if (document.getElementById('labelSubject')) document.getElementById('labelSubject').value = exam.header.labels.subject || 'MATA PELAJARAN';
            if (document.getElementById('labelClass')) document.getElementById('labelClass').value = exam.header.labels.class || 'KELAS';
            if (document.getElementById('labelDate')) document.getElementById('labelDate').value = exam.header.labels.date || 'HARI / TANGGAL';
            if (document.getElementById('labelTime')) document.getElementById('labelTime').value = exam.header.labels.time || 'WAKTU';
            if (document.getElementById('labelCode')) document.getElementById('labelCode').value = exam.header.labels.code || 'KODE SOAL';
            if (document.getElementById('labelSkill')) document.getElementById('labelSkill').value = exam.header.labels.skill || 'KOMP. KEAHLIAN';
            if (document.getElementById('labelYear')) document.getElementById('labelYear').value = exam.header.labels.year || 'TAHUN PELAJARAN';
            if (document.getElementById('labelInstructions')) document.getElementById('labelInstructions').value = exam.header.labels.instructions || 'PETUNJUK PENGERJAAN';
        }

        renderAllQuestions();
        updateTotalQuestions();
    }, 100);
}

window.deleteQuiz = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus soal ini? Tindakan ini tidak dapat dibatalkan.')) {
        const newExams = state.db.exams.filter(e => e.id !== id);
        saveDB({ ...state.db, exams: newExams });
        window.refreshView(); // Refresh list
    }
}

window.addQuestion = () => {
    const type = document.querySelector('input[name="questionType"]:checked').value;
    const text = document.getElementById('questionText').value;

    if (!text) {
        alert("Pertanyaan harus diisi!");
        return;
    }

    let question = {
        id: Date.now().toString(),
        type: type,
        text: text
    };

    if (type === 'pg') {
        const options = [
            document.getElementById('optA').value,
            document.getElementById('optB').value,
            document.getElementById('optC').value,
            document.getElementById('optD').value,
            document.getElementById('optE').value
        ];
        const key = document.getElementById('keyAnswer').value;

        if (options.some(opt => !opt)) {
            alert("Semua pilihan jawaban A-E harus diisi!");
            return;
        }
        if (!key) {
            alert("Kunci jawaban harus dipilih!");
            return;
        }

        question.options = options;
        question.key = key;
    }

    // Add to state
    window.currentQuizQuestions.push(question);

    // Clear form fields
    document.getElementById('questionText').value = '';
    document.getElementById('optA').value = '';
    document.getElementById('optB').value = '';
    document.getElementById('optC').value = '';
    document.getElementById('optD').value = '';
    document.getElementById('optE').value = '';
    document.getElementById('keyAnswer').value = '';
    document.querySelector('input[name="questionType"][value="pg"]').checked = true;
    window.toggleQuestionType('pg'); // Reset to PG view

    // Refresh view (re-render ensures UI updates)
    renderAllQuestions();
    updateTotalQuestions();
}

window.removeQuestion = (id) => {
    const idx = window.currentQuizQuestions.findIndex(q => q.id == id);
    if (idx > -1) {
        window.currentQuizQuestions.splice(idx, 1);
        renderAllQuestions(); // Re-render to update numbers
        updateTotalQuestions();
    }
};

function createQuestionHTML(q, number) {
    const typeBadge = q.type === 'essay' ? 'ESAI' : 'PG';
    const typeBadgeClass = q.type === 'essay' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700';

    return `
        <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onclick="window.removeQuestion('${q.id}')" class="p-2 bg-white text-red-500 hover:bg-red-50 rounded-lg shadow-sm border border-gray-100 transition-colors" title="Hapus Soal">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
        </div>
        <div class="flex gap-4">
            <div class="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-sm shadow-indigo-200">
                ${number}.
            </div>
            <div class="flex-1 space-y-4">
                <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${typeBadgeClass}">
                        ${typeBadge}
                    </span>
                </div>
                <div>
                     <textarea placeholder="Tuliskan pertanyaan disini..." class="w-full p-3 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px]" onchange="updateQuestionText('${q.id}', this.value)">${q.text}</textarea>
                </div>
                ${q.type === 'pg' ? `
                <div class="grid grid-cols-1 gap-3 pl-2 border-l-2 border-indigo-100">
                    ${['A', 'B', 'C', 'D', 'E'].map((optLetter, i) => `
                        <div class="flex items-center gap-3">
                            <span class="text-xs font-bold text-gray-400 w-4 uppercase">${optLetter}.</span>
                            <input type="text" value="${q.options[i]}" placeholder="Pilihan ${optLetter}" class="flex-1 px-3 py-2 rounded-md border border-gray-200 text-sm focus:border-indigo-500 outline-none" onchange="updateQuestionOption('${q.id}', ${i}, this.value)">
                            <div class="relative">
                                <input type="radio" name="correct-${q.id}" value="${optLetter}" ${q.key === optLetter ? 'checked' : ''} onchange="updateQuestionKey('${q.id}', this.value)" class="w-4 h-4 text-indigo-600 cursor-pointer" title="Tandai sebagai jawaban benar">
                            </div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
        </div>
    `;
}

function renderAllQuestions() {
    const list = document.getElementById('questions-list');
    if (!list) return;

    if (window.currentQuizQuestions.length === 0) {
        list.innerHTML = `
            <div class="text-center py-12 text-gray-400 italic bg-gray-50 rounded-xl border border-dashed border-gray-200" id="empty-state">
                Belum ada soal. Klik tombol "Tambah Soal" untuk memulai.
            </div>
        `;
    } else {
        list.innerHTML = window.currentQuizQuestions.map((q, i) =>
            `<div id="q-${q.id}" class="p-6 rounded-xl border border-gray-200 bg-gray-50/50 hover:border-indigo-300 transition-colors relative group">
                ${createQuestionHTML(q, i + 1)}
            </div>`
        ).join('');
    }
    if (window.lucide) window.lucide.createIcons();
}

// State Updaters
window.updateQuestionText = (id, val) => {
    const q = window.currentQuizQuestions.find(item => item.id === id);
    if (q) q.text = val;
}
window.updateQuestionOption = (id, idx, val) => {
    const q = window.currentQuizQuestions.find(item => item.id === id);
    if (q && q.options) q.options[idx] = val;
}
window.updateQuestionKey = (id, val) => {
    const q = window.currentQuizQuestions.find(item => item.id === id);
    if (q) q.key = val;
}
function updateTotalQuestions() {
    const el = document.getElementById('total-questions');
    if (el) el.innerText = window.currentQuizQuestions.length;
}

// TOGGLE QUESTION TYPE
window.toggleQuestionType = (type) => {
    const opts = document.getElementById('optionsContainer');
    const key = document.getElementById('keyContainer');

    if (type === 'essay') {
        opts.classList.add('hidden');
        key.classList.add('hidden');
    } else {
        opts.classList.remove('hidden');
        key.classList.remove('hidden');
    }
}

// Preview & Save
// Helper to get header from DOM
function getHeaderFromDOM() {
    return {
        school: document.getElementById('quizSchoolName')?.value,
        title: document.getElementById('quizTitle')?.value,
        year: document.getElementById('quizYear')?.value,
        subject: document.getElementById('quizSubject')?.value,
        class: document.getElementById('quizClass')?.value,
        date: document.getElementById('quizDate')?.value,
        time: document.getElementById('quizTime')?.value,
        code: document.getElementById('quizCode')?.value,
        skill: document.getElementById('quizSkill')?.value,
        instructions: document.getElementById('quizInstructions')?.value,
        font: document.getElementById('quizFont')?.value || "'Times New Roman', serif",
        labels: {
            school: document.getElementById('labelSchool')?.value || 'NAMA SEKOLAH / INSTANSI',
            title: document.getElementById('labelTitle')?.value || 'JUDUL UJIAN',
            year: document.getElementById('labelYear')?.value || 'TAHUN PELAJARAN',
            subject: document.getElementById('labelSubject')?.value || 'MATA PELAJARAN',
            class: document.getElementById('labelClass')?.value || 'KELAS',
            date: document.getElementById('labelDate')?.value || 'HARI / TANGGAL',
            time: document.getElementById('labelTime')?.value || 'WAKTU',
            code: document.getElementById('labelCode')?.value || 'KODE SOAL',
            skill: document.getElementById('labelSkill')?.value || 'KOMP. KEAHLIAN',
            instructions: document.getElementById('labelInstructions')?.value || 'PETUNJUK PENGERJAAN'
        }
    };
}

window.previewQuiz = (quizData = null) => {
    let header, questions;

    if (quizData) {
        header = quizData.header;
        questions = quizData.questions;
    } else {
        header = getHeaderFromDOM();
        questions = window.currentQuizQuestions || [];
    }

    // Default instructions if empty
    const instructionsText = header.instructions || "a. Semua jawaban dikerjakan pada lembar jawab yang tersedia\nb. Nama/Nomor tes ditulis pada sudut kanan atas lembar jawab";

    // Split instructions by new line for formatting
    const instructionsList = instructionsText.split('\n').map(line => `<li>${line}</li>`).join('');

    // Default labels fallback
    const labels = header.labels || {
        school: 'NAMA SEKOLAH / INSTANSI',
        title: 'JUDUL UJIAN',
        subject: 'MATA PELAJARAN',
        class: 'KELAS',
        date: 'HARI / TANGGAL',
        time: 'WAKTU',
        code: 'KODE SOAL',
        skill: 'KOMP. KEAHLIAN',
        year: 'TAHUN PELAJARAN',
        instructions: 'PETUNJUK PENGERJAAN'
    };

    // PARTITION QUESTIONS
    const pgQuestions = questions.filter(q => q.type !== 'essay');
    const essayQuestions = questions.filter(q => q.type === 'essay');

    const previewHTML = `
        <style>
             @import url('https://fonts.googleapis.com/css2?family=Tinos:ital,wght@0,400;0,700;1,400&display=swap');
             
             .print-preview {
                font-family: ${header.font};
                color: black;
                line-height: 1.3;
            }
             .print-preview h1 { font-size: 16pt; font-weight: 900; }
             .print-preview h2 { font-size: 14pt; font-weight: 700; }
             .print-preview p { font-size: 11pt; }
             .print-preview .identity-grid {
                 display: grid;
                 grid-template-columns: 140px 10px 1fr 100px 10px 1fr;
                 gap: 2px 8px;
                 font-size: 11pt;
                 font-weight: 700;
                 margin-bottom: 2px;
                 padding-bottom: 8px;
                 border-bottom: 3px double black;
             }
             .print-preview .question-item {
                 break-inside: avoid;
                 margin-bottom: 12px;
             }
             @media print {
                 @page { 
                     size: A4; 
                     margin: 1.5cm;
                 }
                 body {
                     -webkit-print-color-adjust: exact;
                     print-color-adjust: exact;
                 }
                 .no-print { display: none !important; }
                 
                 /* Hide everything */
                 body > * { display: none !important; }
                 
                 /* Only show the modal */
                 #genericModal { 
                     display: flex !important;
                     position: absolute !important; 
                     top: 0 !important; left: 0 !important; 
                     width: 100% !important; height: auto !important; 
                     background: white !important; 
                     z-index: 9999 !important;
                     overflow: visible !important;
                     padding: 0 !important;
                     margin: 0 !important;
                 }
                 
                 /* Target the inner container of the modal */
                 #genericModal > div {
                     box-shadow: none !important;
                     border: none !important;
                     max-width: 100% !important;
                     width: 100% !important;
                     border-radius: 0 !important;
                 }
                 
                 /* Reset scrollbars for print */
                 .custom-scrollbar {
                     overflow: visible !important;
                     height: auto !important;
                     padding: 0 !important;
                 }
                 
                 /* Make sure the preview content is visible */
                 .print-preview {
                     border: none !important;
                     padding: 0 !important;
                     margin: 0 auto !important;
                     max-width: 100% !important;
                     overflow-wrap: anywhere !important; /* Force break even for long strings */
                 }
                 
                 /* Force background colors */
                 * { -webkit-print-color-adjust: exact !important; }
             }
         </style>

         <div class="print-preview bg-white p-8 max-w-[210mm] min-h-[297mm] mx-auto border border-gray-300 shadow-lg print:border-none print:shadow-none print:p-0 text-black leading-relaxed">
             <!-- HEADER -->
             <div class="border-b-4 border-double border-black pb-4 mb-4">
                 <div class="flex items-center justify-between gap-4">
                      <!-- Logo -->
                      <div class="w-20 h-20 flex-shrink-0 flex items-center justify-center">
                         <i data-lucide="graduation-cap" class="w-16 h-16 text-black"></i>
                     </div>
                     <!-- Center Text -->
                     <div class="flex-1 text-center uppercase px-2">
                         <h2 class="tracking-wider font-bold text-xl leading-tight mb-1">${header.title}</h2>
                         <h1 class="font-black text-2xl leading-tight mb-1">${header.school}</h1>
                         <p class="font-bold text-base">${labels.year} ${header.year}</p>
                     </div>
                     <!-- Code Box -->
                     <div class="w-24 h-24 flex-shrink-0 border-2 border-black flex flex-col items-center justify-center bg-white">
                         <span class="text-xs font-bold w-full text-center border-b border-black py-1">KODE</span>
                         <span class="text-xl font-black flex-1 flex items-center justify-center text-center px-1 break-all leading-none">${header.code.split('/')[0] || 'P..'}</span>
                     </div>
                 </div>
             </div>

             <!-- IDENTITY -->
             <div class="identity-grid">
                 <span>${labels.subject}</span> <span>:</span> <span class="break-words">${header.subject}</span>
                 <span>${labels.date}</span> <span>:</span> <span class="break-words">${header.date}</span>
                 
                 <span>${labels.class}</span> <span>:</span> <span class="break-words">${header.class}</span>
                  <span>${labels.time}</span> <span>:</span> <span class="break-words">${header.time}</span>
                 
                 <span>${labels.skill}</span> <span>:</span> <span class="break-words">${header.skill}</span>
                 <span>${labels.code}</span> <span>:</span> <span class="break-words">${header.code}</span>
             </div>

             <!-- INSTRUCTIONS -->
              <div class="text-[11pt] font-bold mb-4">
                 <div class="flex gap-2">
                     <span class="flex-shrink-0">${labels.instructions.replace(':', '')} :</span>
                     <ol class="list-[lower-alpha] pl-4 m-0 break-words w-full">
                          ${instructionsList}
                     </ol>
                 </div>
             </div>
             
             <!-- PG SECTION -->
            ${pgQuestions.length > 0 ? `
                 <div class="mb-4 text-[11pt] font-bold text-justify">
                    I. Pilihlah jawaban yang benar diantara jawaban a,b,c,d dan e dengan cara memberi tanda silang (x) pada kolom lembar jawab yang tersedia !
                </div>

                <div style="column-count: 2; column-gap: 40px; text-align: justify; margin-bottom: 20px;">
                    ${pgQuestions.map((q, i) => `
                        <div class="question-item break-inside-avoid">
                            <div class="flex gap-2 text-[11pt]">
                                <span class="font-bold w-5 flex-shrink-0 text-right">${i + 1}.</span>
                                <div class="flex-1 min-w-0">
                                    <p class="mb-1 whitespace-pre-wrap leading-snug break-words" style="word-break: break-word;">${q.text || '...'}</p>
                                    <ol class="list-[lower-alpha] pl-5 m-0 space-y-0.5 ml-1">
                                        ${q.options ? q.options.map(opt => `<li class="break-words" style="word-break: break-word;">${opt || '...'}</li>`).join('') : ''}
                                    </ol>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            <!-- ESSAY SECTION -->
            ${essayQuestions.length > 0 ? `
                <div class="mb-4 text-[11pt] font-bold text-justify">
                    II. Jawablah pertanyaan berikut dengan benar dan jelas!
                </div>
                
                <div style="text-align: justify;">
                     ${essayQuestions.map((q, i) => `
                        <div class="question-item mb-6">
                            <div class="flex gap-2 text-[11pt]">
                                <span class="font-bold w-5 flex-shrink-0 text-right">${pgQuestions.length + i + 1}.</span>
                                <div class="flex-1 min-w-0">
                                    <p class="mb-1 whitespace-pre-wrap leading-snug break-words" style="word-break: break-word;">${q.text || '...'}</p>
                                    <div class="my-2 text-gray-300 text-xs select-none pointer-events-none">
                                        ........................................................................................................................................................<br>
                                        ........................................................................................................................................................<br>
                                        ........................................................................................................................................................
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            <div class="mt-8 text-center text-xs text-gray-400 no-print">
                 Use browser print settings (Ctrl+P) to save as PDF. Ensure spacing matches A4.
            </div>
        </div>
        
        <div class="flex justify-center gap-4 mt-8 no-print pb-10">
            <button onclick='window.downloadQuizAsWord(${JSON.stringify(quizData)})' class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95">
                <i data-lucide="file-text" class="w-4 h-4"></i> Download Word
            </button>
             <button onclick="closeModal()" class="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                Tutup Preview
            </button>
        </div>
    `;

    // WORD EXPORT FUNCTION
    window.downloadQuizAsWord = (quizData = null) => {
        let header, questions;

        if (quizData) {
            header = quizData.header;
            questions = quizData.questions;
        } else {
            header = getHeaderFromDOM();
            questions = window.currentQuizQuestions || [];
        }

        // Default labels fallback
        const labels = header.labels || {
            school: 'NAMA SEKOLAH / INSTANSI',
            title: 'JUDUL UJIAN',
            subject: 'MATA PELAJARAN',
            class: 'KELAS',
            date: 'HARI / TANGGAL',
            time: 'WAKTU',
            code: 'KODE SOAL',
            skill: 'KOMP. KEAHLIAN',
            year: 'TAHUN PELAJARAN',
            instructions: 'PETUNJUK PENGERJAAN'
        };

        const fontStyle = `font-family: ${header.font || "'Times New Roman', serif"}; font-size: 11pt;`;

        const preHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Doc</title><style>
            @page { size: 21.0cm 29.7cm; margin: 1.5cm 1.5cm 1.5cm 1.5cm; mso-page-orientation: portrait; } 
            body { ${fontStyle} } 
            table { border-collapse: collapse; width: 100%; } 
            td { vertical-align: top; padding: 2px; } 
            .q-table td { padding-bottom: 5px; }
            ol { margin: 0; padding-left: 20px; }
            li { margin-bottom: 2px; }
        </style></head><body>`;
        const postHtml = "</body></html>";

        // Helper to render a single question as a table (to mimic flex)
        const renderQuestionToTable = (q, index) => {
            const num = index + 1;
            const text = q.text || '...';

            // Explicitly generate table rows for options with letters
            const opts = (q.options || []).map((o, i) => {
                const letter = String.fromCharCode(97 + i) + '.'; // 97 is 'a'
                return `
                    <tr>
                        <td style="width: 25px; vertical-align: top;">${letter}</td>
                        <td style="vertical-align: top;">${o || '...'}</td>
                    </tr>
                `;
            }).join('');

            return `
            <table class="q-table" style="width: 100%; margin-bottom: 12px; border: none;">
                <tr>
                    <td style="width: 30px; vertical-align: top; font-weight: bold;">${num}.</td>
                    <td style="vertical-align: top;">
                        <div style="margin-bottom: 5px; text-align: justify;">${text}</div>
                        <table style="width: 100%; border: none; margin-top: 2px;">
                            ${opts}
                        </table>
                    </td>
                </tr>
            </table>
            `;
        };

        // SPLIT QUESTIONS (PG and ESSAY)
        const pgQuestions = questions.filter(q => q.type !== 'essay');
        const essayQuestions = questions.filter(q => q.type === 'essay');

        // Render PG Logic
        const mid = Math.ceil(pgQuestions.length / 2);
        const leftQuestions = pgQuestions.slice(0, mid);
        const rightQuestions = pgQuestions.slice(mid);

        const leftHtml = leftQuestions.map((q, i) => renderQuestionToTable(q, i)).join('');
        const rightHtml = rightQuestions.map((q, i) => renderQuestionToTable(q, mid + i)).join('');

        // Render Essay Logic
        let essayHtml = '';
        if (essayQuestions.length > 0) {
            essayHtml = `
            <div style="font-size: 11pt; font-weight: bold; margin-bottom: 10px; margin-top: 15px; text-align: justify;">
                II. Jawablah pertanyaan berikut dengan benar dan jelas!
            </div>
            <table class="q-table" style="width: 100%; border: none;">
                ${essayQuestions.map((q, i) => `
                    <tr>
                        <td style="width: 30px; vertical-align: top; font-weight: bold;">${pgQuestions.length + i + 1}.</td>
                        <td style="vertical-align: top;">
                            <div style="margin-bottom: 80px; text-align: justify;">${q.text || '...'}</div>
                        </td>
                    </tr>
                `).join('')}
            </table>
            `;
        }

        let html = `
            <table class="header-table" style="width: 100%; border-bottom: 3px double black; margin-bottom: 15px;">
                <tr>
                    <td rowspan="3" width="80" style="width: 80px; text-align: center; vertical-align: middle;">
                         <span style="font-size: 40pt;">🎓</span>
                    </td>
                    <td style="text-align: center;">
                        <span style="font-size: 14pt; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">${header.title}</span><br>
                        <span style="font-size: 16pt; font-weight: 900; text-transform: uppercase;">${header.school}</span><br>
                        <span style="font-size: 11pt; font-weight: bold;">${labels.year} ${header.year}</span>
                    </td>
                    <td rowspan="3" width="100" style="width: 100px; padding: 0;">
                         <div style="border: 2px solid black; text-align: center; height: 100px;">
                            <div style="font-size: 10pt; font-weight: bold; border-bottom: 1px solid black;">KODE</div>
                             <div style="font-size: 20pt; font-weight: 900; padding-top: 20px; word-break: break-all;">${header.code.split('/')[0] || '..'}</div>
                        </div>
                    </td>
                </tr>
            </table>

            <table class="identity-table" style="width: 100%; font-weight: bold; font-size: 11pt; margin-bottom: 10px;">
                 <tr>
                    <td style="width: 150px;">${labels.subject}</td><td style="width: 10px;">:</td><td>${header.subject}</td>
                    <td style="width: 120px;">${labels.date}</td><td style="width: 10px;">:</td><td>${header.date}</td>
                </tr>
                 <tr>
                    <td style="width: 150px;">${labels.class}</td><td style="width: 10px;">:</td><td>${header.class}</td>
                    <td style="width: 120px;">${labels.time}</td><td style="width: 10px;">:</td><td>${header.time}</td>
                </tr>
                 <tr>
                    <td style="width: 150px;">${labels.skill}</td><td style="width: 10px;">:</td><td>${header.skill}</td>
                    <td style="width: 120px;">${labels.code}</td><td style="width: 10px;">:</td><td>${header.code}</td>
                </tr>
            </table>

             <div style="font-size: 11pt; font-weight: bold; margin-bottom: 15px;">
                <table style="width: 100%;">
                    <tr>
                        <td style="width: 90px; white-space: nowrap;">${labels.instructions.replace(':', '')} :</td>
                        <td>
                             <ol type="a" style="margin: 0; padding-left: 20px;">
                                ${header.instructions.split('\n').map(l => `<li>${l}</li>`).join('')}
                            </ol>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- PG SECTION -->
            ${pgQuestions.length > 0 ? `
            <div style="font-size: 11pt; font-weight: bold; margin-bottom: 10px; text-align: justify;">
                I. Pilihlah jawaban yang benar diantara jawaban a,b,c,d dan e dengan cara memberi tanda silang (x) pada kolom lembar jawab yang tersedia !
            </div>

            <table style="width: 100%; border: none;">
                <tr>
                    <td style="width: 50%; vertical-align: top; padding-right: 15px;">
                        ${leftHtml}
                    </td>
                    <td style="width: 50%; vertical-align: top; padding-left: 15px;">
                        ${rightHtml}
                    </td>
                </tr>
            </table>
            ` : ''}
            
            <!-- ESSAY SECTION -->
            ${essayHtml}

            <br>
             <div style="font-size: 10pt; text-align: center; color: #888;">
                Downloaded from Sekolah Pintar
            </div>
        `;

        const blob = new Blob(['\ufeff', preHtml + html + postHtml], {
            type: 'application/msword'
        });

        // Specify link url
        const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(preHtml + html + postHtml);

        // Create download link element
        const downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);

        if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, 'soal-ujian-word.doc');
        } else {
            // Create a link to the file
            downloadLink.href = url;

            // Setting the file name
            downloadLink.download = 'soal-ujian-word.doc';

            //triggering the function
            downloadLink.click();
        }

        document.body.removeChild(downloadLink);
    };

    showModal("Preview Soal Ujian", previewHTML, null, 'max-w-5xl');
}

// Save Quiz
window.saveQuiz = () => {
    // We use getHeaderFromDOM to ensure we capture all fields including custom labels
    const header = getHeaderFromDOM();

    if (!header.school || !header.title) {
        alert("Nama Sekolah dan Judul Ujian harus diisi!");
        return;
    }

    const currentDB = state.db;
    let newExams = [...currentDB.exams];

    if (window.currentQuizId) {
        // Update existing
        const index = newExams.findIndex(e => e.id === window.currentQuizId);
        if (index > -1) {
            newExams[index] = {
                ...newExams[index],
                header: header,
                questions: window.currentQuizQuestions,
                updated: new Date().toISOString()
            };
        }
    } else {
        // Create new
        const newQuiz = {
            id: `exam_${Date.now()}`,
            header: header,
            questions: window.currentQuizQuestions,
            created: new Date().toISOString()
        };
        newExams.push(newQuiz);
    }

    saveDB({ ...currentDB, exams: newExams });

    alert("Soal berhasil disimpan ke Database!");

    // Return to list view
    window.currentQuizMode = 'list';
    window.currentQuizId = null;
    window.currentQuizQuestions = [];
    window.refreshView();
}

window.previewQuizFromList = (id) => {
    const exam = state.db.exams.find(e => e.id === id);
    if (!exam) return;
    window.previewQuiz(exam);
}

window.downloadQuizFromList = (id) => {
    const exam = state.db.exams.find(e => e.id === id);
    if (!exam) return;
    window.downloadQuizAsWord(exam);
}


function createPlaceholder(title, message) {
    const container = document.createElement('div');
    container.className = "text-center py-20 fade-in";
    container.innerHTML = `
        < div class="bg-white p-8 rounded-3xl shadow-lg border border-indigo-50 inline-block" >
            <div class="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <i data-lucide="construction" class="w-10 h-10 text-indigo-500"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">${title}</h3>
            <p class="text-gray-500 max-w-sm mx-auto">${message}</p>
        </div >
        `;
    return container;
}


// --- HELPER: GENERIC MODAL ---
function showModal(title, contentHTML, onConfirm, widthClass = 'max-w-2xl') {
    const existingModal = document.getElementById('genericModal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'genericModal';
    modal.className = "fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm fade-in";
    modal.innerHTML = `
        <div id="modalContent" class="bg-white w-full ${widthClass} rounded-2xl shadow-2xl transform scale-100 transition-all max-h-[90vh] flex flex-col">
            <div class="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 class="text-xl font-bold text-gray-900">${title}</h3>
                <button type="button" onclick="closeModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
            </div>
            <div class="p-6 overflow-y-auto custom-scrollbar relative">
                ${contentHTML}
            </div>
        </div>
        `;

    document.body.appendChild(modal);

    // Initialize icons in the modal
    if (window.lucide) window.lucide.createIcons();

    // Handle form submission inside the modal if it exists
    const form = modal.querySelector('form');
    if (form && onConfirm) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Form submitted'); // Debug log
            // alert('Debug: Form submit triggered'); // Uncomment for visual debug if needed
            const formData = new FormData(form);
            try {
                onConfirm(formData);
                closeModal();
            } catch (err) {
                console.error(err);
                alert('Terjadi kesalahan saat menyimpan data: ' + err.message);
            }
        });
    }

    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (!e.target.closest('#modalContent')) closeModal();
    });
}

window.closeModal = () => {
    const modal = document.getElementById('genericModal');
    if (modal) {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.remove(), 200);
    }
};

// --- TEACHERS COMPONENT ---
function renderTeachers() {
    const teachers = state.db.users.filter(u => u.role === UserRole.GURU && u.sekolahId === state.user.sekolahId);

    // Explicitly expose functions to window to ensure onclick works
    window.showTeacherModal = showTeacherModal;
    window.editTeacher = editTeacher;
    window.deleteTeacher = deleteTeacher;
    window.viewTeacher = viewTeacher;

    const rows = teachers.length === 0 ? `
        <tr><td colspan="5" class="px-6 py-12 text-center text-gray-400 italic text-xs">Belum ada data guru</td></tr>
            ` : teachers.map(item => `
            <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center overflow-hidden border border-indigo-100">
                        ${item.foto ? `<img src="${item.foto}" class="w-full h-full object-cover" />` : `<span class="text-indigo-600 font-bold text-xs">${item.name.charAt(0)}</span>`}
                    </div>
                    <div>
                        <p class="font-bold text-gray-900">${item.name}</p>
                        <p class="text-[10px] text-gray-500">NIP: ${item.nip || '-'}</p>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4">
                 <p class="text-xs font-bold text-gray-700">${item.mapel || '-'}</p>
                 <p class="text-[10px] text-gray-500">${item.statusGuru || '-'}</p>
            </td>
            <td class="px-6 py-4 text-xs text-gray-600">${item.phone || '-'}</td>
             <td class="px-6 py-4">
                <span class="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight">${item.jabatan || 'Guru Mapel'}</span>
            </td>
            <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                     <button type="button" onclick="window.viewTeacher('${item.id}')" class="p-2 hover:bg-indigo-50 rounded-full text-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer" title="Lihat Detail">
                        <i data-lucide="eye" class="w-4 h-4 pointer-events-none"></i>
                    </button>
                    <button type="button" onclick="window.editTeacher('${item.id}')" class="p-2 hover:bg-gray-100 rounded-full text-indigo-600 transition-colors cursor-pointer" title="Edit">
                        <i data-lucide="edit-3" class="w-4 h-4 pointer-events-none"></i>
                    </button>
                    <button type="button" onclick="window.deleteTeacher('${item.id}')" class="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors cursor-pointer" title="Hapus">
                        <i data-lucide="trash-2" class="w-4 h-4 pointer-events-none"></i>
                    </button>
                </div>
            </td>
        </tr>
        `).join('');

    const container = document.createElement('div');
    container.className = "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden fade-in";

    // Using inline onclick with global function reference + relative z-50 for safety
    container.innerHTML = `
        <div class="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 class="text-lg font-bold text-gray-800">Data Guru</h3>
          <button type="button" onclick="window.showTeacherModal()" class="relative z-50 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2 text-sm font-bold cursor-pointer">
            <i data-lucide="plus" class="w-4 h-4 pointer-events-none"></i>
            Tambah Guru
          </button>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left">
                <thead class="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <tr>
                        <th class="px-6 py-4">Nama & NIP</th>
                        <th class="px-6 py-4">Mapel & Status</th>
                        <th class="px-6 py-4">Kontak</th>
                        <th class="px-6 py-4">Jabatan</th>
                        <th class="px-6 py-4 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 text-sm text-gray-600">
                    ${rows}
                </tbody>
            </table>
        </div>
    `;

    return container;
}


// Global variable for current teacher being edited
window.currentTeacher = null;

// Global Save Action for Teacher
window.saveTeacherAction = () => {
    const form = document.querySelector('#genericModal form');
    if (!form) {
        alert('Error: Form tidak ditemukan');
        return;
    }

    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');

    if (!name || !email) {
        alert('Harap lengkapi Nama Lengkap dan Email!');
        return;
    }

    const t = window.currentTeacher || {};

    // Handle Photo
    let newFoto = t.foto || '';
    const preview = document.getElementById('previewFoto');
    if (preview && preview.src && !preview.classList.contains('hidden')) {
        newFoto = preview.src;
    }

    const teacherData = {
        ...(t || {}),
        id: t.id || `g${Date.now()}`,
        role: UserRole.GURU,
        sekolahId: state.user.sekolahId,
        name: formData.get('name'),
        email: formData.get('email'),
        nik: formData.get('nik'),
        tglLahir: formData.get('tglLahir'),
        gender: formData.get('gender'),
        alamat: formData.get('alamat'),
        agama: formData.get('agama'),
        phone: formData.get('phone'),
        nip: formData.get('nip'),
        statusGuru: formData.get('statusGuru'),
        jabatan: formData.get('jabatan'),
        sertifikasi: formData.get('sertifikasi'),
        mapel: formData.get('mapel'),
        kelasAjar: formData.get('kelasAjar'),
        jamMengajar: formData.get('jamMengajar'),
        tahunMasuk: formData.get('tahunMasuk'),
        foto: newFoto
    };

    try {
        if (t && t.id) {
            // Edit Mode
            const index = state.db.users.findIndex(u => u.id === t.id);
            if (index !== -1) {
                const updatedUsers = [...state.db.users];
                updatedUsers[index] = teacherData;
                saveDB({ ...state.db, users: updatedUsers });
            }
        } else {
            // Add Mode
            saveDB({ ...state.db, users: [...state.db.users, teacherData] });
        }
        renderApp();
        closeModal();
        alert('Data guru berhasil disimpan!');
    } catch (err) {
        console.error(err);
        alert('Gagal menyimpan: ' + err.message);
    }
};

function showTeacherModal(teacher = null, isViewMode = false) {
    const isEdit = !!teacher && !isViewMode;
    const t = teacher || {};

    const disabledAttr = isViewMode ? 'disabled class="bg-gray-50 text-gray-500 cursor-not-allowed w-full px-4 py-2 rounded-lg border border-gray-200 outline-none text-sm"' : 'class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"';

    const formHTML = `
        <form class="space-y-6 pr-2">
            <!--Foto Profil-->
             <div class="flex items-center gap-4">
                <div class="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden group ${!isViewMode ? 'hover:border-indigo-500 cursor-pointer' : ''}">
                    <img id="previewFoto" src="${t.foto || ''}" class="${t.foto ? '' : 'hidden'} w-full h-full object-cover" />
                    <i data-lucide="camera" class="w-6 h-6 text-gray-400 ${t.foto ? 'hidden' : ''}"></i>
                    ${!isViewMode ? `<input type="file" id="fotoInput" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" onchange="window.previewImage(this)">` : ''}
                </div>
                <div>
                     <p class="text-sm font-bold text-gray-700">Foto Profil</p>
                     <p class="text-xs text-gray-500">${isViewMode ? 'Foto tersimpan' : 'Klik lingkaran untuk unggah'}</p>
                </div>
            </div>

            <!--Data Pribadi-->
            <div class="space-y-4">
                <h4 class="text-sm uppercase tracking-widest font-bold text-indigo-500 border-b pb-2">Data Pribadi</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Nama Lengkap</label>
                        <input type="text" name="name" value="${t.name || ''}" ${disabledAttr}>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">NIK</label>
                        <input type="text" name="nik" value="${t.nik || ''}" ${disabledAttr}>
                    </div>
                     <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Tempat, Tanggal Lahir</label>
                        <input type="date" name="tglLahir" value="${t.tglLahir || ''}" ${disabledAttr}>
                    </div>
                     <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Jenis Kelamin</label>
                        <select name="gender" ${disabledAttr}>
                             <option value="L" ${t.gender === 'L' ? 'selected' : ''}>Laki-laki</option>
                             <option value="P" ${t.gender === 'P' ? 'selected' : ''}>Perempuan</option>
                        </select>
                    </div>
                     <div class="md:col-span-2">
                        <label class="block text-xs font-bold text-gray-500 mb-1">Alamat Lengkap</label>
                        <textarea name="alamat" rows="2" ${disabledAttr}>${t.alamat || ''}</textarea>
                    </div>
                     <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Agama</label>
                        <select name="agama" ${disabledAttr}>
                             <option value="Islam" ${t.agama === 'Islam' ? 'selected' : ''}>Islam</option>
                             <option value="Kristen" ${t.agama === 'Kristen' ? 'selected' : ''}>Kristen</option>
                             <option value="Katolik" ${t.agama === 'Katolik' ? 'selected' : ''}>Katolik</option>
                             <option value="Hindu" ${t.agama === 'Hindu' ? 'selected' : ''}>Hindu</option>
                             <option value="Buddha" ${t.agama === 'Buddha' ? 'selected' : ''}>Buddha</option>
                             <option value="Konghucu" ${t.agama === 'Konghucu' ? 'selected' : ''}>Konghucu</option>
                        </select>
                    </div>
                     <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">No. HP</label>
                        <input type="tel" name="phone" value="${t.phone || ''}" ${disabledAttr}>
                    </div>
                    <div class="md:col-span-2">
                        <label class="block text-xs font-bold text-gray-500 mb-1">Email (untuk Login)</label>
                        <input type="email" name="email" value="${t.email || ''}" ${disabledAttr}>
                    </div>
                </div>
            </div>

             <!--Data Kepegawaian-->
            <div class="space-y-4">
                <h4 class="text-sm uppercase tracking-widest font-bold text-indigo-500 border-b pb-2">Data Kepegawaian</h4>
                 <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">NIP / NUPTK</label>
                        <input type="text" name="nip" value="${t.nip || ''}" ${disabledAttr}>
                    </div>
                     <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Status Guru</label>
                        <select name="statusGuru" ${disabledAttr}>
                             <option value="PNS" ${t.statusGuru === 'PNS' ? 'selected' : ''}>PNS</option>
                             <option value="Honorer" ${t.statusGuru === 'Honorer' ? 'selected' : ''}>Honorer/GTT</option>
                             <option value="Tetap Yayasan" ${t.statusGuru === 'Tetap Yayasan' ? 'selected' : ''}>Tetap Yayasan</option>
                        </select>
                    </div>
                     <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Jabatan</label>
                        <input type="text" name="jabatan" value="${t.jabatan || 'Guru Mapel'}" ${disabledAttr}>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Sertifikasi</label>
                        <select name="sertifikasi" ${disabledAttr}>
                             <option value="Belum" ${t.sertifikasi === 'Belum' ? 'selected' : ''}>Belum Sertifikasi</option>
                             <option value="Sudah" ${t.sertifikasi === 'Sudah' ? 'selected' : ''}>Sudah Sertifikasi</option>
                        </select>
                    </div>
                 </div>
            </div>
            
             <!--Data Mengajar-->
        <div class="space-y-4">
            <h4 class="text-sm uppercase tracking-widest font-bold text-indigo-500 border-b pb-2">Data Mengajar</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1">Mata Pelajaran Utama</label>
                    <input type="text" name="mapel" value="${t.mapel || ''}" ${disabledAttr}>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1">Kelas yang Diajar</label>
                    <input type="text" name="kelasAjar" value="${t.kelasAjar || ''}" ${disabledAttr}>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1">Jam Mengajar / Minggu</label>
                    <input type="number" name="jamMengajar" value="${t.jamMengajar || ''}" ${disabledAttr}>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1">Tahun Mulai Mengajar</label>
                    <input type="number" name="tahunMasuk" value="${t.tahunMasuk || new Date().getFullYear()}" ${disabledAttr}>
                </div>
            </div>
        </div>

            ${!isViewMode ? `
            <div class="pt-6 border-t mt-4">
                 <button type="button" onclick="window.saveTeacherAction()" class="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 cursor-pointer">
                    ${isEdit ? 'Simpan Perubahan' : 'Tambah Guru Baru'}
                 </button>
            </div>
            ` : ''
        }
        </form>
        `;

    const title = isViewMode ? 'Detail Data Guru' : (isEdit ? 'Edit Data Guru' : 'Tambah Guru Baru');

    // Set global current teacher for the save action
    window.currentTeacher = t;

    // Call showModal with null callback
    showModal(title, formHTML, null);
}

function viewTeacher(id) {
    const teacher = state.db.users.find(u => u.id === id);
    if (teacher) showTeacherModal(teacher, true);
}

function editTeacher(id) {
    const teacher = state.db.users.find(u => u.id === id);
    if (teacher) showTeacherModal(teacher);
}

function deleteTeacher(id) {
    if (confirm('Hapus data guru ini?')) {
        saveDB({ ...state.db, users: state.db.users.filter(u => u.id !== id) });
        renderApp();
    }
}

// Helper for image preview
function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const preview = document.getElementById('previewFoto');
            const icon = input.parentElement.querySelector('i');
            preview.src = e.target.result;
            preview.classList.remove('hidden');
            icon.classList.add('hidden');
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// Export to window for inline onclick handlers
window.showTeacherModal = showTeacherModal;
window.editTeacher = editTeacher;
window.deleteTeacher = deleteTeacher;
window.previewImage = previewImage;

window.navigate = (tab) => {
    state.activeTab = tab;
    state.isSidebarOpen = false;
    renderApp();
};

window.logout = () => {
    setUser(null);
    state.activeTab = 'dashboard';
};

window.toggleSidebar = () => {
    state.isSidebarOpen = !state.isSidebarOpen;
    renderApp();
};

// --- STUDENTS COMPONENT ---
// --- STUDENTS COMPONENT ---
function renderStudents() {
    // Determine students based on role
    const allStudents = state.user.role === UserRole.SUPER_ADMIN
        ? state.db.siswa
        : state.db.siswa.filter(s => s.sekolahId === state.user.sekolahId);

    // Initialize state
    if (typeof window.studentClassFilter === 'undefined') window.studentClassFilter = '';
    if (typeof window.studentSearchQuery === 'undefined') window.studentSearchQuery = '';

    const isFilterActive = !!window.studentClassFilter || !!window.studentSearchQuery;

    // Filter Logic
    let students = [];
    if (isFilterActive) {
        students = allStudents.filter(s => {
            const matchesClass = window.studentClassFilter ? s.kelasId === window.studentClassFilter : true;
            const query = (window.studentSearchQuery || '').toLowerCase();
            const matchesSearch = !query ||
                (s.nama && s.nama.toLowerCase().includes(query)) ||
                (s.nis && s.nis.includes(query));
            return matchesClass && matchesSearch;
        });
    }

    // Expose global functions needed for onclick handlers
    window.showStudentModal = showStudentModal;
    window.viewStudent = viewStudent;
    window.editStudent = editStudent;
    window.deleteStudent = deleteStudent;

    // Helper to auto-fill class details in modal
    window.handleClassChange = (select) => {
        const classId = select.value;
        if (!classId) return;

        const cls = state.db.kelas.find(c => c.id === classId);
        if (cls) {
            const form = select.closest('form');
            if (form) {
                // Update Tingkat
                const tingkatInput = form.querySelector('[name="tingkat"]');
                if (tingkatInput) tingkatInput.value = cls.tingkat;

                // Update Jurusan
                const jurusanInput = form.querySelector('input[name="jurusan"]');
                if (jurusanInput) jurusanInput.value = cls.jurusan;

                // Update Wali Kelas
                const waliInput = form.querySelector('input[name="waliKelasId"]');
                if (waliInput) waliInput.value = cls.waliKelasId;
            }
        }
    };

    // Filter Handler
    window.setStudentFilter = (val) => {
        window.studentClassFilter = val;
        renderApp();
    };

    window.setStudentSearch = (val) => {
        window.studentSearchQuery = val;
        renderApp();
    };

    // Global variable for current student being edited
    window.currentStudent = null;

    // Global Save Action
    window.saveStudentAction = () => {
        console.log('Save action triggered');
        const form = document.querySelector('#genericModal form');
        if (!form) {
            alert('Error: Form tidak ditemukan');
            return;
        }

        const formData = new FormData(form);
        const nama = formData.get('nama');
        const nis = formData.get('nis');

        if (!nama || !nis) {
            alert('Harap lengkapi Nama Lengkap dan NIS!');
            return;
        }

        const s = window.currentStudent || {};

        // Handle Photo
        let newFoto = s.foto || '';
        const preview = document.getElementById('previewFotoSiswa');
        if (preview && preview.src && !preview.classList.contains('hidden')) {
            newFoto = preview.src;
        }

        const newData = {
            ...(s || {}),
            id: s.id || `st${Date.now()}`,
            sekolahId: state.user.sekolahId,
            nama: formData.get('nama'),
            nis: formData.get('nis'),
            nisn: formData.get('nisn'),
            nik: formData.get('nik'),
            tempatLahir: formData.get('tempatLahir'),
            tanggalLahir: formData.get('tanggalLahir'),
            gender: formData.get('gender'),
            agama: formData.get('agama'),
            alamat: formData.get('alamat'),
            provinsi: formData.get('provinsi'),
            kabupaten: formData.get('kabupaten'),
            kecamatan: formData.get('kecamatan'),
            kodePos: formData.get('kodePos'),
            kelasId: formData.get('kelasId'),
            tingkat: formData.get('tingkat'),
            jurusan: formData.get('jurusan'),
            waliKelasId: formData.get('waliKelasId'),
            tahunAjaran: formData.get('tahunAjaran'),
            semester: formData.get('semester'),
            statusSiswa: formData.get('statusSiswa'),
            foto: newFoto,
            statusAktif: true
        };

        try {
            if (s && s.id) {
                // Edit Mode
                const index = state.db.siswa.findIndex(item => item.id === s.id);
                if (index !== -1) {
                    const updated = [...state.db.siswa];
                    updated[index] = newData;
                    saveDB({ ...state.db, siswa: updated });
                }
            } else {
                // Add Mode
                saveDB({ ...state.db, siswa: [...state.db.siswa, newData] });
            }
            renderApp();
            closeModal();
            alert('Data siswa berhasil disimpan!');
        } catch (err) {
            console.error(err);
            alert('Gagal menyimpan: ' + err.message);
        }
    };

    // Prepare Options for Filter
    const classes = state.db.kelas ? state.db.kelas.filter(k => k.sekolahId === state.user.sekolahId) : [];
    const filterOptions = classes.map(c => `<option value="${c.id}" ${window.studentClassFilter === c.id ? 'selected' : ''}>${c.nama}</option>`).join('');

    // Determine Empty/Loading State Content
    let tbodyContent = '';

    if (!isFilterActive) {
        tbodyContent = `
            <tr>
                <td colspan="5" class="px-6 py-12 text-center text-gray-400">
                    <div class="flex flex-col items-center justify-center gap-3">
                        <div class="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-400">
                            <i data-lucide="filter" class="w-6 h-6"></i>
                        </div>
                        <p class="font-medium text-sm">Silakan pilih kelas atau cari siswa untuk menampilkan data.</p>
                    </div>
                </td>
            </tr>
         `;
    } else if (students.length === 0) {
        tbodyContent = `
            <tr><td colspan="5" class="px-6 py-12 text-center text-gray-400 italic text-xs">Belum ada data siswa yang cocok</td></tr>
        `;
    } else {
        tbodyContent = students.map(item => {
            const kelas = state.db.kelas ? state.db.kelas.find(k => k.id === item.kelasId) : null;
            const kelasNama = kelas ? kelas.nama : '-';
            return `
                <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 border border-gray-200">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center overflow-hidden border border-indigo-100">
                            ${item.foto ? `<img src="${item.foto}" class="w-full h-full object-cover" />` : `<span class="text-indigo-600 font-bold text-xs">${(item.nama || '').charAt(0)}</span>`}
                        </div>
                        <div>
                            <p class="font-bold text-gray-900">${item.nama}</p>
                            <p class="text-[10px] text-gray-500">NIS: ${item.nis || '-'}</p>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 border border-gray-200">
                    <p class="text-xs font-bold text-gray-700">${kelasNama}</p>
                    <p class="text-[10px] text-gray-500">${item.nisn || '-'}</p>
                </td>
                <td class="px-6 py-4 border border-gray-200">
                     <span class="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight">${item.jurusan || '-'}</span>
                </td>
                <td class="px-6 py-4 border border-gray-200">
                    <span class="px-2 py-1 rounded-full text-[10px] font-bold ${item.statusSiswa === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}">
                        ${item.statusSiswa || 'Aktif'}
                    </span>
                </td>
                <td class="px-6 py-4 text-center border border-gray-200">
                    <div class="flex items-center justify-center gap-2">
                        <button type="button" onclick="window.showStudentQR('${item.id}')" class="p-2 hover:bg-blue-50 rounded-full text-blue-400 hover:text-blue-600 transition-colors cursor-pointer" title="QR Code">
                            <i data-lucide="qr-code" class="w-4 h-4 pointer-events-none"></i>
                        </button>
                         <button type="button" onclick="window.viewStudent('${item.id}')" class="p-2 hover:bg-indigo-50 rounded-full text-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer" title="Lihat">
                            <i data-lucide="eye" class="w-4 h-4 pointer-events-none"></i>
                        </button>
                        <button type="button" onclick="window.editStudent('${item.id}')" class="p-2 hover:bg-gray-100 rounded-full text-indigo-600 transition-colors cursor-pointer" title="Edit">
                            <i data-lucide="edit-3" class="w-4 h-4 pointer-events-none"></i>
                        </button>
                        <button type="button" onclick="window.deleteStudent('${item.id}')" class="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors cursor-pointer" title="Hapus">
                            <i data-lucide="trash-2" class="w-4 h-4 pointer-events-none"></i>
                        </button>
                    </div>
                </td>
            </tr>
            `;
        }).join('');
    }

    const container = document.createElement('div');
    container.className = "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden fade-in";

    container.innerHTML = `
        <div class="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 class="text-lg font-bold text-gray-800">Data Siswa</h3>
          
          <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div class="relative min-w-[180px]">
                     <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i data-lucide="filter" class="w-4 h-4 text-gray-400"></i>
                    </div>
                    <select onchange="window.setStudentFilter(this.value)" class="pl-9 pr-8 py-2 bg-gray-50 border-none rounded-lg text-sm outline-none w-full appearance-none cursor-pointer hover:bg-gray-100 transition-colors text-gray-600 font-medium h-[36px]">
                        <option value="">-- Pilih Kelas --</option>
                        ${filterOptions}
                    </select>
                     <div class="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                        <i data-lucide="chevron-down" class="w-4 h-4 text-gray-400"></i>
                    </div>
                </div>

                <div class="relative">
                  <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></i>
                  <input type="text" placeholder="Cari Nama / NIS..." value="${window.studentSearchQuery || ''}" onchange="window.setStudentSearch(this.value)" class="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm outline-none w-full sm:w-auto h-[36px]" />
                </div>

             ${state.user.role === UserRole.GURU ? `
             <button type="button" onclick="window.showStudentModal()" class="relative z-50 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2 text-sm font-bold cursor-pointer h-[36px] whitespace-nowrap">
                <i data-lucide="plus" class="w-4 h-4 pointer-events-none"></i>
                Tambah Siswa
            </button>
             ` : ''}
          </div>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead class="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <tr>
                        <th class="px-6 py-4 border border-gray-200">Nama & NIS</th>
                        <th class="px-6 py-4 border border-gray-200">Kelas & NISN</th>
                        <th class="px-6 py-4 border border-gray-200">Jurusan</th>
                        <th class="px-6 py-4 border border-gray-200">Status</th>
                        <th class="px-6 py-4 border border-gray-200 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 text-sm text-gray-600">
                    ${tbodyContent}
                </tbody>
            </table>
        </div>
    `;

    return container;
}

function showStudentModal(student = null, isViewMode = false) {
    const isEdit = !!student && !isViewMode;
    const s = student || {};
    const disabledAttr = isViewMode ? 'disabled class="bg-gray-50 text-gray-500 cursor-not-allowed w-full px-4 py-2 rounded-lg border border-gray-200 outline-none text-sm"' : 'class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"';

    // Get Classes for Dropdown
    const classes = state.db.kelas ? state.db.kelas.filter(k => k.sekolahId === state.user.sekolahId) : [];
    const classOptions = classes.map(c => `<option value="${c.id}" ${s.kelasId === c.id ? 'selected' : ''}>${c.nama}</option>`).join('');

    const formHTML = `
        <form class="space-y-6 pr-2">
            
            <!--Foto Profil-->
             <div class="flex items-center gap-4 border-b pb-4">
                <div class="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden group ${!isViewMode ? 'hover:border-indigo-500 cursor-pointer' : ''}">
                    <img id="previewFotoSiswa" src="${s.foto || ''}" class="${s.foto ? '' : 'hidden'} w-full h-full object-cover" />
                    <i data-lucide="camera" class="w-6 h-6 text-gray-400 ${s.foto ? 'hidden' : ''}"></i>
                    ${!isViewMode ? `<input type="file" id="fotoInputSiswa" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" onchange="window.previewImageSiswa(this)">` : ''}
                </div>
                <div>
                     <p class="text-sm font-bold text-gray-700">Foto Siswa</p>
                     <p class="text-xs text-gray-500">${isViewMode ? 'Foto tersimpan' : 'Klik lingkaran untuk unggah'}</p>
                </div>
            </div>

            <!--Tabs Navigation(Simple Implementation)-- >
        <div class="space-y-6">

            <!-- Identitas -->
            <div>
                <h4 class="text-sm uppercase tracking-widest font-bold text-indigo-500 border-b pb-2 mb-4"> identitas Pribadi</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Nama Lengkap</label>
                        <input type="text" name="nama" value="${s.nama || ''}" ${disabledAttr}>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">NIS</label>
                        <input type="text" name="nis" value="${s.nis || ''}" ${disabledAttr}>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">NISN</label>
                        <input type="text" name="nisn" value="${s.nisn || ''}" ${disabledAttr}>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">NIK</label>
                        <input type="text" name="nik" value="${s.nik || ''}" ${disabledAttr}>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Tempat Lahir</label>
                        <input type="text" name="tempatLahir" value="${s.tempatLahir || ''}" ${disabledAttr}>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Tanggal Lahir</label>
                        <input type="date" name="tanggalLahir" value="${s.tanggalLahir || ''}" ${disabledAttr}>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Jenis Kelamin</label>
                        <select name="gender" ${disabledAttr}>
                            <option value="L" ${s.gender === 'L' ? 'selected' : ''}>Laki-laki</option>
                            <option value="P" ${s.gender === 'P' ? 'selected' : ''}>Perempuan</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Agama</label>
                        <select name="agama" ${disabledAttr}>
                            <option value="Islam" ${s.agama === 'Islam' ? 'selected' : ''}>Islam</option>
                            <option value="Kristen" ${s.agama === 'Kristen' ? 'selected' : ''}>Kristen</option>
                            <option value="Katolik" ${s.agama === 'Katolik' ? 'selected' : ''}>Katolik</option>
                            <option value="Hindu" ${s.agama === 'Hindu' ? 'selected' : ''}>Hindu</option>
                            <option value="Buddha" ${s.agama === 'Buddha' ? 'selected' : ''}>Buddha</option>
                            <option value="Konghucu" ${s.agama === 'Konghucu' ? 'selected' : ''}>Konghucu</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Alamat -->
            <div>
                <h4 class="text-sm uppercase tracking-widest font-bold text-indigo-500 border-b pb-2 mb-4">Alamat Lengkap</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block text-xs font-bold text-gray-500 mb-1">Alamat Jalan</label>
                        <textarea name="alamat" rows="2" ${disabledAttr}>${s.alamat || ''}</textarea>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Provinsi</label>
                        <input type="text" name="provinsi" value="${s.provinsi || ''}" ${disabledAttr}>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Kabupaten/Kota</label>
                        <input type="text" name="kabupaten" value="${s.kabupaten || ''}" ${disabledAttr}>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Kecamatan</label>
                        <input type="text" name="kecamatan" value="${s.kecamatan || ''}" ${disabledAttr}>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Kode Pos</label>
                        <input type="text" name="kodePos" value="${s.kodePos || ''}" ${disabledAttr}>
                    </div>
                </div>
            </div>

            <!-- Data Akademik -->
            <div>
                <h4 class="text-sm uppercase tracking-widest font-bold text-indigo-500 border-b pb-2 mb-4">Data Akademik</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Kelas</label>
                        <select name="kelasId" onchange="window.handleClassChange(this)" ${disabledAttr}>
                            <option value="">Pilih Kelas</option>
                            ${classOptions}
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Tingkat</label>
                        <input type="text" name="tingkat" value="${s.tingkat || ''}" ${disabledAttr} placeholder="Contoh: 10">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Jurusan</label>
                        <input type="text" name="jurusan" value="${s.jurusan || ''}" ${disabledAttr}>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Wali Kelas (ID)</label>
                        <input type="text" name="waliKelasId" value="${s.waliKelasId || ''}" ${disabledAttr}>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Tahun Ajaran</label>
                        <input type="text" name="tahunAjaran" value="${s.tahunAjaran || '2024/2025'}" ${disabledAttr}>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Semester</label>
                        <select name="semester" ${disabledAttr}>
                            <option value="Ganjil" ${s.semester === 'Ganjil' ? 'selected' : ''}>Ganjil</option>
                            <option value="Genap" ${s.semester === 'Genap' ? 'selected' : ''}>Genap</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1">Status Siswa</label>
                        <select name="statusSiswa" ${disabledAttr}>
                            <option value="Aktif" ${s.statusSiswa === 'Aktif' ? 'selected' : ''}>Aktif</option>
                            <option value="Lulus" ${s.statusSiswa === 'Lulus' ? 'selected' : ''}>Lulus</option>
                            <option value="Pindah" ${s.statusSiswa === 'Pindah' ? 'selected' : ''}>Pindah</option>
                            <option value="Keluar" ${s.statusSiswa === 'Keluar' ? 'selected' : ''}>Keluar</option>
                        </select>
                    </div>
                </div>
            </div>

        </div>

             ${!isViewMode ? `
            <div class="pt-6 border-t mt-4">
                 <button type="button" onclick="window.saveStudentAction()" class="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 cursor-pointer">
                    ${isEdit ? 'Simpan Perubahan' : 'Tambah Siswa'}
                 </button>
            </div>
            ` : ''
        }

        </form>
        `;

    const title = isViewMode ? 'Detail Data Siswa (v2)' : (isEdit ? 'Edit Data Siswa (v2)' : 'Tambah Siswa Baru (v2)');

    // Set global current student for the save action
    window.currentStudent = s;

    // Call showModal with null callback
    showModal(title, formHTML, null);
}

function viewStudent(id) {
    const student = state.db.siswa.find(s => s.id === id);
    if (student) showStudentModal(student, true);
}

function editStudent(id) {
    const student = state.db.siswa.find(s => s.id === id);
    if (student) showStudentModal(student, false);
}

function deleteStudent(id) {
    if (confirm('Hapus data siswa ini?')) {
        saveDB({ ...state.db, siswa: state.db.siswa.filter(s => s.id !== id) });
        renderApp();
    }
}

window.previewImageSiswa = (input) => {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const preview = document.getElementById('previewFotoSiswa');
            const icon = input.parentElement.querySelector('i');
            preview.src = e.target.result;
            preview.classList.remove('hidden');
            icon.classList.add('hidden');
        }
        reader.readAsDataURL(input.files[0]);
    }
}



window.showStudentQR = (id) => {
    const student = state.db.siswa.find(s => s.id === id);
    if (!student) return;

    const qrContainerId = `qrcode-${id}`;
    const modalHTML = `
        <div class="flex flex-col items-center justify-center p-6 space-y-4">
            <div class="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                <div id="${qrContainerId}"></div>
            </div>
            <div class="text-center">
                <h3 class="text-lg font-bold text-gray-900">${student.nama}</h3>
                <p class="text-sm text-gray-500 font-mono">${student.nis || '-'}</p>
                <p class="text-xs text-indigo-500 mt-1 font-semibold tracking-wider uppercase">${student.kelasId ? (state.db.kelas.find(k => k.id === student.kelasId)?.nama || '-') : '-'}</p>
            </div>
        </div>
            <p class="text-xs text-gray-400 max-w-xs text-center">
                Gunakan QR Code ini untuk keperluan absensi dan identitas digital siswa.
            </p>
            <button onclick="window.downloadQR('${qrContainerId}', '${student.nama}')" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                <i data-lucide="download" class="w-4 h-4"></i>
                Download QR Code
            </button>
        </div>
    `;

    showModal('QR Code Siswa', modalHTML, null);

    // Generate QR Code after modal renders
    setTimeout(() => {
        const container = document.getElementById(qrContainerId);
        if (container) {
            container.innerHTML = ''; // Clear previous
            new QRCode(container, {
                text: student.id, // Or use NIS/NISN if preferred, but ID is unique
                width: 200,
                height: 200,
                colorDark: "#4f46e5", // Indigo-600
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        }
    }, 100);
};

window.downloadQR = (containerId, filename) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // QRCode.js usually renders a canvas or img
    const img = container.querySelector('img');
    const canvas = container.querySelector('canvas');
    let url = '';

    if (img) url = img.src;
    else if (canvas) url = canvas.toDataURL("image/png");

    if (url) {
        const link = document.createElement('a');
        link.download = `QR-${filename}-${Date.now()}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert('Gagal mengunduh QR Code. Silakan coba lagi.');
    }
};

window.toggleSidebar = () => {
    state.isSidebarOpen = !state.isSidebarOpen;
    renderApp();
};

// --- VIOLATIONS COMPONENT ---
function renderViolations() {
    const container = document.createElement('div');
    container.className = "space-y-6 fade-in";

    // Resolve data
    const violations = state.db.pelanggaran || [];

    // Helper to get student name
    const getStudentName = (id) => {
        const s = state.db.siswa.find(x => x.id === id);
        return s ? s.nama : 'Unknown';
    };

    // Calculate Default Month/Year (Current)
    if (!window.violationFilterMonth) window.violationFilterMonth = new Date().getMonth() + 1;
    if (!window.violationFilterYear) window.violationFilterYear = new Date().getFullYear();

    // Filter Logic
    let filteredViolations = violations;
    if (window.violationFilterMonth) {
        filteredViolations = filteredViolations.filter(v => new Date(v.tanggal).getMonth() + 1 === parseInt(window.violationFilterMonth));
    }
    if (window.violationFilterYear) {
        filteredViolations = filteredViolations.filter(v => new Date(v.tanggal).getFullYear() === parseInt(window.violationFilterYear));
    }

    // Generate Month Options
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const monthOptions = months.map((m, i) => `<option value="${i + 1}" ${window.violationFilterMonth == i + 1 ? 'selected' : ''}>${m}</option>`).join('');

    // Generate Year Options (Current Year - 5 to Current Year + 1)
    const currentYear = new Date().getFullYear();
    let yearOptions = '';
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
        yearOptions += `<option value="${i}" ${window.violationFilterYear == i ? 'selected' : ''}>${i}</option>`;
    }

    // Helper for category badge
    const getBadgeColor = (cat) => {
        if (cat === 'Ringan') return 'bg-yellow-100 text-yellow-800';
        if (cat === 'Sedang') return 'bg-orange-100 text-orange-800';
        return 'bg-red-100 text-red-800';
    };

    container.innerHTML = `
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-900">Catatan Pelanggaran</h2>
                <p class="text-gray-500 text-sm">Monitoring kedisiplinan dan tata tertib siswa</p>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-3">
                 <select onchange="window.violationFilterMonth = this.value; renderApp()" class="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                    <option value="">Semua Bulan</option>
                    ${monthOptions}
                </select>
                <select onchange="window.violationFilterYear = this.value; renderApp()" class="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                    <option value="">Semua Tahun</option>
                    ${yearOptions}
                </select>
                <button onclick="window.showViolationModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-200 transition-all flex items-center gap-2">
                    <i data-lucide="plus-circle" class="w-5 h-5"></i>
                    Catat Pelanggaran
                </button>
            </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-gray-50/50">
                        <tr>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Siswa</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Pelanggaran</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Kategori</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Poin</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        ${filteredViolations.length === 0 ? `
                            <tr><td colspan="6" class="px-6 py-8 text-center text-gray-400">Belum ada data pelanggaran</td></tr>
                        ` : filteredViolations.map(v => `
                            <tr class="hover:bg-gray-50/50 transition-colors">
                                <td class="px-6 py-4 font-medium text-gray-900 text-sm">${v.tanggal}</td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                            ${getStudentName(v.siswaId).charAt(0)}
                                        </div>
                                        <span class="text-sm font-medium text-gray-700">${getStudentName(v.siswaId)}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600">
                                    <p class="font-medium text-gray-900">${v.jenis}</p>
                                    <p class="text-xs text-gray-400">${v.keterangan}</p>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(v.kategori)}">
                                        ${v.kategori}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold text-sm border border-gray-200">
                                        -${v.poin}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-right relative">
                                    <button onclick="window.toggleActionMenu('${v.id}', event)" class="action-menu-btn text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-gray-100">
                                        <i data-lucide="more-vertical" class="w-5 h-5"></i>
                                    </button>
                                    <div id="menu-${v.id}" class="action-menu hidden absolute right-10 top-0 w-32 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                                        <div class="py-1">
                                            <button onclick="window.editViolation('${v.id}')" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                                <i data-lucide="edit-3" class="w-4 h-4 text-gray-400"></i> Edit
                                            </button>
                                            <button onclick="window.deleteViolation('${v.id}')" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-50">
                                                <i data-lucide="trash-2" class="w-4 h-4 text-red-400"></i> Hapus
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <p class="text-xs text-gray-500">Menampilkan ${filteredViolations.length} data pelanggaran</p>
            </div>
        </div>
    `;
    setTimeout(initIcons, 0);
    return container;
}

// --- ACHIEVEMENTS COMPONENT ---
function renderAchievements() {
    const container = document.createElement('div');
    container.className = "space-y-6 fade-in";

    // Resolve data
    const achievements = state.db.prestasi || [];

    // Helper to get student name
    const getStudentName = (id) => {
        const s = state.db.siswa.find(x => x.id === id);
        return s ? s.nama : 'Unknown';
    };

    // Calculate Default Month/Year (Current)
    if (!window.achievementFilterMonth) window.achievementFilterMonth = new Date().getMonth() + 1;
    if (!window.achievementFilterYear) window.achievementFilterYear = new Date().getFullYear();

    // Filter Logic
    let filteredAchievements = achievements;
    if (window.achievementFilterMonth) {
        filteredAchievements = filteredAchievements.filter(a => new Date(a.tanggal).getMonth() + 1 === parseInt(window.achievementFilterMonth));
    }
    if (window.achievementFilterYear) {
        filteredAchievements = filteredAchievements.filter(a => new Date(a.tanggal).getFullYear() === parseInt(window.achievementFilterYear));
    }

    // Generate Month Options
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const monthOptions = months.map((m, i) => `<option value="${i + 1}" ${window.achievementFilterMonth == i + 1 ? 'selected' : ''}>${m}</option>`).join('');

    // Generate Year Options
    const currentYear = new Date().getFullYear();
    let yearOptions = '';
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
        yearOptions += `<option value="${i}" ${window.achievementFilterYear == i ? 'selected' : ''}>${i}</option>`;
    }

    container.innerHTML = `
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-900">Catatan Prestasi</h2>
                <p class="text-gray-500 text-sm">Rekam jejak pencapaian dan keunggulan siswa</p>
            </div>
             <div class="flex flex-col sm:flex-row gap-3">
                 <select onchange="window.achievementFilterMonth = this.value; renderApp()" class="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                    <option value="">Semua Bulan</option>
                    ${monthOptions}
                </select>
                <select onchange="window.achievementFilterYear = this.value; renderApp()" class="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                    <option value="">Semua Tahun</option>
                    ${yearOptions}
                </select>
                <button onclick="window.showAchievementModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-200 transition-all flex items-center gap-2">
                    <i data-lucide="plus-circle" class="w-5 h-5"></i>
                    Catat Prestasi
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            ${filteredAchievements.length === 0 ? `
                <div class="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <i data-lucide="award" class="w-12 h-12 mx-auto mb-3 opacity-20"></i>
                    <p>Belum ada data prestasi</p>
                </div>
            ` : filteredAchievements.map(p => `
                 <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group relative">
                    <!-- Action Menu -->
                    <div class="absolute top-4 right-4 z-20">
                        <button onclick="window.toggleActionMenu('${p.id}', event)" class="bg-white/80 backdrop-blur-sm action-menu-btn text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-white shadow-sm border border-transparent hover:border-gray-100">
                            <i data-lucide="more-vertical" class="w-5 h-5"></i>
                        </button>
                         <div id="menu-${p.id}" class="action-menu hidden absolute right-0 top-8 w-32 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                            <div class="py-1">
                                <button onclick="window.editAchievement('${p.id}')" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                                    <i data-lucide="edit-3" class="w-4 h-4 text-gray-400"></i> Edit
                                </button>
                                <button onclick="window.deleteAchievement('${p.id}')" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-50">
                                    <i data-lucide="trash-2" class="w-4 h-4 text-red-400"></i> Hapus
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-start justify-between mb-4 pr-8">
                        <span class="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-indigo-100">
                            ${p.kategori}
                        </span>
                        <span class="text-xs text-gray-400 font-medium">${p.tanggal}</span>
                    </div>
                    
                    <h3 class="text-lg font-bold text-gray-900 mb-1 leading-tight line-clamp-2">${p.judul}</h3>
                    <p class="text-sm text-indigo-500 font-medium mb-4">${p.tingkat}</p>
                    
                    <div class="flex items-center gap-3 pt-4 border-t border-dashed border-gray-100">
                         <div class="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-xs ring-2 ring-white">
                            ${getStudentName(p.siswaId).charAt(0)}
                        </div>
                        <div>
                            <p class="text-xs font-bold text-gray-900">${getStudentName(p.siswaId)}</p>
                            <p class="text-[10px] text-gray-500 line-clamp-1">${p.keterangan}</p>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    setTimeout(initIcons, 0);
    return container;
}

// --- HELPER FOR ACTION MENUS ---
window.toggleActionMenu = (id, event) => {
    if (event) event.stopPropagation();
    // Close other menus
    document.querySelectorAll('.action-menu').forEach(el => {
        if (el.id !== `menu-${id}`) el.classList.add('hidden');
    });
    const menu = document.getElementById(`menu-${id}`);
    if (menu) menu.classList.toggle('hidden');
};

// Close menus when clicking outside
window.onclick = (event) => {
    if (!event.target.closest('.action-menu-btn')) {
        document.querySelectorAll('.action-menu').forEach(el => el.classList.add('hidden'));
    }
};

window.editViolation = (id) => {
    const v = state.db.pelanggaran.find(x => x.id === id);
    if (v) showViolationModal(v);
};

window.deleteViolation = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus data pelanggaran ini?')) {
        const newViolations = state.db.pelanggaran.filter(x => x.id !== id);
        saveDB({ ...state.db, pelanggaran: newViolations });
        renderApp();
    }
};

// --- MODAL & SAVE LOGIC FOR VIOLATIONS ---
window.saveViolationAction = () => {
    const form = document.getElementById('violationForm');
    if (!form) return;
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const v = window.currentViolation || {};
    const newData = {
        id: v.id || Math.random().toString(36).substr(2, 9),
        siswaId: document.getElementById('v_siswaId').value,
        tanggal: document.getElementById('v_tanggal').value,
        jenis: document.getElementById('v_jenis').value,
        kategori: document.getElementById('v_kategori').value,
        poin: parseInt(document.getElementById('v_poin').value),
        keterangan: document.getElementById('v_keterangan').value,
        guruId: state.user.id
    };

    let newViolations = state.db.pelanggaran || [];
    if (v.id) newViolations = newViolations.map(x => x.id === newData.id ? newData : x);
    else newViolations.push(newData);

    saveDB({ ...state.db, pelanggaran: newViolations });
    if (typeof closeModal === 'function') closeModal();
    else document.getElementById('modalOverlay')?.classList.add('hidden');
    renderApp();
    alert('Data pelanggaran berhasil disimpan');
};

window.showViolationModal = (data = null) => {
    window.currentViolation = data || {};
    const isEdit = !!data;
    const v = data || {};
    const students = state.db.siswa.filter(s => s.sekolahId === state.user.sekolahId);

    // Sort students alphabetically
    students.sort((a, b) => a.nama.localeCompare(b.nama));

    const studentOptions = students.map(s => `<option value="${s.id}" ${v.siswaId === s.id ? 'selected' : ''}>${s.nama} - ${s.kelasId ? state.db.kelas.find(k => k.id === s.kelasId)?.nama : ''}</option>`).join('');

    const formHTML = `
        <form id="violationForm" class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">Nama Siswa</label>
                <select id="v_siswaId" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" required>
                    <option value="">-- Pilih Siswa --</option>
                    ${studentOptions}
                </select>
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">Tanggal Kejadian</label>
                <input type="date" id="v_tanggal" value="${v.tanggal || new Date().toISOString().split('T')[0]}" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" required>
            </div>
             <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">Jenis Pelanggaran</label>
                <input type="text" id="v_jenis" value="${v.jenis || ''}" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="Contoh: Terlambat, Merokok" required>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                     <label class="block text-xs font-bold text-gray-500 mb-1">Kategori</label>
                     <select id="v_kategori" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                        <option value="Ringan" ${v.kategori === 'Ringan' ? 'selected' : ''}>Ringan</option>
                        <option value="Sedang" ${v.kategori === 'Sedang' ? 'selected' : ''}>Sedang</option>
                        <option value="Berat" ${v.kategori === 'Berat' ? 'selected' : ''}>Berat</option>
                     </select>
                </div>
                 <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1">Poin Pelanggaran</label>
                    <input type="number" id="v_poin" value="${v.poin || 5}" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" min="1" required>
                </div>
            </div>
            <div>
                 <label class="block text-xs font-bold text-gray-500 mb-1">Keterangan / Tindak Lanjut</label>
                 <textarea id="v_keterangan" rows="3" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="Detail kejadian atau tindakan yang diambil">${v.keterangan || ''}</textarea>
            </div>
            <div class="pt-4">
                 <button type="button" onclick="window.saveViolationAction()" class="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 cursor-pointer">
                    ${isEdit ? 'Simpan Perubahan' : 'Simpan Data'}
                 </button>
            </div>
        </form>
    `;

    showModal(isEdit ? 'Edit Pelanggaran' : 'Catat Pelanggaran Baru', formHTML, null);
    // Submit handling is now via onclick -> saveViolationAction
}

// --- MODAL & SAVE LOGIC FOR ACHIEVEMENTS ---
window.saveAchievementAction = () => {
    const form = document.getElementById('achievementForm');
    if (!form) return;
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const v = window.currentAchievement || {};
    const newData = {
        id: v.id || Math.random().toString(36).substr(2, 9),
        siswaId: document.getElementById('a_siswaId').value,
        tanggal: document.getElementById('a_tanggal').value,
        judul: document.getElementById('a_judul').value,
        tingkat: document.getElementById('a_tingkat').value,
        kategori: document.getElementById('a_kategori').value,
        keterangan: document.getElementById('a_keterangan').value,
        guruId: state.user.id
    };

    let newAchievements = state.db.prestasi || [];
    if (v.id) newAchievements = newAchievements.map(x => x.id === newData.id ? newData : x);
    else newAchievements.push(newData);

    saveDB({ ...state.db, prestasi: newAchievements });
    if (typeof closeModal === 'function') closeModal();
    else document.getElementById('modalOverlay')?.classList.add('hidden');
    renderApp();
    alert('Data prestasi berhasil disimpan');
};

window.showAchievementModal = (data = null) => {
    window.currentAchievement = data || {};
    const isEdit = !!data;
    const v = data || {};

    // Sort students alphabetically
    const students = state.db.siswa.filter(s => s.sekolahId === state.user.sekolahId);
    students.sort((a, b) => a.nama.localeCompare(b.nama));
    const studentOptions = students.map(s => `<option value="${s.id}" ${v.siswaId === s.id ? 'selected' : ''}>${s.nama} - ${s.kelasId ? state.db.kelas.find(k => k.id === s.kelasId)?.nama : ''}</option>`).join('');

    const formHTML = `
        <form id="achievementForm" class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">Nama Siswa</label>
                <select id="a_siswaId" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" required>
                    <option value="">-- Pilih Siswa --</option>
                    ${studentOptions}
                </select>
            </div>
             <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">Judul Prestasi</label>
                <input type="text" id="a_judul" value="${v.judul || ''}" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="Contoh: Juara 1 Lomba Renang" required>
            </div>
            <div class="grid grid-cols-2 gap-4">
                 <div>
                    <label class="block text-xs font-bold text-gray-500 mb-1">Tanggal</label>
                    <input type="date" id="a_tanggal" value="${v.tanggal || new Date().toISOString().split('T')[0]}" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" required>
                </div>
                 <div>
                     <label class="block text-xs font-bold text-gray-500 mb-1">Tingkat</label>
                     <select id="a_tingkat" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                        <option value="Sekolah" ${v.tingkat === 'Sekolah' ? 'selected' : ''}>Sekolah</option>
                        <option value="Kecamatan" ${v.tingkat === 'Kecamatan' ? 'selected' : ''}>Kecamatan</option>
                        <option value="Kabupaten/Kota" ${v.tingkat === 'Kabupaten/Kota' ? 'selected' : ''}>Kabupaten/Kota</option>
                        <option value="Provinsi" ${v.tingkat === 'Provinsi' ? 'selected' : ''}>Provinsi</option>
                         <option value="Nasional" ${v.tingkat === 'Nasional' ? 'selected' : ''}>Nasional</option>
                         <option value="Internasional" ${v.tingkat === 'Internasional' ? 'selected' : ''}>Internasional</option>
                     </select>
                </div>
            </div>
             <div>
                 <label class="block text-xs font-bold text-gray-500 mb-1">Kategori</label>
                 <select id="a_kategori" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                    <option value="Akademik" ${v.kategori === 'Akademik' ? 'selected' : ''}>Akademik</option>
                    <option value="Non-Akademik" ${v.kategori === 'Non-Akademik' ? 'selected' : ''}>Non-Akademik</option>
                 </select>
            </div>
            <div>
                 <label class="block text-xs font-bold text-gray-500 mb-1">Keterangan Lain</label>
                 <textarea id="a_keterangan" rows="2" class="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="Catatan tambahan...">${v.keterangan || ''}</textarea>
            </div>
            <div class="pt-4">
                 <button type="button" onclick="window.saveAchievementAction()" class="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 cursor-pointer">
                    ${isEdit ? 'Simpan Perubahan' : 'Simpan Data'}
                 </button>
            </div>
        </form>
    `;

    showModal(isEdit ? 'Edit Prestasi' : 'Catat Prestasi Baru', formHTML, null);
    // Submit handling is now via onclick -> saveAchievementAction
}

window.editAchievement = (id) => {
    const v = state.db.prestasi.find(x => x.id === id);
    if (v) showAchievementModal(v);
};

window.deleteAchievement = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus data prestasi ini?')) {
        const newAchievements = state.db.prestasi.filter(x => x.id !== id);
        saveDB({ ...state.db, prestasi: newAchievements });
        renderApp();
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', initApp);

/* ========================================================
   SUPABASE DATABASE CONFIGURATION (ANVG)
   ======================================================== */
const SUPABASE_URL = 'https://syculxnokrkluyzuempj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_uSljNgeCYIweqTOPbfvk4Q_vnDyc9fC';

let db = null;
if (typeof supabase !== 'undefined') {
    db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/* ========================================================
   GLOBAL AIRLINE COLOR THEME ENGINE (ANVG)
   ======================================================== */

// 1. Immediately apply the saved airline theme across all pages
(function() {
    const savedTheme = localStorage.getItem('anvg_theme') || 'ana';
    applyThemeClass(savedTheme);
})();

function applyThemeClass(theme) {
    if (!document.body) return;
    document.body.classList.remove('theme-peach', 'theme-nca', 'theme-airjapan');
    if (theme && theme !== 'ana') {
        document.body.classList.add(`theme-${theme}`);
    }
}

// 2. Called when selecting an airline button in settings.html
function setTheme(themeName) {
    localStorage.setItem('anvg_theme', themeName);
    applyThemeClass(themeName);
    
    // Voice confirmation if enabled
    if (localStorage.getItem('anvg_voice_briefing') === 'true') {
        const names = {
            'ana': 'All Nippon Airways blue theme active',
            'peach': 'Peach Aviation pink theme active',
            'nca': 'Nippon Cargo Airlines theme active',
            'airjapan': 'AirJapan sunrise teal theme active'
        };
        speakAudioMessage(names[themeName] || 'Theme updated');
    }
}

// ================= HAMBURGER MENU LOGIC =================
const menuOverlay = document.getElementById('menuOverlay');
const sideMenu = document.getElementById('sideMenu');

function openMenu() {
    if (!menuOverlay || !sideMenu) return;
    menuOverlay.classList.remove('hidden');
    setTimeout(() => {
        menuOverlay.classList.remove('opacity-0');
        sideMenu.classList.remove('translate-x-full');
    }, 10);
    document.body.style.overflow = 'hidden'; 
}

function closeMenu() {
    if (!menuOverlay || !sideMenu) return;
    menuOverlay.classList.add('opacity-0');
    sideMenu.classList.add('translate-x-full');
    setTimeout(() => {
        menuOverlay.classList.add('hidden');
    }, 300);
    document.body.style.overflow = ''; 
}

// Submenu accordion logic
function toggleSubmenu(id) {
    const submenu = document.getElementById(id);
    const arrow = document.getElementById(id + '-arrow');
    if (!submenu || !arrow) return;
    
    if (submenu.classList.contains('hidden')) {
        submenu.classList.remove('hidden');
        submenu.classList.add('flex');
        arrow.classList.add('rotate-180');
    } else {
        submenu.classList.add('hidden');
        submenu.classList.remove('flex');
        arrow.classList.remove('rotate-180');
    }
}

// ================= PHOTO GALLERY / CAROUSEL LOGIC =================
const slides = document.querySelectorAll('.carousel-slide');
let currentSlide = 0;

function showSlide(index) {
    if (!slides || slides.length === 0) return;
    slides.forEach((slide, i) => {
        slide.classList.remove('opacity-100');
        slide.classList.add('opacity-0');
        if (i === index) {
            slide.classList.remove('opacity-0');
            slide.classList.add('opacity-100');
        }
    });
}

function nextSlide() {
    if (!slides || slides.length === 0) return;
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    if (!slides || slides.length === 0) return;
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

if (slides && slides.length > 0) {
    setInterval(nextSlide, 5000);
}

// ================= PWA SETUP =================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(registration => {
            console.log('PWA ServiceWorker registered successfully!');
        }).catch(err => {
            console.log('PWA ServiceWorker registration failed: ', err);
        });
    });
}
/* ========================================================
   GLOBAL VOICE CABIN BRIEFING SYSTEM (ANVG)
   ======================================================== */

function speakAudioMessage(messageText) {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(messageText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    setTimeout(() => {
        window.speechSynthesis.speak(utterance);
    }, 450);
}

/* ========================================================
   LIVE DATABASE PUBLIC STATS LOADER (ANVG)
   ======================================================== */
async function loadPublicStats() {
    if (!db) return;
    try {
        const { data, error } = await db.from('statistics').select('*').eq('id', 1).single();
        if (error || !data) return;

        const elHours = document.getElementById('displayHours');
        const elPireps = document.getElementById('displayPireps');
        const elHubs = document.getElementById('displayHubs');
        const elAircraft = document.getElementById('displayAircraft');
        const elDest = document.getElementById('displayDestinations');

        if (elHours && data.total_hours) elHours.innerText = data.total_hours;
        if (elPireps && data.total_pireps) elPireps.innerText = data.total_pireps;
        if (elHubs && data.hubs) elHubs.innerText = data.hubs;
        if (elAircraft && data.aircraft_family) elAircraft.innerText = data.aircraft_family;
        if (elDest && data.destinations) elDest.innerText = data.destinations;
    } catch (err) {
        console.warn('Public stats sync skipped:', err);
    }
}

/* ========================================================
   PAGE INITIALIZATION & SECRET ADMIN SHORTCUT
   ======================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Re-verify theme
    const savedTheme = localStorage.getItem('anvg_theme') || 'ana';
    applyThemeClass(savedTheme);

    // 2. Play audio greeting if enabled
    const isVoiceEnabled = localStorage.getItem('anvg_voice_briefing') === 'true';
    if (isVoiceEnabled) {
        const currentPath = window.location.pathname;
        const pageName = currentPath.split("/").pop() || "index.html";

        const pageBriefings = {
            "index.html": "Welcome aboard All Nippon Virtual Group. Flight deck systems online.",
            "events.html": "Events and flight schedules sector. View upcoming group flights.",
            "routes.html": "Operational route center. Explore global departures and arrivals.",
            "ranks.html": "Pilot ranking deck. Progression criteria and operational tiers.",
            "training.html": "Flight training division. Review stage 1 theory and checkride syllabi.",
            "roster.html": "Active pilot directory and flight hours leaderboard.",
            "fleet.html": "Fleet catalog. All Nippon passenger, regional, and freighter airframes.",
            "codeshare.html": "Codeshare alliances and partner network.",
            "changelog.html": "System changelog and flight dispatch utilities.",
            "apply.html": "Recruitment desk. Verify flight requirements and apply.",
            "about.html": "About All Nippon Virtual Group. Our mission and background.",
            "staff.html": "Executive staff and flight administration team.",
            "settings.html": "Flight deck settings panel."
        };

        if (pageBriefings[pageName]) {
            speakAudioMessage(pageBriefings[pageName]);
        }
    }

    // 3. Sync live database counters to homepage
    loadPublicStats();

        // 4. Secret Admin Trigger: Triple-tap the header logo
    let tapCount = 0;
    let tapTimer = null;

    // Target the logo image or its container link
    const logoTarget = document.querySelector('header a img') || document.querySelector('header img');

    if (logoTarget) {
        // Handle direct mobile screen taps
        logoTarget.addEventListener('touchstart', (e) => {
            tapCount++;
            clearTimeout(tapTimer);

            if (tapCount === 3) {
                e.preventDefault();
                e.stopPropagation();
                tapCount = 0;
                window.location.href = 'admin.html';
                return;
            }

            tapTimer = setTimeout(() => {
                tapCount = 0;
            }, 1000);
        }, { passive: false });

        // Fallback for desktop mouse clicks
        logoTarget.addEventListener('click', (e) => {
            tapCount++;
            clearTimeout(tapTimer);

            if (tapCount >= 3) {
                e.preventDefault();
                e.stopPropagation();
                tapCount = 0;
                window.location.href = 'admin.html';
                return;
            }

            // Prevent default single-click reload if tapping quickly
            if (tapCount > 1) {
                e.preventDefault();
            }

            tapTimer = setTimeout(() => {
                tapCount = 0;
            }, 1000);
        });
    }
  
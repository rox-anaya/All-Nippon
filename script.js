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

// Only run interval if the carousel exists on the current page
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

// Automatically announce current sector on load if enabled
document.addEventListener('DOMContentLoaded', () => {
    // Re-verify theme in case body rendered after initial IIFE
    const savedTheme = localStorage.getItem('anvg_theme') || 'ana';
    applyThemeClass(savedTheme);

    const isVoiceEnabled = localStorage.getItem('anvg_voice_briefing') === 'true';
    if (!isVoiceEnabled) return;

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
});
// Secret Admin Shortcut: Triple-click the logo to open admin panel
let logoClickCount = 0;
let logoTimer = null;

const navLogo = document.querySelector('header img'); // Finds your ANVG header logo
if (navLogo) {
    navLogo.addEventListener('click', (e) => {
        logoClickCount++;
        clearTimeout(logoTimer);

        if (logoClickCount === 3) {
            e.preventDefault(); // Stops normal home page refresh
            window.location.href = 'admin.html';
            logoClickCount = 0;
        }

        // Resets count if you take longer than 800ms
        logoTimer = setTimeout(() => {
            logoClickCount = 0;
        }, 800);
    });
}

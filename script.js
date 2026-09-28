// ================= HAMBURGER MENU LOGIC =================
const menuOverlay = document.getElementById('menuOverlay');
const sideMenu = document.getElementById('sideMenu');

function openMenu() {
    menuOverlay.classList.remove('hidden');
    setTimeout(() => {
        menuOverlay.classList.remove('opacity-0');
        sideMenu.classList.remove('translate-x-full');
    }, 10);
    // Stops the background from scrolling when menu is open
    document.body.style.overflow = 'hidden'; 
}

function closeMenu() {
    menuOverlay.classList.add('opacity-0');
    sideMenu.classList.add('translate-x-full');
    setTimeout(() => {
        menuOverlay.classList.add('hidden');
    }, 300);
    // Allows background scrolling again
    document.body.style.overflow = ''; 
}

// Submenu accordion logic (for About Us, Operations, etc.)
function toggleSubmenu(id) {
    const submenu = document.getElementById(id);
    const arrow = document.getElementById(id + '-arrow');
    
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

// ================= PHOTO GALLERY LOGIC =================
const slides = document.querySelectorAll('.carousel-slide');
let currentSlide = 0;

function showSlide(index) {
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
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

// Auto-change photos every 5 seconds
setInterval(nextSlide, 5000);


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
    
    // Stop any existing voice announcement
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(messageText);
    utterance.rate = 0.95; // Calm, professional flight deck pace
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    // Small delay to allow the DOM to render comfortably
    setTimeout(() => {
        window.speechSynthesis.speak(utterance);
    }, 450);
}

// Automatically announce the current page on load if enabled
document.addEventListener('DOMContentLoaded', () => {
    const isVoiceEnabled = localStorage.getItem('anvg_voice_briefing') === 'true';
    if (!isVoiceEnabled) return;

    // Detect the current file name
    const currentPath = window.location.pathname;
    const pageName = currentPath.split("/").pop() || "index.html";

    // Sector briefings mapped by file name
    const pageBriefings = {
        "index.html": "Welcome aboard All Nippon Virtual Group. Flight deck systems online.",
        "events.html": "Events and flight schedules sector. View upcoming group flights.",
        "routes.html": "Operational route center. Explore global departures and arrivals.",
        "ranks.html": "Pilot ranking deck. Progression criteria and operational tiers.",
        "training.html": "Flight training division. Review stage 1 theory and checkride syllabi.",
        "roster.html": "Active pilot directory and flight hours leaderboard.",
        "fleet.html": "Fleet catalog. All Nippon passenger, regional, and freighter airframes.",
        "codeshare.html": "Codeshare alliances and Star Alliance partner network.",
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

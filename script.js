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

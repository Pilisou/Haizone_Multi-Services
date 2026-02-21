const btnTout = document.getElementById('btn-tout');
const btnClose = document.getElementById('btn-close');
const sidebar = document.getElementById('sidebar');

btnTout.onclick = () => sidebar.classList.add('active');
btnClose.onclick = () => sidebar.classList.remove('active');

// Fèmen sidebar si moun nan klike deyò
window.onclick = (e) => {
    if (e.target == sidebar) sidebar.classList.remove('active');
}

let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function nextSlide() {
    // Retire klas active nan slide aktyèl la
    slides[currentSlide].classList.remove('active');
    
    // Kalkile pwochen slide la
    currentSlide = (currentSlide + 1) % slides.length;
    
    // Ajoute klas active nan pwochen slide la
    slides[currentSlide].classList.add('active');
}

// Chanje pwodwi chak 5 segonn
setInterval(nextSlide, 5000);
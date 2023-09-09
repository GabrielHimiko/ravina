function setViewportHeight() {
    const windowHeight = window.innerHeight;
    document.querySelector('main').style.setProperty('--vh', `${windowHeight}px`);
    localStorage.setItem('storedVH', `${windowHeight}px`);
};

if (localStorage.getItem('storedVH')) {
    const storedVH = localStorage.getItem('storedVH');
    document.querySelector('main').style.setProperty('--vh', storedVH);
} else {
    window.addEventListener('DOMContentLoaded', setViewportHeight);
};

window.addEventListener('resize', setViewportHeight);
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelector('#loader').style.display = 'none';
        document.querySelector('#check').style.display = 'flex';
        setTimeout(() => {
            document.querySelector('#check').classList.remove('bx-tada');
            window.location.href = '/store.html';
        }, 1500);
    }, 6000);
});
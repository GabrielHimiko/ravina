setTimeout(function() {
    document.querySelector('#loading').style.opacity = 0;
    setTimeout(function() {
        document.querySelector('#loading').style.display = 'none';
        document.querySelector('#isLoaded').style.display = 'flex';
        setTimeout(function() {
            document.querySelector('#isLoaded').style.opacity = 1;
        }, 100);
    }, 1000);
}, 3000);

document.querySelector('main').addEventListener('dblclick', () => {
    document.querySelector('button#edit').style.display = '';
    setTimeout(function() {
        document.querySelector('button#edit').style.opacity = '1';
        setTimeout(function() {
            document.querySelector('button#edit').style.opacity = '0';
            setTimeout(function() {
                document.querySelector('button#edit').style.display = 'none';
            }, 500);
        }, 5000);
    }, 100);
})
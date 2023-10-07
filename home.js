const categoryBtns = document.querySelectorAll('#categorias button');
const loading = document.querySelector('#loading');
const prod_results = document.querySelector('#prod_results');

categoryBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        if(btn.classList.contains('selected')) return;
        
        btn.parentNode.scrollLeft = 0;
        categoryBtns.forEach((e) => {e.style.display = ''});
        categoryBtns.forEach((e) => {
            if(e.classList.contains('selected')) {
                e.innerText = btn.innerText;
            }
        })
        btn.style.display = 'none';

        prod_results.style.display = 'none';
        prod_results.style.opacity = '0';
        loading.style.display = '';

        setTimeout(function() {
            loading.style.opacity = '0';
            prod_results.style.display = '';
            setTimeout(function() {
                prod_results.style.opacity = '1';
                loading.style.opacity = '1';
                loading.style.display = 'none';
            }, 1000);
        }, 1000);
    })
})
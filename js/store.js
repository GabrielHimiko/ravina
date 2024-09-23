//Declarando os elementos HTML
const topMenu = {
    cont: document.querySelector('#topMenu'),
    prim: document.querySelector('#topMenu_prim'),
    sec: document.querySelector('#topMenu_sec'),
}
const middle = document.querySelector('#middle');
const search = {
    cont: document.querySelector('#search'),
    icon: document.querySelector('#search_icon'),
    inp: document.querySelector('#search_inp'),
    go: document.querySelector('#search_go'),
};
const cart = document.querySelector('#cart');
//-----------------------------

search.inp.addEventListener('focus', () => {
    search.go.style.display = 'flex';
    search.icon.style.display = 'none';
    search.inp.style.borderWidth = '1px 0 1px 1px';
    search.inp.style.borderRadius = '10px 0 0 10px';
    search.inp.style.paddingInline = '10px';
    search.inp.style.borderColor = 'rgb(100, 100, 255)';
    cart.style.display = 'none';
});
search.inp.addEventListener('blur', () => {
    search.go.style = 'inherit';
    search.icon.style = 'inherit';
    search.inp.style = 'inherit';
    cart.style = 'inherit';
});

lastScrollTop = 0;
middle.addEventListener('scroll', () => {
    if (middle.scrollTop > 0) {
        topMenu.cont.classList.add('ending');
    } 
    else {
        topMenu.cont.classList.remove('ending');
    }

    if ((lastScrollTop > middle.scrollTop) && (middle.scrollTop <= topMenu.sec.offsetHeight/3)) {
        middle.scrollTo({top: 0, behavior: 'smooth'});
    }
    lastScrollTop = middle.scrollTop;

})
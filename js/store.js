//Declarando os elementos HTML
const topMenu = {
    cont: document.querySelector('#topMenu'),
    prim: document.querySelector('#topMenu_prim'),
    sec: document.querySelector('#topMenu_sec'),
}
const topMenu_size = topMenu.cont.offsetHeight;
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
    search.inp.style.borderRadius = '5px 0 0 5px';
    search.inp.style.paddingLeft = '5px';
    search.inp.style.borderColor = 'rgb(100, 100, 255)';
    cart.style.display = 'none';
});
search.inp.addEventListener('blur', () => {
    search.go.style = 'inherit';
    search.icon.style = 'inherit';
    search.inp.style = 'inherit';
    cart.style = 'inherit';
});

middle.addEventListener('scroll', () => {
    if (middle.scrollTop > 0) {
        topMenu.cont.classList.add('float');
        topMenu.sec.style.display = 'none';
        middle.style.paddingTop = topMenu_size + 'px';
    } 
    else if (middle.scrollTop <= topMenu_size) {
        topMenu.cont.classList.remove('float');
        topMenu.sec.style = 'inherit';
        middle.style = 'inherit';
    }
})
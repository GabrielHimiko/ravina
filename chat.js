const search_input = document.querySelector('#headerTop input');
const search_btn = document.querySelector('#headerTop .inputZone button');
search_input.addEventListener('keydown', (event) => {if(event.key === 'Enter') window.location.href = '/home.html?search=' + search_input.value});
search_btn.addEventListener('click', () => {window.location.href = '/home.html?search=' + search_input.value});

document.querySelector('#loading').style.display = 'none';

const url = new URL(window.location.href);
const urlPar = url.searchParams.get('id');

if(!urlPar) {
    document.querySelector('#not-found').style.display = '';
} else {
    document.querySelector('#result').style.display = '';
    document.querySelector('#loading').style.display = 'none';


}


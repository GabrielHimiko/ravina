const validation = document.querySelector('#validation');
const select_type = document.querySelector('#select_type');
const result = document.querySelector('#result');
const add_new = document.querySelector('button#add_new');
const creating = document.querySelector('#creating');

const firebaseConfig = {
    apiKey: "AIzaSyB9gKyaRTojAe8kGwtZEabOHT-_wHlW3_A",
    authDomain: "ravina-13c31.firebaseapp.com",
    databaseURL: "https://ravina-13c31-default-rtdb.firebaseio.com",
    projectId: "ravina-13c31",
    storageBucket: "ravina-13c31.appspot.com",
    messagingSenderId: "273452791178",
    appId: "1:273452791178:web:2b963d0c4b8994d16ec473",
    measurementId: "G-SNX95VXLVN"
};
firebase.initializeApp(firebaseConfig);

let arr_products, arr_sellers, actual_type;

firebase.database().ref('products').once('value').then((snapshot) => {
    snapshot.forEach((childSnapshot) => {
        arr_products.push(childSnapshot.val());
    });
});
firebase.database().ref('sellers').once('value').then((snapshot) => {
    snapshot.forEach((childSnapshot) => {
        arr_sellers.push(childSnapshot.val());
    });
});

document.querySelector('#validation_input').addEventListener('input', function() {
    if (this.value === 'ravina23') {
        validation.style.display = 'none';
        select_type.style.display = '';
        sessionStorage.setItem('havePass', true);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if(sessionStorage.getItem('havePass')) {
        validation.style.display = 'none';
        select_type.style.display = '';
    }
});

document.querySelector('#sellers_btn').addEventListener('click', function() {
    result.style.display = '';
    add_new.style.display = '';
    document.querySelectorAll('#select_type button').forEach((e) => {e.classList.remove('selected')});
    this.classList.add('selected');
    result.innerHTML = arr_sellers ? arr_products.join('<br>') : '';
    add_new.innerText = '+ Criar um novo vendedor';
    actual_type = 'seller';
});

document.querySelector('#products_btn').addEventListener('click', function() {
    result.style.display = '';
    add_new.style.display = '';
    document.querySelectorAll('#select_type button').forEach((e) => {e.classList.remove('selected')});
    this.classList.add('selected');
    result.innerHTML = arr_products ? arr_products.join('<br>') : '';
    add_new.innerText = '+ Criar um novo produto';
    actual_type = 'product';
});

add_new.addEventListener('click', () => {
    if (actual_type == 'product') {
        creating.style.display = '';
        creating.innerHTML = `
            <div class="add_new">
                <div>*Nome: <input id="prod_name"></div>
                <div>
                    *Filtro: 
                    <select id="prod_filter">
                        <option>Selecione</option>
                    </select>
                </div>
                <div>
                    *Subfiltro: 
                    <select id="prod_subfilter" disabled=true>
                        <option>Selecione</option>
                    </select>
                </div>
                <div>*Preço: <input id="prod_price" type="number"></div>
                <div>Preço anterior: <input id="prod_befprice" type="number"></div>
                <div>Link da imagem: <input id="prod_imglink"></div>
                <div>
                    *Vendedor: 
                    <select id="prod_sellerid">
                        <option>Selecione</option>
                    </select>
                </div>
                <div>
                    <button>Salvar</button><button>Cancelar</button>
                </div>
            </div>
        `;
    }
    else if (actual_type == 'seller') {

    };
})
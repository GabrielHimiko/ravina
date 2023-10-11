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

let arr_products, arr_sellers, actual_type, isCreating;

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
    if (isCreating) return;
    if (actual_type == 'product') {
        isCreating = true;
        creating.style.display = '';
        document.querySelector('#creating .add_new.product').style.display = '';
        document.querySelector('#creating .add_new.seller').style.display = 'none';
    }
    else if (actual_type == 'seller') {

    };
});

document.querySelector('#creating .add_new.product #prod_filter').addEventListener('change', function() {
    if(!this.value) return;
    const prodTypeSelected = this.value;
    const prod_subfilter_select = document.querySelector('#creating .add_new.product #prod_subfilter');
    if(obj_prod_filter[prodTypeSelected]) {
        prod_subfilter_select.disabled = false;
        
        if(obj_prod_filter[prodTypeSelected].options) {
            Array.from(prod_subfilter_select.children).forEach((c) => {prod_subfilter_select.removeChild(c)});
                const allOpt = new Option('Selecione');
                allOpt.value = 0;
                prod_subfilter_select.appendChild(allOpt);
            for(i = 0; i < obj_prod_filter[prodTypeSelected].options.length; i++) {
                const newOpt = new Option(obj_prod_filter[prodTypeSelected].options[i].title);
                newOpt.value = obj_prod_filter[prodTypeSelected].options[i].value;
                prod_subfilter_select.appendChild(newOpt);
            }
            prod_filter_select.style.display = '';
        }
    } else {
        prod_subfilter_select.disabled = true;
        Array.from(prod_subfilter_select.children).forEach((c) => {prod_subfilter_select.removeChild(c)});
        const allOpt = new Option('Não disponível');
        allOpt.value = 0;
        prod_subfilter_select.appendChild(allOpt);
    }
});

document.querySelector('#creating .add_new.product #prod_save').addEventListener('click', () => {
    const needs = [
        document.querySelector('#creating .add_new.product #prod_title'),
        document.querySelector('#creating .add_new.product #prod_filter'),
        document.querySelector('#creating .add_new.product #prod_price'),
        document.querySelector('#creating .add_new.product #prod_sellerid')
    ]
    needs.forEach((e) => {
        e.addEventListener('change', () => {
            if(e.value != '0' && e.value) {
                e.style.borderColor = 'lightgrey';
            }
        })
        if(!e.value || e.value == '0') {
            e.style.borderColor = 'orange';
        }
    })
})
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

let arr_products, arr_sellers;

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

const validation = document.querySelector('#validation');
const select_type = document.querySelector('#select_type');
const sellers = document.querySelector('#sellers');
const products = document.querySelector('#products');

document.querySelector('#validation_input').addEventListener('input', function() {
    if (this.value === 'ravina23') {
        validation.style.display = 'none';
        select_type.style.display = '';
        localStorage.setItem('havePass', true);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('havePass')) {
        validation.style.display = 'none';
        select_type.style.display = '';
    }
});

document.querySelector('#sellers_btn').addEventListener('click', function() {
    sellers.style.display = '';
    products.style.display = 'none';
    document.querySelectorAll('#select_type button').forEach((e) => {e.classList.remove('selected')});
    this.classList.add('selected');
    sellers.innerHTML = arr_sellers ? arr_sellers.join('<br>') : 'Nenhum vendedor cadastrado';
});

document.querySelector('#products_btn').addEventListener('click', function() {
    products.style.display = '';
    sellers.style.display = 'none';
    document.querySelectorAll('#select_type button').forEach((e) => {e.classList.remove('selected')});
    this.classList.add('selected');
    products.innerHTML = arr_products ? arr_products.join('<br>') : 'Nenhum produto cadastrado';
});
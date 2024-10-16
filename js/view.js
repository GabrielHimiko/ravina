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

//Obtendo o parâmetro do URL
const urlParams = new URLSearchParams(window.location.search);
const prodId = urlParams.get('id');

//Obtendo os dados
let sellers = [], prods = [], lines = [];
firebase.database().ref('sellers').orderByChild('name').once('value').then((snapshot) => {
    
    sellers = [], prods = [];
    snapshot.forEach((childSnapshot) => {
        const seller = childSnapshot.val();
        seller.key = childSnapshot.key;
        sellers.push(seller);
    });

    firebase.database().ref('products').orderByChild('title').once('value').then((snapshot) => {
            
        snapshot.forEach((childSnapshot) => {
            const prod = childSnapshot.val();
            prod.key = childSnapshot.key;
            
            sellers.forEach(seller => {
                if (seller.sellerid === prod.sellerid) {
                    prod.s_dist = seller.dist;
                    prod.s_rate = seller.rate;
                    prod.s_name = seller.name;
                    prod.s_nick = seller.nick;
                    prod.s_img = seller.imglink;
                }
            });

            prods.push(prod);
        });

        findProd();
    });

});

//Carregando o produto selecionado
function findProd() {

    let selProd;
    prods.forEach(prod => {
        if(prod.key === prodId) selProd = prod;
    });

    document.title = selProd.title + ' | Ravina Marketplace';
    document.querySelector('#prodImg').src = selProd.imglink;
    document.querySelector('#backImg').src = selProd.imglink;
    document.querySelector('#price').innerHTML = '<span style="font-size: 12pt">R$</span>' + (selProd.price*1).toFixed(2).replace(".", ",");

    if(selProd.rprice && selProd.rprice != '-x-') {
        document.querySelector('#rprice').hidden = false;
        document.querySelector('#desc').hidden = false;
        document.querySelector('#rprice').innerHTML = 'R$' + (selProd.rprice*1).toFixed(2).replace(".", ",");
        document.querySelector('#desc').innerHTML = "-" + ( ((selProd.rprice - selProd.price) / selProd.rprice) * 100 ).toFixed(0) + "%";
    }
    document.querySelector('#parc').innerHTML = 'Ou R$' + (selProd.price*1.15).toFixed(2).replace(".", ",") + ' no boleto';

    document.querySelector('#title').innerHTML = selProd.title;

    document.querySelector('#sellerName').innerHTML = selProd.s_name;
    document.querySelector('#sellerDist').innerHTML = selProd.s_dist.replace(".", ",");
    document.querySelector('#sellerImg').src = selProd.s_img;
    document.querySelector('#sellerRate').innerHTML = selProd.s_rate + "<i class='bx bxs-star'></i>";
};
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

let arr_sellers = [], arr_products = [];

const url = new URL(window.location.href);
const urlPar = url.searchParams.get('id');

firebase.database().ref('sellers').orderByChild('name').on('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const seller = childSnapshot.val();
        arr_sellers.push(seller);
    });

    firebase.database().ref('products').orderByChild('name').on('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const prod = childSnapshot.val();
            arr_products.push(prod);
        });

        let prod, seller;
        arr_products.forEach((p) => {
            if(urlPar === p.prodid) {
                prod = p;
                arr_sellers.forEach((s) => {
                    if(s.sellerid === p.sellerid) {
                        seller = s;
                    }
                });
            }
        });

        document.querySelector('#middle #loading').style.display = 'none';
        
        if(prod) {
            document.querySelector('#middle #result').style.display = '';
            document.querySelector('#middle #result').style.opacity = '0';

            setTimeout(function() {
                document.querySelector('#middle #result').style.opacity = '1';
            }, 100);
        } else {
            document.querySelector('#middle #not-found').style.display = '';
            document.querySelector('#middle #not-found').style.opacity = '0';

            setTimeout(function() {
                document.querySelector('#middle #not-found').style.opacity = '1';
            }, 100);

            setTimeout(function() {
                window.location.href = '/home.html';
            }, 5000);
        }

        let count = 0;
        arr_products.forEach((p) => {
            if(p.sellerid === seller.sellerid) {
                count++;
            }
        })
        seller.prodcount = count;
        seller.disttimewalk = (seller.dist/0.0833).toFixed(0);
        seller.disttimecar = (seller.dist/0.5).toFixed(0);

        document.querySelector('#middle .prod_title').innerHTML = prod.title;
        document.querySelector('#middle .prod_imglink').src = prod.imglink;
        document.querySelector('#middle .seller_disttimewalk').innerHTML = `${seller.disttimewalk}min andando`;
        document.querySelector('#middle .seller_disttimecar').innerHTML = `${seller.disttimecar}min de carro`;
        document.querySelector('#middle .seller_imglink').src = seller.imglink;
        document.querySelector('#middle .seller_imglink2').src = seller.imglink;
        document.querySelector('#middle .seller_name').innerHTML = seller.name;
        document.querySelector('#middle .seller_rate').innerHTML = seller.rate;
        document.querySelector('#middle .seller_dist').innerHTML = seller.dist;
        document.querySelector('#middle .seller_prodcount').innerHTML = seller.prodcount;
    });
});

document.querySelector('#return').addEventListener('click', () => {
    window.location.href = '/home.html';
});

document.querySelector('#middle #result #seller-info_image').addEventListener('click', () => {
    document.querySelector('#middle #result #seller-info').style.display = 'none';
    document.querySelector('#middle #result #seller-img').style.display = '';
    document.querySelector('#middle #result #seller-img').style.opacity = '0';

    setTimeout(function() {
        document.querySelector('#middle #result #seller-img').style.opacity = '1';
    }, 100);
});

document.querySelector('#middle #result #seller-img').addEventListener('click', () => {
    document.querySelector('#middle #result #seller-img').style.display = 'none';
    document.querySelector('#middle #result #seller-info').style.display = '';
    document.querySelector('#middle #result #seller-info').style.opacity = '0';

    setTimeout(function() {
        document.querySelector('#middle #result #seller-info').style.opacity = '1';
    }, 100);
});
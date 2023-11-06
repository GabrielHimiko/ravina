const baskDataString = localStorage.getItem("baskData");

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
let prod, seller;

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
        };

        let count = 0;
        arr_products.forEach((p) => {
            if(p.sellerid === seller.sellerid) {
                count++;
            }
        })
        seller.prodcount = count;
        seller.distNum = Number(seller.dist.replace(',', '.'));
        seller.distStr = seller.dist.replace('.', ',');
        seller.disttimewalk = (seller.distNum/0.0833).toFixed(0);
        seller.disttimecar = (seller.distNum/0.5).toFixed(0);
        switch(seller.rate) {
            case '1': seller.rateStars = '★☆☆☆☆'; break;
            case '2': seller.rateStars = '★★☆☆☆'; break;
            case '3': seller.rateStars = '★★★☆☆'; break;
            case '4': seller.rateStars = '★★★★☆'; break;
            case '5': seller.rateStars = '★★★★★'; break;
        };

        document.querySelector('#middle .prod_title').innerHTML = prod.title;
        document.querySelector('#middle .prod_imglink').src = prod.imglink;
        document.querySelector('#middle .seller_disttime').innerHTML = `${(seller.disttimewalk >= 60 ? `${(seller.disttimewalk/60).toFixed(1).replace('.', ',')}h` : `${seller.disttimewalk}min`) + ' andando'} ou ${seller.disttimecar}min de carro`;
        document.querySelector('#middle .seller_imglink').src = seller.imglink;
        document.querySelector('#middle .seller_imglink2').src = seller.imglink;
        document.querySelector('#middle .seller_name').innerHTML = seller.name;
        document.querySelector('#middle .seller_nick').innerHTML = seller.nick;
        document.querySelector('#middle .seller_rate').innerHTML = seller.rateStars;
        document.querySelector('#middle .seller_dist').innerHTML = seller.distStr;
        document.querySelector('#middle .seller_prodcount').innerHTML = seller.prodcount;

        if(prod.filter == 'serv') {
            document.querySelector('#buy-zone').style.display = 'none';
        }
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

let isOnBask = false;
document.querySelector('#to-basket').addEventListener('click', function() {
    if (isOnBask) {alert('Este produto já está na sua cesta!'); return};
    isOnBask = true;
    this.style.borderColor = 'lightgrey';
    this.style.opacity = 0.5;

    let new_baskData = [];
    if(baskDataString) {
        new_baskData = JSON.parse(baskDataString);
    }
    new_baskData.push(prod);
    const new_baskDataString = JSON.stringify(new_baskData);

    localStorage.setItem("baskData", new_baskDataString);

    console.log(new_baskData);

    alert(`1x ${prod.title} adicionado à cesta.`);
})
const loading = document.querySelector('#loading');
const prod_results = document.querySelector('#prod_results');
const search_input = document.querySelector('#headerTop input');
const search_btn = document.querySelector('#headerTop .inputZone button');
const select_orderBy = document.querySelector('#orderBy');

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
const url_search = url.searchParams.get('search');

loadSellers(url_search);

function loadSellers(searchk) {

    prod_results.innerHTML = '';
    prod_results.style.display = 'none';
    prod_results.style.opacity = '0';
    loading.style.display = '';

    firebase.database().ref('sellers').orderByChild('name').on('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const seller = childSnapshot.val();
            arr_sellers.push(seller);
        });
    
        firebase.database().ref('products').orderByChild('title').on('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const prod = childSnapshot.val();
                arr_products.push(prod);
            });
    
            prod_results.style.display = '';
            setTimeout(() => {prod_results.style.opacity = '1'}, 100);
            loading.style.display = 'none';

            arr_sellers.forEach(seller => {
                seller.prodcount = 0;
                seller.prodfilters = [];
                switch(seller.rate) {
                    case '1': seller.rateStars = '★☆☆☆☆'; break;
                    case '2': seller.rateStars = '★★☆☆☆'; break;
                    case '3': seller.rateStars = '★★★☆☆'; break;
                    case '4': seller.rateStars = '★★★★☆'; break;
                    case '5': seller.rateStars = '★★★★★'; break;
                };

                arr_products.forEach(p => {
                    obj_prod_filter.forEach(filter => {
                        if (filter === p.filter) p.filterName = filter.title;
                    })
                    if(p.sellerid === seller.sellerid) {
                        seller.prodcount++;
                        if(!seller.prodfilters.includes(p.filterName)) seller.prodfilters.push(p.filterName);
                    }
                })

                const cardItem = document.createElement('div');
                cardItem.classList.add('cardItem');
                cardItem.id = seller.sellerid;
                cardItem.innerHTML = `
                    <div class="cardItem">
                        <div class="left">
                            <img class="product" src="${seller.imglink}">
                        </div>
                        <div class="right">
                            <div style="padding-bottom: 5px; border-bottom: 1px solid lightgrey">
                                <span><b>${seller.name}</b></span><br>
                            </div>
                            <div style="font-size: 10pt; padding-top: 5px">
                                Conhecido(a) como <span style="color: rgb(60, 60, 255)">${seller.nick}</span><br>
                                <div style="display: flex">Produtos à venda:&nbsp;<span style="color: rgb(60, 60, 255)">${seller.prodcount}</span>&nbsp;<button id="see-this-seller" style="font-size: 9pt" onclick="window.location.href='/home.html?sellerid=${seller.sellerid}'">Ver</button></div>
                                Avaliação: <span style="color: rgb(230, 170, 0);">${seller.rateStars}</span>
                            </div>
                        </div>
                    </div>
                `;

                prod_results.appendChild(cardItem);
            });
        });
    });
}

const loading = document.querySelector('#loading');
const seller_results = document.querySelector('#seller_results');
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

let arr_sellers = [], arr_products = [], sel_order = 'rel';

const url = new URL(window.location.href);
const url_search = url.searchParams.get('search');

if(url_search) search_input.value = url_search;

loadSellers(url_search);

select_orderBy.addEventListener('change', function() {
    sel_order = this.value;
    loadSellers();
})

function searchStr(texto) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
}

search_btn.addEventListener('click', () => {loadSellers(search_input.value)});
search_input.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        loadSellers(search_input.value);
    }
});

function loadSellers(searchk) {

    seller_results.innerHTML = '';
    seller_results.style.display = 'none';
    seller_results.style.opacity = '0';
    loading.style.display = '';
    let totalRes = 0;
    arr_sellers = [];
    arr_products = [];

    firebase.database().ref('sellers').orderByChild('name').on('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const seller = childSnapshot.val();

            if(searchk) {
                if(searchStr(seller.name).includes(searchStr(searchk)) || searchStr(seller.nick).includes(searchStr(searchk))) arr_sellers.push(seller);
            }
            else arr_sellers.push(seller);
        });
    
        firebase.database().ref('products').orderByChild('title').on('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const prod = childSnapshot.val();
                arr_products.push(prod);
            });
    
            seller_results.style.display = '';
            setTimeout(() => {seller_results.style.opacity = '1'}, 100);
            loading.style.display = 'none';

            if(!arr_sellers.length && searchk) {
                    let findedP = [];
                    arr_products.forEach(p => {
                        if(searchStr(p.title).includes(searchStr(searchk))) findedP.push(p);
                    });

                    if(findedP.length > 1) window.location.href = '/home.html?search=' + searchk;
                    else if(findedP.length == 1) window.location.href = '/viewproduct.html?id=' + findedP[0].prodid + '&search=' + searchk;
                    else {
                        seller_results.innerHTML = `
                            Não encontramos "${searchk}" no sistema.<br>
                            Tente <b>mudar o critério de pesquisa</b>!
                        `;
                    }
            }

            if (sel_order === 'dist') {
                arr_sellers.sort((a, b) => {
                    const vA = parseFloat(a.dist.replace(',', '.'));
                    const vB = parseFloat(b.dist.replace(',', '.'));
                    return vA - vB;
                });
            } else if (sel_order === 'rate') {
                arr_sellers.sort((a, b) => {
                    if (a.rate !== b.rate) {
                        return b.rate - a.rate;
                    } else {
                        return Math.random() * 2 - 1;
                    }
                });
            } else if (sel_order === 'rel') {
                arr_sellers.sort((a, b) => {
                    if (a.rel !== b.rel) {
                        return a.rel - b.rel;
                    } else {
                        return Math.random() * 2 - 1;
                    }
                });
            }

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
                        if (filter.value === p.filter) p.filterName = filter.title;
                    })
                    if(p.sellerid === seller.sellerid) {
                        seller.prodcount++;
                        if(!seller.prodfilters.includes(p.filterName))seller.prodfilters.push(p.filterName);
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
                        <div class="right" style="width">
                            <div>
                                <b>${seller.name}</b><br>
                                <div style="font-size: 10pt"><span style="color: rgb(230, 170, 0);">${seller.rateStars}</span> • <span>${seller.dist}km</span></div>
                            </div>
                            <div style="font-size: 10pt; padding-top: 5px">
                                Conhecido(a) como <span style="color: rgb(60, 60, 255)">${seller.nick.length > 10 ? seller.nick.slice(0, 10).trim() + '...' : seller.nick}</span><br>
                                <i style="font-size: 8pt">Clique para mais detalhes</i>
                            </div>
                        </div>
                    </div>
                `;

                seller_results.appendChild(cardItem);
                totalRes++;
            });

            document.querySelector('#results-count').parentNode.style.display = '';
            document.querySelector('#results-count').innerHTML = totalRes;
        });
    });
}

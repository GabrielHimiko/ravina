const categoryBtns = document.querySelectorAll('#categorias button');
const loading = document.querySelector('#loading');
const prod_results = document.querySelector('#prod_results');
const prod_filter_title = document.querySelector('.resInfo #filter_title');
const prod_filter_select = document.querySelector('.resInfo #filter_select');
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

let arr_products = [], arr_sellers = [], arr_cardItems = [], arr_lines = [];
let sel_filter = 'desc', sel_subfilter, sel_order = 'rel', sel_search, red_search, perLine = 2;
let cardItemsInserted = 0, requireLoadMore = false, actualMaxLines = 10;

function setPerLine() {
    if(window.innerWidth <= 600) perLine = 2;
    if(window.innerWidth > 600 && window.innerWidth <= 750) perLine = 3;
    if(window.innerWidth > 750) perLine = 4;
    if(window.innerWidth > 1000) perLine = 5;
}

setPerLine();
loadProducts();

window.addEventListener('resize', () => {
    setPerLine();
    loadProducts();
});

categoryBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        if(btn.classList.contains('selected')) return;

        sel_filter = btn.id;
        
        btn.parentNode.scrollLeft = 0;
        categoryBtns.forEach((e) => {e.style.display = ''});
        categoryBtns.forEach((e) => {
            if(e.classList.contains('selected')) {
                e.innerText = btn.innerText;
            }
        })
        btn.style.display = 'none';
        sel_subfilter = '';

        let hasFind = false;
        obj_prod_filter.forEach((filter) => {
            if(filter.value === sel_filter && !hasFind) {
                hasFind = true;

                if(filter.options) {
                    prod_filter_select.style.display = '';
                    prod_filter_title.style.display = '';
                    prod_filter_title.innerHTML = filter.subtitle;
                    Array.from(prod_filter_select.children).forEach((c) => {prod_filter_select.removeChild(c)});
                    const allOpt = new Option('Ver tudo');
                    prod_filter_select.appendChild(allOpt);
                    for(i = 0; i < filter.options.length; i++) {
                        const newOpt = new Option(filter.options[i].title);
                        newOpt.value = filter.options[i].value;
                        prod_filter_select.appendChild(newOpt);
                    }

                    prod_filter_select.addEventListener('change', () => {
                        sel_subfilter = prod_filter_select.value;
                        loadProducts(sel_filter, sel_subfilter);
                    });
                }
                else {
                    prod_filter_title.style.display = 'none';
                    prod_filter_select.style.display = 'none';
                }
            };
        });
        if(!hasFind) {
            prod_filter_title.style.display = 'none';
            prod_filter_select.style.display = 'none';
        };

        loadProducts();

    })
});

select_orderBy.addEventListener('change', function() {
    sel_order = this.value;
    loadProducts();
})

function searchStr(texto) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

search_btn.addEventListener('click', () => {
    if(search_input.value.length == 0) loadProducts();
    sel_search = search_input.value;
    
    let finded_p = [];
    arr_products.forEach((p) => {
        if(searchStr(p.title).includes(searchStr(sel_search))) {
            finded_p.push(p);
        }
    });

    let finded_s = [];
    arr_sellers.forEach((s) => {
        if(searchStr(s.name).includes(searchStr(sel_search))) {
            finded_s.push(s);
        }
    });

    if(finded_p.length) {
        loadProducts(searchStr(sel_search));
    } else if(finded_s.length) {
        window.location.href = '/persons.html?search=' + searchStr(sel_search);
    }
    else {
        prod_results.innerHTML = `
            Não encontramos "${sel_search}" no sistema.<br>
            Tente <b>mudar os critérios de pesquisa</b>!
        `;
        return;
    };
});


function loadProducts(searchk) {

    arr_products = []; 
    arr_sellers = [];
    arr_cardItems = [];
    arr_lines = [];
    cardItemsInserted = 0;
    requireLoadMore = false;

    prod_results.innerHTML = '';
    prod_results.style.display = 'none';
    prod_results.style.opacity = '0';
    loading.style.display = '';

    firebase.database().ref('sellers').orderByChild('name').on('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const seller = childSnapshot.val();
            arr_sellers.push(seller);
        });

        firebase.database().ref('products').orderByChild('name').on('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const prod = childSnapshot.val();

                let sRate, sDist;
                arr_sellers.forEach((s) => {
                    if (s.sellerid === prod.sellerid) {
                        sRate = s.rate;
                        sDist = s.dist.replace('.', ',');
                    }
                });
                prod.rate = sRate;
                prod.dist = sDist;
                prod.price = Number(prod.price).toFixed(2).replace('.', ',');
                if(prod.rprice === '-x-') prod.rprice = '';
                if(prod.rprice) prod.rprice = Number(prod.rprice).toFixed(2).replace('.', ',');

                if(!searchk) arr_products.push(prod);
                else {
                    if(searchStr(prod.title).includes(searchk)) arr_products.push(prod);
                }

                if (sel_order === 'price') {
                    arr_products.sort((a, b) => {
                        const vA = parseFloat(a.price.replace(',', '.'));
                        const vB = parseFloat(b.price.replace(',', '.'));
                        return vA - vB;
                    });
                } else if (sel_order === 'rate') {
                    arr_products.sort((a, b) => {
                        return b.rate - a.rate;
                    });
                } else if (sel_order === 'rel') {
                    arr_products.sort((a, b) => {
                        return a.sel_order - b.sel_order;
                    });
                } else if (sel_order === 'dist') {
                    arr_products.sort((a, b) => {
                        const vA = parseFloat(a.dist.replace(',', '.'));
                        const vB = parseFloat(b.dist.replace(',', '.'));
                        console.log(vA - vB);
                        return vA - vB;
                    });
                }
            });

            loading.style.display = 'none';
            prod_results.style.display = '';
            
            setTimeout(function() {
                prod_results.style.opacity = '1';
                loading.style.opacity = '1';
            }, 100);

            let finded = 0;
            arr_products.forEach((prod) => {
                if(sel_filter == 'desc') {
                    if(!prod.rprice) return;
                }
                else if(sel_filter != 'all') {
                    if (prod.filter != sel_filter) return;
                    if ((sel_subfilter) && (prod.subfilter != sel_subfilter)) return;
                }
                finded++;

                let prod_sellerNick, prod_sellerRate;

                arr_sellers.forEach((s) => {
                    if (s.sellerid === prod.sellerid) {
                        prod_sellerNick = s.nick;
                        switch(s.rate) {
                            case '1': prod_sellerRate = '★☆☆☆☆'; break;
                            case '2': prod_sellerRate = '★★☆☆☆'; break;
                            case '3': prod_sellerRate = '★★★☆☆'; break;
                            case '4': prod_sellerRate = '★★★★☆'; break;
                            case '5': prod_sellerRate = '★★★★★'; break;
                        };
                    }
                });

                const cardItem = document.createElement('div');
                cardItem.classList.add('cardItem');
                cardItem.id = prod.prodid;
                cardItem.innerHTML = `
                    <div class="cardItem" id="">
                        <div class="top">
                            <img class="product" src="${prod.imglink}">
                        </div>
                        <div class="info">
                            <div class="itemInfo">
                                <span class="item_title">${prod.title.length > 20 ? `<span style="font-size: 9pt">${prod.title.slice(0, 20)}...</span>` : prod.title}</span><br>
                                ${!prod.rprice ? '' : `<span class="item_oldPrice">R$${prod.rprice}</span> `}<span class="item_price">${prod.filter == 'serv' ? 'Preço variável' : `R$${prod.price}`}</span>${prod.filter == 'serv' ? '' : ' <span class="item_priceType">cada</span>'}
                            </div>
                            <div class="sellerInfo"><span class="seller_name">${prod_sellerNick}</span> <span class="seller_rating">${prod_sellerRate}</span><br><span class="seller_dist">${prod.dist}km de distância</span></div>
                        </div>
                    </div>
                `;

                cardItem.addEventListener('click', function() {
                    window.location.href = `/viewproduct.html?id=${this.id}`;
                });

                arr_cardItems.push(cardItem);
            });
            
            if(finded == 0) {
                prod_results.innerHTML = `
                    Não encontramos produtos com essas especificações 😞<br>
                    Tente <b>mudar o filtro e o subfiltro</b> selecionados!
                `;
                return;
            }

            let linesCount = Math.ceil(arr_cardItems.length / perLine);
            if (linesCount > 10) requireLoadMore = true;
            for (let i = 0; i < linesCount; i++) {
                const line = document.createElement('div');
                line.classList.add('line');
                arr_lines.push(line);

                for (let j = 0; j < perLine; j++) {
                    if (cardItemsInserted >= arr_cardItems.length) {
                        if(Array.from(arr_lines[i].children).length < perLine) {
                            for(let k = 0; Array.from(arr_lines[i].children).length < perLine; k++) {
                                const nullCardItem = document.createElement('div');
                                nullCardItem.classList.add('cardItem');
                                nullCardItem.style = 'pointer-events: none; border: none;';
                                arr_lines[i].appendChild(nullCardItem);
                            }
                        }
                        break;
                    }
                    arr_lines[i].appendChild(arr_cardItems[cardItemsInserted]);
                    cardItemsInserted++;
                }
            };

            for(i = 0; i < arr_lines.length; i++) {
                if(i > 10 && requireLoadMore) {
                    arr_lines[i].style.display = 'none';
                };
                document.querySelector('#prod_results').appendChild(arr_lines[i]);
            };

            if(requireLoadMore) createLoadMore();

        });
    });
};

function loadMoreLines() {
    actualMaxLines+=10, requireLoadMore = false;
    document.querySelector('#load-more').remove();

    if(actualMaxLines < arr_lines.length) requireLoadMore = true;

    for(i = actualMaxLines-10; i < arr_lines.length && i < actualMaxLines; i++) {
        arr_lines[i].style.display = '';
    };

    if(requireLoadMore) createLoadMore();
};

function createLoadMore() {
    const loadMoreDiv = document.createElement('div');
    loadMoreDiv.style = 'display: flex; justify-content: center';
    const loadMore = document.createElement('button');
    loadMore.style = 'padding-inline: 30px; padding-block: 10px; box-shadow: 0 0 10px rgb(100, 100, 255); background-image: linear-gradient(to right, rgb(25, 25, 255), rgb(100, 100, 255)); color: white; margin-top: 10px'
    loadMore.innerHTML = 'Ver mais';
    loadMore.id = 'load-more';
    loadMore.addEventListener('click', () => {loadMoreLines()});

    loadMoreDiv.appendChild(loadMore);
    document.querySelector('#prod_results').appendChild(loadMoreDiv);
}
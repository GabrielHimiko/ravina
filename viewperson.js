const search_input = document.querySelector('#headerTop input');
const search_btn = document.querySelector('#headerTop .inputZone button');
search_input.addEventListener('keydown', (event) => {if(event.key === 'Enter') window.location.href = '/home.html?search=' + search_input.value});
search_btn.addEventListener('click', () => {window.location.href = '/home.html?search=' + search_input.value});

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
let seller, s_prods = [];

const url = new URL(window.location.href);
const urlPar = url.searchParams.get('id');
const urlPar_search = url.searchParams.get('search');

if(urlPar_search) search_input.value = urlPar_search;

firebase.database().ref('sellers').orderByChild('name').on('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const seller = childSnapshot.val();
        seller.prodfilters = [];
        arr_sellers.push(seller);
    });

    firebase.database().ref('products').orderByChild('name').on('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const prod = childSnapshot.val();
            arr_products.push(prod);
        });

        arr_sellers.forEach((s) => {
            if(urlPar === s.sellerid) {
                seller = s;
                arr_products.forEach((p) => {
                    if(seller.sellerid === p.sellerid) {
                        s_prods.push(p);
                    }
                });
            }
        });

        document.querySelector('#middle #loading').style.display = 'none';
        
        if(seller) {
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

        s_prods.forEach(p => {
            obj_prod_filter.forEach(filter => {
                if (filter.value === p.filter) p.filterName = filter.title;
            })
            if(!seller.prodfilters.includes(p.filterName)) seller.prodfilters.push(p.filterName);
        })

        seller.prodcount = s_prods.length;
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

        document.title = `${seller.name}`;
        document.querySelector('#middle .seller_disttime').innerHTML = `${(seller.disttimewalk >= 60 ? `${(seller.disttimewalk/60).toFixed(1).replace('.', ',')}h` : `${seller.disttimewalk}min`) + ' andando'} ou ${seller.disttimecar}min de carro`;
        document.querySelector('#middle .seller_imglink').src = seller.imglink;
        document.querySelector('#middle .seller_name').innerHTML = seller.name;
        document.querySelector('#middle .seller_nick').innerHTML = seller.nick;
        document.querySelector('#middle .seller_nick2').innerHTML = seller.nick;
        document.querySelector('#middle .seller_rate').innerHTML = seller.rateStars;
        document.querySelector('#middle .seller_dist').innerHTML = seller.distStr;
        document.querySelector('#middle .seller_prodcount').innerHTML = seller.prodcount;
        document.querySelector('#middle .seller_prodfilters').innerHTML = seller.prodfilters.join(', ');

        switch(seller.locat) {
            case 'Zona Norte, Londrina': document.querySelector('#middle .seller_locat').src = 'https://media.discordapp.net/attachments/731202771562266674/1173460525615693875/Zona_Norte_Londrina_2.png?ex=65640947&is=65519447&hm=1428f43f816f782b34b2aaaddce0c8223dbc99416132c59183d10215296636f9&='; break;
            case 'Zona Sul, Londrina': document.querySelector('#middle .seller_locat').src = 'https://media.discordapp.net/attachments/731202771562266674/1173460350369271920/Zona_Norte_Londrina_1.png?ex=6564091d&is=6551941d&hm=18340a705fdeadd663271a2ef26737cbf47886088b288dbc7df2d2b4fa64f4e8&='; break;
            case 'Zona Oeste, Londrina': document.querySelector('#middle .seller_locat').src = 'https://media.discordapp.net/attachments/731202771562266674/1173461065376485456/Zona_Norte_Londrina_3.png?ex=656409c7&is=655194c7&hm=06654bdde59fc06ef97bab522963851d40730b8d2ce1ee0f484b9e592b583112&='; break;
            case 'Zona Leste, Londrina': document.querySelector('#middle .seller_locat').src = 'https://media.discordapp.net/attachments/731202771562266674/1173461365755756554/Zona_Norte_Londrina_4.png?ex=65640a0f&is=6551950f&hm=3569465d991413e1463ddeaa91bd998efd5ae6d1dc28d5b7fa533e636c892dec&='; break;
            case 'Cambé': document.querySelector('#middle .seller_locat').src = 'https://media.discordapp.net/attachments/731202771562266674/1173462021891707000/Zona_Norte_Londrina_6.png?ex=65640aab&is=655195ab&hm=46b4926fb4ef3f8e960ce4fbc5a4ff269d9d323618fff7dbc6e2a38f441ce01e&='; break;
            case 'Ibiporã': document.querySelector('#middle .seller_locat').src = 'https://media.discordapp.net/attachments/731202771562266674/1173461716374401134/Zona_Norte_Londrina_5.png?ex=65640a63&is=65519563&hm=0a091ea3f6d1310ffb5e1ed73da487eeb9fb2ff8b9fe8f0d08565794d18473ab&='; break;
        }

        setTimeout(function() {
            if(document.querySelector('#middle .seller_imglink').offsetHeight > 300) {

                document.querySelector('#middle #expand_img').style.display = '';
    
                document.querySelector('#middle #expand_img').addEventListener('click', function() {
                    if(this.style.backgroundColor == '') {
                        document.querySelector('#middle #img-container').style.height = 'auto';
                        this.style.backgroundColor = 'grey';
                    } else {
                        document.querySelector('#middle #img-container').style.height = '300px';
                        this.style.backgroundColor = '';
                    }
                    
                });
    
            };
        }, 500);

        setTimeout(function() {
            if(document.querySelector('#middle .seller_imglink').offsetHeight > 300) {

                document.querySelector('#middle #expand_img').style.display = '';
    
                document.querySelector('#middle #expand_img').addEventListener('click', function() {
                    if(this.style.backgroundColor == '') {
                        document.querySelector('#middle #img-container').style.height = 'auto';
                        this.style.backgroundColor = 'grey';
                    } else {
                        document.querySelector('#middle #img-container').style.height = '300px';
                        this.style.backgroundColor = '';
                    }
                    
                });
    
            };
        }, 500);

        s_prods.forEach((prod) => {
            
            prod.price = Number(prod.price).toFixed(2).replace('.', ',');
            if(prod.rprice === '-x-') prod.rprice = '';
            if(prod.rprice) prod.rprice = Number(prod.rprice).toFixed(2).replace('.', ',');

            const cardItem = document.createElement('div');
            cardItem.classList.add('cardItem');
            cardItem.id = prod.prodid;
            cardItem.innerHTML = `
                <div class="cardItem">
                    <div class="top">
                        <img class="product" src="${prod.imglink}">
                    </div>
                    <div class="info" style="white-space: nowrap">
                        <div class="itemInfo">
                            <span class="item_title">${prod.title.length > 20 ? `<span style="font-size: 9pt">${prod.title.slice(0, 20).trim()}...</span>` : prod.title}</span><br>
                            ${!prod.rprice ? '' : `<span class="item_oldPrice">R$${prod.rprice}</span> `}<span class="item_price">${prod.filter == 'serv' ? 'Preço variável' : `R$${prod.price}`}</span>${prod.filter == 'serv' ? '' : ' <span class="item_priceType">cada</span>'}
                        </div>
                    </div>
                </div>
            `;
    
            cardItem.addEventListener('click', function() {
                window.location.href = `/viewproduct.html?id=${this.id}`;
            });
    
            document.querySelector('#result_prods').appendChild(cardItem);
        });
    });
});

document.querySelector('#see-this-seller').addEventListener('click', () => {
    document.querySelector('#middle').scrollTop = document.querySelector('#middle').scrollHeight;
});

document.querySelector('#return').addEventListener('click', () => {
    window.location.href = '/home.html';
});
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

//Declarando os elementos HTML
const topMenu = {
    cont: document.querySelector('#topMenu'),
    prim: document.querySelector('#topMenu_prim'),
    sec: document.querySelector('#topMenu_sec'),
}
const middle = document.querySelector('#middle');
const search = {
    cont: document.querySelector('#search'),
    icon: document.querySelector('#search_icon'),
    inp: document.querySelector('#search_inp'),
    go: document.querySelector('#search_go'),
};
const cart = document.querySelector('#cart');
const prodZone = document.querySelector('#prodZone');

//Search
search.inp.addEventListener('focus', () => {
    search.go.style.display = 'flex';
    search.icon.style.display = 'none';
    search.inp.style.borderWidth = '1px 0 1px 1px';
    search.inp.style.borderRadius = '10px 0 0 10px';
    search.inp.style.paddingInline = '10px';
    search.inp.style.borderColor = 'rgb(100, 100, 255)';
    cart.style.display = 'none';
});
search.inp.addEventListener('blur', () => {
    search.go.style = 'inherit';
    search.icon.style = 'inherit';
    search.inp.style = 'inherit';
    cart.style = 'inherit';
});

//topMenu
lastScrollTop = 0;
middle.addEventListener('scroll', () => {
    if (middle.scrollTop > 0) {
        topMenu.cont.classList.add('ending');
    } 
    else {
        topMenu.cont.classList.remove('ending');
    }

    if ((lastScrollTop > middle.scrollTop) && (middle.scrollTop <= topMenu.sec.offsetHeight/3)) {
        middle.scrollTo({top: 0, behavior: 'smooth'});
    }
    lastScrollTop = middle.scrollTop;
})

//prodZone
let sellers = [], prods = [];
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
            
            sellers.forEach(seller => {
                if (seller.sellerid === prod.sellerid) {
                    prod.s_dist = seller.dist;
                    prod.s_rate = seller.rate;
                    prod.s_name = seller.name;
                    prod.s_nick = seller.nick;
                }
            });

            prods.push(prod);
        });

        loadDatabase();
    });

});

function loadDatabase(filter, subfilter, orderBy, search) {

    prodZone.innerHTML = '';

    prods.forEach(prod => {
        if(filter && prod.filter !== filter) return;
        if(subfilter && prod.subfilter !== subfilter) return;
        if(search) {

        }

        const el = {
            cont: document.createElement('div'),
            imgCont: document.createElement('div'),
            rPrice: document.createElement('div'),
            img: document.createElement('img'),
            prodInfo: {
                cont: document.createElement('div'),
                title: document.createElement('span'),
                price: document.createElement('span'),
            },
            sellerInfo: {
                cont: document.createElement('div'),
                nick: document.createElement('span'),
                rate: document.createElement('span'),
                dist: document.createElement('span'),
            },
        }

        el.cont.classList.add('item');
        el.imgCont.classList.add('imgCont');

        el.img.src = prod.imglink;
        el.imgCont.style.backgroundImage = `url('${prod.imglink}')`;
        el.imgCont.appendChild(el.img);

        if(prod.rprice && prod.rprice != '-x-') {
            el.rPrice.classList.add('rPrice');
            el.rPrice.innerHTML = "-" + ( ((prod.rprice - prod.price) / prod.rprice) * 100 ).toFixed(0) + "%";
            el.imgCont.appendChild(el.rPrice);
        }

        el.prodInfo.cont.classList.add('prodInfo');
        el.prodInfo.title.classList.add('title');
        el.prodInfo.title.innerText = prod.title.length > 30 ? prod.title.slice(0, 30).trim() + '...' : prod.title;

        el.prodInfo.cont.appendChild(el.prodInfo.title);
        el.prodInfo.cont.appendChild(el.prodInfo.price);

        el.sellerInfo.cont.classList.add('sellerInfo');
        el.prodInfo.price.classList.add('price');
        el.prodInfo.price.innerHTML = "<span class='cifao'>R$</span>" + (prod.price*1).toFixed(2).replace(".", ",");
        el.sellerInfo.rate.classList.add('rate');
        el.sellerInfo.rate.innerHTML = prod.s_rate + "<span class='estrela'><i class='bx bxs-star'></i></span>";

        el.sellerInfo.cont.appendChild(el.prodInfo.price);        
        el.sellerInfo.cont.appendChild(el.sellerInfo.rate);

        el.cont.appendChild(el.imgCont);
        el.cont.appendChild(el.prodInfo.cont);
        el.cont.appendChild(el.sellerInfo.cont);
        prodZone.appendChild(el.cont);
    });
};

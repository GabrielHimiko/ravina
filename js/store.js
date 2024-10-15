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

//Tamanho da tela
let perLine = 2;
document.addEventListener('DOMContentLoaded', () => {verifyWindowSize()});
window.addEventListener('resize', () => {verifyWindowSize()});
function verifyWindowSize() {
    let newPerLine = 0;
    if(document.querySelector('#interface').offsetWidth >= 600) newPerLine = 3
    else newPerLine = 2;

    if(newPerLine !== perLine) {
        perLine = newPerLine;
        loadDatabase();
    }
};

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

        loadDatabase(0, 0, 'rel', 0, 0);
    });

});

function loadDatabase(filter, subfilter, orderBy, orderByInvert, search) {

    prodZone.innerHTML = '';

    if(orderBy) {
        prods.sort((a, b) => {
            if (orderByInvert) {
                return b[orderBy] - a[orderBy];
            } else {
                return a[orderBy] - b[orderBy];
            }
        });
    }

    let validProds = 0;
    prods.forEach(prod => {

        if(filter) {
            let hasFilter = false;
            filter.forEach((f) => {
                if(f === 'desc' && (prod.rprice && prod.rprice !== '-x-')) hasFilter = true;
                if(prod.filter === f) hasFilter = true;
            });
            if(!hasFilter) return;
        };

        if(subfilter) {
            let hasSubfilter = false;
            subfilter.forEach((sf) => {
                if(prod.subfilter === sf) hasSubfilter = true;
            });
            if(!hasSubfilter) return;
        };

        if(search) {

        }

        validProds++;

        console.log(prod.filter)

        const lastLine = lines[lines.length - 1];
        let selLine;
        if(!lastLine) {
            selLine = createNewLine();
        } 
        else if(lastLine.querySelectorAll('.item').length >= perLine) {
            selLine = createNewLine();
        }
        else {
            selLine = lastLine;
        };
        
        function createNewLine() {
            const newLine = document.createElement('div');
            newLine.classList.add('line');
            prodZone.appendChild(newLine);
            lines.push(newLine);
            return newLine;
        }

        const el = {
            cont: document.createElement('div'),
            imgCont: document.createElement('div'),
            rPrice: document.createElement('div'),
            img: document.createElement('img'),
            backImg: document.createElement('img'),
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
        el.img.classList.add('frontImg');
        el.backImg.classList.add('backImg');

        el.img.src = prod.imglink;
        el.backImg.src = prod.imglink;
        el.imgCont.appendChild(el.img);
        el.imgCont.appendChild(el.backImg);

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
        selLine.appendChild(el.cont);
    });

    const lastLine = lines[lines.length - 1];
    while (lastLine.children.length < perLine) {
        const fItem = document.createElement('div');
        fItem.classList.add('fItem');
        lastLine.appendChild(fItem);
    }

    document.querySelector('#totalResults').innerText = validProds;
};

const catBtns = document.querySelectorAll('#categories button');
catBtns.forEach(cb => {
    cb.addEventListener('click', () => {
        catBtns.forEach(c => {c.hidden = false}); //desocultando todos os catBtns
        catBtns[0].innerHTML = cb.innerHTML;
        cb.hidden = true;
        document.querySelector('#categories').scrollTo({top: 0, left: 0, behavior: 'smooth'});
        loadDatabase(cb.value == 'rec' ? 0 : [cb.value], 0, 'rel', false, 0);
    });
})
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
const sellersZone = document.querySelector('#sellersZone');

//Tamanho da tela
let perLine = 2;
if(document.querySelector('#interface').offsetWidth >= 600) perLine = 3;

window.addEventListener('resize', () => {
    let newPerLine = 0;
    if(document.querySelector('#interface').offsetWidth >= 600) newPerLine = 3
    else newPerLine = 2;

    if(newPerLine !== perLine) {
        perLine = newPerLine;
        loadDatabase('rel', 0, 0);
    }
});

//Search
search.go.addEventListener('mousedown', () => {
    const searchKey = search.inp.value;
    loadDatabase('rel', false, searchKey);
});
search.inp.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        search.go.style = 'inherit';
        search.icon.style = 'inherit';
        search.inp.style = 'inherit';
        cart.style = 'inherit';
        const searchKey = search.inp.value;
        loadDatabase('rel', false, searchKey);
    }
  });
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

//sellersZone
let sellers = [], prods = [];
firebase.database().ref('sellers').orderByChild('name').once('value').then((snapshot) => {
    
    sellers = [], prods = [];
    snapshot.forEach((childSnapshot) => {
        const seller = childSnapshot.val();
        seller.key = childSnapshot.key;
        seller.prods = 0;
        sellers.push(seller);
    });

    firebase.database().ref('products').orderByChild('title').once('value').then((snapshot) => {
            
        snapshot.forEach((childSnapshot) => {
            const prod = childSnapshot.val();
            prod.key = childSnapshot.key;

            prods.push(prod);
        });

        loadDatabase('rel', 0, 0);
    });

});

function loadDatabase(orderBy, orderByInvert, search) {

    sellersZone.innerHTML = '';

    if(orderBy) {
        sellers.sort((a, b) => {
            if (orderByInvert) {
                return b[orderBy] - a[orderBy];
            } else {
                return a[orderBy] - b[orderBy];
            }
        });
    }

    let validSellers = 0;
    sellers.forEach(seller => {

        function removeAccents(str) {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }
        
        if (search) {
            const normalizedTitle = removeAccents(prod.title.toLowerCase());
            const normalizedSearch = removeAccents(search.toLowerCase());
        
            if (!normalizedTitle.includes(normalizedSearch)) return;
        }

        validSellers++;
        prods.forEach(prod => {
            if(prod.sellerid === seller.sellerid) seller.prods += 1;
        });

        const el = document.createElement('div');
        el.classList.add('item');
        el.innerHTML = `
            <div class="imgCont">
                <img src="${seller.imglink}">
            </div>
            <div class="sellerInfo">
                <div class="top">
                    <span style="font-size: 14pt">${seller.name}</span>
                </div>
                <div class="bottom">
                    <div class="sellerBasics">
                        <div>Avaliação geral</div>
                        <div><span style="font-size: 14pt">${seller.rate}<i class='bx bxs-star' style="color: orange"></i></span></div>
                    </div>
                    <div class="sellerBasics">
                        <div>Produtos à venda</div>
                        <div><span style="font-size: 14pt">${seller.prods}</span></div>
                    </div>
                </div>
                <div class="footer">
                        <button><i class='bx bx-search' ></i> Ver produtos</button>
                        <button><i class='bx bx-chat'></i> Chat pessoal</button>
                </div>
            </div>
        `;
        sellersZone.appendChild(el);
    });

    document.querySelector('#totalResults').innerText = validSellers;

    if(!validSellers) return sellersZone.innerHTML = 'Nenhum produto corresponde aos critérios que você escolheu :(';
};
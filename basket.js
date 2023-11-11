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

let arr_sellers = [];

firebase.database().ref('sellers').orderByChild('name').on('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const seller = childSnapshot.val();
        arr_sellers.push(seller);
    });

    document.querySelector('#loading').style.display = 'none';

    let baskDataString;
    loadBask();

    function loadBask() {

        baskDataString = localStorage.getItem("baskData");
        document.querySelector('#result').innerHTML = '';
        let baskData = [];

        baskData = JSON.parse(baskDataString);

        if (baskData) {document.querySelector('#result').style.display = ''}
        else {document.querySelector('#not-found').style.display = ''; return}

        baskData.forEach((prod) => {
            prod.price = Number(prod.price).toFixed(2).replace('.', ',');
            if(prod.rprice && prod.rprice != '-x-') prod.rprice = Number(prod.rprice).toFixed(2).replace('.', ',');
            
            let seller;
            arr_sellers.forEach((s) => {
                if(prod.sellerid === s.sellerid) seller = s;
            });
    
            const cardItem = document.createElement('div');
            cardItem.classList.add('cardItem');
            cardItem.id = prod.prodid;
            cardItem.innerHTML = `
                <div class="cardItem">
                    <div class="left clickable">
                        <img class="product" src="${prod.imglink}">
                    </div>
                    <div class="right">
                        <div class="clickable">
                            <span class="item_title"><b>${prod.title.length > 25 ? `<span style="font-size: 11pt">${prod.title}</span>` : prod.title}</b></span><br>
                            ${!prod.rprice || prod.rprice == '-x-' ? '' : `<span style="font-size: 10pt; color: rgb(194, 29, 29);">R$<s>${prod.rprice}</s></span> `}<span style="color: rgb(60, 60, 255);">R$${prod.price}</span> cada
                        </div>
                        <div class="clickable" style="font-size: 10pt">Vendido por <span class="seller_name">${seller.nick}</span></div>
                        <div><button class="delete" style="margin-top: 5px">❌ Remover</button></div>

                    </div>
                </div>
            `;
    
            cardItem.querySelector('.delete').addEventListener('click', function() {
                let new_baskData = [];

                if(baskDataString) {
                    new_baskData = JSON.parse(baskDataString);
                }

                let index = new_baskData.findIndex(item => item.prodid === cardItem.id);
                console.log(index);

                if (index > -1) {
                    new_baskData.splice(index, 1);
                }

                const new_baskDataString = JSON.stringify(new_baskData);
                localStorage.setItem("baskData", new_baskDataString);
                loadBask();
            });

            cardItem.querySelectorAll('.clickable').forEach(e => {
                e.addEventListener('click', () => {
                    window.location.href = '/viewproduct.html?id=' + cardItem.id;
                });
            });

            document.querySelector('#result').append(cardItem);
    
        });
    
        
    }
});
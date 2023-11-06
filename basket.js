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

let arr_sellers = [];
firebase.database().ref('sellers').orderByChild('name').on('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const seller = childSnapshot.val();
        arr_sellers.push(seller);
    });

    document.querySelector('#loading').style.display = 'none';

    let baskData = []; 

    if(!baskDataString) {
        document.querySelector('#not-found').style.display = '';
    }  else {
        baskData = JSON.parse(baskDataString);

        document.querySelector('#result').style.display = '';
        loadBask();
    }

    function loadBask() {
        baskData.forEach((prod) => {

            prod.price = Number(prod.price).toFixed(2).replace('.', ',');
    
            console.log(prod.sellerid);
            
            let seller;
            arr_sellers.forEach((s) => {
                if(prod.sellerid === s.sellerid) seller = s;
                console.log('executed');
            });
    
            const cardItem = document.createElement('div');
            cardItem.classList.add('cardItem');
            cardItem.id = prod.prodid;
            cardItem.innerHTML = `
                <div class="cardItem">
                    <div class="left">
                        <img class="product" src="${prod.imglink}">
                    </div>
                    <div class="right">
                        <div>
                            <span class="item_title"><b>${prod.title}</b></span><br>
                            ${!prod.rprice || prod.rprice == '-x-' ? '' : `<span style="font-size: 10pt; color: rgb(194, 29, 29);">R$<s>${prod.rprice}</s></span> `}<span style="color: rgb(60, 60, 255);">R$${prod.price}</span> cada
                        </div>
                        <div style="font-size: 10pt">Vendido por <span class="seller_name">${seller.nick}</span></div>

                    </div>
                </div>
            `;
    
            document.querySelector('#result').append(cardItem);
    
        });
    
        
    }
});
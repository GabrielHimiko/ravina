const inputMsg = document.querySelector('#input-msg');
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

document.querySelector('#loading').style.display = 'none';

const url = new URL(window.location.href);
const urlPar = url.searchParams.get('id');
let hasResponsed = false;

if(!urlPar) {
    document.querySelector('#not-found').style.display = '';
} else {
    document.querySelector('#result').style.display = '';
    document.querySelector('#loading').style.display = 'none';

    let seller;
    firebase.database().ref('sellers').orderByChild('name').on('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const s = childSnapshot.val();
            if(s.sellerid === urlPar) seller = s;
        });

        document.querySelector('.seller_nick').innerHTML = seller.nick;
        document.querySelector('.seller_nick2').innerHTML = seller.nick;
    });

    document.querySelector('#send-msg').addEventListener('click', () => {sendMsg()});
    inputMsg.addEventListener('keydown', (event) => {if(event.key === 'Enter') sendMsg()});

    function sendMsg() {

        let now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();

        hours = (hours < 10 ? '0' : '') + hours;
        minutes = (minutes < 10 ? '0' : '') + minutes;

        let formattedTime = `${hours}:${minutes}`;

        if (inputMsg.value) {
            const msg = document.createElement('div');
            msg.innerHTML = `
            <div style="width: 100%; display: flex; justify-content: right; margin-top: 2px">
                <div style="display: flex; justify-content: center; align-items: end; padding: 5px; border: 1px solid lightgrey; border-radius: 5px 0 5px 5px; max-width: 80%; font-size: 10pt; text-align: right;">
                    <div>${inputMsg.value}</div>
                    <div style="margin-left: 5px; color: grey; font-size: 8pt">${formattedTime}</div>
                </div>
            </div>
            `;
            document.querySelector('#msgZone').appendChild(msg);

            if(!hasResponsed) {
                hasResponsed = true;
                setTimeout(() => {
                    document.querySelector('#writing').style.opacity = 1;

                    setTimeout(() => {
                        document.querySelector('#writing').style.animation = 'blink 1s infinite';

                        setTimeout(() => {
                            const res = document.createElement('div');
                            res.innerHTML = `
                            <div style="width: 100%; display: flex; justify-content: left; margin-top: 10px; margin-bottom: 8px">
                                <div style="display: flex; justify-content: center; align-items: end; padding: 5px; background-color: lightgrey; border-radius: 0 5px 5px 5px; max-width: 80%; font-size: 10pt; text-align: left;">
                                    <div>Olá! Tudo bem?<br>Como posso ajudar? 😊</div>
                                    <div style="margin-left: 5px; color: grey; font-size: 8pt">${formattedTime}</div>
                                </div>
                            </div>
                            `;
                            document.querySelector('#msgZone').appendChild(res);
                            document.querySelector('#writing').style.animation = '';
                            document.querySelector('#writing').style.opacity = 0;
                            document.querySelector('#isOnline').style.opacity = 0;
                        }, 10000);
                    }, 500);
                }, 3000)
                
                document.querySelector('#writing').style.animationPlayState = 'paused';
            }

            inputMsg.value = '';
        }
    };

}


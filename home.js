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

firebase.database().ref('products').once('value').then((snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const prod = childSnapshot.val();
        console.log(prod);
    });
});

const categoryBtns = document.querySelectorAll('#categorias button');
const loading = document.querySelector('#loading');
const prod_results = document.querySelector('#prod_results');
const prod_filter_title = document.querySelector('.resInfo #filter_title');
const prod_filter_select = document.querySelector('.resInfo #filter_select');

const prod_filter = {
    com: {
        title: "Tipo de comida:",
        options: ['Salgados/Lanchinhos', 'Almoço e janta', 'Comida típica']
    },
    beb: {
        title: "Tipo de bebida:",
        options: ['Sucos', 'Vitaminas', 'Com álcool', 'Ervas']
    },
    doces: {
        title: "Tipo de doce:",
        options: ['De pote', 'Para assar', 'Infantil']
    },
    roupas: {
        title: "Tipo de roupa:",
        options: ['Parte de cima', 'Parte de baixo', 'Íntimas', 'Calçados']
    },
    plantas: {
        title: "Tipo de planta:",
        options: ['Decorativas/Jardim', 'Medicinais', 'Frutíferas']
    },
    serv: {
        title: "Tipo de serviço:",
        options: ['Construção', 'Montagem de móveis', 'Encanamento', 'Costura', 'Outros']
    }
};
let prodTypeSelected;

categoryBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        if(btn.classList.contains('selected')) return;

        prodTypeSelected = btn.id;
        
        btn.parentNode.scrollLeft = 0;
        categoryBtns.forEach((e) => {e.style.display = ''});
        categoryBtns.forEach((e) => {
            if(e.classList.contains('selected')) {
                e.innerText = btn.innerText;
            }
        })
        btn.style.display = 'none';

        if(prod_filter[prodTypeSelected]) {
            prod_filter_title.style.display = '';
            prod_filter_title.innerHTML = prod_filter[prodTypeSelected].title;
            
            if(prod_filter[prodTypeSelected].options) {
                Array.from(prod_filter_select.children).forEach((c) => {prod_filter_select.removeChild(c)});
                    const allOpt = new Option('Ver tudo');
                    prod_filter_select.appendChild(allOpt);
                for(i = 0; i < prod_filter[prodTypeSelected].options.length; i++) {
                    const newOpt = new Option(prod_filter[prodTypeSelected].options[i]);
                    prod_filter_select.appendChild(newOpt);
                }
                prod_filter_select.style.display = '';
            }
        } else {
            prod_filter_title.style.display = 'none';
            prod_filter_select.style.display = 'none';
        }

        prod_results.style.display = 'none';
        prod_results.style.opacity = '0';
        loading.style.display = '';


        setTimeout(function() {
            loading.style.opacity = '0';
            prod_results.style.display = '';
            setTimeout(function() {
                prod_results.style.opacity = '1';
                loading.style.opacity = '1';
                loading.style.display = 'none';
            }, 1000);
        }, 1000);
    })
})


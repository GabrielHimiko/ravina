const validation = document.querySelector('#validation');
const select_type = document.querySelector('#select_type');
const result = document.querySelector('#result');
const creating = document.querySelector('#creating');
const sellerView = document.querySelector('#creating #sellerResults #sellerView');
const createNewSeller = document.querySelector('#creating #createNewSeller');

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

let arr_products = [], arr_sellers = [], sellerInView;

firebase.database().ref('products').once('value').then((snapshot) => {
    snapshot.forEach((childSnapshot) => {
        arr_products.push(childSnapshot.val());
    });
});

loadSellers();

document.querySelector('#validation_input').addEventListener('input', function() {
    if (this.value === 'ravina23') {
        validation.style.display = 'none';
        select_type.style.display = '';
        sessionStorage.setItem('havePass', true);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if(sessionStorage.getItem('havePass')) {
        validation.style.display = 'none';
        select_type.style.display = '';
    }
});

document.querySelector('#sellers_btn').addEventListener('click', function() {
    document.querySelector('#creating').style.display = '';
    document.querySelector('#creating #sellerZone').style.display = '';
    document.querySelector('#creating #productZone').style.display = 'none';
    document.querySelectorAll('#select_type button').forEach((e) => {e.classList.remove('selected')});
    this.classList.add('selected');
});

document.querySelector('#products_btn').addEventListener('click', function() {
    document.querySelector('#creating').style.display = '';
    document.querySelector('#creating #sellerZone').style.display = 'none';
    document.querySelector('#creating #productZone').style.display = '';
    document.querySelectorAll('#select_type button').forEach((e) => {e.classList.remove('selected')});
    this.classList.add('selected');
    result.innerHTML = arr_products ? arr_products.join('<br>') : '';
});

document.querySelector('#creating #btn_createNewProduct').addEventListener('click', () => {
    creating.style.display = '';
    document.querySelector('#creating #createNewProduct').style.display = '';
});

document.querySelector('#creating #btn_createNewSeller').addEventListener('click', function() {
    this.style.display = 'none';
    document.querySelector('#creating #createNewSeller').style.display = '';
    document.querySelector('#creating #createNewSeller #sellers_count').innerText = arr_sellers.length+1;
    sellerView.style.display = 'none';
    sellerView.parentNode.querySelector('table').style.display = 'none';
});

document.querySelector('#creating #createNewProduct #prod_filter').addEventListener('change', function() {
    if(!this.value) return;
    const prodTypeSelected = this.value;
    const prod_subfilter_select = document.querySelector('#creating #createNewProduct #prod_subfilter');
    if(obj_prod_filter[prodTypeSelected]) {
        prod_subfilter_select.disabled = false;
        
        if(obj_prod_filter[prodTypeSelected].options) {
            Array.from(prod_subfilter_select.children).forEach((c) => {prod_subfilter_select.removeChild(c)});
                const allOpt = new Option('Selecione');
                allOpt.value = 0;
                prod_subfilter_select.appendChild(allOpt);
            for(i = 0; i < obj_prod_filter[prodTypeSelected].options.length; i++) {
                const newOpt = new Option(obj_prod_filter[prodTypeSelected].options[i].title);
                newOpt.value = obj_prod_filter[prodTypeSelected].options[i].value;
                prod_subfilter_select.appendChild(newOpt);
            }
        }
    } else {
        prod_subfilter_select.disabled = true;
        Array.from(prod_subfilter_select.children).forEach((c) => {prod_subfilter_select.removeChild(c)});
        const allOpt = new Option('Não disponível');
        allOpt.value = '1';
        prod_subfilter_select.appendChild(allOpt);
        prod_subfilter_select.parentNode.style.color = 'black';
    }
});

let productsPendencies;

document.querySelector('#creating #createNewProduct #prod_save').addEventListener('click', () => {
    const needs = [
        document.querySelector('#creating #createNewProduct #prod_title'),
        document.querySelector('#creating #createNewProduct #prod_filter'),
        document.querySelector('#creating #createNewProduct #prod_subfilter'),
        document.querySelector('#creating #createNewProduct #prod_price'),
        document.querySelector('#creating #createNewProduct #prod_rel'),
        document.querySelector('#creating #createNewProduct #prod_sellerid')
    ]
    productsPendencies = 0;
    needs.forEach((e) => {
        if(!e.value || e.value == '0') {
            e.parentNode.style.color = 'orange';
            productsPendencies++;
            e.addEventListener('change', () => {
                if(e.value != '0' && e.value) {
                    e.parentNode.style.color = 'black';
                }
            })
        } else {
            e.parentNode.style.color = 'black';
        }
    });

    if(!productsPendencies) {
        alert('Produto criado com sucesso!');

        const newProduct = {
            title: document.querySelector('#creating #createNewProduct #prod_title').value,
            filter: document.querySelector('#creating #createNewProduct #prod_filter').value,
            subfilter: document.querySelector('#creating #createNewProduct #prod_subfilter').value,
            price: document.querySelector('#creating #createNewProduct #prod_price').value,
            rprice: document.querySelector('#creating #createNewProduct #prod_rprice').value,
            rel: document.querySelector('#creating #createNewProduct #prod_rel').value,
            sellerid: document.querySelector('#creating #createNewProduct #prod_sellerid'),
            imglink: document.querySelector('#creating #createNewProduct #prod_imglink').value
        }
        firebase.database().ref('sellers').push(newProduct);
    } else {
        alert('Preencha os campos em laranja antes de enviar.');
    }
});

let sellerPendencies;

document.querySelector('#creating #createNewSeller #seller_save').addEventListener('click', () => {
    const needs = [
        document.querySelector('#creating #createNewSeller #seller_name'),
        document.querySelector('#creating #createNewSeller #seller_locat'),
        document.querySelector('#creating #createNewSeller #seller_dist'),
        document.querySelector('#creating #createNewSeller #seller_rate'),        
        document.querySelector('#creating #createNewSeller #seller_rel')
    ]
    sellerPendencies = 0;
    needs.forEach((e) => {
        if(!e.value || e.value == '0') {
            e.parentNode.style.color = 'orange';
            sellerPendencies++;
            e.addEventListener('change', () => {
                if(e.value != '0' && e.value) {
                    e.parentNode.style.color = 'black';
                }
            })
        } else {
            e.parentNode.style.color = 'black';
        }
    });
    if(!sellerPendencies) {
        alert('Vendedor criado com sucesso!');
        
        let prot_sellerid = document.querySelector('#creating #createNewSeller #seller_name').value.split(' ')[0].toLowerCase();
        let num = 0;
        arr_sellers.forEach(seller => {
            if(!seller) return;
            if(seller.sellerid === prot_sellerid) {
                num++;
            }
        });
        if(num) {prot_sellerid += num};

        const newSeller = {
            name: document.querySelector('#creating #createNewSeller #seller_name').value,
            nick: document.querySelector('#creating #createNewSeller #seller_nick').value,
            desc: document.querySelector('#creating #createNewSeller #seller_desc').value,
            locat: document.querySelector('#creating #createNewSeller #seller_locat').value,
            dist: document.querySelector('#creating #createNewSeller #seller_dist').value,
            rate: document.querySelector('#creating #createNewSeller #seller_rate').value,
            rel: document.querySelector('#creating #createNewSeller #seller_rel').value,
            imglink: document.querySelector('#creating #createNewSeller #seller_imglink').value,
            sellerid: prot_sellerid
        }
        firebase.database().ref('sellers').push(newSeller);
        loadSellers();

        close_createNewSeller(newSeller);
    } else {
        alert('Preencha os campos em laranja antes de enviar.');
    }
});

document.querySelector('#creating #createNewProduct #prod_cancel').addEventListener('click', () => {
    var createNewProduct = document.querySelector('#creating #createNewProduct');
    var formElements = createNewProduct.querySelectorAll('input, select, textarea');
    formElements.forEach(function(element) {
        element.value = element.defaultValue;
    });
    createNewProduct.style.display = 'none';
});

document.querySelector('#creating #createNewSeller #seller_cancel').addEventListener('click', () => {
    var formElements = createNewSeller.querySelectorAll('input, select, textarea');
    formElements.forEach(function(element) {
        element.value = element.defaultValue;
    });

    close_createNewSeller();
});

document.querySelector('#creating #sellerResults #sellerView button.close').addEventListener('click', function() {
    document.querySelector('#creating #sellerResults #sellerView').style.display = 'none';
});

document.querySelector('#creating #sellerResults #sellerView button.delete').addEventListener('click', () => {
    if (!sellerInView) return;
    if(confirm('Deseja mesmo excluir este vendedor?')) {
        firebase.database().ref('sellers').child(sellerInView.key).remove().then(() => {
                loadSellers();
                document.querySelector('#creating #sellerResults #sellerView').style.display = 'none';
        }).catch((error) => {
            console.error(error);
        });
    }
});

//FUNÇÕES DE ATALHO------------------------------------------------------------------------------------------------------------------------

function close_createNewSeller(sellerForView) {
    if(sellerForView) {
        viewSeller(sellerForView);
        sellerView.style.display = '';
    };
    createNewSeller.style.display = 'none';
    sellerView.parentNode.querySelector('table').style.display = '';
    document.querySelector('#creating #btn_createNewSeller').style.display = '';
};

function loadSellers() {
    arr_sellers = [];

    document.querySelectorAll('#creating #sellerZone #sellerResults table td').forEach((e) => {e.remove()});
    console.log('All childs deleted');

    firebase.database().ref('sellers').orderByChild('name').on('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {

            const seller = childSnapshot.val();
            seller.key = childSnapshot.key;

            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.classList.add('name');
            nameCell.innerHTML = seller.name;

            const actCell = document.createElement('td');
            const actCell_btnView = document.createElement('button');
            actCell_btnView.innerHTML = '⚙️';
            actCell_btnView.classList.add('view');
            actCell.appendChild(actCell_btnView);
            actCell.classList.add('act');

            actCell_btnView.addEventListener('click', () => {
                viewSeller(seller);
            })

            row.appendChild(nameCell);
            row.appendChild(actCell);
            document.querySelector('#creating #sellerZone #sellerResults table tbody').appendChild(row);

            arr_sellers.push(seller);
            document.querySelector('#creating #sellerZone #sellerResults table #sellersCount').innerText = arr_sellers.length;
            console.log('New child added');            
        });
    });

};

function viewSeller(seller) {
    sellerInView = seller;
    sellerView.style.display = '';
    sellerView.querySelector('.sellerid').innerHTML = seller.sellerid;
    sellerView.querySelector('.name').innerHTML = seller.name;
    sellerView.querySelector('.locat').innerHTML = seller.locat;
    sellerView.querySelector('.imglink').href = seller.imglink;
    sellerView.querySelector('.nick').innerHTML = seller.nick;
    sellerView.querySelector('.dist').innerHTML = seller.dist;
    sellerView.querySelector('.rate').innerHTML = seller.rate;
    sellerView.querySelector('.rel').innerHTML = seller.rel;
    sellerView.querySelector('.desc').innerHTML = seller.desc;
};
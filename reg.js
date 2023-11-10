const validation = document.querySelector('#validation');
const select_type = document.querySelector('#select_type');
const result = document.querySelector('#result');
const creating = document.querySelector('#creating');
const sellerView = document.querySelector('#creating #sellerResults #sellerView');
const productView = document.querySelector('#creating #productResults #productView');
const createNewSeller = document.querySelector('#creating #createNewSeller');
const createNewProduct = document.querySelector('#creating #createNewProduct');

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

let arr_products = [], arr_sellers = [], sellerInView, sellerInView_isEdit = false, prodInView, prodInView_isEdit = false;

loadProducts();
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

if(localStorage.getItem('regMode') && sessionStorage.getItem('havePass')) {
    document.querySelector('#type-select').value = localStorage.getItem('regMode');
    typeSelect();
}

document.querySelector('#type-select').addEventListener('change', () => {typeSelect()});

function typeSelect() {
    if(!arr_products.length) {
        setTimeout(function() {typeSelect()}, 1000);
    };

    const ts = document.querySelector('#type-select').value;

    document.querySelector('#creating').style.display = '';
    document.querySelector('#creating #productZone').style.display = 'none';
    document.querySelector('#creating #sellerZone').style.display = 'none';
    document.querySelector('#creating #statsZone').style.display = 'none';
    
    if(ts === 'seller') {
        document.querySelector('#creating #sellerZone').style.display = '';
        localStorage.setItem('regMode', 'seller');
    } 
    else if(ts === 'prod') {
        document.querySelector('#creating #productZone').style.display = '';
        localStorage.setItem('regMode', 'prod');
    }
    else if(ts === 'stats') {
        document.querySelector('#creating #statsZone').style.display = '';
        loadStats();
        localStorage.setItem('regMode', 'stats');
    }
};

document.querySelector('#creating #btn_createNewProduct').addEventListener('click', function() {
    this.style.display = 'none';
    document.querySelector('#creating #createNewProduct').style.display = '';
    document.querySelector('#creating #createNewProduct #products_count').innerText = arr_products.length+1;
    productView.style.display = 'none';
    productView.parentNode.querySelector('table').style.display = 'none';
    document.querySelector('#creating #createNewProduct').style.display = '';
    loadProducts();
    clear_createNewProduct();
});

document.querySelector('#creating #btn_createNewSeller').addEventListener('click', function() {
    this.style.display = 'none';
    document.querySelector('#creating #createNewSeller').style.display = '';
    document.querySelector('#creating #createNewSeller #sellers_count').innerText = arr_sellers.length+1;
    sellerView.style.display = 'none';
    sellerView.parentNode.querySelector('table').style.display = 'none';

    clear_createNewSeller();
});

document.querySelector('#creating #createNewProduct #prod_filter').addEventListener('change', function() {
    if(!this.value) return;
    const prodTypeSelected = this.value;
    const prod_subfilter_select = document.querySelector('#creating #createNewProduct #prod_subfilter');
    Array.from(prod_subfilter_select.children).forEach((c) => {c.remove()});

    obj_prod_filter.forEach((filter) => {
        if(filter.value === prodTypeSelected) {
            if(filter.options) {
                prod_subfilter_select.disabled = false;
                for(i = 0; i < filter.options.length; i++) {
                    const newOpt = new Option(filter.options[i].title);
                    newOpt.value = filter.options[i].value;
                    prod_subfilter_select.appendChild(newOpt);
                }
            } else {
                prod_subfilter_select.disabled = true;
                const allOpt = new Option('Não disponível');
                allOpt.value = '1';
                prod_subfilter_select.appendChild(allOpt);
                prod_subfilter_select.parentNode.style.color = 'black';
            };
        }
    })
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

        let prot_prodid = document.querySelector('#creating #createNewProduct #prod_title').value.split(' ')[0].toLowerCase();
        let num = 0;
        arr_products.forEach(prod => {
            if(!prod) return;
            if(prod.prodid === prot_prodid) {
                num++;
            }
        });
        if(num) {prot_prodid += num};

        const newProduct = {
            title: document.querySelector('#creating #createNewProduct #prod_title').value,
            filter: document.querySelector('#creating #createNewProduct #prod_filter').value,
            subfilter: document.querySelector('#creating #createNewProduct #prod_subfilter').value,
            price: document.querySelector('#creating #createNewProduct #prod_price').value,
            rprice: document.querySelector('#creating #createNewProduct #prod_rprice').value,
            rel: document.querySelector('#creating #createNewProduct #prod_rel').value,
            sellerid: document.querySelector('#creating #createNewProduct #prod_sellerid').value,
            imglink: document.querySelector('#creating #createNewProduct #prod_imglink').value,
            prodid: prot_prodid
        }
        firebase.database().ref('products').push(newProduct);

        firebase.database().ref('products').orderByChild('sellerid').on('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
    
                const product = childSnapshot.val();
                product.key = childSnapshot.key;

                const newProduct = {
                    prodid: product.key
                }

                firebase.database().ref('products/' + product.key).update(newProduct).then(() => {
                    loadProducts();
                }).catch((error) => {
                    console.error(`Erro ao atualizar vendedor: ${error}`);
                });
            })
        });

        close_createNewProduct(newProduct);
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
    close_createNewProduct();
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

document.querySelector('#creating #productResults #productView button.close').addEventListener('click', function() {
    document.querySelector('#creating #productResults #productView').style.display = 'none';
});

document.querySelector('#creating #sellerResults #sellerView button.delete').addEventListener('click', () => {
    if (!sellerInView) return;
    if(confirm('Deseja mesmo excluir este vendedor?')) {
        let prodsCount = 0;
        arr_products.forEach((prod) => {
            if(prod.sellerid === sellerInView.sellerid) {
                prodsCount++;
            }
        });
        if(prodsCount) {
            if(confirm(`Este vendedor tem ${prodsCount} produtos. Todos serão excluídos.\nQUER MESMO DELETAR ESTE VENDEDOR?`)) {
                firebase.database().ref('sellers').child(sellerInView.key).remove().then(() => {
                    loadSellers();
                    document.querySelector('#creating #sellerResults #sellerView').style.display = 'none';
                    document.querySelector('#creating #sellerZone #sellerResults table #sellersCount').innerText = arr_sellers.length;
                }).catch((error) => {
                    console.error(error);
                });
                arr_products.forEach((prod) => {
                    if(prod.sellerid === sellerInView.sellerid) {
                        firebase.database().ref('products').child(prod).remove().then(() => {
                        }).catch((error) => {
                            console.error(error);
                        });
                    }
                })
            }
        } else {
            firebase.database().ref('sellers').child(sellerInView.key).remove().then(() => {
                loadSellers();
                document.querySelector('#creating #sellerResults #sellerView').style.display = 'none';
            }).catch((error) => {
                console.error(error);
            });
            document.querySelector('#creating #sellerZone #sellerResults table #sellersCount').innerText = arr_sellers.length;
        }
        
    }
});

document.querySelector('#creating #productResults #productView button.delete').addEventListener('click', () => {
    if (!prodInView) return;
    if(confirm('Deseja mesmo excluir este produto?')) {
        firebase.database().ref('products').child(prodInView.key).remove().then(() => {
                loadProducts();
                document.querySelector('#creating #productResults #productView').style.display = 'none';
                document.querySelector('#creating #productZone #productResults table #productsCount').innerText = arr_products.length;
        }).catch((error) => {
            console.error(error);
        });
    }
});

document.querySelector('#creating #sellerResults #sellerView button.edit').addEventListener('click', () => {
    sellerInView_isEdit = true;
    sellerView.querySelector('.imglink').innerHTML = sellerInView.imglink;
    sellerView.querySelector('#btns_common').style.display = 'none';
    sellerView.querySelector('#btns_edit').style.display = 'flex';
    sellerView.querySelectorAll('.name, .nick, .desc, .locat, .rate, .rel, .dist, .imglink').forEach((e) => {
        if(e.innerHTML.length < 1) e.innerText = '-x-';
        e.contentEditable = true;
        e.style.borderBottom = '1px solid black';
        e.style.margin = '5px';
        e.style.paddingInline = '5px';
    });
});

document.querySelector('#creating #productResults #productView button.edit').addEventListener('click', () => {
    prodInView_isEdit = true;
    productView.querySelector('.imglink').innerHTML = prodInView.imglink;
    productView.querySelector('.filter').innerHTML = prodInView.filter;
    productView.querySelector('.subfilter').innerHTML = prodInView.subfilter;
    productView.querySelector('.seller').innerHTML = prodInView.sellerid;
    productView.querySelector('#btns_common').style.display = 'none';
    productView.querySelector('#btns_edit').style.display = 'flex';
    productView.querySelectorAll('.title, .rel, .imglink, .price, .rprice, .filter, .subfilter, .seller').forEach((e) => {
        if(e.innerHTML.length < 1) e.innerText = '-x-';
        e.contentEditable = true;
        e.style.borderBottom = '1px solid black';
        e.style.margin = '5px';
        e.style.paddingInline = '5px';
    });
});

document.querySelector('#creating #sellerResults #sellerView button.save').addEventListener('click', () => {

    const newSeller = {
        name: sellerView.querySelector('.name').innerHTML,
        nick: sellerView.querySelector('.nick').innerHTML,
        locat: sellerView.querySelector('.locat').innerHTML,
        dist: sellerView.querySelector('.dist').innerHTML,
        rel: sellerView.querySelector('.rel').innerHTML,
        rate: sellerView.querySelector('.rate').innerHTML,
        desc: sellerView.querySelector('.desc').innerHTML,
        imglink: sellerView.querySelector('.imglink').innerHTML,
        sellerid: sellerView.querySelector('.sellerid').innerHTML,
    }

    firebase.database().ref('sellers/' + sellerInView.key).update(newSeller).then(() => {
        close_editSeller();
        loadSellers();
        viewSeller(newSeller);
    }).catch((error) => {
        console.error(`Erro ao atualizar vendedor: ${error}`);
    });
});
document.querySelector('#creating #productResults #productView button.save').addEventListener('click', () => {

    const newProduct = {
        title: productView.querySelector('.title').innerHTML,
        imglink: productView.querySelector('.imglink').innerHTML,
        price: productView.querySelector('.price').innerHTML,
        rprice: productView.querySelector('.rprice').innerHTML,
        rel: productView.querySelector('.rel').innerHTML,
        filter: productView.querySelector('.filter').innerHTML,
        subfilter: productView.querySelector('.subfilter').innerHTML,
        sellerid: productView.querySelector('.seller').innerHTML
    }

    firebase.database().ref('products/' + prodInView.key).update(newProduct).then(() => {
        close_editProd();
        alert('Produto atualizado com sucesso.');
        productView.style.display = 'none';
        loadProducts();
    }).catch((error) => {
        console.error(`Erro ao atualizar vendedor: ${error}`);
    });
})

document.querySelector('#creating #sellerResults #sellerView button.discard').addEventListener('click', () => {
    close_editSeller();
    viewSeller(sellerInView);
});
document.querySelector('#creating #productResults #productView button.discard').addEventListener('click', () => {
    close_editProd();
    viewProd(prodInView);
});

//FUNÇÕES DE ATALHO - SELLER------------------------------------------------------------------------------------------------------------------------

function close_createNewSeller(sellerForView) {
    if(sellerForView) {
        viewSeller(sellerForView);
        sellerView.style.display = '';
    };
    createNewSeller.style.display = 'none';
    sellerView.parentNode.querySelector('table').style.display = '';
    document.querySelector('#creating #btn_createNewSeller').style.display = '';
};
function clear_createNewSeller() {
    var formElements = createNewSeller.querySelectorAll('input, select, textarea');
    formElements.forEach(function(element) {
        element.value = element.defaultValue;
    });
};

function loadSellers() {
    arr_sellers = [];
    document.querySelectorAll('#creating #sellerZone #sellerResults table td').forEach((e) => {e.remove()});

    firebase.database().ref('sellers').orderByChild('name').on('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {

            const seller = childSnapshot.val();
            seller.key = childSnapshot.key;

            const row = document.createElement('tr');

            const imgCell = document.createElement('td');
            imgCell.classList.add('img');
            const imgCell_img = document.createElement('img');
            imgCell.appendChild(imgCell_img);
            imgCell_img.src = seller.imglink;
            imgCell_img.style = 'max-height: 50px';

            let psCount = 0;
            arr_products.forEach(prod => {
                if(prod.sellerid == seller.sellerid) {
                    psCount++;
                }
            });
            
            const nameCell = document.createElement('td');
            nameCell.classList.add('name');
            nameCell.innerHTML = `${seller.name}<br>(${psCount > 0 ? `${psCount} produtos` : `<span style="color: red">${psCount} produtos</span>`})`;

            const actCell = document.createElement('td');
            const actCell_btnView = document.createElement('button');
            actCell_btnView.innerHTML = 'Ver';
            actCell_btnView.classList.add('view');
            actCell.appendChild(actCell_btnView);
            actCell.classList.add('act');

            actCell_btnView.addEventListener('click', () => {
                viewSeller(seller);
            })

            row.appendChild(imgCell);
            row.appendChild(nameCell);
            row.appendChild(actCell);
            document.querySelector('#creating #sellerZone #sellerResults table tbody').appendChild(row);

            arr_sellers.push(seller);
            document.querySelector('#creating #sellerZone #sellerResults table #sellersCount').innerText = arr_sellers.length;
        });
    });

};

function close_editSeller() {
    sellerInView_isEdit = false;
    sellerView.querySelector('.imglink').innerHTML = 'Clique para abrir';
    sellerView.querySelector('.imglink').href = sellerInView.imglink;
    sellerView.querySelector('#btns_common').style.display = 'flex';
    sellerView.querySelector('#btns_edit').style.display = 'none';

    sellerView.querySelectorAll('span, a').forEach((e) => {
        e.contentEditable = false;
        e.style.borderBottom = 'none';
        e.style.margin = '0';
        e.style.paddingInline = '0';
    })
};

function viewSeller(seller) {
    document.querySelector('main #middle #creating').scrollTop = 0;
    if (sellerInView_isEdit) {
        close_editSeller();
        return;
    }
    sellerInView = seller;
    
    sellerView.style.display = '';
    sellerView.querySelector('.sellerid').innerHTML = seller.sellerid;
    sellerView.querySelector('.name').innerHTML = seller.name;
    sellerView.querySelector('.locat').innerHTML = seller.locat;
    sellerView.querySelector('.imglink').href = seller.imglink;
    sellerView.querySelector('.imglink_preview').src = seller.imglink;
    sellerView.querySelector('.nick').innerHTML = seller.nick;
    sellerView.querySelector('.dist').innerHTML = seller.dist;
    sellerView.querySelector('.rate').innerHTML = seller.rate;
    sellerView.querySelector('.rel').innerHTML = seller.rel;
    sellerView.querySelector('.desc').innerHTML = seller.desc;

    sellerView.style.backgroundColor = 'lightgrey';
    setTimeout(() => {
        sellerView.style.backgroundColor = 'rgb(230, 230, 230)';
    }, 500)
};

//FUNÇÕES DE ATALHO - PRODUCT------------------------------------------------------------------------------------------------------------------

function close_createNewProduct(productForView) {
    if(productForView) {
        viewProd(productForView);
        productView.style.display = '';
    };
    createNewProduct.style.display = 'none';
    productView.parentNode.querySelector('table').style.display = '';
    document.querySelector('#creating #btn_createNewProduct').style.display = '';
};
function clear_createNewProduct() {
    var formElements = createNewProduct.querySelectorAll('input, select, textarea');
    formElements.forEach(function(element) {
        element.value = element.defaultValue;
    });

    Array.from(document.querySelector('#creating #createNewProduct #prod_sellerid').children).forEach((e) => {e.remove()});
    document.querySelector('#creating #createNewProduct #prod_sellerid').appendChild(document.createElement('option'));

    arr_sellers.forEach((s) => {
        let prodsCount = 0;
        arr_products.forEach((prod) => {
            if(prod.sellerid === s.sellerid) {
                prodsCount++;
            }
        });
        const opt = document.createElement('option');
        opt.value = s.sellerid;
        opt.innerHTML = `${s.name} (${prodsCount})`;
        document.querySelector('#creating #createNewProduct #prod_sellerid').appendChild(opt);
    });
};

function loadProducts() {
    arr_products = [];
    document.querySelectorAll('#creating #productZone #productResults table td').forEach((e) => {e.remove()});

    firebase.database().ref('products').orderByChild('sellerid').on('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {

            const product = childSnapshot.val();
            product.key = childSnapshot.key;

            const row = document.createElement('tr');

            const imgCell = document.createElement('td');
            imgCell.classList.add('img');
            const imgCell_img = document.createElement('img');
            imgCell.appendChild(imgCell_img);
            imgCell_img.src = product.imglink;
            imgCell_img.style = 'max-height: 50px';

            const titleCell = document.createElement('td');
            titleCell.classList.add('title');
            titleCell.innerHTML = product.title;

            const sellerCell = document.createElement('td');
            sellerCell.classList.add('title');
            sellerCell.innerHTML = product.sellerid;

            const actCell = document.createElement('td');
            const actCell_btnView = document.createElement('button');
            actCell_btnView.innerHTML = 'Ver';
            actCell_btnView.classList.add('view');
            actCell.appendChild(actCell_btnView);
            actCell.classList.add('act');

            actCell_btnView.addEventListener('click', () => {
                viewProd(product);
            });

            row.appendChild(imgCell);
            row.appendChild(titleCell);
            row.appendChild(sellerCell);
            row.appendChild(actCell);
            document.querySelector('#creating #productZone #productResults table tbody').appendChild(row);

            arr_products.push(product);
            document.querySelector('#creating #productZone #productResults table #productsCount').innerText = arr_products.length;
        });
    });

};

function close_editProd() {
    prodInView_isEdit = false;
    productView.querySelector('.imglink').innerHTML = 'Clique para abrir';
    productView.querySelector('.imglink').href = prodInView.imglink;
    productView.querySelector('#btns_common').style.display = 'flex';
    productView.querySelector('#btns_edit').style.display = 'none';

    productView.querySelectorAll('span, a').forEach((e) => {
        e.contentEditable = false;
        e.style.borderBottom = 'none';
        e.style.margin = '0';
        e.style.paddingInline = '0';
    });
};

function viewProd(prod) {
    document.querySelector('main #middle #creating').scrollTop = 0;
    if (prodInView_isEdit) {
        close_editProd();
        return;
    }
    prodInView = prod;
    
    let prod_sellerName;
    arr_sellers.forEach((seller) => {
        if(seller.sellerid === prod.sellerid) {
            prod_sellerName = seller.name;
        }
    });

    let prod_filterName;
    obj_prod_filter.forEach((filter) => {
        if(filter.value == prod.filter) {
            prod_filterName = filter.title;
        }
    });

    let prod_subfilterName = 'Não há';
    obj_prod_filter.forEach((filter) => {
        if(filter.options) {
            filter.options.forEach((subfilter) => {
                if (subfilter.value === prod.subfilter) {
                    prod_subfilterName = subfilter.title;
                }
            })
        }
    });

    productView.style.display = '';
    productView.querySelector('.seller').innerHTML = prod_sellerName;
    productView.querySelector('.prodid').innerHTML = prod.prodid;
    productView.querySelector('.title').innerHTML = prod.title;
    productView.querySelector('.imglink').href = prod.imglink;
    productView.querySelector('.imglink_preview').src = prod.imglink;
    productView.querySelector('.filter').innerHTML = prod_filterName;
    productView.querySelector('.subfilter').innerHTML = prod_subfilterName;
    productView.querySelector('.price').innerHTML = prod.price;
    productView.querySelector('.rprice').innerHTML = prod.rprice;
    productView.querySelector('.rel').innerHTML = prod.rel;

    productView.style.backgroundColor = 'lightgrey';
    setTimeout(() => {
        productView.style.backgroundColor = 'rgb(230, 230, 230)';
    }, 500);
};

//FUNÇÕES DE ATALHO - STATS------------------------------------------------------------------------------------------------------------------

function loadStats() {

    let filters = [], subfilters = [];

    arr_products.forEach(p => {
        if(p.filter) {

            let fName;
            obj_prod_filter.forEach(f => {
                if (f.value == p.filter) fName = f.title;
            });

            if(filters[fName]) filters[fName]++
            else filters[fName] = 1;
        }
    })

    let filterStr = '';
    for (const filter in filters) {
        if (filters.hasOwnProperty(filter)) {
          filterStr += `${filter}: ${filters[filter]}<br>`;
        }
    }

    document.querySelector('#statsResults').innerHTML = `
        <b>Informação geral</b>
        Vendedores cadastrados: ${arr_sellers.length}<br>
        Produtos cadastrados: ${arr_products.length}<br><br>

        <b>Produtos por filtro</b>
        ${filterStr}
    `;
}
function setViewportHeight() {
    const windowHeight = window.innerHeight;
    document.querySelector('main').style.setProperty('--vh', `${windowHeight}px`);
    localStorage.setItem('storedVH', `${windowHeight}px`);
};

if (localStorage.getItem('storedVH')) {
    const storedVH = localStorage.getItem('storedVH');
    document.querySelector('main').style.setProperty('--vh', storedVH);
} else {
    window.addEventListener('DOMContentLoaded', setViewportHeight);
};

window.addEventListener('resize', setViewportHeight);

const obj_prod_filter = {
    com: {
        subtitle: "Tipo de comida:",
        options: [
            {value: 'salg_lanch', title: 'Salgados/Lanchinhos'},
            {value: 'alm_jan', title: 'Almoço e janta'},
            {value: 'tipical', title: 'Comida típica'}
        ]
    },
    beb: {
        subtitle: "Tipo de bebida:",
        options: [
            {value: 'sucos', title: 'Sucos'},
            {value: 'vits', title: 'Vitaminas'},
            {value: 'alc', title: 'Com ácool'},
            {value: 'beb_out', title: 'Outros'},
        ]
    },
    doces: {
        subtitle: "Tipo de doce:",
        options: [
            {value: 'doce_comum', title: 'Comum'},
            {value: 'pote', title: 'De pote'},
            {value: 'assar', title: 'Gelado'},
            {value: 'doce_lowcarb', title: 'Poucas calorias'}
        ]
    },
    roupas: {
        subtitle: "Tipo de roupa:",
        options: [
            {value: 'cima', title: 'Parte de cima'},
            {value: 'baixo', title: 'Parte de baixo'},
            {value: 'int', title: 'Íntimas masculinas'},
            {value: 'int', title: 'Íntimas femininas'},
            {value: 'calc', title: 'Calçados'},
        ]
    },
    plantas: {
        subtitle: "Tipo de planta:",
        options: [
            {value: 'dec', title: 'Decoração/Para vaso'},
            {value: 'jard', title: 'Para jardim'},
            {value: 'med', title: 'Medicinais'},
            {value: 'frut', title: 'Árvores frutíferas'},
        ]
    },
    serv: {
        subtitle: "Tipo de serviço:",
        options: [
            {value: 'const', title: 'Construção'},
            {value: 'mov', title: 'Montagem de móveis'},
            {value: 'enc', title: 'Encanamento'},
            {value: 'cost', title: 'Costura'},
            {value: 'serv_out', title: 'Outros'}
        ]
    }
}
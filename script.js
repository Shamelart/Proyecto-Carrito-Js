const tbody = document.querySelector('.tbody');
let carrito = [];

window.onload = function () {
    const storage = JSON.parse(localStorage.getItem('carrito'));
    if (storage) {
        carrito = storage;
        renderCarrito();
    }
    eventoClick();
    
}
//Uso de fetch

const eventoClick = async () => {

    const infoProductos = await fetch('productos.json');
    const infoProductosJson = await infoProductos.json();
    builCard(infoProductosJson);
    let clickbutton = document.querySelectorAll('.button');
    clickbutton.forEach(btn => {
        btn.addEventListener('click', addToCarritoItem);
    });
}

//generando card

const productContainer = document.querySelector('.productContainer');

function builCard(productsArray) {
    productsArray.forEach((element) => {
        const card = document.createElement('div');
        card.classList.add('col');
        card.classList.add('d-flex');
        card.classList.add('justify-content-center');
        card.classList.add('mb-4');
        card.classList.add('my-5');
        card.innerHTML = `
            <div class="card shadow mb-2 rounded" style="width: 20rem;">
                <h5 class="card-title pt-2 text-center text-white">${element.name}</h5>
                <img src=${element.img} class="card-img-top" alt="">
                <div class="body">

                    <p class="card-text text-center text-white description">${element.description}</p>
                    <h5 class="text-light text-center"> <span class="precio">$${element.price}</span></h5>
                    <div class="d-grid gap-2">
                        <button class="btn btn-dark button">Anadir a carrito</button>
                    </div>
                </div>
            </div>
        
    `;

        productContainer.append(card);
    });
}

function addItemCarrito(newItem) {

    const inputElemento = tbody.getElementsByClassName('input__elemento');

    for (let i = 0; i < carrito.length; i++) {

        if (carrito[i].title.trim() === newItem.title.trim()) {
            carrito[i].cantidad++;
            const inputValue = inputElemento[i];
            inputValue.value++;
            carritoTotal();
            return null;
        }

    }

    carrito.push(newItem);
    renderCarrito();

    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Articulo Añadido a Carrito',
        showConfirmButton: false,
        timer: 1500
    });
}

function renderCarrito() {
    tbody.innerHTML = ''
    carrito.map(item => {
        const tr = document.createElement('tr');
        tr.classList.add('itemCarrito');
        const content = `
        <th scope="row">1</th>
                <td class="table__productos">
                <img src=${item.img} alt="">
                <h6 class="title text-light ">${item.title}</h6>
                </td>
                <td class="table__price text-light">${item.precio}</td>
                <td class="table__cantidad">
                <input type="number" min="1" value=${item.cantidad} class="input__elemento">
                <button class="delete btn btn-danger">Borrar</button>  
                </td>
        `
        tr.innerHTML = content;
        tbody.append(tr);

        tr.querySelector(".delete").addEventListener('click', removeItemCarrito);
        tr.querySelector(".input__elemento").addEventListener('onkeyup', cambiarValor);
        tr.querySelector(".input__elemento").addEventListener('input', cambiarValor);
    })
    carritoTotal();
}

function cambiarValor(e){
    const input = e.target;
    const tr = input.closest(".itemCarrito");
    const title = tr.querySelector('.title').textContent;
    for (let i = 0; i < carrito.length; i++) {

        if (carrito[i].title.trim() === title.trim()) {
            carrito[i].cantidad = input.valueAsNumber;
        }
    }
    carritoTotal();
}

function carritoTotal() {
    let total = 0;
    const itemCartTotal = document.querySelector('.itemCartTotal');
    carrito.forEach((item) => {
        const precio = Number(item.precio.replace("$", ''));
        total = total + precio * item.cantidad;
    });

    itemCartTotal.innerHTML = `total $${total}`;
    addLocalStorage();

}

const comprar = document.querySelector('.btn-success');
comprar.addEventListener('click', ()=>{
    
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: '¡Gracias por su Compra!',
        showConfirmButton: false,
        timer: 1500
    });
    localStorage.clear();
    tbody.innerHTML = '';
    const itemCartTotal = document.querySelector('.itemCartTotal');
    itemCartTotal.innerHTML = '';    
});

function removeItemCarrito(e) {
    const buttonDelete = e.target;
    const tr = buttonDelete.closest(".itemCarrito");
    const title = tr.querySelector('.title').textContent;
    for (let i = 0; i < carrito.length; i++) {

        if (carrito[i].title.trim() === title.trim()) {
            carrito.splice(i, 1);
        }
    }
    tr.remove();    
}



function sumaCantidad(e) {
    const sumaInput = e.target;
    const tr = sumaInput.closest(".itemCarrito");
    const title = tr.querySelector('.title').textContent;
    carrito.forEach(item => {
        if (item.title() === title) {
            sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value;
            item.cantidad = sumaInput.value;
            carritoTotal();
        }
    });
}

function addLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function addToCarritoItem(e) {
    const button = e.target;
    const item = button.closest('.card');
    const itemTitle = item.querySelector('.card-title').textContent;
    const itemPrice = item.querySelector('.precio').textContent;
    const itemImg = item.querySelector('.card-img-top').src;


    const newItem = {
        title: itemTitle,
        precio: itemPrice,
        img: itemImg,
        cantidad: 1
    }

    addItemCarrito(newItem);
}



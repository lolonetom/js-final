const cards =document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}


document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        crearCarrito()
    }
})
cards.addEventListener('click', e => {
    addCarrito(e)
    //ALERTA CUANDO SE AGREGA UN ARTICULO
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 800,
        timerProgressBar: true,
        didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    Toast.fire({
        icon: 'success',
        title: 'Agregado al carrito'
    })
})

items.addEventListener('click', e =>{
    btnAccion(e)
})

//OBTENER PRODUCTOS DESDE JSON LOCAL//
const fetchData = async () => {
    try{
        const res = await fetch('./data/productos.json');
        const data = await res.json();
        /* console.log(data); */
        crearCards(data)
    }catch (error){
        console.log(error);
    }
}

const crearCards = data => {
    data.forEach(cards => {
        templateCard.querySelector('h4').textContent = cards.nombre
        templateCard.querySelector('p').textContent = cards.precio
        templateCard.querySelector('img').setAttribute("src", cards.imagen)
        templateCard.querySelector('.btn-primary').dataset.id = cards.id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addCarrito = e => {
    //console.log(e.target);
    //console.log(e.target.classList.contains('btn-primary'));
    if(e.target.classList.contains('btn-primary')){
        //console.log(e.target.parentElement)
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    const itemCarrito = {
        id: objeto.querySelector('.btn-primary').dataset.id,
        nombre: objeto.querySelector('h4').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }

    if(carrito.hasOwnProperty(itemCarrito.id)){
        itemCarrito.cantidad = carrito[itemCarrito.id].cantidad + 1
    }

    carrito[itemCarrito.id] ={...itemCarrito}
    crearCarrito()
}

const crearCarrito = () =>{
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment) 

    crearFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const crearFooter = () =>{
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = '<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>'
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0 )
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent =nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Carrito eliminado',
            showConfirmButton: false,
            timer: 1500
        })

        carrito = {}
        crearCarrito()
    })
}

const btnAccion = e =>{
    if(e.target.classList.contains('btn-info')){
        /* carrito[e.target.dataset.id] */
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        crearCarrito()
    }
    
    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        crearCarrito()
    }

    e.stopPropagation()
}
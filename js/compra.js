const cardContainer = document.getElementById('cards');
const carro = new Carrito();
const carrito = document.getElementById('carrito');
const items = document.querySelector('#lista-productos')
const listaCompra = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('boton__vaciar');

main();

function main(){
    //Se ejecuta cuando se presionar agregar carrito
    items.addEventListener('click', (e)=>{carro.aniadirProductos(e)});

    //Cuando se elimina productos del carrito
    carrito.addEventListener('click', (e)=>{carro.eliminarProducto(e)});

    //Al vaciar carrito
    vaciarCarritoBtn.addEventListener('click', (e)=>{carro.vaciarCarrito(e)});

    //Al cargar documento se muestra lo almacenado en LS
    document.addEventListener('DOMContentLoaded', carro.leerLocalStorage());

    //Enviar pedido a otra pagina
    procesarPedidoBtn.addEventListener('click', (e)=>{carro.procesarPedido(e)});
}
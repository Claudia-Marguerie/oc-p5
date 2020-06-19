const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const ajax = new Ajax();
const orderData = params.get('orderId');
const orderData2 = params.get('orderPrice');

function displayOrderData(){ // Function pour afficher en HTML le prix et le numéro de commande
    document.querySelector('.data-command p.panier-total').textContent = new Intl.NumberFormat().format(orderData2) + ' €'; // on indique l'emplacement pour le prix
    document.querySelector('.data-command p.order-number').textContent = orderData; // on indique l'emplacement pour le numéro de commande
}

displayOrderData()

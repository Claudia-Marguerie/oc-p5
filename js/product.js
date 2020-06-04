const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const ajax = new Ajax()
const productId = params.get('id')

function displayProduct(product){
    document.querySelector('title').textContent = product.name
    document.querySelector('.menu p.menu-item').textContent = product.name
    document.querySelector('#product-name').textContent = product.name
    document.querySelector('#product-image').setAttribute('src', product.imageUrl)
    document.querySelector('#product-price').textContent = product.price + ' €'
    document.querySelector('#product-description p').textContent = product.description
    document.querySelector('#add-cart').addEventListener('click', () => {
        addToCart(product)
    })
}

function displayProductOptions(product){ 
    const listOptions = document.querySelector('#option-lentille'); 
    for(let i = 0; i < product.lenses.length; i++){ 
        const optionItem = document.createElement('option'); 
        optionItem.innerHTML = '<option id="option-lentille" value="">' + product.lenses[i] +'</option>' 
        listOptions.appendChild(optionItem); 
    }
}




function addToCart(product){
    let storedCartContent = 0;
    storedCartContent = sessionStorage.getItem('storedCartContent');
    const quantity = 1; 
    const updatedStoredCartContent = storedCartContent + quantity;
    sessionStorage.setItem ('storedCartContent', updatedStoredCartContent)
    document.querySelector('#cart-item-quantity').textContent = updatedStoredCartContent
}

// function clickCounter(addToCart){
//     if (typeof (Storage) !== "undefined") {
//         if (sessionStorage.clickcount) {
//             sessionStorage.clickcount = Number (sessionStorage.clickcount) + 1 {
//             } else {
//                 sessionStorage.clickcount = 1;
//             }
//             document.getElementById("#cart-item-quantity").innerHTML = sessionStorage.clickcount;
//         }
//     }
// }


// function cartInit(){
//     let storedCartContent = new Number (0);
//     sessionStorage.clear();
//     sessionStorage.setItem('storedCartContent', storedCartContent);
    
// }



// function saveCart(){
//     sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
// }

// function itemCart(name, price, count) {
//     this.name = name;
//     this.price = price;
//     this.count = count;
// }




// function displayProduct(product){
//     document.querySelector('#product-name').textContent = product.name
//     document.querySelector('#product-image').setAttribute('src', product.imageUrl)
//     document.querySelector('#product-price').textContent = product.price + '€'
//     document.querySelector('#add-cart').addEventListener('click', () => {
//         addToCart(product)
//     })
// }

ajax.get('http://localhost:3000/api/cameras/' + productId).then((product) => {
    displayProduct(product)
    displayProductOptions(product)
    cartInit()
})
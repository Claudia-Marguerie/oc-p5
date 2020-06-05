const ajax = new Ajax()


function displayCartNumber() {
    let cartContent = localStorage.getItem('storedCartContent')
    if (cartContent == null){
        cartContent = []
    } else {
        cartContent = JSON.parse(cartContent)
    }
    document.querySelector('#cart-item-quantity').textContent = cartContent.length
}

displayCartNumber()

ajax.get('http://localhost:3000/api/cameras/' + productId).then((product) => {
    // displayProduct(product)
    
})
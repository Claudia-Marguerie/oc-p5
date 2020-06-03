const ajax = new Ajax()




ajax.get('http://localhost:3000/api/cameras/' + productId).then((product) => {
    displayProduct(product)
})
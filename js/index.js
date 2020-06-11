const ajax = new Ajax()

function separateThousands(nb) { // Function pour séparer les milliers des chiffres
    let nbs = nb.toString(); // on convertit en string
    let sepNb = ''; // on crée une string vide
    let longNb = nbs.length; // on calcule le nombre des chiffres dans le nombre initial
    for(i=0; i<longNb; i++){ // pour tous les chiffres du nombre initial
        sepNb = sepNb + nbs[i]; // on tranfère le chiffre i du nombre initial vers la nouvelle string
        let chiffresRestants = longNb - (i + 1); // on calcule le nombre de chiffres restants à transfèrer
        if (((chiffresRestants % 3) == 0) && (chiffresRestants > 0)){ // si le nombre de chiffre à tranfèrer est multiple de 3 et qui resente encore des chiffres à transferer 
            sepNb = sepNb + ' '; // on ajoute un space
        }     
    }
    return sepNb; // on sort une string
}

function displayProduct(product){
    const listProduct = document.querySelector('#list-products');
    const productListItem = document.createElement('li');
    productListItem.innerHTML = '<div class="product-item">'+'<a href="product.html?id='+ product._id +'"><img src="' + product.imageUrl + '"alt=""></a>' +
    '<div class="product-name-price">'+'<a href="product.html?id='+ product._id +'">' + '<h3 class= "product-name">' + product.name + '</h3>'+
    '<p class="product-price">'+ separateThousands(product.price) + ' €</p>'+ '</a>'+'</div>'+'</div>'
    listProduct.appendChild(productListItem);
}

function displayTextEnd(){
    const listProduct = document.querySelector('#list-products');
    const textBoxEnd = document.createElement('div');
    textBoxEnd.innerHTML = '<div class="text-end"><p>Nos meilleures sélections sont présentées ici chaque semaine !</p></div>'
    listProduct.appendChild(textBoxEnd);
}

function displayCartNumber() {
    let cartContent = localStorage.getItem('storedCartContent')
    if (cartContent == null){
        cartContent = []
    } else {
        cartContent = JSON.parse(cartContent)
    }
    document.querySelector('#cart-item-quantity').textContent = cartContent.length
}


ajax.get('http://localhost:3000/api/cameras').then((products) => {
    for(let i = 0; i < products.length; i++){
        displayProduct(products[i])
    }
    displayCartNumber()
    displayTextEnd()
}, (err) => {
    console.log(err)
})
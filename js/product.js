const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const ajax = new Ajax()
const productId = params.get('id')

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
    document.querySelector('title').textContent = product.name
    document.querySelector('.menu p.menu-item').textContent = product.name
    document.querySelector('#product-name').textContent = product.name
    document.querySelector('#product-image').setAttribute('src', product.imageUrl)
    document.querySelector('#product-price').textContent = separateThousands(product.price) + ' €'
    document.querySelector('#product-description p').textContent = product.description
    document.querySelector('#add-cart').addEventListener('click', () => {
        addToCart(product)
    })
    displayCartNumber()
}

function displayProductOptions(product){ 
    const listOptions = document.querySelector('#option-lentille'); 
    for(let i = 0; i < product.lenses.length; i++){ 
        const optionItem = document.createElement('option'); 
        optionItem.setAttribute("value", product.lenses[i])
        optionItem.innerHTML = product.lenses[i] 
        listOptions.appendChild(optionItem); 
    }
}

function addToCart(product){
    let cartContent = localStorage.getItem('storedCartContent')
    if (cartContent == null){
        cartContent = []
    } else {
        cartContent = JSON.parse(cartContent)
    }
    cartContent.push({
        id: product._id, lense: document.querySelector("#option-lentille").value
    })
    // console.log(cartContent)
    localStorage.setItem("storedCartContent", JSON.stringify(cartContent))
    document.querySelector('#cart-item-quantity').textContent = cartContent.length
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


ajax.get('http://localhost:3000/api/cameras/' + productId).then((product) => {
    displayProduct(product)
    displayProductOptions(product)
 //   sessionStorage.clear();
    cartInit()
})
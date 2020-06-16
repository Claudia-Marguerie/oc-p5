const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const ajax = new Ajax();
const orderData = params.get('orderId');
const orderData2 = params.get('orderPrice');

function displayOrderData(){ // Function pour afficher en HTML le prix et le numéro de commande
    document.querySelector('.data-command p.panier-total').textContent = separateThousands(orderData2) + ' €'; // on indique l'emplacement pour le prix
    document.querySelector('.data-command p.order-number').textContent = orderData; // on indique l'emplacement pour le numéro de commande
}


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

displayOrderData()

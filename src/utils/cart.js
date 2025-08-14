

export function getCart(){

    let cart = localStorage.getItem("cart")
    cart = JSON.parse(cart)
    if(cart == null){
        cart = []
        localStorage.setItem("cart", JSON.stringify(cart))
      
    }
      return cart   
}


export function removeFromCart(product_id) {
    let cart = getCart();

    const newCart = cart.filter(
        (item)=>{
            return item.product_id != product_id;
        }
    )

    localStorage.setItem("cart", JSON.stringify(newCart));
}

export function addToCart(product, qty) {
	let cart = getCart();

	let index = cart.findIndex((item) => {
		return item.product_id == product.product_id;
	});

    if(index == -1){
        cart[cart.length] = {
            product_id : product.product_id,
            productname : product.productname,
            image : product.images[0],
            price : product.price,
            labelledPrice : product.labelledPrice,
            qty : qty
        }
    }else{
        const newQty = cart[index].qty + qty;
        if(newQty<=0){
            removeFromCart(product.product_id);
            return;
        }else{
            cart[index].qty = newQty;
        }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
}

export function getTotal(){
    let cart = getCart();

    let total = 0;

    for(let i=0;i<cart.length;i++){
        total += cart[i].price * cart[i].qty;
    }
    return total;
}
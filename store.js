// the youtube tutorial that was used to help create this project was https://www.youtube.com/watch?v=B20Getj_Zk4&list=RDCMUCADAkBGiLWIPkCu8D1R1M6g&index=5
let carts = document.querySelectorAll('.add-to-cart')

let products = [{
		name: 'Tory Burch',
		tag: 'tory_burch',
		price: 360,
		inCart: 0

	},
	{
		name: 'Baglism backpack',
		tag: 'baglism_backpack',
		price: 240,
		inCart: 0

	},
	{
		name: 'Burberry ',
		tag: 'burr_berry',
		price: 250,
		inCart: 0

	},
	{
		name: 'Baglism Jansport',
		tag: 'baglism_jansport',
		price: 650,
		inCart: 0

	},
	{
		name: 'Baglism pack',
		tag: 'baglism_pack',
		price: 122,
		inCart: 0

	}

];
// -----------------------------------------------------------------------------------------------------------
// this code collects all the add to cart buttons form the index.html page and passes down to cartNumbers
for (let i = 0; i < carts.length; i++) {
	carts[i].addEventListener('click', () => {
		cartNumbers(products[i]);
		totalCost(products[i]);


	})
}
// The function makes sure that the numbers of cart items are the same when the user closees the window or refreshes
function onLoadCartNumbers() {

	let productNumbers = localStorage.getItem('cartNumbers');

	if (productNumbers) {
		document.querySelector('.access span').textContent = productNumbers
	}

}
// -----------------------------------------------------------------------------------------------------------

//This function accpets an argument then adds selected cart items to local storage 
function cartNumbers(product) {


	let productNumbers = localStorage.getItem('cartNumbers')

	productNumbers = parseInt(productNumbers);

	// this checks if the there is a key value in localstorage
	if (productNumbers) {
		localStorage.setItem('cartNumbers', productNumbers + 1)
		document.querySelector('.access span').textContent = productNumbers + 1;
	} else {
		localStorage.setItem('cartNumbers', 1)
		document.querySelector('.access span').textContent = 1;
	}
	setItems(product)

}
// -----------------------------------------------------------------------------------------------------------

// this function gets the details of the cart items that have been selected and places it in localstorage
function setItems(product) {
	 let cartItems = localStorage.getItem('productsInCart');
	cartItems = JSON.parse(cartItems);
	
	// increments incart number to match the times the user clicks on a specific cart 
	if (cartItems != null) {

		if (cartItems[product.tag] === undefined) {
			cartItems = {
				...cartItems,
				[product.tag]: product
			}
		}
			cartItems[product.tag].inCart += 1;
	} else {
			product.inCart = 1;
			cartItems = {
				[product.tag]: product
			}
		}

	

	localStorage.setItem("productsInCart", JSON.stringify(cartItems));

}
// onLoadCartNumbers()
// -----------------------------------------------------------------------------------------------------------


// This function calculates and saves the sum of all items selected in localstorage
function totalCost(product) {

	let cartCost = localStorage.getItem('totalCost');
	let vatPrice = Math.floor(product.price + ((15 / 100) * product.price));

	if (cartCost != null) {

		cartCost = parseInt(cartCost);
		localStorage.setItem('totalCost', cartCost + vatPrice);
	} else {

		localStorage.setItem('totalCost', vatPrice);
	}

}
// -----------------------------------------------------------------------------------------------------------
// this function updates the total cost depending on which delivery option is selected
function updateTotalCost() {

	let cartCost = localStorage.getItem('totalCost');
	let inputs = document.getElementsByName("optionsRadiosinline");
	let dilivOp = localStorage.getItem('dilivery');


	for (var i = 0; i < inputs.length; i++) {

		if (inputs[i].checked) {
			let selected = inputs[i].value;

			switch (cartCost != null) {

				case selected === '2':


					if (dilivOp === 'true') {

						localStorage.setItem('totalCost', cartCost);
						displayCart();
					} else {

						cartCost = parseInt(cartCost);
						localStorage.setItem('totalCost', cartCost + 120);
						localStorage.setItem('dilivery', true);
						displayCart();
					}

					break

				case selected === '1':

					if (dilivOp === 'true') {
						cartCost = parseInt(cartCost);
						localStorage.setItem('totalCost', cartCost - 120);
						localStorage.setItem('dilivery', false);
						displayCart();
					} else {
						localStorage.setItem('totalCost', cartCost);
						displayCart();
					}

					break
			}
		}

	}

}

function couponDis() {
	let disCode = document.getElementById('discountCode').value;

	let coupCode = localStorage.getItem('discount-coupon');


	if (!isNaN(disCode) && coupCode === null) {
		let cartCost = localStorage.getItem('totalCost');
		let disCost = Math.floor(cartCost - ((20 / 100) * cartCost));

		localStorage.setItem('totalCost', disCost);
		localStorage.setItem('discount-coupon', true);
		alert('You have recieved a 20% discount');
		displayCart()
	} else if (coupCode === 'true') {
		alert('One coupon per customer...sorry');
		window.location.reload(true)
	} else {
		alert('Not valid coupon code... try another');
		window.location.reload(true)
	}


}

// -----------------------------------------------------------------------------------------------------------

// Removes cart items from cart pages aswell as in local storage
$('#products-container').on('click', '.remove', function () {
	let tag = $(this).attr("cart-name");
	clearCart(tag);
	displayCart();
	onLoadCartNumbers();


})

function clearCart(tag) {
	let cartCost = JSON.parse(localStorage.totalCost);
	let cartNum = JSON.parse(localStorage.cartNumbers);
	let cart = JSON.parse(localStorage.productsInCart);
	let filteredCart = Object.entries(cart);


	for (let i in filteredCart) {

		if (filteredCart[i].includes(tag)) {
			let dltItemPrice = JSON.parse(filteredCart[i][1].price);
			let dltItemIncart = JSON.parse(filteredCart[i][1].inCart);
			let vatPrice = dltItemIncart * Math.floor(dltItemPrice + ((15 / 100) * dltItemPrice));

			let subTot = cartCost - vatPrice;

			cartNum = cartNum - dltItemIncart;

			filteredCart.splice(i, 1);

			function reducer(acc, cur) {
				return {
					...acc,
					[cur[0]]: cur[1]
				}
			}
			let leftOvaItems = filteredCart.reduce(reducer, {});

			localStorage.productsInCart = JSON.stringify(leftOvaItems);
			localStorage.cartNumbers = JSON.stringify(cartNum);
			localStorage.totalCost = subTot
		}

	}

}


// ------------------------------------------------------------------------------------------------------------
// subtracting or adding the quantity to cart
$('#products-container').on('click', '.minus', function () {
	let val = true;
	let tag = $(this).attr("cart-name");
	quant(tag, val);
	displayCart();
	onLoadCartNumbers();
})
$('#products-container').on('click', '.add', function () {

	let val = false;
	let tag = $(this).attr("cart-name");

	quant(tag, val);
	displayCart();
	onLoadCartNumbers();
})

function quant(tag, val) {
	let cartCost = JSON.parse(localStorage.totalCost);
	let cart = JSON.parse(localStorage.productsInCart);
	let cartNum = JSON.parse(localStorage.cartNumbers);
	let filteredCart = Object.entries(cart);

	for (let i in filteredCart) {

		if (filteredCart[i].includes(tag) && val === true) {
			let dltItemPrice = JSON.parse(filteredCart[i][1].price);
			let dltItemIncart = JSON.parse(filteredCart[i][1].inCart);
			let minusCart = dltItemIncart - 1;
			let vatPrice = Math.floor(dltItemPrice + ((15 / 100) * dltItemPrice));
			let subTot = cartCost - vatPrice;

			cartNum = cartNum - 1;

			let e = filteredCart[i][0];
			let obj = {
				...filteredCart[i][1],
				inCart: minusCart
			}
			let updatedObj = {
				[e]: obj
			}
			let returnedTarget = Object.assign(cart, updatedObj);
			localStorage.productsInCart = JSON.stringify(returnedTarget);
			localStorage.cartNumbers = JSON.stringify(cartNum);
			localStorage.totalCost = subTot;

		} else if (filteredCart[i].includes(tag) && val === false) {
			let dltItemPrice = JSON.parse(filteredCart[i][1].price);
			let dltItemIncart = JSON.parse(filteredCart[i][1].inCart);
			let minusCart = dltItemIncart + 1;
			let vatPrice = Math.floor(dltItemPrice + ((15 / 100) * dltItemPrice));
			let subTot = cartCost + vatPrice;

			cartNum = cartNum + 1;

			let e = filteredCart[i][0];
			let obj = {
				...filteredCart[i][1],
				inCart: minusCart
			}
			let updatedObj = {
				[e]: obj
			}
			let returnedTarget = Object.assign(cart, updatedObj);
			localStorage.productsInCart = JSON.stringify(returnedTarget);
			localStorage.cartNumbers = JSON.stringify(cartNum);
			localStorage.totalCost = subTot
		}
	}

}

// -----------------------------------------------------------------------------------------------------------

// this function displays the details of the cart content on the Checkout.html page
function displayCart() {
	let cartItems = localStorage.getItem("productsInCart");
	cartItems = JSON.parse(cartItems);
	let cartCost = localStorage.getItem('totalCost');

	let productContainer = document.querySelector('#products');
	if (cartItems && productContainer) {
		productContainer.innerHTML = '';

		Object.values(cartItems).map(item => {
			productContainer.innerHTML +=
				`<div id="product">
					<ion-icon  name="close-circle-outline" cart-name=${item.tag} class="remove" ></ion-icon>
					<img width=100px height=100px src="./img/${item.tag}.jpg">
					<span>${item.name}</span>
			</div>

			<div id="price"> R${item.price}.00</div>

			<div id="quantity"><ion-icon name="arrow-dropleft" class="minus" cart-name=${item.tag}></ion-icon><span>
			${item.inCart}
			</span><ion-icon name="arrow-dropright" class="add" cart-name=${item.tag}></ion-icon></div>
			
			<div id = "total">
				R${item.inCart * Math.floor(item.price + ((15/100)*item.price))}.00
			</div>	
		`
		});
		productContainer.innerHTML += `
		<div class= "basketTotalContainer">
		<div class="input-group mb-3">
		<div class="input-group-prepend">
			<button class="btn btn-outline-secondary" onclick = couponDis() type="button">Submit</button>
		</div>
		<input type="text" class="form-control" id ="discountCode" maxlength="5" placeholder=" Enter 5 digit coupon code" aria-label="" aria-describedby="basic-addon1">
		</div>
		<h4 class="basketTotalTitle">
			Basket Total :
		</h4>
		<h4 class="basketTotal" >
			R${cartCost}.00
		</h4>
		</div>
		`
	}

}
onLoadCartNumbers();
displayCart()

// ---------------------------------------------------------------------------------------------------------------
// jquery animations 
$(document).ready(function () {

	$(".account").click(function () {
		var X = $(this).attr('id');
		if (X == 1) {
			$(".submenu").hide();
			$(this).attr('id', '0');
		} else {
			$(".submenu").show();
			$(this).attr('id', '1');
		}

	});

	//Mouse click on sub menu
	$(".submenu").mouseup(function () {
		return false;
	});

	//Mouse click on my account link
	$(".account").mouseup(function () {
		return false;
	});


	//Document Click
	$(window).on('load', function () {
		$(".submenu").hide();
		$(".account").attr('id', '');
	});
});
//  This function displays the text fields 
function handleClick() {
	var inputs = document.getElementsByName("optionsRadiosinline");
	for (var i = 0; i < inputs.length; i++) {
		if (inputs[i].checked) {
			let selected = inputs[i].value;

			if (selected == '1') {
				document.getElementById("contacts").style.display = 'block';
			} else {
				document.getElementById("contacts").style.display = 'none';
			}
			if (selected == '2') {
				document.getElementById("dilivery").style.display = 'block';
			} else {
				document.getElementById("dilivery").style.display = 'none';
			}
		}
	}
	updateTotalCost();
}

function saveDiliveryDetails() {
	let firstName = document.getElementById("fistName").value;
	let lastName = document.getElementById("secondName").value;
	let address = document.getElementById("address").value;
	let provance = document.getElementById("provance").value;
	let zip = document.getElementById("zip").value;
	let Email = document.getElementById("email").value;

	let saveDiliveyDetailsArr = {
		firstName: firstName,
		lastName: lastName,
		address: address,
		provance: provance,
		zip: zip,
		Email: Email
	}
	for (const key in saveDiliveyDetailsArr) {
		localStorage.setItem("Dilivery Details", JSON.stringify(saveDiliveyDetailsArr));

	}
	alert("Saved")
	document.getElementById("dilivery").style.display = 'none';

}

function saveCollectionDetails() {
	let firstName = document.getElementById("fistName-coll").value;
	let lastName = document.getElementById("secondName-coll").value;
	let Email = document.getElementById("email-coll").value;

	let saveDiliveyDetailsArr = {
		firstName: firstName,
		lastName: lastName,
		Email: Email
	}
	for (const key in saveDiliveyDetailsArr) {
		localStorage.setItem("collection  Details", JSON.stringify(saveDiliveyDetailsArr));

	}
	alert("Saved")
	document.getElementById("contacts").style.display = 'none';

}

function confirmOrder() {
	let cartNum = JSON.parse(localStorage.cartNumbers);

	if (cartNum > 0) {
		alert('Your order is successful your reference number is :' + (Math.floor(Math.random() * (999 - 100)) + 100));
	} else if (cartNum === 0) {
		alert('Your cart is empty please fill it up');
	}
}
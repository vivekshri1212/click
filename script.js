// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Sab Add To Cart buttons select karo
const buttons = document.querySelectorAll("button");

buttons.forEach(btn => {
    if(btn.innerText.includes("Add To Cart")){
        btn.addEventListener("click", function(){
            const card = btn.closest("div");
            const name = card.querySelector("h3") 
                        ? card.querySelector("h3").innerText 
                        : "Coffee";
            
            const priceText = card.innerText.match(/\$\d+\.?\d*/);
            const price = priceText ? parseFloat(priceText[0].replace("$","")) : 0;

            addToCart(name, price);
        });
    }
});

// Add to cart function
function addToCart(name, price){
    cart.push({name, price});
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
    alert(name + " added to cart!");
}

// Toggle cart
document.getElementById("cart-btn").addEventListener("click", toggleCart);

function toggleCart(){
    const modal = document.getElementById("cart-modal");
    modal.style.display = modal.style.display === "block" ? "none" : "block";
}

// Update cart UI
function updateCart(){
    const container = document.getElementById("cart-items");
    const totalDiv = document.getElementById("cart-total");

    container.innerHTML = "";
    let total = 0;

    cart.forEach((item,index)=>{
        total += item.price;
        container.innerHTML += `
            <div class="cart-item">
                <span>${item.name} - $${item.price}</span>
                <button onclick="removeItem(${index})">X</button>
            </div>
        `;
    });

    totalDiv.innerText = "Total: $" + total.toFixed(2);
}

// Remove item
function removeItem(index){
    cart.splice(index,1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

// Clear cart
function clearCart(){
    cart = [];
    localStorage.removeItem("cart");
    updateCart();
}

// Load cart on page load
updateCart();

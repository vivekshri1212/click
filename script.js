let cart = JSON.parse(localStorage.getItem("cart")) || [];

const navLinks = document.querySelectorAll('#container_box a[href^="#"]');
const header = document.getElementById("container");
const cartButton = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const searchButton = document.getElementById("search-btn");
const searchPanel = document.getElementById("search-panel");
const searchBox = document.getElementById("search-box");
const saveCartButton = document.getElementById("save-cart-btn");
const cartStatus = document.getElementById("cart-status");
const searchableCards = document.querySelectorAll(
    ".class1, .class2, .class3, .class4, .class_5, .class_6, .product_card"
);

navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();

        const targetId = link.getAttribute("href");
        const targetSection = document.querySelector(targetId);

        if (!targetSection) {
            return;
        }

        const headerOffset = header ? header.offsetHeight + 12 : 0;
        const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerOffset;

        window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
        });
    });
});

document.addEventListener("click", (event) => {
    const addToCartButton = event.target.closest("button");

    if (addToCartButton && addToCartButton.textContent.includes("Add To Cart")) {
        const card = addToCartButton.closest(".class1, .class2, .class3, .class4, .class_5, .class_6, .product_card");

        if (!card) {
            return;
        }

        const title = card.querySelector("h3");
        const priceText = card.textContent.match(/\$\d+(\.\d+)?/);
        const name = title ? title.textContent.trim() : "Coffee";
        const price = priceText ? parseFloat(priceText[0].replace("$", "")) : 0;

        addToCart(name, price);
    }
});

function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
    openCart();
}

cartButton.addEventListener("click", () => {
    searchPanel.classList.remove("active");
    toggleCart();
});

function toggleCart() {
    cartModal.style.display = cartModal.style.display === "block" ? "none" : "block";
}

function openCart() {
    cartModal.style.display = "block";
}

function updateCart() {
    const container = document.getElementById("cart-items");
    const totalDiv = document.getElementById("cart-total");

    container.innerHTML = "";
    cartStatus.textContent = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        container.innerHTML += `
            <div class="cart-item">
                <span>${item.name} - $${item.price.toFixed(2)}</span>
                <button onclick="removeItem(${index})">X</button>
            </div>
        `;
    });

    totalDiv.innerText = "Total: $" + total.toFixed(2);
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

function clearCart() {
    cart = [];
    localStorage.removeItem("cart");
    updateCart();
}

saveCartButton.addEventListener("click", async () => {
    if (!cart.length) {
        cartStatus.textContent = "Cart empty hai. Pehle item add karo.";
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartStatus.textContent = "Saving cart...";

    try {
        const response = await fetch("/api/cart/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                items: cart,
                total
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Cart save failed.");
        }

        cartStatus.textContent = `Cart database me save ho gaya. ID: ${data.insertedId}`;
    } catch (error) {
        cartStatus.textContent = `Backend/MongoDB unavailable: ${error.message}`;
    }
});

searchButton.addEventListener("click", () => {
    cartModal.style.display = "none";
    searchPanel.classList.toggle("active");

    if (searchPanel.classList.contains("active")) {
        searchBox.focus();
    }
});

searchBox.addEventListener("input", (event) => {
    const query = event.target.value.trim().toLowerCase();

    searchableCards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        const isMatch = text.includes(query);
        card.classList.toggle("search-hidden", !isMatch);
    });
});

window.addEventListener("click", (event) => {
    const clickedInsideSearch = event.target.closest("#search-panel") || event.target.closest("#search-btn");
    const clickedInsideCart = event.target.closest("#cart-modal") || event.target.closest("#cart-btn");

    if (!clickedInsideSearch) {
        searchPanel.classList.remove("active");
    }

    if (!clickedInsideCart && !event.target.closest("button")) {
        cartModal.style.display = "none";
    }
});

updateCart();

// interactive preordering :3c

const products = [
  {
    id: "sourdough",
    name: "Signature Country Sourdough",
    category: "breads",
    price: 8.00,
    unit: "loaf",
    description: "Fermented for 36 hours for maximum flavor with a crunchy crust.",
    badge: "Bestseller"
  },
  {
    id: "baguette",
    name: "Classic French Baguette",
    category: "breads",
    price: 4.50,
    unit: "loaf",
    description: "Traditional crisp crust with an airy, tender interior baked fresh each morning.",
    badge: "Daily Fresh"
  },
  {
    id: "seeded-rye",
    name: "Seeded Rye Loaf",
    category: "breads",
    price: 7.00,
    unit: "loaf",
    description: "Hearty whole grain rye studded with toasted flax, caraway, and sunflower seeds.",
    badge: null
  },
  {
    id: "rosemary-focaccia",
    name: "Rosemary Focaccia",
    category: "breads",
    price: 6.50,
    unit: "quarter slab",
    description: "Golden olive-oil infused flatbread topped with sea salt and garden rosemary.",
    badge: null
  },
  {
    id: "cranberry-walnut",
    name: "Cranberry Walnut Bread",
    category: "daily",
    price: 7.50,
    unit: "loaf",
    description: "Tangy dried berries and toasted walnuts packed in a rustic artisan loaf.",
    badge: "Seasonal"
  },
  {
    id: "olive-ciabatta",
    name: "Olive and Herb Ciabatta",
    category: "daily",
    price: 6.00,
    unit: "loaf",
    description: "High-hydration Italian loaf studded with Kalamata olives and wild oregano.",
    badge: null
  },
  {
    id: "garlic-brioche",
    name: "Roasted Garlic Brioche",
    category: "daily",
    price: 8.00,
    unit: "braid",
    description: "Rich, buttery crumb laced with slow-roasted caramelized garlic cloves.",
    badge: "Staff Pick"
  },
  {
    id: "spelt-honey",
    name: "Spelt and Honey Pane",
    category: "daily",
    price: 6.75,
    unit: "loaf",
    description: "Ancient whole grain bread naturally sweetened with local wildflower honey.",
    badge: null
  },
  {
    id: "berry-cake",
    name: "Vanilla Bean Berry Cake",
    category: "cakes",
    price: 45.00,
    unit: "6-inch cake",
    description: "Fluffy Madagascar vanilla sponge layered with organic berry compote and buttercream.",
    badge: "Pre-Order"
  },
  {
    id: "chocolate-cake",
    name: "Chocolate Fudge Cake",
    category: "cakes",
    price: 50.00,
    unit: "8-inch cake",
    description: "Decadent dark chocolate sponge filled with velvety chocolate ganache.",
    badge: "Pre-Order"
  },
  {
    id: "custom-cake",
    name: "Custom Celebration Cake",
    category: "cakes",
    price: 120.00,
    unit: "starting price",
    description: "Bespoke tiered cake customized to your party theme, floral styling, and dietary needs.",
    badge: "Custom"
  }
];

const productGrid = document.getElementById("product-grid");
const wishlistItems = document.getElementById("wishlist-items");
const wishlistEmpty = document.getElementById("wishlist-empty");
const wishlistCount = document.getElementById("wishlist-count");
const wishlistTotal = document.getElementById("wishlist-total");
const clearButton = document.getElementById("clear-wishlist");

const storageKey = "nsb_preorder_list";

let currentCategory = "all";
let wishlistIds = [];

function saveWishlist() {
  localStorage.setItem(storageKey, JSON.stringify(wishlistIds));
}

function loadWishlist() {
  const saved = localStorage.getItem(storageKey);

  if (saved !== null) {
    wishlistIds = JSON.parse(saved);
  }
}

function getProductById(id) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      return products[i];
    }
  }
}

function getProductsByCategory(category) {
  if (category === "all") {
    return products;
  }

  const matches = [];

  for (let i = 0; i < products.length; i++) {
    if (products[i].category === category) {
      matches.push(products[i]);
    }
  }

  return matches;
}

function createProductCard(product) {
  const badge = product.badge ? `<span class="product-badge">${product.badge}</span>` : "";
  const alreadyAdded = wishlistIds.includes(product.id);
  const buttonLabel = alreadyAdded ? "Added" : "Add to pre-order";
  const buttonClass = alreadyAdded ? "add-button added" : "add-button";

  return `
    <article class="product-card" data-id="${product.id}">
      <h3>${product.name}</h3>
      ${badge}
      <p class="product-price">$${product.price.toFixed(2)} per ${product.unit}</p>
      <p>${product.description}</p>
      <button type="button" class="${buttonClass}" data-id="${product.id}">${buttonLabel}</button>
    </article>
  `;
}

function addToWishlist(id) {
  if (!wishlistIds.includes(id)) {
    wishlistIds.push(id);
  }

  saveWishlist();
  renderProducts();
  renderWishlist();
}

function removeFromWishlist(id) {
  const kept = [];

  for (let i = 0; i < wishlistIds.length; i++) {
    if (wishlistIds[i] !== id) {
      kept.push(wishlistIds[i]);
    }
  }

  wishlistIds = kept;
  saveWishlist();
  renderProducts();
  renderWishlist();
}

function clearWishlist() {
  wishlistIds = [];
  localStorage.removeItem(storageKey);
  renderProducts();
  renderWishlist();
}

// innerHTML wipes the old buttons, so these get hooked up again after every render
function setupAddButtons() {
  const buttons = document.querySelectorAll(".add-button");

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function (event) {
      addToWishlist(event.target.dataset.id);
    });
  }
}

function renderProducts() {
  const visible = getProductsByCategory(currentCategory);
  productGrid.innerHTML = visible.map(product => createProductCard(product)).join("");
  setupAddButtons();
}

function createWishlistItem(product) {
  return `
    <li>
      ${product.name} - $${product.price.toFixed(2)}
      <button type="button" class="remove-button" data-id="${product.id}">Remove</button>
    </li>
  `;
}

function calculateTotal() {
  let total = 0;

  for (let i = 0; i < wishlistIds.length; i++) {
    total = total + getProductById(wishlistIds[i]).price;
  }

  return total;
}

function setupRemoveButtons() {
  const buttons = document.querySelectorAll(".remove-button");

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function (event) {
      removeFromWishlist(event.target.dataset.id);
    });
  }
}

function renderWishlist() {
  const chosen = wishlistIds.map(id => createWishlistItem(getProductById(id)));

  wishlistItems.innerHTML = chosen.join("");
  wishlistCount.textContent = wishlistIds.length;
  wishlistTotal.textContent = "$" + calculateTotal().toFixed(2);
  setupRemoveButtons();

  if (wishlistIds.length === 0) {
    wishlistEmpty.classList.remove("hidden");
  } else {
    wishlistEmpty.classList.add("hidden");
  }
}

function setupCategoryFilters() {
  const buttons = document.querySelectorAll(".filter-button");

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function (event) {
      const clicked = event.target;

      for (let j = 0; j < buttons.length; j++) {
        buttons[j].classList.remove("active");
      }

      clicked.classList.add("active");
      currentCategory = clicked.dataset.category;
      renderProducts();
    });
  }
}

if (productGrid) {
  loadWishlist();
  setupCategoryFilters();
  clearButton.addEventListener("click", clearWishlist);
  renderProducts();
  renderWishlist();
}

const itemDetails = document.getElementById("item-details");

function buildOrderSummary() {
  const lines = [];

  for (let i = 0; i < wishlistIds.length; i++) {
    const product = getProductById(wishlistIds[i]);
    lines.push(product.name + " - $" + product.price.toFixed(2));
  }

  return lines.join("\n");
}

function prefillOrderDetails() {
  loadWishlist();

  if (wishlistIds.length > 0 && itemDetails.value === "") {
    itemDetails.value = buildOrderSummary();
  }
}

if (itemDetails) {
  prefillOrderDetails();
}

const preorderForm = document.getElementById("preorder-form");
const formSuccess = document.getElementById("form-success");
const formFields = ["name", "email", "pickup-date", "request-type", "item-details"];

function showError(inputId, message) {
  const input = document.getElementById(inputId);
  const errorSpan = document.getElementById(inputId + "-error");

  input.classList.add("input-error");
  errorSpan.textContent = message;
}

function clearError(inputId) {
  const input = document.getElementById(inputId);
  const errorSpan = document.getElementById(inputId + "-error");

  input.classList.remove("input-error");
  errorSpan.textContent = "";
}

function clearAllErrors() {
  for (let i = 0; i < formFields.length; i++) {
    clearError(formFields[i]);
  }
}

function validateForm() {
  let isValid = true;

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const pickupDate = document.getElementById("pickup-date").value;
  const requestType = document.getElementById("request-type").value;

  if (name.trim() === "") {
    showError("name", "Please tell us your name.");
    isValid = false;
  }

  if (email.trim() === "") {
    showError("email", "Please enter an email address.");
    isValid = false;
  }

  if (pickupDate === "") {
    showError("pickup-date", "Please choose a pickup date.");
    isValid = false;
  }

  if (requestType === "") {
    showError("request-type", "Please choose a request type.");
    isValid = false;
  }

  if (itemDetails.value.trim() === "") {
    showError("item-details", "Let us know what you would like to order.");
    isValid = false;
  }

  return isValid;
}

if (preorderForm) {
  preorderForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearAllErrors();
    formSuccess.classList.add("hidden");

    if (validateForm()) {
      formSuccess.classList.remove("hidden");
      preorderForm.reset();
    }
  });
}

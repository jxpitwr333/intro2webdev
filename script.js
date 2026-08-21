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

let currentCategory = "all";
let wishlistIds = [];

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

  return `
    <article class="product-card" data-id="${product.id}">
      <h3>${product.name}</h3>
      ${badge}
      <p class="product-price">$${product.price.toFixed(2)} per ${product.unit}</p>
      <p>${product.description}</p>
    </article>
  `;
}

function renderProducts() {
  const visible = getProductsByCategory(currentCategory);
  productGrid.innerHTML = visible.map(product => createProductCard(product)).join("");
}

function createWishlistItem(product) {
  return `<li data-id="${product.id}">${product.name} - $${product.price.toFixed(2)}</li>`;
}

function renderWishlist() {
  const chosen = wishlistIds.map(id => createWishlistItem(getProductById(id)));

  wishlistItems.innerHTML = chosen.join("");
  wishlistCount.textContent = wishlistIds.length;

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
  setupCategoryFilters();
  renderProducts();
  renderWishlist();
}

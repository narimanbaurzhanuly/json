// header
const headerCartBtn = document.querySelector(".header__cart-btn");
const headerCartItems = document.querySelector(".header__cart-items");
let featuredList = document.querySelector(".featured__list");
//products
const listContainer = document.querySelector(".products__list");
const brandsBtns = document.querySelectorAll(".brands__btn");
const range = document.querySelector(".form__range");
const priceValue = document.querySelector(".price__value");
// cart
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartContent = document.querySelector(".cart__content");
const cartCloseBtn = document.querySelector(".cart__close-btn");
const itemAmount = document.querySelector(".cart__item-amount");
const cartTotal = document.querySelector(".cart__total");
const cartCheckoutBtn = document.querySelector(".cart__checkout-btn");

// filter
const formInput = document.querySelector(".form__input");
let cart = [];
let productBtns = [];
let productItemsFilter = [];
let productItemsRange = [];
let productItemsSearch = [];
let featuredItems = [];

class Products {
  async getProducts() {
    try {
      let result = await fetch("/scripts/products.json");
      let result = await fetch(
        "https://raw.githubusercontent.com/narimanbaurzhanuly/Json-file/main/scripts/products.json"
      );
      let data = await result.json();

      let products = data.items;

      products = products.map((item) => {
        const { category, title, price } = item.fields;
        const { id } = item.sys;
        const url = item.fields.image.url;
        return { category, title, price, id, url };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

class DisplayProducts {
  renderList(products) {
    productItemsFilter = products;
    let item = "";

    products.forEach((product) => {
      item += `
            <li  class="products__item" data-id=${product.category}>
                <div class="product">
                    <img class="product__img" alt=${product.title} src=${product.url} />
                 
                            <button class="product__cart-btn" data-id="${product.id}">
                                
                            </button>
                 
                    <p class="product__title">${product.title}</p>
                    <p class="product__price">${product.price}</p>
                </div>
            </li>
            `;
    });
    listContainer.innerHTML = item;
  }

  featuredShow(products) {
    let randomItems = products.sort(() => 0.5 - Math.random()).slice(0, 3);
    let item = "";

    randomItems.forEach((product) => {
      item += `
            <li  class="featured__item" data-id=${product.category}>
                <div class="card">
                    <img class="card__img" alt=${product.title} src=${product.url} />
                 
                    <p class="card__title">${product.title}</p>
                    <p class="card__price">${product.price}</p>
                </div>
            </li>
            `;
    });
    featuredList.innerHTML = item;
  }
  searchLogic() {
    const productCardItems = [...document.querySelectorAll(".product__title")];
    productItemsSearch = productCardItems;

    const value = formInput.value.trim().toLowerCase();

    if (value != "") {
      productItemsSearch.forEach((item) => {
        let title = item.innerText.toLowerCase();
        if (title.search(value) == -1) {
          item.parentElement.parentElement.classList.add(
            "products__item-hidden"
          );
        } else {
          item.parentElement.parentElement.classList.remove(
            "products__item-hidden"
          );
        }
      });
    } else {
      productItemsSearch.forEach((item) => {
        item.parentElement.parentElement.classList.remove(
          "products__item-hidden"
        );
      });
    }
  }

  filterLogic() {
    const productCardItems = [...document.querySelectorAll(".products__item")];
    productItemsFilter = productCardItems;

    brandsBtns.forEach(function (btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const btnCategory = e.currentTarget.dataset.filter;
        formInput.value = "";

        productItemsFilter.forEach((item) => {
          let categoryItem = item.dataset.id;
          item.classList.remove("products__item-hidden");
          if (categoryItem !== btnCategory && btnCategory !== "all") {
            item.classList.add("products__item-hidden");
          }
        });
      });
    });
  }

  rangeLogic() {
    const productPriceItems = [...document.querySelectorAll(".product__price")];
    productItemsRange = productPriceItems;

    productItemsRange.forEach((card) => {
      let cardPrice = +card.innerText;
      formInput.value = "";

      card.parentElement.parentElement.classList.remove(
        "products__item-hidden"
      );
      if (cardPrice >= range.value) {
        card.parentElement.parentElement.classList.add("products__item-hidden");
      }
    });
    priceValue.innerHTML = `Value : $${range.value}`;
  }

  getCartButtons() {
    const productCartBtns = [
      ...document.querySelectorAll(".product__cart-btn"),
    ];
    productBtns = productCartBtns;
    productCartBtns.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      console.log(inCart);
      if (inCart) {
        button.style.backgroundImage = "none";
        button.innerText = "In Cart";
        button.disabled = true;
      }
      button.addEventListener("click", (event) => {
        event.target.style.backgroundImage = "none";
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        let cartItem = { ...Storage.getProduct(id), amount: 1 };

        cart = [...cart, cartItem];
        Storage.saveCart(cart);
        this.setCartValues(cart);
        this.addCartItem(cartItem);
        this.showCart();
      });
    });
  }

  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    headerCartItems.innerText = itemsTotal;
  }

  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart__item");
    div.innerHTML = `
 
              <img
                src=${item.url}
                class="cart__item-img"
                alt=""
              />
              <div>
                <h4 class="cart__item-name">${item.title}</h4>
                <p class="cart__item-price">${item.price}</p>
                <button class="cart__item-remove-btn" data-id=${item.id}>өшіру</button>
              </div>
              <div>
                <button class="cart__item-increase-btn" data-id=${item.id}>
                  <img />
                </button>
                <p class="cart__item-amount" data-id="">${item.amount}</p>
                <button class="cart__item-decrease-btn" data-id=${item.id}>
                  <img />
                </button>
              </div>
             `;
    cartContent.appendChild(div);
  }
  showCart() {
    cartOverlay.classList.add("cart-overlay__show");
    cartDOM.classList.add("cart__show");
  }
  hideCart() {
    cartOverlay.classList.remove("cart-overlay__show");
    cartDOM.classList.remove("cart__show");
  }
  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.settleCart(cart);
    headerCartBtn.addEventListener("click", this.showCart);
    cartCloseBtn.addEventListener("click", this.hideCart);
    formInput.addEventListener("change", this.searchLogic);
    range.addEventListener("change", this.rangeLogic);
  }
  settleCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }

  cartLogic() {
    // Checkout
    cartCheckoutBtn.addEventListener("click", () => {
      console.log(`Total: $${cartTotal.innerText}`);
    });

    // Cart functionality
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("cart__item-remove-btn")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);
      } else if (event.target.classList.contains("cart__item-increase-btn")) {
        let increaseAmount = event.target;
        let id = increaseAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        increaseAmount.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains("cart__item-decrease-btn")) {
        let decreaseAmount = event.target;
        let id = decreaseAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          decreaseAmount.previousElementSibling.innerText = tempItem.amount;
        }
      }
    });
  }

  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerText = "";
    button.style.backgroundImage = "url('../../images/cart-add.svg')";
  }
  getSingleButton(id) {
    return productBtns.find((button) => button.dataset.id === id);
  }
}

class Storage {
  static saveProduct(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const displayProducts = new DisplayProducts();
  const products = new Products();
  displayProducts.setupAPP();

  products
    .getProducts()
    .then((products) => {
      displayProducts.renderList(products);
      Storage.saveProduct(products);
      displayProducts.featuredShow(products);
    })
    .then(() => {
      displayProducts.getCartButtons();
      displayProducts.cartLogic();
      displayProducts.filterLogic();
    });
});

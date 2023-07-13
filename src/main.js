async function getProducts() {
  try {
    const data = await fetch(
      "https://ecommercebackend.fundamentos-29.repl.co/"
    );
    const res = await data.json();

    window.localStorage.setItem("products", JSON.stringify(res));
    return res;
  } catch (error) {
    console.log(error);
  }
}
function printProducts(db) {
  const productsHTML = document.querySelector(".products");
  let html = "";
  for (const product of db.products) {
    const buttonAdd = product.quantity
      ? `<i class='bx bx-plus' id="${product.id}"></i>`
      : "<span class='soldOut'>sold out 💥</span>";
    html += `
      <div class="product ${product.category}">
            <div class = "product__img">
                <img src="${product.image}" alt="imagen" />
            </div>
            <div class ="product__info">
              <div class ="product__info_title">
              <h4><p class="product__name" id="${product.id}">${product.name}</p>  </h4>
              </div>
              <div class ="product__info_stock"><h4> <span> <b>Stock:</b> ${product.quantity}</span></h4></div>
              <div className="product__info__price"><h5>
                 $${product.price}                 
                   ${buttonAdd}                 
             </h5></div>
             
             
            </div>         
      </div>
      `;
  }

  productsHTML.innerHTML = html;
}
function handleShowCart() {
  const iconCartHTML = document.querySelector(".bx-cart");
  const cartHTNL = document.querySelector(".cart");

  iconCartHTML.addEventListener("click", function () {
    cartHTNL.classList.toggle("cart__show");
  });
}
function addToCartFromProducts(db) {
  const productHTML = document.querySelector(".products");

  productHTML.addEventListener("click", function (e) {
    if (e.target.classList.contains("bx-plus")) {
      const id = Number(e.target.id);

      const productFind = db.products.find((product) => product.id === id);

      if (db.cart[productFind.id]) {
        if (productFind.quantity === db.cart[productFind.id].amount)
          return alert("No tenemos mas en bodega 👀");
        db.cart[productFind.id].amount++;
      } else {
        db.cart[productFind.id] = { ...productFind, amount: 1 };
      }
      window.localStorage.setItem("cart", JSON.stringify(db.cart));
      printProductsInCart(db);
      printTotal(db);
      handlePrintAmountProducts(db);
    }
  });
}
function printProductsInCart(db) {
  const cart__productsHTML = document.querySelector(".cart__products");

  let html = "";

  for (const product in db.cart) {
    const { quantity, price, name, image, id, amount } = db.cart[product];
    html += `
        <div class ="cart__product">
          <div class ="cart__product--img">
            <img src="${image}"  alt="imagen" />
          </div>
          <div class= "cart__product--body">
            <h4>${name} | $${price}</h4>
            <p>Stock: ${quantity} </p>
            <div class = "cart__product--body-op" id="${id}">
              <i class='bx bx-minus'></i>
              <span>${amount} unit</span>
              <i class='bx bx-plus' ></i>
              <i class='bx bx-trash' ></i>
            </div>
          </div>
        </div>
    `;
  }
  cart__productsHTML.innerHTML = html;
}
function handleProductsInCart(db) {
  const cartproductsHTML = document.querySelector(".cart__products");

  cartproductsHTML.addEventListener("click", function (e) {
    if (e.target.classList.contains("bx-plus")) {
      const id = Number(e.target.parentElement.id);

      const productFind = db.products.find((product) => product.id === id);

      if (productFind.quantity === db.cart[productFind.id].amount)
        return alert("No tenemos mas en bodega 👀");

      db.cart[id].amount++;
    }

    if (e.target.classList.contains("bx-minus")) {
      const id = Number(e.target.parentElement.id);
      if (db.cart[id].amount === 1) {
        const response = confirm(
          "Estas seguro de que quieres eliminar este producto? 😢"
        );
        if (!response) return;
        delete db.cart[id];
      } else {
        db.cart[id].amount--;
      }
    }

    if (e.target.classList.contains("bx-trash")) {
      const id = Number(e.target.parentElement.id);
      const response = confirm(
        "Estas seguro de que quieres eliminar este producto? 😢"
      );
      if (!response) return;
      delete db.cart[id];
    }
    window.localStorage.setItem("cart", JSON.stringify(db.cart));
    printProductsInCart(db);
    printTotal(db);
    handlePrintAmountProducts(db);
  });
}
function printTotal(db) {
  const infoTotalHTML = document.querySelector(".info__total");
  const infoAmountHTML = document.querySelector(".info__amount");

  let totalProducts = 0;
  let amountProducts = 0;

  for (const product in db.cart) {
    const { amount, price } = db.cart[product];
    totalProducts += price * amount;
    amountProducts += amount;
  }
  infoAmountHTML.textContent = amountProducts + " units";
  infoTotalHTML.textContent = "$" + totalProducts + " .00";
}
function handleTotal(db) {
  const btnBuy = document.querySelector(".btn__buy");

  btnBuy.addEventListener("click", function () {
    if (!Object.values(db.cart).length)
      return alert("Primero agrega productos al carrito 🤩 ");

    const response = confirm("Seguro que quieres comprar? 🏷");
    if (!response) return;

    const currentProducts = [];

    for (const product of db.products) {
      const productCart = db.cart[product.id];
      if (product.id === productCart?.id) {
        currentProducts.push({
          ...product,
          quantity: product.quantity - productCart.amount,
        });
      } else {
        currentProducts.push(product);
      }
    }
    db.products = currentProducts;
    db.cart = {};

    window.localStorage.setItem("products", JSON.stringify(db.products));
    window.localStorage.setItem("cart", JSON.stringify(db.cart));
    printTotal(db);
    printProductsInCart(db);
    printProducts(db);
    handlePrintAmountProducts(db);
  });
}

function handlePrintAmountProducts(db) {
  const amountProductsHTML = document.querySelector(".amountProducts");

  let amount = 0;

  for (const product in db.cart) {
    amount += db.cart[product].amount;
  }
  amountProductsHTML.textContent = amount;
}
function configMixItUp() {
  mixitup(".products", {
    selectors: {
      target: ".product",
    },
    animation: {
      duration: 300,
    },
  });
}

function handleModal(db) {
  const productHTML = document.querySelector(".products");

  const modalHTML = document.querySelector(".modal");

  productHTML.addEventListener("click", function (e) {
    let html = "";
    if (e.target.classList.contains("product__name")) {
      const id = Number(e.target.id);
      const productFind = db.products.find((product) => product.id === id);

      modalHTML.classList.add("modal__hidden");
      const buttonAdd = productFind.quantity
        ? `<i class='bx bx-plus' id="${productFind.id}"></i>`
        : "<span class='soldOut'>sold out 💥</span>";
      html += `      
      <div class="modal__content ">
        <div class="iconClose"><span>x</span></div>
            <div class = "modal__content_img">
                <img src="${productFind.image}" alt="imagen" />
            </div>
            <h3 class="content__name_product">${productFind.name} <span>${productFind.category} </span></h3>
            <p class = "content__description_product">${productFind.description}</p>
            <div class ="modal__content_info">
              <h3>$${productFind.price} <span>${buttonAdd}</span></h3>
              <p>${productFind.quantity} units</p>
            </div>         
      </div>
      `;

      modalHTML.innerHTML = html;

      const iconCloseHTML = document.querySelector(".iconClose");

      iconCloseHTML.addEventListener("click", () => {
        modalHTML.classList.remove("modal__hidden");
      });
    }
  });
}
function darkMode() {
  const iconTheme = document.querySelector("#changeTheme");
  const bxMoon = document.querySelector(".bx-sun");

  const isDark = () => JSON.parse(localStorage.getItem("isDark"));
  document.body.classList.toggle("darkmode", isDark());

  iconTheme.addEventListener("click", () => {
    if (isDark()) {
      localStorage.setItem("isDark", JSON.stringify(false));
      document.body.classList.remove("darkmode");
      bxMoon.classList.remove("bx-sun");
      bxMoon.classList.add("bx-moon");
    } else {
      localStorage.setItem("isDark", JSON.stringify(true));
      document.body.classList.add("darkmode");

      bxMoon.classList.add("bx-sun");
      bxMoon.classList.remove("bx-moon");
    }
  });
}

async function main() {
  const db = {
    products:
      JSON.parse(window.localStorage.getItem("products")) ||
      (await getProducts()),
    cart: JSON.parse(window.localStorage.getItem("cart")) || {},
  };

  printProducts(db);
  handleShowCart();
  addToCartFromProducts(db);
  printProductsInCart(db);
  handleProductsInCart(db);
  printTotal(db);
  handleTotal(db);
  handlePrintAmountProducts(db);
  configMixItUp();
  handleModal(db);
  darkMode();
}
main();

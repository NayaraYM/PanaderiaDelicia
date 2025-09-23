let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Abrir modal de producto
const detailButtons = document.querySelectorAll(".view-detail");
const modal = new bootstrap.Modal(document.getElementById("productModal"));
let currentProduct = {};

detailButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentProduct = {
      name: btn.dataset.name,
      price: parseFloat(btn.dataset.price),
      img: btn.dataset.img,
      desc: btn.dataset.desc
    };
    document.getElementById("modalTitle").textContent = currentProduct.name;
    document.getElementById("modalImg").src = currentProduct.img;
    document.getElementById("modalDesc").textContent = currentProduct.desc;
    document.getElementById("modalPrice").textContent = currentProduct.price.toFixed(2);
    document.getElementById("modalQty").value = 1;
    modal.show();
  });
});

// Agregar al carrito desde modal
document.getElementById("addToCartBtn").addEventListener("click", () => {
  const qty = parseInt(document.getElementById("modalQty").value);
  const existing = cart.find(item => item.name === currentProduct.name);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({...currentProduct, qty});
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
  modal.hide();
});

// Actualizar carrito en la UI
function updateCartUI() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  cartItems.innerHTML = "";
  let total = 0, count = 0;

  cart.forEach((item, i) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <div>
        <strong>${item.name}</strong> (x${item.qty}) - S/ ${(item.price * item.qty).toFixed(2)}
      </div>
      <button class="btn btn-sm btn-danger" onclick="removeFromCart(${i})">Eliminar</button>
    `;
    cartItems.appendChild(li);
    total += item.price * item.qty;
    count += item.qty;
  });

  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = count;
}

// Eliminar producto del carrito
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

updateCartUI();
// Botón de "Proceder al Pago"
document.getElementById("checkoutBtn").addEventListener("click", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }
  // Cierra carrito y abre el modal de pago
  bootstrap.Modal.getInstance(document.getElementById("cartModal")).hide();
  new bootstrap.Modal(document.getElementById("paymentModal")).show();
});

// Función para pagar
function pay(method) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  let receipt = "=== FACTURA ===\n";
  let total = 0;
  cart.forEach(item => {
    receipt += `${item.name} x${item.quantity} = S/ ${(item.price * item.quantity).toFixed(2)}\n`;
    total += item.price * item.quantity;
  });
  receipt += `TOTAL: S/ ${total.toFixed(2)}\nMétodo de pago: ${method}`;

  alert(receipt);

  // Vaciar carrito después de pagar
  localStorage.removeItem("cart");
  document.getElementById("cart-items").innerHTML = "";
  document.getElementById("cart-total").textContent = "0.00";
  document.getElementById("cart-count").textContent = "0";

  // Cierra el modal de pago
  bootstrap.Modal.getInstance(document.getElementById("paymentModal")).hide();
}

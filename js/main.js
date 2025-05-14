// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function formatCurrency(amount) {
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

function addToCart(id, name, price) {
  const existingItem = cart.find(item => item.id === id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id,
      name,
      price,
      quantity: 1
    });
  }
  
  saveCart();
  updateCartDisplay();
  updateCartCount();
  showNotification(`${name} added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartDisplay();
  updateCartCount();
}

function updateQuantity(id, quantity) {
  const item = cart.find(item => item.id === id);
  if (item) {
    item.quantity = Math.max(0, quantity);
    if (item.quantity === 0) {
      removeFromCart(id);
    } else {
      saveCart();
      updateCartDisplay();
      updateCartCount();
    }
  }
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartDisplay() {
  const cartItems = document.getElementById('cart-items');
  const subtotalElement = document.getElementById('subtotal');
  const taxElement = document.getElementById('tax');
  const totalElement = document.getElementById('total');
  
  if (!cartItems) return; // Not on cart page
  
  cartItems.innerHTML = '';
  let subtotal = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <img src="https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="${item.name}">
      <div class="item-details">
        <h3>${item.name}</h3>
        <p>${formatCurrency(item.price)}</p>
      </div>
      <div class="quantity-controls">
        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
      </div>
      <div class="item-total">
        ${formatCurrency(itemTotal)}
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">×</button>
    `;
    cartItems.appendChild(cartItem);
  });
  
  const tax = Math.round(subtotal * 0.16); // 16% VAT
  const total = subtotal + tax;
  
  subtotalElement.textContent = formatCurrency(subtotal);
  taxElement.textContent = formatCurrency(tax);
  totalElement.textContent = formatCurrency(total);
}

function checkout() {
  if (cart.length === 0) {
    showNotification('Your cart is empty!', 'error');
    return;
  }
  
  // In a real application, this would redirect to a checkout page
  showNotification('Proceeding to checkout...', 'success');
  // Clear cart after successful checkout
  cart = [];
  saveCart();
  updateCartDisplay();
  updateCartCount();
}

// Contact form handling
function handleSubmit(event) {
  event.preventDefault();
  
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value
  };
  
  // In a real application, this would send the data to a server
  console.log('Form submitted:', formData);
  showNotification('Message sent successfully!', 'success');
  event.target.reset();
}

// Notification system
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Add styles for the notification
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.padding = '10px 20px';
  notification.style.borderRadius = '4px';
  notification.style.color = 'white';
  notification.style.backgroundColor = type === 'success' ? '#27ae60' : '#e74c3c';
  notification.style.zIndex = '1000';
  notification.style.transition = 'opacity 0.3s ease';
  
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Category filtering
function filterProducts(category) {
  const products = document.querySelectorAll('.product');
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  // Update active button
  filterButtons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.category === category) {
      btn.classList.add('active');
    }
  });
  
  // Filter products
  products.forEach(product => {
    if (category === 'all' || product.dataset.category === category) {
      product.style.display = 'flex';
    } else {
      product.style.display = 'none';
    }
  });
}

// Initialize cart display and category filters when the page loads
document.addEventListener('DOMContentLoaded', () => {
  updateCartDisplay();
  updateCartCount();
  
  // Add click handlers for category filters
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterProducts(btn.dataset.category);
    });
  });
}); 
// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // State variables
    let selectedCategory = 'all';
    let selectedProduct = null;
    let isCartOpen = false;
    let isPreviewOpen = false;
    let cartItems = [];
    
    // Try to load cart from localStorage
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        cartItems = JSON.parse(savedCart);
        updateCartBadge();
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage', error);
    }
  
    // DOM Elements
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const categoryFilter = document.getElementById('categoryFilter');
    const productsGrid = document.getElementById('productsGrid');
    const cartBtn = document.getElementById('cartBtn');
    const cartBadge = document.getElementById('cartBadge');
    const cartBackdrop = document.getElementById('cartBackdrop');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const productModal = document.getElementById('productModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalContent = document.getElementById('modalContent');
    const navbar = document.querySelector('.navbar');
    const currentYearElem = document.getElementById('currentYear');
    
    // Set current year in footer
    currentYearElem.textContent = new Date().getFullYear();
  
    // Event Listeners
    menuBtn.addEventListener('click', toggleMobileMenu);
    cartBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', closeCart);
    closeModalBtn.addEventListener('click', closeProductPreview);
    cartBackdrop.addEventListener('click', (e) => {
      // Only close if clicking outside the sidebar
      if (e.target === cartBackdrop) {
        closeCart();
      }
    });
    productModal.addEventListener('click', (e) => {
      // Only close if clicking outside the modal content
      if (e.target === productModal) {
        closeProductPreview();
      }
    });
    
    // Scroll listener for navbar
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  
    // Initialize page
    initializePage();
  
    // Functions
    function initializePage() {
      renderCategoryButtons();
      
      // Simulate loading delay
      setTimeout(() => {
        renderProducts();
      }, 800);
    }
  
    function toggleMobileMenu() {
      mobileMenu.classList.toggle('open');
      // Close cart if it's open
      if (isCartOpen) {
        closeCart();
      }
    }
  
    function renderCategoryButtons() {
      const buttonsHTML = categories.map(category => {
        return `
          <button 
            class="category-button ${selectedCategory === category.id ? 'active' : ''}"
            data-category="${category.id}"
          >
            ${category.name}
          </button>
        `;
      }).join('');
      
      categoryFilter.innerHTML = buttonsHTML;
      
      // Add event listeners to category buttons
      document.querySelectorAll('.category-button').forEach(button => {
        button.addEventListener('click', () => {
          selectedCategory = button.dataset.category;
          // Update active state
          document.querySelectorAll('.category-button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === selectedCategory);
          });
          renderProducts();
        });
      });
    }
  
    function renderProducts() {
      const filteredProducts = selectedCategory === 'all' 
        ? products 
        : products.filter(product => product.category === selectedCategory);
      
      if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
          <div class="flex flex-col items-center justify-center py-12">
            <p class="text-lg text-muted-foreground mb-4">Nenhum produto encontrado</p>
            <p class="text-sm text-muted-foreground">Tente mudar os critérios de filtro</p>
          </div>
        `;
        return;
      }
      
      const productsHTML = filteredProducts.map(product => {
        return `
          <div class="product-card" data-product-id="${product.id}">
            <div class="product-image-container">
              <img 
                src="${product.image}" 
                alt="${product.name}" 
                class="product-image"
                loading="lazy"
              />
            </div>
            <div class="product-info">
              <h3 class="product-name">${product.name}</h3>
              <div class="product-price-cart">
                <span class="product-price">$${product.price.toFixed(2)}</span>
                <button 
                  class="add-to-cart-button"
                  data-product-id="${product.id}"
                  aria-label="Adicionar ${product.name} ao carrinho"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  <span>Adicionar</span>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
      
      productsGrid.innerHTML = productsHTML;
      
      // Add event listeners to products
      document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
          const productId = parseInt(card.dataset.productId);
          openProductPreview(productId);
        });
      });
      
      // Add event listeners to add-to-cart buttons
      document.querySelectorAll('.add-to-cart-button').forEach(button => {
        button.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent card click
          const productId = parseInt(button.dataset.productId);
          addToCart(productId);
          
          // Create ripple effect
          const rect = button.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const ripple = document.createElement('span');
          ripple.classList.add('ripple');
          ripple.style.left = `${x}px`;
          ripple.style.top = `${y}px`;
          
          button.appendChild(ripple);
          setTimeout(() => {
            ripple.remove();
          }, 800);
        });
      });
    }
  
    function openProductPreview(productId) {
      const product = products.find(p => p.id === productId);
      if (!product) return;
      
      selectedProduct = product;
      isPreviewOpen = true;
      document.body.style.overflow = 'hidden';
      
      const existingItem = cartItems.find(item => item.id === product.id);
      const quantity = existingItem ? existingItem.quantity : 1;
      const isInCart = !!existingItem;
      
      modalContent.innerHTML = `
        <div class="modal-product-image">
          <img src="${product.image}" alt="${product.name}" />
        </div>
        <div class="modal-product-info">
          <div>
            <span class="modal-product-category">
              ${capitalizeFirstLetter(product.category)}
            </span>
            <h2 class="modal-product-name">${product.name}</h2>
            <p class="modal-product-price">$${product.price.toFixed(2)}</p>
          </div>
          
          <p class="modal-product-description">${product.description}</p>
          
          <div class="modal-product-actions">
            ${isInCart ? `
              <div class="modal-product-quantity">
                <div class="quantity-controls">
                  <button class="quantity-button decrease-quantity" data-product-id="${product.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
                  </button>
                  <span class="quantity-text">${quantity}</span>
                  <button class="quantity-button increase-quantity" data-product-id="${product.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  </button>
                </div>
                <span class="cart-status">No seu carrinho</span>
              </div>
            ` : `
              <button class="modal-add-to-cart" data-product-id="${product.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                Adicionar ao Carrinho
              </button>
            `}
          </div>
        </div>
      `;
      
      productModal.classList.remove('hidden');
      
      // Add event listeners
      if (isInCart) {
        const decreaseBtn = modalContent.querySelector('.decrease-quantity');
        const increaseBtn = modalContent.querySelector('.increase-quantity');
        
        decreaseBtn.addEventListener('click', () => {
          updateCartItemQuantity(product.id, quantity - 1);
          openProductPreview(product.id);
        });
        
        increaseBtn.addEventListener('click', () => {
          updateCartItemQuantity(product.id, quantity + 1);
          openProductPreview(product.id);
        });
      } else {
        const addToCartBtn = modalContent.querySelector('.modal-add-to-cart');
        
        addToCartBtn.addEventListener('click', () => {
          addToCart(product.id);
          openProductPreview(product.id);
        });
      }
    }
  
    function closeProductPreview() {
      productModal.classList.add('hidden');
      document.body.style.overflow = '';
      isPreviewOpen = false;
      setTimeout(() => {
        selectedProduct = null;
      }, 300);
    }
  
    function addToCart(productId) {
      const product = products.find(p => p.id === productId);
      if (!product) return;
      
      const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        // Increment quantity if item already exists
        cartItems[existingItemIndex].quantity += 1;
      } else {
        // Add new item with quantity 1
        cartItems.push({
          ...product,
          quantity: 1
        });
      }
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(cartItems));
      
      // Update UI
      updateCartBadge();
      showToast(`${product.name} adicionado ao carrinho`);
      
      // Open cart
      openCart();
    }
  
    function updateCartItemQuantity(productId, newQuantity) {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }
      
      const itemIndex = cartItems.findIndex(item => item.id === productId);
      if (itemIndex !== -1) {
        cartItems[itemIndex].quantity = newQuantity;
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cartItems));
        
        // Update UI
        updateCartBadge();
        renderCart();
      }
    }
  
    function removeFromCart(productId) {
      cartItems = cartItems.filter(item => item.id !== productId);
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(cartItems));
      
      // Update UI
      updateCartBadge();
      renderCart();
      
      // If product preview is open, update it
      if (isPreviewOpen && selectedProduct && selectedProduct.id === productId) {
        openProductPreview(productId);
      }
    }
  
    function toggleCart() {
      if (isCartOpen) {
        closeCart();
      } else {
        openCart();
      }
      
      // Close mobile menu if it's open
      if (mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
      }
    }
  
    function openCart() {
      cartBackdrop.classList.remove('hidden');
      isCartOpen = true;
      document.body.style.overflow = 'hidden';
      renderCart();
    }
  
    function closeCart() {
      cartBackdrop.classList.add('hidden');
      isCartOpen = false;
      document.body.style.overflow = '';
    }
  
    function renderCart() {
      const cartContent = document.getElementById('cartContent');
      
      if (cartItems.length === 0) {
        // Empty cart
        cartContent.innerHTML = `
          <div class="cart-empty">
            <svg class="cart-empty-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <h3 class="cart-empty-title">Seu carrinho está vazio</h3>
            <p class="cart-empty-text">Comece adicionando itens ao seu carrinho</p>
            <button class="continue-shopping" id="continueShopping">Continuar Comprando</button>
          </div>
        `;
        
        // Add event listener to continue shopping button
        const continueShoppingBtn = document.getElementById('continueShopping');
        continueShoppingBtn.addEventListener('click', closeCart);
        
        return;
      }
      
      // Calculate total price
      const totalPrice = cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
      
      // Cart with items
      cartContent.innerHTML = `
        <div class="cart-items">
          ${cartItems.map(item => `
            <div class="cart-item">
              <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" />
              </div>
              <div class="cart-item-details">
                <div class="cart-item-name-remove">
                  <h3 class="cart-item-name">${item.name}</h3>
                  <button class="cart-item-remove" data-product-id="${item.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  </button>
                </div>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                  <button class="cart-quantity-button decrease-cart-quantity" data-product-id="${item.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
                  </button>
                  <span class="cart-quantity-text">${item.quantity}</span>
                  <button class="cart-quantity-button increase-cart-quantity" data-product-id="${item.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="cart-footer">
          <div class="cart-subtotal">
            <span>Subtotal</span>
            <span class="font-semibold">$${totalPrice.toFixed(2)}</span>
          </div>
          <button class="cart-checkout">Finalizar Compra</button>
        </div>
      `;
      
      // Add event listeners to cart buttons
      document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', () => {
          const productId = parseInt(button.dataset.productId);
          removeFromCart(productId);
        });
      });
      
      document.querySelectorAll('.decrease-cart-quantity').forEach(button => {
        button.addEventListener('click', () => {
          const productId = parseInt(button.dataset.productId);
          const item = cartItems.find(item => item.id === productId);
          if (item) {
            updateCartItemQuantity(productId, item.quantity - 1);
          }
        });
      });
      
      document.querySelectorAll('.increase-cart-quantity').forEach(button => {
        button.addEventListener('click', () => {
          const productId = parseInt(button.dataset.productId);
          const item = cartItems.find(item => item.id === productId);
          if (item) {
            updateCartItemQuantity(productId, item.quantity + 1);
          }
        });
      });
    }
  
    function updateCartBadge() {
      const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
      
      if (totalItems > 0) {
        cartBadge.textContent = totalItems;
        cartBadge.classList.remove('hidden');
      } else {
        cartBadge.classList.add('hidden');
      }
    }
  
    function showToast(message) {
      // Create toast element
      const toast = document.createElement('div');
      toast.classList.add('toast');
      toast.innerHTML = `
        <div class="toast-content">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          <span>${message}</span>
        </div>
      `;
      
      document.body.appendChild(toast);
      
      // Add styles for toast
      const style = document.createElement('style');
      style.textContent = `
        .toast {
          position: fixed;
          bottom: 1rem;
          right: 1rem;
          z-index: 1000;
          animation: slideInUp 0.3s, fadeOut 0.3s 2s forwards;
        }
        
        .toast-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background-color: hsl(var(--foreground));
          color: hsl(var(--background));
          border-radius: 0.375rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        @keyframes slideInUp {
          from {
            transform: translateY(1rem);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `;
      
      document.head.appendChild(style);
      
      // Remove toast after animation
      setTimeout(() => {
        toast.remove();
      }, 2300);
    }
  
    // Helper functions
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  });
  
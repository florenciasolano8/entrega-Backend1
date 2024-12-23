document.addEventListener("DOMContentLoaded", () => {
    const categorySelect = document.getElementById("category");
    const sortSelect = document.getElementById("sort");
    const productsList = document.getElementById("products-list");

    function loadProductsList(category, sort, page) {
        let url = `/api/products?page=${page}`;
        
        if (category) {
          url += `&category=${category}`;
        }
        
        if (sort) {
          url += `&sort=${sort}`;
        }
      
      
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Error en la solicitud');
            }
            return response.json();
          })
          .then((data) => {
          })
          .catch((error) => {
            console.error('Error al cargar los productos:', error);
          });
      }
    sortSelect.addEventListener("change", () => {
        loadProductsList(categorySelect.value, sortSelect.value);
    });

    categorySelect.addEventListener("change", () => {
        loadProductsList(categorySelect.value, sortSelect.value);
    });

    loadProductsList();
});
document.getElementById('createProductBtn').addEventListener('click', () => {
    window.location.href = '/api/public';
});
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingProductIndex = cart.findIndex(item => item.id === product.id);
  if (existingProductIndex !== -1) {
    cart[existingProductIndex].quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));

  showSuccessNotification();
}

function showSuccessNotification() {
  Swal.fire({
    title: '¡Producto añadido!',
    text: 'El producto ha sido añadido a tu carrito.',
    icon: 'success',
    confirmButtonText: 'Aceptar'
  });
}

document.querySelectorAll('button[data-product-id]').forEach(button => {
  button.addEventListener('click', function() {
    const productId = this.getAttribute('data-product-id');
    
    const productElement = this.closest('.products');
    const productName = productElement.querySelector('ul li:first-child').textContent.split(':')[1].trim(); // Nombre
    const productPrice = productElement.querySelector('ul li:nth-child(2)').textContent.split(':')[1].trim(); // Precio

    const product = {
      id: productId,
      name: productName,
      price: productPrice
    };
    addToCart(product);
  });
});

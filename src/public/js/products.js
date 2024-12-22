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

document.addEventListener("DOMContentLoaded", () => {
    const btnActualizar = document.getElementById("btn-actualizar-productos");
    const btnRefreshProductsList = document.getElementById("btn-refresh-products-list");
    const categorySelect = document.getElementById("category");
    const sortSelect = document.getElementById("sort");
    const productsList = document.getElementById("products-list");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");

    const updateProducts = (page, category = '', sort = '') => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("page", page);
        if (category) urlParams.set("category", category);
        if (sort) urlParams.set("sort", sort);
        window.location.search = urlParams.toString();
    };

    const loadProductsList = async () => {
        console.log("Cargando la lista de productos...");
        try {
            // Simulación de productos de prueba
            const data = {
                status: 'success',
                payload: {
                    docs: [
                        { id: 1, title: 'Producto 1' },
                        { id: 2, title: 'Producto 2' },
                        { id: 3, title: 'Producto 3' },
                    ],
                    totalDocs: 3,
                    limit: 10,
                    totalPages: 1,
                    page: 1,
                },
            };
    
            console.log("Datos recibidos:", data);
            if (data && Array.isArray(data.payload.docs)) {
                const products = data.payload.docs;
                console.log("Productos:", products);
    
                productsList.innerHTML = "";
                products.forEach((product) => {
                    productsList.innerHTML += `<li>Id: ${product.id} - Nombre: ${product.title}</li>`;
                });
            } else {
                console.error("La estructura de los datos es incorrecta o no contiene productos.", data);
                productsList.innerHTML = "<p>No se encontraron productos.</p>";
            }
        } catch (error) {
            console.error("Error al cargar los productos:", error);
        }
    };
    
    btnRefreshProductsList.addEventListener("click", () => {
        loadProductsList();
        console.log("Lista de productos recargada");
    });

    btnActualizar.addEventListener("click", () => {
        location.reload();
    });

    prevPageBtn.addEventListener("click", () => {
        const currentPage = parseInt(new URLSearchParams(window.location.search).get("page")) || 1;
        if (currentPage > 1) {
            updateProducts(currentPage - 1, categorySelect.value, sortSelect.value);
        }
    });

    nextPageBtn.addEventListener("click", () => {
        const currentPage = parseInt(new URLSearchParams(window.location.search).get("page")) || 1;
        updateProducts(currentPage + 1, categorySelect.value, sortSelect.value);
    });

    sortSelect.addEventListener("change", () => {
        const selectedSort = sortSelect.value;
        updateProducts(1, categorySelect.value, selectedSort);
    });

    categorySelect.addEventListener("change", () => {
        const selectedCategory = categorySelect.value;
        updateProducts(1, selectedCategory, sortSelect.value);
    });

    // Cargar los productos inicialmente
    loadProductsList();

    
});

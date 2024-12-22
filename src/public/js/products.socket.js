const socket = io();
const productList = document.querySelector(".container-products");
const productsList = document.getElementById("products-list");
const productsForm = document.getElementById("insert-product");
const inputProductId = document.getElementById("input-product-id");
const btnDeleteProduct = document.getElementById("btn-delete-product");
const errorMessage = document.getElementById("error-message");
let prevPageBtn = document.getElementById("prev-page");
let nextPageBtn = document.getElementById("next-page");
let currentPageText = document.getElementById("current-page");

//Muestra productos de la lista
socket.on("products-list", (data) => {
    console.log("Datos recibidos:", data);
    const products = data.products?.docs ?? [];

    if (!Array.isArray(products)) {
        console.error("Los datos no son un arreglo:", products);
        return;
    }
    // Actualizo la lista de productos 
    productList.innerHTML = '';
    productsList.innerHTML = '';

    products.forEach((product) => {
        productList.innerHTML += `
            <div class="product-card">
                <ul>
                    <li>Nombre: ${product.title}</li>
                    <li>Precio: ${product.price}</li>
                    <li>divisa: ${product.currency}</li>
                    <li>Categoría: ${product.category}</li>
                    <li>Descripción: ${product.description}</li>
                    <li>Código: ${product.code}</li>
                    <li>Estado: ${product.status}</li>
                    <li>Stock: ${product.stock}</li>
                    <button class="view-product-btn" data-id="${product._id}">Ver Detalles</button>
                </ul>
            </div>
        `;
        productsList.innerHTML += `<li>Id: ${product.id} - Nombre ${product.title}</li>`;
    });
});

prevPageBtn.addEventListener("click", () => {
    let currentPage = Number(currentPageText.innerText) || 1;
    if (currentPage > 1) {
        currentPage--;
        loadProducts(currentPage);
    }
});

nextPageBtn.addEventListener("click", () => {
    let currentPage = Number(currentPageText.innerText) || 1;
    currentPage++;
    loadProducts(currentPage);
});


// Maneja el evento de eliminación de productos
btnDeleteProduct.onclick = () => {
    const id = Number(inputProductId.value);
    inputProductId.value = "";
    errorMessage.innerText = "";

    if (id > 0) {
        socket.emit("delete-product", { id });
    }
};

// Manejo de errores
socket.on("error-message", (data) => {
    errorMessage.innerText = data.message;
    console.log(data.message);
});

// Función para mostrar los detalles del producto en un modal
function showProductModal(product) {
    const modalContent = `
    <div class="modal">
    <h2>${product.title}</h2>
    <p>Precio: ${product.price}</p>
    <p>Moneda: ${product.currency}</p>
    <p>Categoria: ${product.category}</p>
    <p>Descripcion: ${product.description}</p>
            <p>Stock: ${product.stock}</p>
            <p>Codigo: ${product.code}</p>
            <p>Estado: ${product.status}</p>
            <button id="close-modal">Cerrar</button>
            </div>
            `;
    document.body.innerHTML += modalContent;
    document.getElementById("close-modal").onclick = () => {
        document.querySelector(".modal").remove();
    };
}


// Función para cargar los productos según la página actual
function loadProducts(page) {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set("page", page);
    window.location.search = queryParams.toString();
}

// Maneja el envío del formulario para agregar productos
productsForm.onsubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const status = formData.get("status") === "on";

    errorMessage.innerText = "";
    form.reset();

    socket.emit("insert-product", {
        title: formData.get("title"),
        price: formData.get("price"),
        currency: formData.get("currency"),
        description: formData.get("description"),
        stock: formData.get("stock"),
        code: formData.get("code"),
        status: status,
        category: formData.get("category")
    });
};
// Evento para mostrar el modal al hacer clic en "Ver Detalles"
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("view-product-btn")) {
        const productId = e.target.getAttribute("data-id");
        const product = products.find(p => p._id === productId);
        if (product) {
            showProductModal(product);
        }
    }
});
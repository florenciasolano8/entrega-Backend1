// Establece la conexión con el servidor usando Socket.IO
const socket = io();

const productsList = document.getElementById("products-list");
const productsForm = document.getElementById("products-form");
const errorMessage = document.getElementById("error-message");


socket.on("products-list",(data)=>{
    const products = data.products || [];

    productsList.innerText = "";

    products.forEach((product)=>{
        productsList.innerHTML += `<li>Id: ${product.id} - Nombre ${product.title}</li>`;
    });
});

productsForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    const form = event.target;
    const formdata = new FormData(form);

    errorMessage.innerText="";
    form.reset();

    socket.emit("insert-products",{
        title: formdata.get("title"),
        description: formdata.get("description"),
        code: formdata.get("code"),
        price: formdata.get("price"),
        stock: formdata.get("stock"),  
        category: formdata.get("category"),
        status: formdata.get("status") || "off",
      });
    });

    socket.on("error-message", (data)=>{
        errorMessage.innerText = data.message;
    })

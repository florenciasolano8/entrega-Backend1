document.addEventListener("DOMContentLoaded", () => {
    const cartId = "1b9f7gk2p8j1g45";
    const bDeleteAll = document.getElementById("b-deleteAll");
    const removeButtons = document.querySelectorAll(".remove-from-cart");

    // Hace solicitud a  DELETE
    const deleteFromCart = async (url) => {
        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const result = await response.json();
                alert(result.message || "Se realizo con Exito");
                location.reload(); 
            } else {
                const errorText = await response.text();
                console.error("Error del servidor:", errorText);
                alert("Error. Revisa la consola para más detalles.");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Hubo un problema al conectarse al servidor.");
        }
    };

    // Elimina todos los productos del carrito
    bDeleteAll.addEventListener("click", () => {
        deleteFromCart(`/api/cart/${cartId}`);
    });

    // Elimina un producto específico del carrito
    removeButtons.forEach((button) => {
        button.addEventListener("click", async (event) => {
            const productId = button.getAttribute("data-product-id");

            if (!productId) {
                console.error("El ID del producto no esta definido.");
                return;
            }

            const productUrl = `/api/cart/${cartId}/product/${productId}`;
            deleteFromCart(productUrl);
        });
    });
});

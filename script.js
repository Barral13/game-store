const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

// Lista do carrinho
let cart = [];

// Abre o modal do carrinho
cartBtn.addEventListener("click", function () {
   updateCartModal();
   cartModal.style.display = "flex"
})

// Fecha o modal ao clicar fora
cartModal.addEventListener("click", function (event) {
   if (event.target === cartModal) {
      cartModal.style.display = "none"
   }
})

// Fecha o modal atraves do botão
closeModalBtn.addEventListener("click", function () {
   cartModal.style.display = "none"
})

menu.addEventListener("click", function (event) {
   let parentButton = event.target.closest(".add-to-cart-btn");

   if (parentButton) {
      const name = parentButton.getAttribute("data-name");
      const price = parseFloat(parentButton.getAttribute("data-price"));

      //Adicionando ao carrinho
      addToCart(name, price)
      Toastify({
         text: "Item adicionado com sucesso!",
         duration: 3000,
         close: true,
         gravity: "top", // `top` or `bottom`
         position: "left", // `left`, `center` or `right`
         stopOnFocus: true, // Prevents dismissing of toast on hover
         style: {
            background: "linear-gradient(to right, #eb5ceb, #d08a28)",
         },
      }).showToast();
   }
})

// Funcão para adicionar ao carrinho
function addToCart(name, price) {
   const existingItem = cart.find(item => item.name === name)

   if (existingItem) {
      // Se o item existe aumenta a quantidade +1
      existingItem.quantity += 1;
   } else {
      cart.push({
         name,
         price,
         quantity: 1,
      })
   }

   updateCartModal()
}

// Atualizando o carrinho
function updateCartModal() {
   cartItemsContainer.innerHTML = "";
   let total = 0;

   cart.forEach(item => {
      const cartItemElement = document.createElement("div");
      cartItemElement.classList.add("flex", "justfy-between", "mb-4", "flex-col")

      cartItemElement.innerHTML = `
         <div class="flex items-center justify-between">
            <div>
               <p class="font-bold">${item.name}</p>
               <p>Quantidade: ${item.quantity}</p>
               <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

            <div>
               <button class="remove-from-cart-btn p-1 bg-orange-500 text-black rounded font-bold" data-name="${item.name}">
                  Remover
               </button>
            </div>

         </div>
      `
      total += item.price * item.quantity;

      cartItemsContainer.appendChild(cartItemElement);
   })

   cartTotal.textContent = total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
   });

   cartCounter.innerText = cart.length;
}

// Removendo item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
   if (event.target.classList.contains("remove-from-cart-btn")) {
      const name = event.target.getAttribute("data-name")

      removeItemCart(name);
   }
});

function removeItemCart(name) {
   const index = cart.findIndex(item => item.name === name);

   if (index !== -1) {
      const item = cart[index];

      if (item.quantity > 1) {
         item.quantity -= 1;
         updateCartModal();
         Toastify({
            text: "Item removido.",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
               background: "linear-gradient(to right, #eb5ceb, #d08a28)",
            },
         }).showToast();
         return;
      }

      cart.splice(index, 1);
      Toastify({
         text: "Item removido.",
         duration: 3000,
         close: true,
         gravity: "top", // `top` or `bottom`
         position: "left", // `left`, `center` or `right`
         stopOnFocus: true, // Prevents dismissing of toast on hover
         style: {
            background: "linear-gradient(to right, #eb5ceb, #d08a28)",
         },
      }).showToast();
      updateCartModal();
   }
}

// Funções de Input
addressInput.addEventListener("input", function (event) {
   let inputValue = event.target.value;

   if (inputValue !== "") {
      addressInput.classList.remove("border-red-500")
      addressWarn.classList.add("hidden")
   }
})

// Finalizando pedido
checkoutBtn.addEventListener("click", function () {
   if (cart.length === 0) return;
   if (addressInput.value === "") {
      addressWarn.classList.remove("hidden")
      addressInput.classList.add("border-red-500")
      return;
   }

   const isOpen = checkStoreOpen();
   if (!isOpen) {
      Toastify({
         text: "Ops, atualmente trabalhamos com pedido somente em horário comercial.",
         duration: 5000,
         close: true,
         gravity: "top", // `top` or `bottom`
         position: "left", // `left`, `center` or `right`
         stopOnFocus: true, // Prevents dismissing of toast on hover
         style: {
            background: "linear-gradient(to right, #eb5ceb, #d08a28)",
         },
      }).showToast();

      return;
   }

   //Enviar pedido para api WhatsApp
   const cartItems = cart.map((item) => {
      return (
         ` ${item.name}, Quantidade: (${item.quantity}), Preço: R$ ${item.price} |`
      )
   }).join("")

   const message = encodeURIComponent(cartItems)
   const phone = "38997292832"

   window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

   cart = [];
   updateCartModal();
})

// Verifica e manipula o card horario
function checkStoreOpen() {
   const data = new Date();
   const hora = data.getHours();
   const diaSemana = data.getDay();
   return (diaSemana >= 1 && diaSemana <= 6) && (hora >= 8 && hora < 20);
}

const spanItem = document.getElementById("date-span");
const isOpen = checkStoreOpen();

if (isOpen) {
   spanItem.classList.remove("bg-orange-500");
   spanItem.classList.add("bg-fuchsia-600");
} else {
   spanItem.classList.remove("bg-fuchsia-600");
   spanItem.classList.add("bg-orange-500");
}

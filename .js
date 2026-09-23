/* =========================================================
   DINO SHOES
   Sistema de tienda + CRUD + carrito + favoritos
========================================================= */

const STORAGE_KEY = "DINO_SHOES_PROFESSIONAL_2026";
const CART_KEY = "DINO_SHOES_CART_2026";
const FAVORITES_KEY = "DINO_SHOES_FAVORITES_2026";


/* =========================================================
   PRODUCTOS INICIALES
========================================================= */

const starterProducts = [

    {
        id: 1001,
        name: "Air Max Urban",
        brand: "Nike",
        style: "Sneakers",
        size: 38,
        color: "Blanco / Negro",
        price: 899,
        stock: 12,
        image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 1002,
        name: "Street Classic",
        brand: "Adidas",
        style: "Casual",
        size: 39,
        color: "Negro",
        price: 749,
        stock: 8,
        image:
            "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 1003,
        name: "Runner Pro",
        brand: "New Balance",
        style: "Running",
        size: 40,
        color: "Gris / Blanco",
        price: 999,
        stock: 6,
        image:
            "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 1004,
        name: "Urban Motion",
        brand: "Puma",
        style: "Deportivo",
        size: 37,
        color: "Blanco",
        price: 699,
        stock: 15,
        image:
            "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 1005,
        name: "Classic Leather",
        brand: "Reebok",
        style: "Urbano",
        size: 38,
        color: "Blanco",
        price: 799,
        stock: 10,
        image:
            "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 1006,
        name: "Velocity Run",
        brand: "Asics",
        style: "Running",
        size: 41,
        color: "Azul / Blanco",
        price: 1099,
        stock: 5,
        image:
            "https://images.unsplash.com/photo-1554131597-cc2e9b2c3e04?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 1007,
        name: "Elegant Step",
        brand: "Clarks",
        style: "Formal",
        size: 40,
        color: "Café",
        price: 1199,
        stock: 4,
        image:
            "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 1008,
        name: "Street Force",
        brand: "Vans",
        style: "Urbano",
        size: 39,
        color: "Negro / Blanco",
        price: 649,
        stock: 13,
        image:
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=85"
    }

];


/* =========================================================
   ESTADO
========================================================= */

let products = loadProducts();

let cart = loadData(
    CART_KEY,
    []
);

let favorites = loadData(
    FAVORITES_KEY,
    []
);

let currentImage = "";
let editImage = "";

let deleteId = null;


/* =========================================================
   SELECTOR
========================================================= */

const $ = id => document.getElementById(id);


/* =========================================================
   LOCAL STORAGE
========================================================= */

function loadProducts() {

    const saved =
        localStorage.getItem(STORAGE_KEY);

    if (!saved) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(starterProducts)
        );

        return clone(starterProducts);
    }

    try {

        return JSON.parse(saved);

    } catch {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(starterProducts)
        );

        return clone(starterProducts);
    }

}


function loadData(key, fallback) {

    const saved =
        localStorage.getItem(key);

    if (!saved) {
        return clone(fallback);
    }

    try {

        return JSON.parse(saved);

    } catch {

        return clone(fallback);

    }

}


function clone(value) {

    return JSON.parse(
        JSON.stringify(value)
    );

}


function saveProducts() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(products)
    );

}


function saveCart() {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

}


function saveFavorites() {

    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favorites)
    );

}


/* =========================================================
   DINERO
========================================================= */

function money(value) {

    return `Q ${Number(value).toLocaleString(
        "es-GT",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    )}`;

}


/* =========================================================
   SEGURIDAD
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(
            /[&<>"']/g,
            char => ({

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"

            }[char])
        );

}


/* =========================================================
   CATÁLOGO
========================================================= */

function renderProducts() {

    const container =
        $("productsContainer");

    const search =
        $("searchInput")
            .value
            .trim()
            .toLowerCase();

    const brand =
        $("brandFilter").value;

    const style =
        $("styleFilter").value;

    const size =
        $("sizeFilter").value;

    const sort =
        $("sortFilter").value;


    let list =
        products.filter(product => {

            const searchable = [

                product.name,
                product.brand,
                product.style,
                product.color,
                product.size

            ]
                .join(" ")
                .toLowerCase();


            const matchesSearch =
                searchable.includes(search);


            const matchesBrand =
                brand === "all" ||
                product.brand === brand;


            const matchesStyle =
                style === "all" ||
                product.style === style;


            const matchesSize =
                size === "all" ||
                String(product.size) === size;


            return (
                matchesSearch &&
                matchesBrand &&
                matchesStyle &&
                matchesSize
            );

        });


    /* ORDENAMIENTO */

    if (sort === "price-low") {

        list.sort(
            (a, b) => a.price - b.price
        );

    }

    if (sort === "price-high") {

        list.sort(
            (a, b) => b.price - a.price
        );

    }

    if (sort === "name") {

        list.sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name
                )
        );

    }

    if (sort === "stock") {

        list.sort(
            (a, b) =>
                b.stock - a.stock
        );

    }


    container.innerHTML =
        list.map(productCard).join("");


    $("resultCount").textContent =
        `${list.length} ${
            list.length === 1
                ? "producto"
                : "productos"
        }`;


    $("emptyState")
        .classList
        .toggle(
            "show",
            list.length === 0
        );


    updateClearButton();

    updateDashboard();

}


/* =========================================================
   TARJETA DE PRODUCTO
========================================================= */

function productCard(product) {

    const isFavorite =
        favorites.includes(product.id);


    let stockClass = "";

    let stockText = "";


    if (product.stock === 0) {

        stockClass = "out";
        stockText = "Agotado";

    } else if (product.stock <= 3) {

        stockClass = "low";
        stockText =
            `${product.stock} disponibles`;

    } else {

        stockText =
            `${product.stock} en stock`;

    }


    const fallback =
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=85";


    return `

        <article class="product-card">

            <div class="product-photo">

                <img
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                    onerror="this.src='${fallback}'"
                >


                <span class="product-tag">
                    ${escapeHTML(product.brand)}
                </span>


                <span class="stock-tag ${stockClass}">
                    ${stockText}
                </span>


                <button
                    class="favorite-button ${
                        isFavorite ? "active" : ""
                    }"
                    onclick="toggleFavorite(${product.id})"
                    title="Favorito">

                    <i class="${
                        isFavorite
                            ? "fa-solid"
                            : "fa-regular"
                    } fa-heart"></i>

                </button>

            </div>


            <div class="product-content">

                <span class="product-brand">
                    ${escapeHTML(product.style)}
                </span>


                <h3>
                    ${escapeHTML(product.name)}
                </h3>


                <div class="product-meta">

                    <span>
                        <i class="fa-solid fa-ruler"></i>
                        Talla ${escapeHTML(product.size)}
                    </span>

                    <span>
                        <i class="fa-solid fa-palette"></i>
                        ${escapeHTML(product.color)}
                    </span>

                </div>


                <div class="product-footer">

                    <strong class="product-price">
                        ${money(product.price)}
                    </strong>


                    <div class="product-actions">

                        <button
                            class="product-action cart"
                            title="Agregar al carrito"
                            onclick="addToCart(${product.id})"
                            ${
                                product.stock === 0
                                    ? "disabled"
                                    : ""
                            }>

                            <i class="fa-solid fa-bag-shopping"></i>

                        </button>


                        <button
                            class="product-action edit"
                            title="Editar"
                            onclick="openEdit(${product.id})">

                            <i class="fa-solid fa-pen"></i>

                        </button>


                        <button
                            class="product-action delete"
                            title="Eliminar"
                            onclick="openDelete(${product.id})">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </div>

            </div>

        </article>

    `;

}


/* =========================================================
   FILTROS
========================================================= */

function populateFilters() {

    const currentBrand =
        $("brandFilter").value;

    const currentStyle =
        $("styleFilter").value;

    const currentSize =
        $("sizeFilter").value;


    const brands =
        [
            ...new Set(
                products
                    .map(p => p.brand)
                    .filter(Boolean)
            )
        ].sort();


    const styles =
        [
            ...new Set(
                products
                    .map(p => p.style)
                    .filter(Boolean)
            )
        ].sort();


    const sizes =
        [
            ...new Set(
                products
                    .map(p => String(p.size))
                    .filter(Boolean)
            )
        ].sort(
            (a, b) => Number(a) - Number(b)
        );


    $("brandFilter").innerHTML =
        `<option value="all">
            Todas las marcas
        </option>` +

        brands.map(
            brand =>
                `<option value="${escapeHTML(brand)}">
                    ${escapeHTML(brand)}
                </option>`
        ).join("");


    $("styleFilter").innerHTML =
        `<option value="all">
            Todos los estilos
        </option>` +

        styles.map(
            style =>
                `<option value="${escapeHTML(style)}">
                    ${escapeHTML(style)}
                </option>`
        ).join("");


    $("sizeFilter").innerHTML =
        `<option value="all">
            Todas las tallas
        </option>` +

        sizes.map(
            size =>
                `<option value="${escapeHTML(size)}">
                    Talla ${escapeHTML(size)}
                </option>`
        ).join("");


    if (brands.includes(currentBrand)) {

        $("brandFilter").value =
            currentBrand;

    }


    if (styles.includes(currentStyle)) {

        $("styleFilter").value =
            currentStyle;

    }


    if (sizes.includes(currentSize)) {

        $("sizeFilter").value =
            currentSize;

    }

}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

    const total =
        products.length;


    const stock =
        products.reduce(
            (sum, product) =>
                sum +
                Number(product.stock),
            0
        );


    const brands =
        new Set(
            products.map(
                product =>
                    product.brand
                        .trim()
                        .toLowerCase()
            )
        ).size;


    const value =
        products.reduce(
            (sum, product) =>
                sum +
                Number(product.price) *
                Number(product.stock),
            0
        );


    $("totalProducts")
        .textContent = total;


    $("totalStock")
        .textContent = stock;


    $("totalBrands")
        .textContent = brands;


    $("inventoryValue")
        .textContent = money(value);


    $("heroProducts")
        .textContent = total;


    $("heroStock")
        .textContent = stock;

}


/* =========================================================
   FILTROS LIMPIOS
========================================================= */

function clearFilters() {

    $("searchInput").value = "";

    $("brandFilter").value = "all";

    $("styleFilter").value = "all";

    $("sizeFilter").value = "all";

    $("sortFilter").value = "default";


    renderProducts();

}


function updateClearButton() {

    const active =
        $("searchInput").value.trim() !== "" ||
        $("brandFilter").value !== "all" ||
        $("styleFilter").value !== "all" ||
        $("sizeFilter").value !== "all" ||
        $("sortFilter").value !== "default";


    $("clearFilters")
        .classList
        .toggle(
            "show",
            active
        );

}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    message,
    type = "success"
) {

    const toast =
        document.createElement("div");


    toast.className =
        `toast ${type}`;


    const icon =
        type === "success"
            ? "fa-circle-check"
            : "fa-circle-exclamation";


    toast.innerHTML = `

        <i class="fa-solid ${icon}"></i>

        <span>
            ${escapeHTML(message)}
        </span>

    `;


    $("toastContainer")
        .appendChild(toast);


    setTimeout(
        () => toast.remove(),
        3000
    );

}


/* =========================================================
   IMAGEN DEL FORMULARIO
========================================================= */

function resetImagePreview() {

    currentImage = "";

    $("previewImage").hidden = true;

    $("previewImage")
        .removeAttribute("src");

    $("previewPlaceholder").hidden =
        false;

    $("removeImageBtn").hidden =
        true;

    $("productImage").value = "";

}


$("productImage")
    .addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];

            if (!file) return;


            if (!file.type.startsWith("image/")) {

                showToast(
                    "Selecciona una imagen válida.",
                    "error"
                );

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                () => {

                    currentImage =
                        reader.result;


                    $("previewImage")
                        .src =
                        currentImage;


                    $("previewImage")
                        .hidden = false;


                    $("previewPlaceholder")
                        .hidden = true;


                    $("removeImageBtn")
                        .hidden = false;

                };


            reader.readAsDataURL(file);

        }
    );


$("removeImageBtn")
    .addEventListener(
        "click",
        resetImagePreview
    );


/* =========================================================
   REGISTRAR PRODUCTO
========================================================= */

$("productForm")
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                $("productName")
                    .value
                    .trim();

            const brand =
                $("productBrand")
                    .value
                    .trim();

            const style =
                $("productStyle")
                    .value;

            const size =
                Number(
                    $("productSize")
                        .value
                );

            const color =
                $("productColor")
                    .value
                    .trim();

            const price =
                Number(
                    $("productPrice")
                        .value
                );

            const stock =
                Number(
                    $("productStock")
                        .value
                );


            if (
                !name ||
                !brand ||
                !style ||
                !size ||
                !color ||
                price < 0 ||
                stock < 0
            ) {

                showToast(
                    "Completa correctamente todos los campos.",
                    "error"
                );

                return;

            }


            const product = {

                id:
                    Date.now(),

                name,

                brand,

                style,

                size,

                color,

                price,

                stock,

                image:
                    currentImage ||
                    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=85"

            };


            products.unshift(product);


            saveProducts();

            populateFilters();

            renderProducts();


            event.target.reset();

            resetImagePreview();


            showToast(
                "Producto registrado correctamente."
            );


            document
                .getElementById("catalogo")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


$("productForm")
    .addEventListener(
        "reset",
        () => {

            setTimeout(
                resetImagePreview,
                0
            );

        }
    );


/* =========================================================
   EDITAR PRODUCTO
========================================================= */

function openEdit(id) {

    const product =
        products.find(
            p => p.id === id
        );


    if (!product) return;


    $("editProductId")
        .value = product.id;


    $("editProductName")
        .value = product.name;


    $("editProductBrand")
        .value = product.brand;


    $("editProductStyle")
        .value = product.style;


    $("editProductSize")
        .value = product.size;


    $("editProductColor")
        .value = product.color;


    $("editProductPrice")
        .value = product.price;


    $("editProductStock")
        .value = product.stock;


    $("editPreviewImage")
        .src = product.image;


    editImage =
        product.image;


    $("editModal")
        .hidden = false;


    document.body.classList
        .add("no-scroll");

}


function closeEdit() {

    $("editModal")
        .hidden = true;


    $("editProductImage")
        .value = "";


    document.body.classList
        .remove("no-scroll");

}


$("closeEditModal")
    .addEventListener(
        "click",
        closeEdit
    );


$("cancelEdit")
    .addEventListener(
        "click",
        closeEdit
    );


$("editModal")
    .addEventListener(
        "click",
        event => {

            if (
                event.target ===
                $("editModal")
            ) {

                closeEdit();

            }

        }
    );


$("editProductImage")
    .addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];

            if (!file) return;


            const reader =
                new FileReader();


            reader.onload =
                () => {

                    editImage =
                        reader.result;


                    $("editPreviewImage")
                        .src =
                        editImage;

                };


            reader.readAsDataURL(file);

        }
    );


$("editForm")
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const id =
                Number(
                    $("editProductId")
                        .value
                );


            const index =
                products.findIndex(
                    p => p.id === id
                );


            if (index === -1) return;


            products[index] = {

                ...products[index],

                name:
                    $("editProductName")
                        .value
                        .trim(),

                brand:
                    $("editProductBrand")
                        .value
                        .trim(),

                style:
                    $("editProductStyle")
                        .value,

                size:
                    Number(
                        $("editProductSize")
                            .value
                    ),

                color:
                    $("editProductColor")
                        .value
                        .trim(),

                price:
                    Number(
                        $("editProductPrice")
                            .value
                    ),

                stock:
                    Number(
                        $("editProductStock")
                            .value
                    ),

                image:
                    editImage

            };


            saveProducts();

            populateFilters();

            renderProducts();

            closeEdit();


            showToast(
                "Producto actualizado correctamente."
            );

        }
    );


/* =========================================================
   ELIMINAR
========================================================= */

function openDelete(id) {

    deleteId = id;

    $("deleteModal")
        .hidden = false;

    document.body.classList
        .add("no-scroll");

}


function closeDelete() {

    deleteId = null;

    $("deleteModal")
        .hidden = true;

    document.body.classList
        .remove("no-scroll");

}


$("cancelDelete")
    .addEventListener(
        "click",
        closeDelete
    );


$("deleteModal")
    .addEventListener(
        "click",
        event => {

            if (
                event.target ===
                $("deleteModal")
            ) {

                closeDelete();

            }

        }
    );


$("confirmDelete")
    .addEventListener(
        "click",
        () => {

            if (deleteId === null) return;


            const deleted =
                products.find(
                    p => p.id === deleteId
                );


            products =
                products.filter(
                    p => p.id !== deleteId
                );


            /* Si estaba en favoritos */

            favorites =
                favorites.filter(
                    id => id !== deleteId
                );


            /* Si estaba en carrito */

            cart =
                cart.filter(
                    item => item.id !== deleteId
                );


            saveProducts();

            saveFavorites();

            saveCart();


            populateFilters();

            renderProducts();

            updateCart();

            renderFavorites();


            closeDelete();


            showToast(
                `"${deleted?.name || "Producto"}" eliminado.`
            );

        }
    );


/* =========================================================
   FAVORITOS
========================================================= */

function toggleFavorite(id) {

    const exists =
        favorites.includes(id);


    if (exists) {

        favorites =
            favorites.filter(
                favoriteId =>
                    favoriteId !== id
            );

        showToast(
            "Producto eliminado de favoritos."
        );

    } else {

        favorites.push(id);

        showToast(
            "Producto agregado a favoritos."
        );

    }


    saveFavorites();

    renderProducts();

    renderFavorites();

    updateFavoriteCount();

}


function updateFavoriteCount() {

    $("favoriteCount")
        .textContent =
        favorites.length;

}


function renderFavorites() {

    const container =
        $("favoritesItems");


    const favoriteProducts =
        favorites
            .map(
                id =>
                    products.find(
                        p => p.id === id
                    )
            )
            .filter(Boolean);


    if (favoriteProducts.length === 0) {

        container.innerHTML = `

            <div class="empty-favorites">

                <i class="fa-regular fa-heart"></i>

                <p>
                    Todavía no tienes productos favoritos.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        favoriteProducts
            .map(
                product =>
                    `

                    <div class="favorite-item">

                        <img
                            src="${escapeHTML(product.image)}"
                            alt="${escapeHTML(product.name)}"
                        >

                        <div>

                            <h4>
                                ${escapeHTML(product.name)}
                            </h4>

                            <span>
                                ${escapeHTML(product.brand)}
                            </span>

                            <strong>
                                ${money(product.price)}
                            </strong>

                        </div>

                    </div>

                    `
            )
            .join("");

}


/* =========================================================
   CARRITO
========================================================= */

function addToCart(id) {

    const product =
        products.find(
            p => p.id === id
        );


    if (!product) return;


    if (product.stock <= 0) {

        showToast(
            "Este producto está agotado.",
            "error"
        );

        return;

    }


    const existing =
        cart.find(
            item => item.id === id
        );


    if (existing) {

        if (
            existing.quantity >=
            product.stock
        ) {

            showToast(
                "No hay más unidades disponibles.",
                "error"
            );

            return;

        }

        existing.quantity++;

    } else {

        cart.push({

            id,

            quantity: 1

        });

    }


    saveCart();

    updateCart();


    showToast(
        `${product.name} agregado al carrito.`
    );

}


function removeFromCart(id) {

    cart =
        cart.filter(
            item => item.id !== id
        );


    saveCart();

    updateCart();


    showToast(
        "Producto retirado del carrito."
    );

}


function updateCart() {

    const container =
        $("cartItems");


    let totalItems = 0;

    let totalPrice = 0;


    cart.forEach(
        item => {

            const product =
                products.find(
                    p => p.id === item.id
                );


            if (!product) return;


            totalItems +=
                item.quantity;


            totalPrice +=
                product.price *
                item.quantity;

        }
    );


    $("cartCount")
        .textContent =
        totalItems;


    $("cartTotal")
        .textContent =
        money(totalPrice);


    if (cart.length === 0) {

        container.innerHTML = "";

        $("cartEmpty")
            .style.display = "flex";

        $("cartFooter")
            .style.display = "none";

        return;

    }


    $("cartEmpty")
        .style.display = "none";


    $("cartFooter")
        .style.display = "block";


    container.innerHTML =
        cart
            .map(
                item => {

                    const product =
                        products.find(
                            p =>
                                p.id === item.id
                        );


                    if (!product) return "";


                    return `

                        <div class="cart-item">

                            <div class="cart-item-image">

                                <img
                                    src="${escapeHTML(product.image)}"
                                    alt="${escapeHTML(product.name)}"
                                >

                            </div>


                            <div class="cart-item-info">

                                <h4>
                                    ${escapeHTML(product.name)}
                                </h4>

                                <span>
                                    ${escapeHTML(product.brand)}
                                    · Talla ${escapeHTML(product.size)}
                                </span>

                                <span>
                                    Cantidad:
                                    ${item.quantity}
                                </span>

                                <div class="cart-item-price">
                                    ${money(
                                        product.price *
                                        item.quantity
                                    )}
                                </div>

                            </div>


                            <button
                                class="remove-cart"
                                onclick="removeFromCart(${product.id})">

                                <i class="fa-solid fa-trash"></i>

                            </button>

                        </div>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   ABRIR / CERRAR CARRITO
========================================================= */

function openCartPanel() {

    $("cartPanel")
        .classList
        .add("open");

    $("cartOverlay")
        .classList
        .add("show");

    document.body.classList
        .add("no-scroll");

}


function closeCartPanel() {

    $("cartPanel")
        .classList
        .remove("open");

    $("cartOverlay")
        .classList
        .remove("show");

    document.body.classList
        .remove("no-scroll");

}


$("openCart")
    .addEventListener(
        "click",
        openCartPanel
    );


$("closeCart")
    .addEventListener(
        "click",
        closeCartPanel
    );


$("cartOverlay")
    .addEventListener(
        "click",
        closeCartPanel
    );


$("continueShopping")
    .addEventListener(
        "click",
        () => {

            closeCartPanel();

            document
                .getElementById("catalogo")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


/* =========================================================
   FAVORITOS PANEL
========================================================= */

function openFavoritesPanel() {

    renderFavorites();

    $("favoritesPanel")
        .classList
        .add("open");

    $("favoritesOverlay")
        .classList
        .add("show");

    document.body.classList
        .add("no-scroll");

}


function closeFavoritesPanel() {

    $("favoritesPanel")
        .classList
        .remove("open");

    $("favoritesOverlay")
        .classList
        .remove("show");

    document.body.classList
        .remove("no-scroll");

}


$("openFavorites")
    .addEventListener(
        "click",
        openFavoritesPanel
    );


$("closeFavorites")
    .addEventListener(
        "click",
        closeFavoritesPanel
    );


$("favoritesOverlay")
    .addEventListener(
        "click",
        closeFavoritesPanel
    );


/* =========================================================
   BUSCADOR
========================================================= */

$("openSearch")
    .addEventListener(
        "click",
        () => {

            $("searchOverlay")
                .classList
                .add("show");

            $("globalSearch")
                .focus();

            document.body.classList
                .add("no-scroll");

        }
    );


$("closeSearch")
    .addEventListener(
        "click",
        closeSearch
    );


$("searchOverlay")
    .addEventListener(
        "click",
        event => {

            if (
                event.target ===
                $("searchOverlay")
            ) {

                closeSearch();

            }

        }
    );


function closeSearch() {

    $("searchOverlay")
        .classList
        .remove("show");

    document.body.classList
        .remove("no-scroll");

}


$("globalSearch")
    .addEventListener(
        "input",
        event => {

            $("searchInput").value =
                event.target.value;

            renderProducts();

        }
    );


/* =========================================================
   EVENTOS DE FILTROS
========================================================= */

$("searchInput")
    .addEventListener(
        "input",
        renderProducts
    );


$("brandFilter")
    .addEventListener(
        "change",
        renderProducts
    );


$("styleFilter")
    .addEventListener(
        "change",
        renderProducts
    );


$("sizeFilter")
    .addEventListener(
        "change",
        renderProducts
    );


$("sortFilter")
    .addEventListener(
        "change",
        renderProducts
    );


$("clearFilters")
    .addEventListener(
        "click",
        clearFilters
    );


$("emptyClear")
    .addEventListener(
        "click",
        clearFilters
    );


/* =========================================================
   CATEGORÍAS
========================================================= */

document
    .querySelectorAll(".category-card")
    .forEach(
        card => {

            card.addEventListener(
                "click",
                () => {

                    const category =
                        card.dataset.category;


                    $("styleFilter").value =
                        category;


                    renderProducts();


                    document
                        .getElementById(
                            "catalogo"
                        )
                        .scrollIntoView({
                            behavior: "smooth"
                        });

                }
            );

        }
    );


/* =========================================================
   MENÚ MÓVIL
========================================================= */

$("mobileMenu")
    .addEventListener(
        "click",
        () => {

            $("mobileNav")
                .classList
                .toggle("open");

        }
    );


document
    .querySelectorAll(".mobile-nav a")
    .forEach(
        link => {

            link.addEventListener(
                "click",
                () => {

                    $("mobileNav")
                        .classList
                        .remove("open");

                }
            );

        }
    );


/* =========================================================
   CHECKOUT DEMO
========================================================= */

document
    .querySelector(".checkout-button")
    .addEventListener(
        "click",
        () => {

            if (cart.length === 0) {

                showToast(
                    "Tu carrito está vacío.",
                    "error"
                );

                return;

            }


            showToast(
                "Proceso de compra disponible próximamente."
            );

        }
    );


/* =========================================================
   NAVEGACIÓN ACTIVA
========================================================= */

const sections =
    document.querySelectorAll(
        "main section[id]"
    );

const navLinks =
    document.querySelectorAll(
        ".desktop-nav .nav-item"
    );


window.addEventListener(
    "scroll",
    () => {

        let current = "";


        sections.forEach(
            section => {

                const sectionTop =
                    section.offsetTop - 150;

                if (
                    window.scrollY >=
                    sectionTop
                ) {

                    current =
                        section.id;

                }

            }
        );


        navLinks.forEach(
            link => {

                link.classList.remove(
                    "active"
                );


                if (
                    link.getAttribute(
                        "href"
                    ) === `#${current}`
                ) {

                    link.classList.add(
                        "active"
                    );

                }

            }
        );

    }
);


/* =========================================================
   INICIAR APLICACIÓN
========================================================= */

populateFilters();

renderProducts();

updateCart();

renderFavorites();

updateFavoriteCount();
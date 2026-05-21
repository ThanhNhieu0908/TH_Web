// RENDER GIAO DIỆN FLEET & XỬ LÝ LỖI ẢNH (Image Fallback)
const productList = document.getElementById("product-list");

// Dùng biến fleetData từ file data.js đã được nhúng trước đó
fleetData.forEach((car) => {
  // onerror: Nếu Github Pages block Unsplash, tự động thay bằng ảnh xám có text
  const safeImg = `onerror="this.onerror=null;this.src='https://placehold.co/700x400/1a1a1a/d4af37?text=${car.name.replace(/ /g, "+")}'"`;

  productList.innerHTML += `
    <div class="card">
        <img src="${car.img}" alt="${car.name}" ${safeImg}>
        <div class="card-body">
            ${car.badge ? `<span class="card-badge">${car.badge}</span>` : ""}
            <h3 class="card-title">${car.name}</h3>
            <p class="card-price">${car.price}</p>
            <button class="btn btn-outline" style="width: 100%; padding: 12px;" onclick="window.location.hash='#contact'">Book Test Drive</button>
        </div>
    </div>
  `;
});

// SPA ROUTING ENGINE (Chuyển trang bằng Hash #)
function handleRouting() {
  // Lấy hash hiện tại trên thanh địa chỉ URL (vd: #about), mặc định là #home
  let hash = window.location.hash || "#home";

  // Xóa trạng thái active của tất cả các page
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  // Xóa trạng thái active trên thanh menu
  document.querySelectorAll("#nav-links a").forEach((link) => {
    link.classList.remove("active");
  });

  // Tìm thẻ <div> có id khớp với hash và bật nó lên
  const targetPage = document.querySelector(hash);
  if (targetPage) {
    targetPage.classList.add("active");
  } else {
    // Nếu người dùng nhập linh tinh (vd: #xyz), fallback về trang chủ
    document.getElementById("home").classList.add("active");
    hash = "#home";
  }

  // Highlight đúng menu đang đứng
  const activeMenuLink = document.querySelector(`#nav-links a[href="${hash}"]`);
  if (activeMenuLink) activeMenuLink.classList.add("active");

  // Tự động scroll lên đầu trang khi đổi view
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Kích hoạt Routing khi người dùng click vào menu hoặc ấn Back/Forward trên trình duyệt
window.addEventListener("hashchange", handleRouting);

// Kích hoạt ngay lập tức khi load xong file HTML
window.addEventListener("DOMContentLoaded", handleRouting);

// 1. Tạo mảng chứa các sản phẩm trong giỏ hàng
let cart = [];

document.addEventListener("DOMContentLoaded", function () {
  // Gọi hàm hiển thị xe và hiển thị giỏ hàng ban đầu
  renderProducts();
  updateCartUI();

  // 2. Logic Bật/Tắt hiển thị bảng Giỏ hàng khi bấm vào icon Giỏ hàng
  const cartIcon = document.getElementById("cart-icon");
  const cartDropdown = document.getElementById("cart-dropdown");

  cartIcon.addEventListener("click", function (e) {
    e.stopPropagation(); // Ngăn sự kiện nổi bọt
    if (
      cartDropdown.style.display === "none" ||
      cartDropdown.style.display === ""
    ) {
      cartDropdown.style.display = "block";
    } else {
      cartDropdown.style.display = "none";
    }
  });

  // Bấm ra ngoài giỏ hàng thì tự động đóng bảng lại
  document.addEventListener("click", function () {
    cartDropdown.style.display = "none";
  });
  cartDropdown.addEventListener("click", function (e) {
    e.stopPropagation(); // Bấm bên trong bảng giỏ hàng thì không bị đóng
  });
});

// 3. Hàm hiển thị danh sách siêu xe từ dữ liệu data.js vào mục #product-list
function renderProducts() {
  const productList = document.getElementById("product-list");
  if (!productList) return;

  productList.innerHTML = ""; // Xóa dữ liệu cũ nếu có

  // Duyệt qua mảng dữ liệu có sẵn trong data.js (Ví dụ mảng tên là supercars)
  supercars.forEach((car) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
            <img src="${car.image}" alt="${car.name}" style="width:100%; border-radius: 4px 4px 0 0; height: 200px; object-fit: cover;">
            <div class="card-body" style="padding: 20px; text-align: left;">
                <h3 class="card-title" style="color: #fff; margin-bottom: 10px;">${car.name}</h3>
                <p style="color: #999; font-size: 14px; margin-bottom: 15px; height: 40px; overflow: hidden;">${car.desc}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #d4af37; font-weight: bold; font-size: 18px;">$${car.price.toLocaleString()}</span>
                    <button class="btn buy-btn" style="padding: 6px 12px; font-size: 14px;" onclick="addToCart(${car.id})">Mua ngay</button>
                </div>
            </div>
        `;
    productList.appendChild(card);
  });
}

// 4. Hàm Thêm Sản Phẩm Vào Giỏ Hàng
function addToCart(id) {
  // Tìm sản phẩm trong mảng dữ liệu gốc dựa vào ID
  const product = supercars.find((item) => item.id === id);
  if (!product) return;

  // Kiểm tra xem sản phẩm này đã có trong giỏ hàng chưa
  const cartItem = cart.find((item) => item.id === id);

  if (cartItem) {
    cartItem.quantity += 1; // Nếu có rồi thì tăng số lượng lên 1
  } else {
    // Nếu chưa có thì thêm đối tượng mới vào mảng với số lượng là 1
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  // Cập nhật giao diện và thông báo cho người dùng
  updateCartUI();
  alert(`Đã thêm ${product.name} vào giỏ hàng thành công!`);
}

// 5. Hàm Xóa Sản Phẩm khỏi Giỏ Hàng
function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCartUI();
}

// 6. Hàm Cập Nhật Toàn Bộ Giao Diện Giỏ Hàng (Số lượng icon, danh sách chi tiết, tổng tiền)
function updateCartUI() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  // Tính tổng số lượng item để hiển thị lên Badge icon
  let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.innerText = totalItems;

  // Nếu giỏ hàng trống
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p style="color: #777; font-size: 14px; text-align: center; padding: 10px 0;">Giỏ hàng trống.</p>`;
    cartTotal.innerText = "$0";
    return;
  }

  // Render danh sách các món đồ có trong giỏ hàng
  cartItemsContainer.innerHTML = "";
  let totalPrice = 0;

  cart.forEach((item) => {
    totalPrice += item.price * item.quantity;

    const div = document.createElement("div");
    div.style.cssText =
      "display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 14px; color: #ccc; border-bottom: 1px dashed #222; padding-bottom: 5px;";
    div.innerHTML = `
            <div style="max-width: 70%;">
                <span style="color: #fff; font-weight: bold;">${item.name}</span><br>
                <span style="color: #777;">$${item.price.toLocaleString()} x ${item.quantity}</span>
            </div>
            <button style="background: none; border: none; color: #ff4d4d; cursor: pointer; font-size: 16px;" onclick="removeFromCart(${item.id})">✕</button>
        `;
    cartItemsContainer.appendChild(div);
  });

  // Cập nhật tổng tiền lên giao diện
  cartTotal.innerText = "$" + totalPrice.toLocaleString();
}

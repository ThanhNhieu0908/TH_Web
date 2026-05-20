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

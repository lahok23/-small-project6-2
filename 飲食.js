document.addEventListener("DOMContentLoaded", function () {
  // 切换菜单的显示和隐藏
  function toggleMenu() {
    const navbar = document.querySelector(".navbar");
    navbar.classList.toggle("hidden");
  }

  // 监听窗口大小变化事件，控制菜单的显示和隐藏
  window.addEventListener("resize", () => {
    const navbar = document.querySelector(".navbar");
    if (window.innerWidth <= 1042) {
      navbar.classList.add("hidden");
    } else {
      navbar.classList.remove("hidden");
    }
  });

  // 初始加载时根据窗口宽度设置菜单显示或隐藏
  const navbar = document.querySelector(".navbar");
  if (window.innerWidth <= 1042) {
    navbar.classList.add("hidden");
  } else {
    navbar.classList.remove("hidden");
  }

  // 将 toggleMenu 函数绑定到汉堡菜单按钮的点击事件
  const hamburger = document.querySelector(".hamburger");
  hamburger.addEventListener("click", toggleMenu);
});

// 獲取彈跳視窗
var modal = document.getElementById("quantityModal");

// 獲取觸發彈跳視窗顯示的按鈕
var purchaseButtons = document.querySelectorAll(".addToCartBtn");

// 初始化商品單價和數量
var pricePerItem = 0;
var quantity = 1;
var currentProduct = null;

// 當用戶點擊任何一個購買按鈕時，顯示彈跳視窗
purchaseButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    modal.style.display = "block";
    // 獲取商品相關信息
    var productId = this.getAttribute("data-id");
    var productName = this.getAttribute("data-name");
    var productImage = this.getAttribute("data-image");
    var priceText = this.parentNode.querySelector(".price")?.innerText;

    if (priceText) {
      // 獲取商品價格
      pricePerItem = parseFloat(priceText.replace(/[^\d.]/g, ""));
    } else {
      console.error("商品價格未找到");
      return;
    }

    // 保存當前商品信息
    currentProduct = {
      id: productId,
      name: productName,
      image: productImage,
      price: pricePerItem,
    };

    // 更新彈跳視窗中的商品名稱和總價格
    updateTotalPrice();
  });
});

// 當用戶輸入數量時，更新彈跳視窗中的總價格
document.getElementById("quantityInput").addEventListener("input", function () {
  quantity = parseInt(this.value) || 1; // 如果輸入不是數字，則將數量設為1
  // 更新彈跳視窗中的總價格
  updateTotalPrice();
});

// 更新彈跳視窗中的總價格
function updateTotalPrice() {
  var total = pricePerItem * quantity;
  document.getElementById("totalAmount").innerText = "總金額：" + total + "元";
}

// 當用戶點擊彈跳視窗外部區域時，隱藏彈跳視窗
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// 獲取所有需要添加聲音的文本元素
var audioElements = document.querySelectorAll(".play-audio");

// 遍歷每個文本元素
audioElements.forEach(function (element) {
  // 添加點擊事件監聽器
  element.addEventListener("click", function () {
    // 獲取語音文件的URL
    var audioUrl = this.getAttribute("data-audio");
    // 創建新的音頻元素
    var audio = new Audio(audioUrl);
    // 播放語音
    audio.play();
    // 監聽音頻播放結束事件，並在播放結束後移除音頻元素
    audio.addEventListener("ended", function () {
      audio.remove();
    });
  });
});

// 獲取所有需要添加聲音的i標籤元素
var audioElements = document.querySelectorAll(".play-audio");

// 遍歷每個i標籤元素
audioElements.forEach(function (element) {
  // 添加點擊事件監聽器
  element.addEventListener("click", function () {
    // 獲取語音文件的URL
    var audioUrl = this.getAttribute("data-audio");
    // 創建新的音頻元素
    var audio = new Audio(audioUrl);
    // 播放語音
    audio.play();
    // 添加已點擊類
    this.classList.add("clicked");
    // 監聽音頻播放結束事件，並在播放結束後移除音頻元素和已點擊類
    audio.addEventListener("ended", function () {
      audio.remove();
      element.classList.remove("clicked");
    });
  });
});

// 購物車共用
const cartItemCount = document.getElementById("cartItemCount");
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

// 更新購物車商品數量顯示
function updateCartItemCount() {
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  cartItemCount.textContent = totalItems;
  cartItemCount.style.display = totalItems > 0 ? "inline" : "none";
}

// 添加商品到購物車
function addToCart(product, quantity = 1) {
  const existingItem = cartItems.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cartItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
    });
  }
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  updateCartItemCount(); // 更新購物車商品數量顯示
}

// 從本地存儲加載購物車內容
function loadCartItems() {
  cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  updateCartItemCount(); // 初始化頁面時更新購物車商品數量顯示
}

// 初始化頁面時加載購物車內容
loadCartItems();

// 確認按鈕事件處理程序
document
  .getElementById("confirmQuantity")
  .addEventListener("click", function () {
    if (currentProduct) {
      addToCart(currentProduct, quantity);

      // 顯示成功提示信息
      document.getElementById("purchaseSuccess").style.display = "block";

      // 延遲關閉彈跳視窗和成功提示信息
      setTimeout(function () {
        document.getElementById("purchaseSuccess").style.display = "none";
        modal.style.display = "none"; // 關閉彈跳視窗
      }, 1500);
    } else {
      console.error("商品信息未找到");
    }
  });

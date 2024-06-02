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

document.addEventListener("DOMContentLoaded", function () {
  // 選擇所有購買按鈕
  const purchaseButtons = document.querySelectorAll(".btn-filled-dark");

  // 選擇模態框和相關元素
  const modal = document.getElementById("quantityModal");
  const span = document.getElementsByClassName("close")[0];
  const confirmQuantityButton = document.getElementById("confirmQuantity");
  const purchaseSuccessMessage = document.getElementById("purchaseSuccess");
  const totalAmountElement = document.getElementById("totalAmount");
  const quantityInput = document.getElementById("quantityInput");

  // 當前選擇的商品
  let currentItem = null;

  // 在購買按鈕的點擊事件監聽器中更新數量值
  purchaseButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // 確保獲取到的元素存在
      const priceElement = this.parentElement.querySelector(".price");
      const nameElement = this.parentElement.querySelector("h3");
      const imageElement = this.getAttribute("data-image");

      if (priceElement && nameElement) {
        // 更新數量值
        const price = parseInt(priceElement.dataset.price, 10);
        currentItem = {
          id: Date.now().toString(),
          name: nameElement.innerText,
          price: price,
          image: imageElement, // 獲取圖片 URL
          quantity: 1, // 默認數量為1
        };

        modal.style.display = "block";
        // 在彈跳視窗打開時立即更新價格
        updateTotalPrice();
      } else {
        console.error("Price or name element not found.");
      }
    });
  });

  // 當用戶點擊 <span> (x), 關閉模態框
  span.onclick = function () {
    modal.style.display = "none";
  };

  // 當用戶點擊確認按鈕
  confirmQuantityButton.addEventListener("click", function () {
    console.log("確認按鈕被點擊了"); // 添加調試語句，確保確認按鈕被點擊

    const quantity = parseInt(quantityInput.value, 10) || 1;
    currentItem.quantity = quantity; // 更新當前選擇的商品的數量

    addToCart(currentItem);
    purchaseSuccessMessage.style.display = "block";

    // 延遲關閉彈跳視窗和成功提示信息
    setTimeout(function () {
      purchaseSuccessMessage.style.display = "none";
      modal.style.display = "none"; // 關閉彈跳視窗
    }, 1500);
  });

  // 當用戶點擊模態框外部時關閉模態框
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // 添加商品到購物車
  function addToCart(item) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItems.push(item);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartItemCount();
  }

  // 根據購物車內商品數量更新顯示
  function updateCartItemCount() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const cartItemCount = document.getElementById("cartItemCount");
    const totalItems = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    cartItemCount.textContent = totalItems;
    cartItemCount.style.display = totalItems > 0 ? "inline" : "none";
  }

  // 初始化購物車數量顯示
  updateCartItemCount();

  // 漢堡菜單點擊事件
  const hamburger = document.querySelector(".hamburger");
  const navbar = document.querySelector(".navbar");
  hamburger.addEventListener("click", () => {
    navbar.classList.toggle("open");
  });

  // 當用戶輸入數量時，更新彈跳視窗中的總價格
  quantityInput.addEventListener("input", function () {
    const quantity = parseInt(this.value, 10) || 1; // 如果輸入不是數字，則將數量設為1
    const total = currentItem.price * quantity;
    totalAmountElement.innerText = "總金額：" + total + "元";
  });

  // 更新總價格
  function updateTotalPrice() {
    const total = currentItem.price * currentItem.quantity;
    totalAmountElement.innerText = "總金額：" + total + "元";
  }
});

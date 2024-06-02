document.addEventListener("DOMContentLoaded", function () {
  const cartItemCount = document.getElementById("cartItemCount");
  const cartItemsElement = document.getElementById("cartItems");
  const checkoutForm = document.getElementById("checkoutForm");

  // 从本地存储获取购物车内容
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  // 更新购物车商品数量显示
  function updateCartItemCount() {
    const totalItems = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    cartItemCount.textContent = totalItems;
    cartItemCount.style.display = totalItems > 0 ? "inline" : "none";
  }

  // 显示购物车内容
  function displayCartItems() {
    if (!cartItemsElement) return; // 如果页面没有购物车元素则返回
    cartItemsElement.innerHTML = "";
    let subtotal = 0;

    cartItems.forEach((item, index) => {
      const cartItem = document.createElement("li");
      cartItem.classList.add("items", index % 2 === 0 ? "even" : "odd");
      cartItem.innerHTML = `
        <div class="infoWrap">
          <div class="cartSection">
            <img src="${item.image}" alt="${item.name}" class="itemImg" />
            <p class="itemNumber"></p>
            <h3>${item.name}</h3>
            <span>數量</span><input type="text" class="qty" value="${
              item.quantity
            }" data-index="${index}" />
            ${
              item.date
                ? `<p class="reservationDate">預約日期: ${item.date}</p>`
                : ""
            }
          </div>
          <div class="prodTotal cartSection">
            <p>$${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <div class="cartSection removeWrap">
            <a href="#" class="remove" data-index="${index}">x</a>
          </div>
        </div>
      `;
      cartItemsElement.appendChild(cartItem);
      subtotal += item.price * item.quantity;
    });

    document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("total").textContent = `$${(subtotal + 5).toFixed(
      2
    )}`; // 假设运费为 $5.00

    // 绑定移除按钮的事件监听器
    bindRemoveButtons();

    // 绑定数量输入框的事件监听器
    bindQuantityInputs();

    updateCartItemCount();
  }

  // 绑定移除按钮事件
  function bindRemoveButtons() {
    document.querySelectorAll(".remove").forEach((removeButton) => {
      removeButton.addEventListener("click", function (event) {
        event.preventDefault();
        const index = parseInt(this.dataset.index);
        removeFromCart(index);
      });
    });
  }

  // 绑定数量输入框事件
  function bindQuantityInputs() {
    document.querySelectorAll(".qty").forEach((input) => {
      input.addEventListener("change", function () {
        const index = parseInt(this.dataset.index);
        const newQuantity = parseInt(this.value);
        if (newQuantity > 0) {
          cartItems[index].quantity = newQuantity;
          localStorage.setItem("cartItems", JSON.stringify(cartItems));
          displayCartItems();
        } else {
          this.value = cartItems[index].quantity;
        }
      });
    });
  }

  // 移除购物车中的商品
  function removeFromCart(index) {
    cartItems.splice(index, 1);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    displayCartItems();
    updateCartItemCount();
  }

  // 初始化页面时，显示购物车内容
  displayCartItems();

  // 添加商品到购物车按钮点击事件处理程序
  document.querySelectorAll(".addToCartBtn").forEach((button) => {
    button.addEventListener("click", function () {
      const itemId = this.dataset.id;
      const itemName = this.dataset.name;
      const itemPrice = parseFloat(this.dataset.price);
      const itemImage = this.dataset.image;
      const itemDate = this.dataset.date; // 确保日期数据正确传递
      addToCart(itemId, itemName, itemPrice, itemImage, itemDate, 1);
    });
  });

  // 添加商品到购物车的函数
  function addToCart(
    itemId,
    itemName,
    itemPrice,
    itemImage,
    itemDate,
    itemQuantity = 1
  ) {
    const existingItem = cartItems.find((item) => item.id === itemId);
    if (existingItem) {
      existingItem.quantity += itemQuantity;
    } else {
      cartItems.push({
        id: itemId,
        name: itemName,
        price: itemPrice,
        image: itemImage,
        date: itemDate || "", // 存储日期信息
        quantity: itemQuantity,
      });
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartItemCount();
    displayCartItems(); // 更新购物车显示
  }

  // 处理结帐表单提交
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("name").value;
      const phone = document.getElementById("phone").value;
      const address = document.getElementById("address").value;
      const creditCard = document.getElementById("creditCard").value;

      // 您可以在这里添加更多的验证逻辑

      // 显示确认信息
      alert(
        `結帳成功！\n\n姓名: ${name}\n電話: ${phone}\n住址: ${address}\n信用卡號: ${creditCard}\n\n感謝您的購買！`
      );

      // 清空购物车
      cartItems = [];
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      updateCartItemCount();
      displayCartItems();

      // 重置表单
      checkoutForm.reset();
    });
  }
});

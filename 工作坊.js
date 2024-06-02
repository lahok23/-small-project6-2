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

var audioElements = document.querySelectorAll(".play-audio");
audioElements.forEach(function (element) {
  element.addEventListener("click", function () {
    var audioUrl = this.getAttribute("data-audio");
    var audio = new Audio(audioUrl);
    audio.play();
    this.classList.add("clicked");
    audio.addEventListener("ended", function () {
      audio.remove();
      element.classList.remove("clicked");
    });
  });
});

var reservationModal = document.getElementById("reservation-modal");
var closeBtn = document.querySelector(".close-btn");
var confirmBtn = document.getElementById("confirmQuantityBtn");
var cartItemCount = document.getElementById("cartItemCount");

var globalCourseName = null;
var globalCoursePrice = null;
var globalCourseImage = null; // 添加变量存储图片 URL

document.querySelectorAll(".card-item button").forEach((button) => {
  button.addEventListener("click", function () {
    globalCourseName = this.getAttribute("data-course");
    globalCoursePrice = this.getAttribute("data-price");
    globalCourseImage = this.getAttribute("data-image"); // 获取图片 URL

    console.log("Button clicked");
    console.log("globalCourseName:", globalCourseName);
    console.log("globalCoursePrice:", globalCoursePrice);
    console.log("globalCourseImage:", globalCourseImage); // 输出图片 URL 以便调试

    reservationModal.style.display = "block";
    document.getElementById("total-price").innerText = `$${globalCoursePrice}`;
    document.getElementById("selected-people").value = 1;
    document.getElementById("selected-date").value = "";
  });
});

window.onclick = function (event) {
  if (event.target == reservationModal) {
    reservationModal.style.display = "none";
  }
};

closeBtn.onclick = function () {
  reservationModal.style.display = "none";
};

document
  .getElementById("selected-people")
  .addEventListener("input", function () {
    const pricePerPerson = globalCoursePrice;
    const selectedPeople = this.value;
    document.getElementById("total-price").innerText = `$${
      pricePerPerson * selectedPeople
    }`;
  });

confirmBtn.addEventListener("click", function () {
  const selectedDate = document.getElementById("selected-date").value;
  const selectedPeople = document.getElementById("selected-people").value;
  const courseName = globalCourseName;
  const coursePrice = globalCoursePrice;
  const courseImage = globalCourseImage; // 获取图片 URL
  const totalPrice = coursePrice * selectedPeople;

  console.log("Confirm button clicked");
  console.log("Selected Date:", selectedDate);
  console.log("Selected People:", selectedPeople);
  console.log("Course Name:", courseName);
  console.log("Course Price:", coursePrice);
  console.log("Total Price:", totalPrice);

  if (selectedDate && selectedPeople > 0) {
    const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    cart.push({
      id: Date.now().toString(),
      name: courseName,
      price: coursePrice,
      quantity: parseInt(selectedPeople),
      image: courseImage, // 存储图片 URL
      date: selectedDate, // 存储日期
    });
    localStorage.setItem("cartItems", JSON.stringify(cart));

    updateCartItemCount(); // 更新购物车数量显示

    var successMessage = document.getElementById("success-message");
    successMessage.style.display = "block";

    setTimeout(() => {
      successMessage.style.display = "none";
      reservationModal.style.display = "none";
    }, 2000);

    updateCartVisibility();
  } else {
    alert("請選擇日期和人數，這是預約成功所需的必要條件。");
  }
});

function updateCartItemCount() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  cartItemCount.textContent = cartItems.reduce(
    (total, item) => total + parseInt(item.quantity),
    0
  );
  cartItemCount.style.display = cartItems.length > 0 ? "inline" : "none";
}

function updateCartVisibility() {
  if (parseInt(cartItemCount.innerText) === 0) {
    cartItemCount.style.display = "none";
  } else {
    cartItemCount.style.display = "inline";
  }
}

updateCartItemCount();
updateCartVisibility();

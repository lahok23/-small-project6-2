document.addEventListener("DOMContentLoaded", (event) => {
  const popups = {
    destination: document.getElementById("destination-popup"),
    date: document.getElementById("date-popup"),
    guests: document.getElementById("guests-popup"),
    booking: document.getElementById("booking-popup"),
    success: document.getElementById("success-popup"),
  };

  const inputs = {
    destination: document.getElementById("destination-input"),
    date: document.getElementById("date-input"),
    guests: document.getElementById("guests-input"),
  };

  const closeButtons = {
    destination: document.getElementById("destination-close-btn"),
    date: document.getElementById("date-close-btn"),
    guests: document.getElementById("guests-close-btn"),
  };

  const saveButtons = {
    destination: document.getElementById("destination-save-btn"),
    date: document.getElementById("date-save-btn"),
    guests: document.getElementById("guests-save-btn"),
  };

  const bookingTitle = document.getElementById("booking-title");
  const bookingStartDate = document.getElementById("booking-start-date");
  const bookingEndDate = document.getElementById("booking-end-date");
  const bookingAdults = document.getElementById("booking-adults");
  const bookingChildren = document.getElementById("booking-children");
  const confirmBookingBtn = document.getElementById("confirmBookingBtn");

  const cartItemCount = document.getElementById("cartItemCount");

  // Helper function to show/hide popup
  const togglePopup = (popup, show) => {
    popup.style.display = show ? "block" : "none";
  };

  // Event listeners for input clicks
  inputs.destination.addEventListener("click", () =>
    togglePopup(popups.destination, true)
  );
  inputs.date.addEventListener("click", () => togglePopup(popups.date, true));
  inputs.guests.addEventListener("click", () =>
    togglePopup(popups.guests, true)
  );

  // Event listeners for close buttons
  closeButtons.destination.addEventListener("click", () =>
    togglePopup(popups.destination, false)
  );
  closeButtons.date.addEventListener("click", () =>
    togglePopup(popups.date, false)
  );
  closeButtons.guests.addEventListener("click", () =>
    togglePopup(popups.guests, false)
  );

  // Event listeners for save buttons
  saveButtons.destination.addEventListener("click", () => {
    const selectedValue = document.getElementById("destination-select").value;
    inputs.destination.value = selectedValue;
    togglePopup(popups.destination, false);
  });

  saveButtons.date.addEventListener("click", () => {
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;
    inputs.date.value = `${startDate} - ${endDate}`;
    togglePopup(popups.date, false);
  });

  saveButtons.guests.addEventListener("click", () => {
    const adults = document.getElementById("adults").value;
    const children = document.getElementById("children").value;
    inputs.guests.value = `${adults} 位旅客, 1 間客房`;
    togglePopup(popups.guests, false);
  });

  window.addEventListener("click", (event) => {
    if (event.target === popups.destination) {
      togglePopup(popups.destination, false);
    }
    if (event.target === popups.date) {
      togglePopup(popups.date, false);
    }
    if (event.target === popups.guests) {
      togglePopup(popups.guests, false);
    }
  });

  // Room item visibility logic
  const items = document.querySelectorAll(".room-item");
  const visibleItems = 4; // Number of items to show at a time
  let currentIndex = 0;

  function updateVisibility() {
    items.forEach((item, index) => {
      if (index >= currentIndex && index < currentIndex + visibleItems) {
        item.classList.add("visible");
      } else {
        item.classList.remove("visible");
      }
    });
    console.log("Current index:", currentIndex);
  }

  function scrollRight() {
    if (currentIndex + visibleItems < items.length) {
      currentIndex += visibleItems;
    } else {
      currentIndex = 0;
    }
    updateVisibility();
  }

  function scrollLeft() {
    if (currentIndex - visibleItems >= 0) {
      currentIndex -= visibleItems;
    } else {
      currentIndex = Math.max(0, items.length - visibleItems);
    }
    updateVisibility();
  }

  updateVisibility(); // Initialize visibility on page load

  document.querySelector(".arrow-right").addEventListener("click", scrollRight);
  document.querySelector(".arrow-left").addEventListener("click", scrollLeft);

  // 房间预订功能
  function showBookingPopup(roomName, roomPrice, roomImage) {
    bookingTitle.innerText = `預訂房間: ${roomName}`;
    bookingStartDate.value = "";
    bookingEndDate.value = "";
    bookingAdults.value = 1;
    bookingChildren.value = 0;
    togglePopup(popups.booking, true);
    confirmBookingBtn.onclick = function () {
      confirmBooking(roomName, roomPrice, roomImage);
    };
  }

  function confirmBooking(roomName, roomPrice, roomImage) {
    const startDate = bookingStartDate.value;
    const endDate = bookingEndDate.value;
    const adults = bookingAdults.value;
    const children = bookingChildren.value;

    if (!startDate || !endDate) {
      alert("請選擇入住和退房日期");
      return;
    }

    const bookingInfo = {
      name: roomName,
      price: roomPrice,
      image: roomImage, // Add the image URL to the booking info
      startDate,
      endDate,
      quantity: 1, // This could be modified as needed
      date: `${startDate} 至 ${endDate}`, // Add this line to correctly show the date in cart
    };

    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItems.push(bookingInfo);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    updateCartItemCount();

    togglePopup(popups.booking, false);
    togglePopup(popups.success, true);

    setTimeout(() => {
      togglePopup(popups.success, false);
    }, 2000);
  }

  function updateCartItemCount() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const totalItems = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    cartItemCount.textContent = totalItems;
    cartItemCount.style.display = totalItems > 0 ? "inline" : "none";
  }

  updateCartItemCount();

  // 绑定事件监听器到预订按钮
  const bookingLinks = document.querySelectorAll(".booking-link");
  bookingLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const roomName = this.getAttribute("data-name");
      const roomPrice = parseFloat(this.getAttribute("data-price"));
      const roomImage = this.getAttribute("data-image"); // Get the image URL
      showBookingPopup(roomName, roomPrice, roomImage);
    });
  });
});

// 切换菜单
function toggleMenu() {
  const navbar = document.querySelector(".navbar");
  navbar.classList.toggle("hidden");
}

window.addEventListener("resize", function () {
  const navbar = document.querySelector(".navbar");
  if (window.innerWidth <= 1042) {
    navbar.classList.add("hidden");
  } else {
    navbar.classList.remove("hidden");
  }
});

// 显示弹窗
function showPopup(popupId) {
  document.getElementById(popupId).style.display = "block";
}

// 关闭弹窗
function closePopup(popupId) {
  document.getElementById(popupId).style.display = "none";
}

// 隐藏弹窗
function hidePopup(popupId) {
  document.getElementById(popupId).style.display = "none";
}

function searchRooms() {
  var destination = document.getElementById("destination-input").value;
  var rooms = document.querySelectorAll(".room-item");

  rooms.forEach(function (room) {
    if (
      destination === "" ||
      room.getAttribute("data-location") === destination
    ) {
      room.style.display = "block";
    } else {
      room.style.display = "none";
    }
  });
}

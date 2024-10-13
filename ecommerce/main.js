const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

// header container
ScrollReveal().reveal(".header__container h1", scrollRevealOption);
ScrollReveal().reveal(".header__container h4", { ...scrollRevealOption, delay: 500 });
ScrollReveal().reveal(".header__container .btn", { ...scrollRevealOption, delay: 1000 });

// about container
ScrollReveal().reveal(".about__container .section__header", scrollRevealOption);
ScrollReveal().reveal(".about__container .section__subheader", { ...scrollRevealOption, delay: 500 });
ScrollReveal().reveal(".about__container .about__flex", { ...scrollRevealOption, delay: 1000 });
ScrollReveal().reveal(".about__container .btn", { ...scrollRevealOption, delay: 1500 });

// discover container
ScrollReveal().reveal(".discover__card", { ...scrollRevealOption, interval: 500 });
ScrollReveal().reveal(".discover__card__content", { ...scrollRevealOption, interval: 500, delay: 200 });

// blogs container
ScrollReveal().reveal(".blogs__card", { duration: 1000, interval: 400 });

// journals container
ScrollReveal().reveal(".journals__card", { ...scrollRevealOption, interval: 400 });

// Smooth scroll to the camping section
document.querySelector('a[href="#camping"]').addEventListener('click', function(e) {
  e.preventDefault();
  document.querySelector('#camping').scrollIntoView({ behavior: 'smooth' });
});

// Camping card reveal
ScrollReveal().reveal(".camping__card", {
  ...scrollRevealOption,
  interval: 400,
  delay: 200,
  easing: 'ease-in-out'
});

// gallery
ScrollReveal().reveal(".section__header", { ...scrollRevealOption, interval: 500, delay: 200 });
ScrollReveal().reveal(".section__subheader", { ...scrollRevealOption, interval: 500, delay: 200 });
ScrollReveal().reveal(".gallery__card", {
  ...scrollRevealOption,
  interval: 400,
  delay: 200,
  easing: 'ease-in-out'
});

// lodges and mountain section
ScrollReveal().reveal(".lodges__card, .about__card", {
  ...scrollRevealOption,
  interval: 400,
  delay: 200,
  easing: 'ease-in-out'
});

// Modal functionality
const bookingFormModal = document.getElementById("bookingFormModal");
const openBookingModal = document.getElementById("openBookingModal");
const closeModal = document.getElementById("closeModal");

// Open and close modal events
openBookingModal.addEventListener("click", () => { bookingFormModal.style.display = "flex"; });
closeModal.addEventListener("click", () => { bookingFormModal.style.display = "none"; });
window.addEventListener("click", function(event) {
  if (event.target === bookingFormModal) {
    bookingFormModal.style.display = "none";
  }
});

// Calculate price functionality
const mountainSelect = document.getElementById("mountain");
const packageSelect = document.getElementById("package");
const ageInput = document.getElementById("age");
const totalCostElement = document.getElementById("totalCost");

// Prices for mountains and packages
const mountainPrices = {
  mount_kenya: 300,
  kilimanjaro: 400,
  everest: 1000
};

const packagePrices = {
  beginner: 100,
  intermediate: 200,
  expert: 500
};

// Function to calculate total cost
function calculateTotalCost() {
  const selectedMountain = mountainSelect.value;
  const selectedPackage = packageSelect.value;
  const age = parseInt(ageInput.value, 10);
  let total = 0;

  if (selectedMountain && selectedPackage && !isNaN(age)) {
    const mountainPrice = mountainPrices[selectedMountain];
    const packagePrice = packagePrices[selectedPackage];

    // Age-based price calculation
    if (age < 5) {
      alert("Sorry, children under the age of 5 cannot climb.");
      total = 0;
    } else if (age >= 5 && age <= 10) {
      alert("Sorry, children between the ages of 5 and 10 cannot climb.");
      total = 0;
    } else if (age >= 11 && age <= 15) {
      total = (mountainPrice + packagePrice) / 2; // Charge half price
    } else if (age >= 16 && age <= 18) {
      total = mountainPrice + packagePrice; // Full price for 16 and above
    }
  }

  totalCostElement.textContent = total.toFixed(2); // Update total cost display
}

// Event listeners to update total cost
mountainSelect.addEventListener("change", calculateTotalCost);
packageSelect.addEventListener("change", calculateTotalCost);
ageInput.addEventListener("input", calculateTotalCost);

// Form validation to restrict climbing for children under 16
document.getElementById("bookingForm").addEventListener("submit", function(event) {
  const age = parseInt(ageInput.value, 10);
  if (age < 16) {
    alert("Sorry, only children aged 16 and above can climb.");
    event.preventDefault();
  }
});

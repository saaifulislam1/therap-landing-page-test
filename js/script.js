const modal = document.querySelector("#contactModal");
const modalOpeners = document.querySelectorAll("[data-modal-open]");
const modalClosers = document.querySelectorAll("[data-modal-close]");
const contactForm = document.querySelector(".contact-form");
const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobileNav");
let lastFocusedElement = null;

function setMenuState(isOpen) {
  if (!siteHeader || !menuToggle || !mobileNav) return;

  siteHeader.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );
}

function openModal() {
  lastFocusedElement = document.activeElement;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector("input").focus();
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

modalOpeners.forEach((button) => {
  button.addEventListener("click", openModal);
});

modalClosers.forEach((button) => {
  button.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && siteHeader?.classList.contains("is-open")) {
    setMenuState(false);
  }

  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  contactForm.reset();
  closeModal();
});

if (menuToggle && mobileNav && siteHeader) {
  menuToggle.addEventListener("click", () => {
    setMenuState(!siteHeader.classList.contains("is-open"));
  });

  mobileNav.querySelectorAll("a, button").forEach((item) => {
    item.addEventListener("click", () => {
      if (window.innerWidth <= 640) {
        setMenuState(false);
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 640) {
      setMenuState(false);
    }
  });
}

const track = document.querySelector("#cardTrack");
const previousButton = document.querySelector("#prevSlide");
const nextButton = document.querySelector("#nextSlide");
const slideCount = document.querySelector("#slideCount");

if (track && previousButton && nextButton && slideCount) {
  const originalCards = Array.from(track.querySelectorAll(".info-card"));
  const originalCount = originalCards.length;
  const clonesCount = 6;

  for (let i = 0; i < clonesCount; i++) {
    const clone = originalCards[i].cloneNode(true);
    track.appendChild(clone);
  }

  for (let i = originalCount - 1; i >= originalCount - clonesCount; i--) {
    const clone = originalCards[i].cloneNode(true);
    track.insertBefore(clone, track.firstChild);
  }

  const allCards = Array.from(track.querySelectorAll(".info-card"));
  let currentIndex = clonesCount;
  let isTransitioning = false;

  function updateCarousel(animate = true) {
    if (!animate) {
      track.style.transition = "none";
    } else {
      track.style.transition = "transform 280ms ease";
    }

    const targetOffset = allCards[currentIndex].offsetLeft - 20;
    track.style.transform = `translateX(-${targetOffset}px)`;

    const originalIndex =
      (currentIndex - clonesCount + originalCount) % originalCount;

    allCards.forEach((card, idx) => {
      card.classList.toggle("is-active", idx === currentIndex);
    });

    slideCount.textContent = `${originalIndex + 1}/${originalCount}`;
  }

  nextButton.addEventListener("click", () => {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex++;
    updateCarousel(true);
  });

  previousButton.addEventListener("click", () => {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex--;
    updateCarousel(true);
  });

  track.addEventListener("transitionend", () => {
    isTransitioning = false;

    if (currentIndex >= clonesCount + originalCount) {
      currentIndex = clonesCount;
      updateCarousel(false);
    } else if (currentIndex < clonesCount) {
      currentIndex = clonesCount + originalCount - 1;
      updateCarousel(false);
    }
  });

  window.addEventListener("resize", () => {
    updateCarousel(false);
  });

  updateCarousel(false);
}

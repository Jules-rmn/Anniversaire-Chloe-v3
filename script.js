const envelopeScreen = document.getElementById("envelope-screen");
const questionScreen = document.getElementById("question-screen");
const galleryScreen = document.getElementById("gallery-screen");
const openEnvelope = document.getElementById("openEnvelope");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const heartsContainer = document.getElementById("hearts-container");
const gallery = document.getElementById("gallery");

openEnvelope.addEventListener("click", () => {
  envelopeScreen.classList.remove("active");
  questionScreen.classList.add("active");
});

noButton.addEventListener("mouseover", () => {
  const maxX = Math.max(10, window.innerWidth - noButton.offsetWidth - 20);
  const maxY = Math.max(10, window.innerHeight - noButton.offsetHeight - 20);
  noButton.style.position = "fixed";
  noButton.style.left = Math.random() * maxX + "px";
  noButton.style.top = Math.random() * maxY + "px";
});

yesButton.addEventListener("click", () => {
  questionScreen.classList.remove("active");
  galleryScreen.classList.add("active");
  createHearts();
});

function createHearts() {
  const numberOfHearts = 120;

  for (let i = 0; i < numberOfHearts; i++) {
    setTimeout(() => {
      const heart = document.createElement("div");
      heart.classList.add("heart");
      heart.textContent = ["❤️", "💗", "💕", "💖", "💘"][Math.floor(Math.random() * 5)];
      heart.style.left = Math.random() * 100 + "%";
      heart.style.fontSize = 20 + Math.random() * 40 + "px";
      heart.style.animationDuration = 2 + Math.random() * 2 + "s";
      heartsContainer.appendChild(heart);
      setTimeout(() => heart.remove(), 4500);
    }, i * 25);
  }

  setTimeout(() => {
    gallery.classList.add("visible");
    setupPhotoNavigation();
  }, 3000);
}

// ------------------------------------------------------------------
// Navigation dans la grande "pièce" de photos
// Les photos restent fixes entre elles : on déplace seulement la vue.
// ------------------------------------------------------------------
function setupPhotoNavigation() {
  let panX = Math.min(0, (window.innerWidth - gallery.offsetWidth) / 2);
  let panY = Math.min(0, (window.innerHeight - gallery.offsetHeight) / 2);
  let draggingView = false;
  let startX = 0;
  let startY = 0;
  let startPanX = 0;
  let startPanY = 0;

  function limits() {
    return {
      minX: Math.min(0, window.innerWidth - gallery.offsetWidth),
      maxX: 0,
      minY: Math.min(0, window.innerHeight - gallery.offsetHeight),
      maxY: 0
    };
  }

  function applyPan() {
    const l = limits();
    panX = Math.max(l.minX, Math.min(l.maxX, panX));
    panY = Math.max(l.minY, Math.min(l.maxY, panY));
    gallery.style.transform = `translate3d(${panX}px, ${panY}px, 0)`;
  }

  function beginPan(event) {
    // Une photo ou le texte central ne doit pas déplacer la vue.
    if (event.target.closest(".photo") || event.target.closest(".photo-modal") || event.target.closest(".birthday-message")) return;

    draggingView = true;
    startX = event.clientX;
    startY = event.clientY;
    startPanX = panX;
    startPanY = panY;
    galleryScreen.classList.add("panning");
    galleryScreen.setPointerCapture?.(event.pointerId);
  }

  function movePan(event) {
    if (!draggingView) return;
    panX = startPanX + (event.clientX - startX);
    panY = startPanY + (event.clientY - startY);
    applyPan();
  }

  function endPan(event) {
    if (!draggingView) return;
    draggingView = false;
    galleryScreen.classList.remove("panning");
    try { galleryScreen.releasePointerCapture?.(event.pointerId); } catch (_) {}
  }

  applyPan();
  galleryScreen.addEventListener("pointerdown", beginPan);
  galleryScreen.addEventListener("pointermove", movePan);
  galleryScreen.addEventListener("pointerup", endPan);
  galleryScreen.addEventListener("pointercancel", endPan);

  window.addEventListener("resize", applyPan);
}

// ------------------------------------------------------------------
// Photos : un clic ouvre la photo en grand. La photo ne se déplace pas.
// ------------------------------------------------------------------
const photoModal = document.getElementById("photo-modal");
const expandedPhoto = document.getElementById("expanded-photo");
const closePhoto = document.getElementById("close-photo");
const backPhoto = document.getElementById("back-photo");

function openPhoto(img) {
  expandedPhoto.src = img.src;
  expandedPhoto.alt = img.alt;
  photoModal.classList.add("visible");
  photoModal.setAttribute("aria-hidden", "false");
}

function closePhotoModal() {
  photoModal.classList.remove("visible");
  photoModal.setAttribute("aria-hidden", "true");
  expandedPhoto.src = "";
}

document.querySelectorAll(".photo").forEach(photo => {
  photo.addEventListener("click", event => {
    event.stopPropagation();
    const img = photo.querySelector("img");
    openPhoto(img);
  });
});

closePhoto.addEventListener("click", event => {
  event.stopPropagation();
  closePhotoModal();
});

backPhoto.addEventListener("click", event => {
  event.stopPropagation();
  closePhotoModal();
});

photoModal.addEventListener("click", event => {
  if (event.target === photoModal) closePhotoModal();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && photoModal.classList.contains("visible")) {
    closePhotoModal();
  }
});

/* ============================================
   🎮 PEAKDLE - Home Page Sound Effects
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  // Ajoute SFX aux liens de navigation
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => sfx.hoverSound());
    link.addEventListener("click", () => sfx.navigationSound());
  });

  // Ajoute SFX aux boutons "Play"
  const playButtons = document.querySelectorAll(".play-btn");
  playButtons.forEach((button) => {
    button.addEventListener("mouseenter", () => sfx.cardEnterSound());
    button.addEventListener("mouseleave", () => sfx.cardLeaveSound());
    button.addEventListener("click", () => sfx.clickSound());
  });

  // Ajoute SFX aux cartes de jeu (hover)
  const gameCards = document.querySelectorAll(".game-card");
  gameCards.forEach((card) => {
    card.addEventListener("mouseenter", () => sfx.cardEnterSound());
    card.addEventListener("mouseleave", () => sfx.cardLeaveSound());
  });

  // Ajoute SFX au bouton burger menu
  const navToggle = document.getElementById("nav-toggle");
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      sfx.clickSound();
    });
  }

  // Ajoute SFX au logo/bouton home
  const navHome = document.getElementById("nav-home");
  if (navHome) {
    navHome.addEventListener("mouseenter", () => sfx.hoverSound());
    navHome.addEventListener("click", () => sfx.victorySound());
  }

  // Ajoute SFX aux boutons back (si présents sur la page)
  const backButtons = document.querySelectorAll(".back-btn");
  backButtons.forEach((button) => {
    button.addEventListener("mouseenter", () => sfx.hoverSound());
    button.addEventListener("click", () => sfx.navigationSound());
  });
});

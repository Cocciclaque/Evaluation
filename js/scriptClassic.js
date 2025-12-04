/* ============================================
   🏔️ PEAKDLE - JavaScript
   ============================================ */

// ============================================
// NAVIGATION & BURGER MENU
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const pages = document.querySelectorAll(".page");
  const playButtons = document.querySelectorAll(".play-btn");
  const backButtons = document.querySelectorAll(".back-btn");
  const navHome = document.getElementById("nav-home");

  // Toggle burger menu
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");

      // Animate burger icon
      const spans = navToggle.querySelectorAll("span");
      if (navMenu.classList.contains("active")) {
        spans[0].style.transform = "rotate(45deg) translateY(10px)";
        spans[1].style.opacity = "0";
        spans[2].style.transform = "rotate(-45deg) translateY(-10px)";
      } else {
        spans[0].style.transform = "none";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "none";
      }
    });
  }

  // Navigation - Switch pages
  function switchPage(pageId) {
    // Hide all pages
    pages.forEach((page) => {
      page.classList.remove("active");
    });

    // Show target page
    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
      targetPage.classList.add("active");
    }

    // Update active nav link
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.dataset.page === pageId) {
        link.classList.add("active");
      }
    });

    // Close mobile menu if open
    navMenu.classList.remove("active");
    if (navToggle) {
      const spans = navToggle.querySelectorAll("span");
      spans[0].style.transform = "none";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "none";
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Nav links click
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const pageId = this.dataset.page;
      switchPage(pageId);
    });
  });

  // Play buttons click
  playButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const pageId = this.dataset.page;
      switchPage(pageId);
    });
  });

  // Back buttons click
  backButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const pageId = this.dataset.page;
      switchPage(pageId);
    });
  });

  // Play again buttons click (in result modals)
  const playAgainButtons = document.querySelectorAll(".play-again-btn");
  playAgainButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      // Refresh the page when going back to home
      location.reload();
    });
  });

  // Close buttons (✖) on modals
  const modalCloseButtons = document.querySelectorAll(".modal-close");
  modalCloseButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const modal = btn.closest(".result-modal");
      if (modal) {
        modal.classList.add("hidden");
      }
    });
  });

  // Logo nav-brand click (Home)
  if (navHome) {
    navHome.addEventListener("click", function (e) {
      e.preventDefault();
      switchPage("home");
    });
  }

  // Close menu when clicking outside
  document.addEventListener("click", function (e) {
    if (
      navMenu.classList.contains("active") &&
      !navMenu.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      navMenu.classList.remove("active");
      const spans = navToggle.querySelectorAll("span");
      spans[0].style.transform = "none";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "none";
    }
  });

  // ============================================
  // COUNTDOWN TIMER
  // ============================================

  function updateCountdown() {
    const countdownElement = document.getElementById("countdown-home");
    if (!countdownElement) return;

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0);

    const diff = tomorrow - now;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    countdownElement.textContent = `${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  // Update countdown every second
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ============================================
  // GAME LOGIC (Placeholder)
  // ============================================

  console.log("🏄 Peakdle loaded successfully!");
  console.log("Ready to climb!");
});

// Fonction pour créer des confettis de victoire
function createConfetti() {
  const emojis = ["🎉", "✨", "🎊", "🎆", "👏", "🎁"];
  const confettiCount = 40;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.animationDelay = Math.random() * 0.3 + "s";
    confetti.style.animationDuration = Math.random() * 2 + 2 + "s";
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 4000);
  }
}

// Fonction pour créer des particules de défaite
function createDefeatParticles() {
  const emojis = ["💀", "💔", "😭", "⚠️"];
  const particleCount = 25;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "defeat-particle";
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    particle.style.left = Math.random() * 100 + "vw";
    particle.style.animationDelay = Math.random() * 0.5 + "s";
    particle.style.animationDuration = Math.random() * 1.5 + 2 + "s";
    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 3500);
  }
}

(async () => {
  const DATA_FILE = "datas.json";
  const MAX_LIVES = 7;

  let items = {},
    targetName = "",
    targetItem = null;
  const guessedNames = new Set();
  let lives = MAX_LIVES;
  let allItems = [];

  const input = document.getElementById("classic-input");
  const submitBtn = document.getElementById("classic-submit");
  const suggestionsDiv = document.getElementById("classic-suggestions");
  const guessesList = document.getElementById("classic-guesses");
  const livesSpan = document.getElementById("classic-lives");
  const livesHearts = document.getElementById("classic-lives-hearts");
  const resultModal = document.getElementById("classic-result");
  const resultTitle = document.getElementById("classic-result-title");
  const resultMessage = document.getElementById("classic-result-message");
  const resultLives = document.getElementById("classic-result-lives");

  function iconUrl(iconName) {
    if (!iconName) return "";
    const fileName = String(iconName).replace(/ /g, "_"); // replace spaces
    return `images/64px-images/64px-${fileName}.webp`;
  }

  function iconUrl192(iconName) {
    if (!iconName) return "";
    const fileName = String(iconName).replace(/ /g, "_"); // replace spaces
    return `images/192px-images/192px-${fileName}.webp`;
  }

  function updateLivesDisplay() {
    livesSpan.textContent = lives;
    livesHearts.textContent =
      "❤️".repeat(Math.max(0, lives)) +
      "🤍".repeat(Math.max(0, MAX_LIVES - lives));
  }

  function compareValues(key, guessValue, targetValue) {
    if (typeof targetValue === "undefined") return "red";
    if (key === "Weight")
      return Number(guessValue) === Number(targetValue) ? "green" : "red";
    if (key === "Uses") return guessValue === targetValue ? "green" : "red";

    const gVals = Array.isArray(guessValue) ? guessValue : [guessValue];
    const tVals = Array.isArray(targetValue) ? targetValue : [targetValue];
    const gNorm = gVals.map((v) => String(v));
    const tNorm = tVals.map((v) => String(v));
    const intersection = gNorm.filter((v) => tNorm.includes(v));
    if (intersection.length === 0) return "red";
    if (intersection.length < Math.max(gNorm.length, tNorm.length))
      return "yellow";
    return "green";
  }
  function addGuessRow(name) {
    const guessedItem = items[name];
    if (!guessedItem) return;

    const row = document.createElement("div");
    row.className = "guess-row";

    // Icon on the left
    const img = document.createElement("img");
    img.src = iconUrl(guessedItem.Icon || guessedItem.icon || name);
    img.alt = name;
    row.appendChild(img);

    const pref = ["Type", "Rarity", "Weight", "Effects", "Uses"];
    const keys = Object.keys(guessedItem)
      .map((k) => k.charAt(0).toUpperCase() + k.slice(1))
      .filter((k) => k !== "Icon");
    const ordered = [];
    for (const k of pref) if (keys.includes(k)) ordered.push(k);
    for (const k of keys) if (!ordered.includes(k)) ordered.push(k);

    for (const key of ordered) {
      const value = guessedItem[key] ?? guessedItem[key.toLowerCase()]; // allow 0
      const targetValue = targetItem[key] ?? targetItem[key.toLowerCase()]; // allow 0
      const colorClass = compareValues(key, value, targetValue);

      let display = Array.isArray(value) ? value.join(", ") : String(value);

      if (key === "Weight" && targetValue !== undefined) {
        const gNum = Number(value),
          tNum = Number(targetValue);
        if (!Number.isNaN(gNum) && !Number.isNaN(tNum)) {
          if (gNum === tNum) display = `${value} ✓`;
          else if (gNum < tNum) display = `${value} ▲`;
          else display = `${value} ▼`;
        }
      }

      const sq = document.createElement("div");
      sq.className = "square " + colorClass;
      sq.textContent = `${key}:\n${display}`;
      row.appendChild(sq);
    }

    // Prepend to stack newest on top
    guessesList.prepend(row);
  }

  /* Autocomplete exactly like Splash mode: suggestion-item plain text blocks */
  function hideSuggestions() {
    suggestionsDiv.style.display = "none";
    suggestionsDiv.innerHTML = "";
  }

  function showSuggestions() {
    const q = input.value.trim().toLowerCase();
    suggestionsDiv.innerHTML = "";
    if (!q) return hideSuggestions();

    const filtered = allItems.filter(
      (i) => i.toLowerCase().includes(q) && !guessedNames.has(i)
    );
    if (filtered.length === 0) return hideSuggestions();

    const suggestions = filtered.slice(0, 10);

    filtered.slice(0, 10).forEach((name) => {
      suggestionsDiv.innerHTML = suggestions
        .map(
          (item) =>
            `<div class="suggestion-item"><img style="margin-right: 8px; vertical-align: middle; object-fit: contain;" src="${iconUrl(
              item
            )}" alt="${item}" class="guess-img">${item}</div>`
        )
        .join("");
      suggestionsDiv.style.display = "block";
      suggestionsDiv.addEventListener("click", () => {
        const first = suggestionsDiv.querySelector(".suggestion-item");
        if (first) input.value = first.textContent.trim();
        hideSuggestions();
        submitGuess();
      });
    });

    suggestionsDiv.style.display = "block";
  }

  function submitGuess() {
    const guess = input.value.trim();
    if (!guess) return;
    if (input.disabled) return;

    // correct
    if (guess === targetName) {
      resultTitle.innerHTML =
        '<span style="font-size: 3rem;">🎉</span><br>Correct!';

      // Ajouter image et effets
      const iconName = (targetItem.icon || targetName).replace(/ /g, "_");
      const imageUrl = iconUrl192(iconName);
      const effectsText = targetItem.Effect
        ? targetItem.Effect.join(", ")
        : "None";

      resultMessage.innerHTML = `
        <img src="${imageUrl}" alt="${targetName}" style="width: 128px; height: 128px; object-fit: contain; margin: 10px auto; display: block; border-radius: 8px;">
        <strong>${targetName}</strong>
        <p style="margin-top: 8px; color: #aaa;">Effects: ${effectsText}</p>
      `;
      resultLives.textContent = String(lives);
      resultModal.classList.remove("hidden", "defeat");
      resultModal.classList.add("victory");

      // Lance les confettis de victoire
      createConfetti();

      input.disabled = true;
      submitBtn.disabled = true;
      hideSuggestions();
      return;
    }

    // valid item
    if (guess in items) {
      if (guessedNames.has(guess)) {
        resultMessage.textContent = `Already guessed "${guess}"`;
        setTimeout(() => {
          resultMessage.textContent = "";
        }, 1400);
        input.value = "";
        showSuggestions();
        return;
      }

      guessedNames.add(guess);
      addGuessRow(guess);

      // lose life
      lives = Math.max(0, lives - 1);
      updateLivesDisplay();

      input.value = "";
      hideSuggestions();

      if (lives <= 0) {
        resultTitle.innerHTML =
          '<span style="font-size: 3rem;">💀</span><br>Out of lives!';

        // Ajouter image et effets
        const iconName = (targetItem.icon || targetName).replace(/ /g, "_");
        const imageUrl = iconUrl192(iconName);
        const effectsText = targetItem.Effect
          ? targetItem.Effect.join(", ")
          : "None";

        resultMessage.innerHTML = `
          <img src="${imageUrl}" alt="${targetName}" style="width: 128px; height: 128px; object-fit: contain; margin: 10px auto; display: block; border-radius: 8px;">
          <strong>${targetName}</strong>
          <p style="margin-top: 8px; color: #aaa;">Effects: ${effectsText}</p>
        `;
        resultLives.textContent = String(lives);
        resultModal.classList.remove("hidden", "victory");
        resultModal.classList.add("defeat");

        // Lance les particules de défaite
        createDefeatParticles();

        input.disabled = true;
        submitBtn.disabled = true;
      }
      return;
    }

    // invalid
    resultMessage.textContent = `Invalid guess: "${guess}"`;
    setTimeout(() => {
      resultMessage.textContent = "";
    }, 1200);
    input.value = "";
    showSuggestions();
  }

  // --- load data ---
  try {
    const res = await fetch(DATA_FILE);
    if (!res.ok) throw new Error("Failed to load " + DATA_FILE);
    items = await res.json();
    allItems = Object.keys(items);
  } catch (err) {
    console.error(err);
    resultMessage.textContent = "Error loading data";
    return;
  }

  // choose target
  const allNames = Object.keys(items);
  targetName = allNames[Math.floor(Math.random() * allNames.length)];
  targetItem = items[targetName];
  console.log("CLASSIC TARGET:", targetName, targetItem);

  // wire events
  updateLivesDisplay();
  input.addEventListener("input", showSuggestions);
  input.addEventListener("focus", showSuggestions);

  // Enter selects top suggestion (Splash-mode behavior)
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const first = suggestionsDiv.querySelector(".suggestion-item");
      if (first) input.value = first.textContent.trim();
      hideSuggestions();
      submitGuess();
    }
  });

  document.addEventListener("click", (e) => {
    if (!suggestionsDiv.contains(e.target) && e.target !== input)
      hideSuggestions();
  });

  submitBtn.addEventListener("click", submitGuess);
})();

// Note: Detective mode is now handled by detective.js

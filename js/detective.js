(async () => {
  const DATA_FILE = "datas.json";
  const MAX_LIVES = 7;

  let items = {};
  let targetName = "";
  let targetItem = null;

  let originalNote = "";
  let revealedMask = "";
  let lives = MAX_LIVES;

  const guessedNames = new Set();
  let allItems = [];

  const input = document.getElementById("detective-input");
  const submitBtn = document.getElementById("detective-submit");
  const suggestionsDiv = document.getElementById("detective-suggestions");
  const hintDiv = document.getElementById("detective-clue");
  const guessesList = document.getElementById("detective-guesses");
  const livesSpan = document.getElementById("detective-lives");
  const livesHearts = document.getElementById("detective-lives-hearts");

  const resultModal = document.getElementById("detective-result");
  const resultTitle = document.getElementById("detective-result-title");
  const resultMessage = document.getElementById("detective-result-message");
  const resultLives = document.getElementById("detective-result-lives");

  function updateLivesDisplay() {
    livesSpan.textContent = lives;
    livesHearts.textContent =
      "❤️".repeat(lives) + "🤍".repeat(MAX_LIVES - lives);
  }

  function maskNote(note) {
    return note.replace(/[A-Za-z]/g, "_");
  }

  function reveal20Percent() {
    let arr = revealedMask.split("");
    let orig = originalNote.split("");

    const hiddenIndexes = arr
      .map((c, i) => (c === "_" ? i : null))
      .filter((v) => v !== null);

    const revealCount = Math.ceil(hiddenIndexes.length * 0.2);

    for (let i = 0; i < revealCount; i++) {
      const idx =
        hiddenIndexes[Math.floor(Math.random() * hiddenIndexes.length)];
      arr[idx] = orig[idx];
      hiddenIndexes.splice(hiddenIndexes.indexOf(idx), 1);
    }

    revealedMask = arr.join("");
  }

  function updateHintDisplay() {
    if (!hintDiv) return;
    hintDiv.innerHTML = "";
    for (let i = 0; i < revealedMask.length; i++) {
      const ch = revealedMask[i];
      if (ch === "_") {
        const span = document.createElement("span");
        span.className = "hidden-char";
        span.textContent = " "; // bloc orange avec espace
        hintDiv.appendChild(span);
      } else {
        const span = document.createElement("span");
        span.className = "revealed-char";
        span.textContent = ch;
        hintDiv.appendChild(span);
      }
    }
  }

  async function addGuessToDisplay(itemName, isCorrect) {
    if (!guessesList) return;
    try {
      const res = await fetch(DATA_FILE);
      const datas = await res.json();
      const itemData = datas[itemName];
      if (!itemData) {
        console.error("Item non trouvé:", itemName);
        return;
      }
      const iconName = (itemData.icon || itemName).replace(/ /g, "_");
      const imageUrl = `images/64px-images/64px-${iconName}.webp`;

      const guessElement = document.createElement("div");
      guessElement.className =
        "guess-item" + (isCorrect ? " correct" : " wrong");
      guessElement.innerHTML = `
        <img src="${imageUrl}" alt="${itemName}" class="guess-img">
        <span class="guess-name">${itemName}</span>
        <span class="guess-result ${isCorrect ? "correct" : "wrong"}">${
        isCorrect ? "✓" : "✗"
      }</span>
      `;
      guessesList.prepend(guessElement);
    } catch (err) {
      console.error("Detective add guess error", err);
    }
  }

  // Autocomplete functionality
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

    suggestionsDiv.innerHTML = suggestions
      .map((item, idx) => {
        const iconName = (items[item]?.icon || item).replace(/ /g, "_");
        return `<div class="suggestion-item" data-idx="${idx}"><img style="margin-right: 8px; vertical-align: middle; object-fit: contain;" src="images/64px-images/64px-${iconName}.webp" alt="${item}" class="guess-img">${item}</div>`;
      })
      .join("");

    suggestionsDiv.style.display = "block";

    const itemsEls = suggestionsDiv.querySelectorAll(".suggestion-item");

    // Fonction pour extraire le nom pur d'une suggestion (sans image)
    function getItemName(el) {
      return suggestions[parseInt(el.dataset.idx)];
    }

    itemsEls.forEach((el, idx) => {
      // Stocke le nom directement dans l'attribut data
      el.dataset.name = suggestions[idx];

      el.addEventListener("click", () => {
        input.value = el.dataset.name;
        hideSuggestions();
        submitGuess();
      });
      el.addEventListener("mouseenter", () => {
        itemsEls.forEach((e) => e.classList.remove("selected"));
        el.classList.add("selected");
        selectedIdx = idx;
      });
    });
  }

  // Variable globale pour l'index de sélection
  let selectedIdx = -1;

  // Gestion clavier unifiée
  function handleKeydown(e) {
    const itemsEls = suggestionsDiv.querySelectorAll(".suggestion-item");

    if (e.key === "ArrowDown" && itemsEls.length > 0) {
      e.preventDefault();
      selectedIdx = (selectedIdx + 1) % itemsEls.length;
      itemsEls.forEach((el) => el.classList.remove("selected"));
      itemsEls[selectedIdx].classList.add("selected");
      return;
    }

    if (e.key === "ArrowUp" && itemsEls.length > 0) {
      e.preventDefault();
      selectedIdx = (selectedIdx - 1 + itemsEls.length) % itemsEls.length;
      itemsEls.forEach((el) => el.classList.remove("selected"));
      itemsEls[selectedIdx].classList.add("selected");
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      // Si une suggestion est sélectionnée, utiliser son nom
      if (selectedIdx >= 0 && itemsEls.length > 0 && itemsEls[selectedIdx]) {
        input.value = itemsEls[selectedIdx].dataset.name;
      } else if (itemsEls.length > 0) {
        // Si aucune sélection mais des suggestions existent, prendre la première
        input.value = itemsEls[0].dataset.name;
      }
      hideSuggestions();
      selectedIdx = -1;
      submitGuess();
    }
  }

  function submitGuess() {
    const guess = input.value.trim();
    console.log(
      "submitGuess called with:",
      guess,
      "| target:",
      targetName,
      "| match:",
      guess === targetName
    );
    if (!guess) return;
    if (input.disabled) return;

    let guessIsValid = false;

    // Win condition
    if (guess === targetName) {
      resultTitle.innerHTML =
        '<span style="font-size: 3rem;">🎉</span><br>Correct!';

      // Ajouter image et effets
      const iconName = (targetItem.icon || targetName).replace(/ /g, "_");
      const imageUrl = `images/192px-images/192px-${iconName}.webp`;
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
      console.log("Victory! Calling createConfetti...");
      if (typeof createConfetti === "function") {
        createConfetti();
        console.log("createConfetti called successfully");
      } else {
        console.log("createConfetti not found");
      }

      // Add final correct guess entry
      addGuessToDisplay(guess, true);
      guessIsValid = true;

      input.disabled = true;
      submitBtn.disabled = true;
      hideSuggestions();
    } else if (guess in items) {
      if (guessedNames.has(guess)) {
        input.value = "";
        showSuggestions();
        updateHintDisplay();
        return;
      }

      guessedNames.add(guess);
      // add wrong guess entry
      addGuessToDisplay(guess, false);
      guessIsValid = true;

      // incorrect → lose life + reveal
      lives = Math.max(0, lives - 1);
      updateLivesDisplay();

      reveal20Percent();

      input.value = "";
      hideSuggestions();

      if (lives <= 0) {
        resultTitle.innerHTML =
          '<span style="font-size: 3rem;">💀</span><br>Out of lives!';

        // Ajouter image et effets
        const iconName = (targetItem.icon || targetName).replace(/ /g, "_");
        const imageUrl = `images/192px-images/192px-${iconName}.webp`;
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
        console.log("Defeat! Calling createDefeatParticles...");
        if (typeof createDefeatParticles === "function") {
          createDefeatParticles();
          console.log("createDefeatParticles called successfully");
        } else {
          console.log("createDefeatParticles not found");
        }

        input.disabled = true;
        submitBtn.disabled = true;
      }
    }

    // Toujours afficher la clue avec updateHintDisplay pour toutes les méthodes
    updateHintDisplay();

    // Invalid guess
    if (!guessIsValid) {
      input.value = "";
      showSuggestions();
      updateHintDisplay();
    }
  }

  // Load items
  try {
    const res = await fetch(DATA_FILE);
    items = await res.json();
    allItems = Object.keys(items);
  } catch (err) {
    console.error("Detective mode data load error", err);
    return;
  }

  // Pick target - use item properties as the clue (since no Note field exists)
  const itemsWithEffect = Object.entries(items).filter(
    ([name, data]) => data.Effect && data.Effect.length > 0
  );
  if (itemsWithEffect.length === 0) {
    console.error("No items with Effect found");
    return;
  }
  const [pickedName, pickedData] =
    itemsWithEffect[Math.floor(Math.random() * itemsWithEffect.length)];
  targetName = pickedName;
  targetItem = pickedData;

  // Build a clue string from item properties
  const clueText = `Type: ${targetItem.Type} | Rarity: ${
    targetItem.Rarity
  } | Weight: ${targetItem.Weight} | Effects: ${targetItem.Effect.join(", ")}`;
  originalNote = clueText;
  revealedMask = maskNote(originalNote);

  updateLivesDisplay();
  updateHintDisplay();

  console.log("DETECTIVE TARGET:", targetName);

  // Event wiring
  input.addEventListener("input", () => {
    selectedIdx = -1; // Reset la sélection quand on tape
    showSuggestions();
  });
  input.addEventListener("focus", showSuggestions);
  input.addEventListener("keydown", handleKeydown);

  submitBtn.addEventListener("click", submitGuess);

  document.addEventListener("click", (e) => {
    if (!suggestionsDiv.contains(e.target) && e.target !== input)
      hideSuggestions();
  });
})();

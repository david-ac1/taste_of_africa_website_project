const currentYear = document.querySelector("#current-year");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

const filterButtons = document.querySelectorAll("[data-filter]");
const recipeCards = document.querySelectorAll("[data-region]");
const favoriteButtons = document.querySelectorAll("[data-favorite]");
const favoritesStorageKey = "tastes-of-africa-favorites";

const getFavorites = () => {
  try {
    const storedFavorites = JSON.parse(
      localStorage.getItem(favoritesStorageKey) || "[]"
    );
    return Array.isArray(storedFavorites) ? storedFavorites : [];
  } catch (error) {
    console.error("Unable to load saved recipe favorites.", error);
    return [];
  }
};

const saveFavorites = (favorites) => {
  try {
    localStorage.setItem(favoritesStorageKey, JSON.stringify(favorites));
  } catch (error) {
    console.error("Unable to save recipe favorite.", error);
  }
};

const updateFavoriteButton = (button, isFavorite) => {
  button.textContent = isFavorite ? "♥ Favorited" : "♡ Favorite";
  button.setAttribute("aria-pressed", String(isFavorite));
  button.classList.toggle("is-favorite", isFavorite);
};

const savedFavorites = getFavorites();

favoriteButtons.forEach((button) => {
  const recipeId = button.dataset.favorite;
  updateFavoriteButton(button, savedFavorites.includes(recipeId));

  button.addEventListener("click", () => {
    const currentFavorites = getFavorites();
    const isFavorite = currentFavorites.includes(recipeId);
    const updatedFavorites = isFavorite
      ? currentFavorites.filter((favorite) => favorite !== recipeId)
      : [...currentFavorites, recipeId];

    saveFavorites(updatedFavorites);
    updateFavoriteButton(button, !isFavorite);
  });
});

const contactForm = document.querySelector("#contact-form");
const formFeedback = document.querySelector("#form-feedback");

if (contactForm && formFeedback) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const nameField = contactForm.querySelector("#name");
    const messageField = contactForm.querySelector("#message");
    const name = nameField.value.trim();
    const message = messageField.value.trim();

    if (message.length <= 20) {
      formFeedback.textContent =
        "Please tell us a little more. Your message must be longer than 20 characters.";
      messageField.focus();
      return;
    }

    contactForm.hidden = true;
    formFeedback.textContent = `Thank you, ${name}! We've received your message.`;
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedRegion = button.dataset.filter;

    filterButtons.forEach((filterButton) => {
      const isSelected = filterButton === button;
      filterButton.classList.toggle("is-active", isSelected);
      filterButton.setAttribute("aria-pressed", String(isSelected));
    });

    recipeCards.forEach((card) => {
      const matchesRegion =
        selectedRegion === "all" || card.dataset.region === selectedRegion;
      card.classList.toggle("is-hidden", !matchesRegion);
    });
  });
});
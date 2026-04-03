
  const container = document.querySelector(".container");
  const searchInput = document.getElementById("searchInput");

  fetch("drinks.json")
  .then(res => res.json())
  .then(drinks => {
    container.innerHTML = "";

    drinks.forEach(drink => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.id = drink.id;

      card.innerHTML = `
        <button class="favorite-button" aria-label="Add to favorites">☆</button>
        <h2 class="card__title">${drink.name}</h2>
        <p class="card__text">${drink.ingredients}</p>
        <p class="card__meta">${drink.meta}</p>
        <div class="card__details">
          <p><strong>Ratio:</strong> ${drink.ratio}</p>
          <p><strong>Glass:</strong> ${drink.glass}</p>
          <p><strong>Garnish:</strong> ${drink.garnish}</p>
        </div>
        <button class="card__button">Pour & Serve</button>
      `;

      container.appendChild(card);
    });

      initializeApp();
  });
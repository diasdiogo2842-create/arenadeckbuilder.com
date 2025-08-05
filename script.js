// script.js

const allCards = [
  { id: 26000000, name: "Knight" },
  { id: 26000001, name: "Archers" },
  { id: 26000002, name: "Goblins" },
  { id: 26000003, name: "Giant" },
  { id: 26000004, name: "P.E.K.K.A" },
  { id: 26000005, name: "Minions" },
  // ... add all other cards (up to 27000079+ depending on updates)
];

const deckContainer = document.getElementById("deck");

allCards.forEach(card => {
  const cardImg = document.createElement("img");
  cardImg.src = `cards/${card.id}.png`;
  cardImg.alt = card.name;
  cardImg.classList.add("card");
  cardImg.title = card.name;

  cardImg.addEventListener("click", () => {
    cardImg.classList.toggle("selected");
  });

  deckContainer.appendChild(cardImg);
});

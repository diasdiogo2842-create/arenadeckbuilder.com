<script>
  const cardMap = {
    "26000000": "Knight", "26000001": "Archers", "26000002": "Goblins", "26000003": "Giant",
    "26000004": "P.E.K.K.A", "26000005": "Minions", "26000006": "Balloon", "26000007": "Witch",
    "26000008": "Barbarians", "26000009": "Golem", "26000010": "Skeletons", "26000011": "Valkyrie",
    "26000012": "Mini P.E.K.K.A", "26000013": "Musketeer", "26000014": "Baby Dragon", "26000015": "Prince",
    "26000016": "Wizard", "26000021": "Fireball", "26000022": "Arrows", "26000023": "Bomber",
    "26000024": "Tombstone", "26000026": "Cannon", "26000031": "Zap", "26000038": "Electro Wizard",
    "26000039": "Mega Minion", "26000041": "Dark Prince", "26000042": "Ice Golem", "26000044": "Hunter"
  };

  const offenseCards = ["Giant", "Balloon", "Golem", "P.E.K.K.A", "Hog Rider", "Miner", "Royal Giant", "Prince"];
  const defenseCards = ["Cannon", "Tornado", "Mini P.E.K.K.A", "Knight", "Valkyrie", "Archers", "Musketeer", "Wizard"];
  const winConditions = ["Golem", "Hog Rider", "Balloon", "Royal Giant", "X-Bow", "Mortar", "Miner", "Graveyard", "Giant"];

  const suggestions = {
    offense: ["Prince", "Giant", "Balloon", "Hog Rider"],
    defense: ["Mini P.E.K.K.A", "Valkyrie", "Musketeer", "Cannon"],
    win: ["Hog Rider", "Miner", "Golem", "Royal Giant"]
  };

  function extractCardIDs(link) {
    try {
      const url = new URL(link);
      const deckParam = url.searchParams.get("deck");
      if (!deckParam) return [];
      const rawIDs = deckParam.split(";");
      const validIDs = rawIDs.filter(id => id.startsWith("2600") && cardMap[id]);
      return validIDs;
    } catch (e) {
      return [];
    }
  }

  function getCardNames(cardIDs) {
    return cardIDs.map(id => cardMap[id]).filter(Boolean);
  }

  function scoreCategory(deck, categoryList) {
    let score = deck.filter(card => categoryList.includes(card)).length;
    if (score >= 3) return "Godly";
    if (score === 2) return "Good";
    if (score === 1) return "Mid";
    return "Bad";
  }

  function getStyledGrade(grade) {
    if (grade === "Godly") {
      return `<span class="godly">${grade}</span>`;
    }
    return grade;
  }

  function suggestSwaps(deck, category, categoryList) {
    let present = deck.filter(card => categoryList.includes(card));
    if (present.length >= 2) return [];
    const needed = suggestions[category].filter(card => !deck.includes(card));
    return needed.slice(0, 2);
  }

  function generateImprovedDeck(originalDeck, swaps) {
    let improvedDeck = [...originalDeck];
    swaps.forEach(swap => {
      for (let i = 0; i < improvedDeck.length; i++) {
        if (!offenseCards.includes(improvedDeck[i]) &&
            !defenseCards.includes(improvedDeck[i]) &&
            !winConditions.includes(improvedDeck[i])) {
          improvedDeck[i] = swap;
          return;
        }
      }
      improvedDeck[0] = swap;
    });
    return [...new Set(improvedDeck)].slice(0, 8);
  }

  function getImageUrl(cardName) {
    const slug = cardName.toLowerCase().replace(/\s|\./g, '-').replace('mini-p.e.k.k.a', 'mini-pekka');
    return `https://royaleapi.com/static/img/cards-150/${slug}.png`;
  }

  function showDeckImages(deck, containerId, title) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<div class="deck-title">${title}</div>`;
    deck.forEach(card => {
      const img = document.createElement("img");
      img.src = getImageUrl(card);
      img.alt = card;
      img.title = card;
      img.width = 80;
      img.style.margin = "5px";
      container.appendChild(img);
    });
  }

  function rateDeck() {
    const link = document.getElementById("deckLink").value.trim();
    const ids = extractCardIDs(link);
    const originalDeck = getCardNames(ids);

    if (originalDeck.length !== 8) {
      document.getElementById("resultText").innerHTML = "Invalid deck link or unsupported cards.";
      document.getElementById("originalDeck").innerHTML = "";
      document.getElementById("swapSuggestions").innerHTML = "";
      document.getElementById("improvedDeck").innerHTML = "";
      return;
    }

    const offense = scoreCategory(originalDeck, offenseCards);
    const defense = scoreCategory(originalDeck, defenseCards);
    const wincon = scoreCategory(originalDeck, winConditions);

    document.getElementById("resultText").innerHTML = `
      <div class="category">⚔️ Offense: ${getStyledGrade(offense)}</div>
      <div class="category">🛡️ Defense: ${getStyledGrade(defense)}</div>
      <div class="category">🏆 Win Condition: ${getStyledGrade(wincon)}</div>
    `;

    let swapCards = [];
    swapCards.push(...suggestSwaps(originalDeck, "offense", offenseCards));
    swapCards.push(...suggestSwaps(originalDeck, "defense", defenseCards));
    swapCards.push(...suggestSwaps(originalDeck, "win", winConditions));

    if (swapCards.length) {
      document.getElementById("swapSuggestions").innerHTML = `<b>🔁 Suggested Cards to Add:</b><br>${swapCards.join(", ")}`;
    } else {
      document.getElementById("swapSuggestions").innerHTML = "✅ This deck is well-balanced!";
    }

    const improvedDeck = generateImprovedDeck(originalDeck, swapCards);

    // Show deck images
    showDeckImages(originalDeck, "originalDeck", "🃏 Original Deck");
    showDeckImages(improvedDeck, "improvedDeck", "✨ Improved Deck");
  }
</script>

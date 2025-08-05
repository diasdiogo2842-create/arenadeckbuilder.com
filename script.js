// Basic list of all card IDs & names
const allCards = [
  { id: 26000000, name: "Knight" },
  { id: 26000001, name: "Archers" },
  { id: 26000002, name: "Goblins" },
  { id: 26000003, name: "Giant" },
  // ... all others from Fandom/DeckShop lists
];

// Utility: find duplicate costs, high synergy, balance
function rateDeck(cards) {
  if (cards.length !== 8) return 0;
  const costs = cards.map(c => c.elixir);
  const avg = costs.reduce((a,b)=>(a+b))/8;
  const varCost = costs.map(c=>Math.abs(c-avg)).reduce((a,b)=>a+b);
  let duplicates = new Set(cards.map(c=>c.id)).size < 8 ? 0 : 2;
  let score = Math.round((avg >= 3 && avg <= 4.5 ? 5 : 3) + Math.max(0, 3 - varCost) + duplicates);
  if (score > 10) score = 10;
  return score;
}

// Parse deck URL like clashroyale://copyDeck?deck=27000010;28000002;...
function parseDeckLink(url) {
  const m = url.match(/deck=([^&]+)/);
  if (!m) return [];
  const ids = m[1].split(';').map(s=>parseInt(s));
  return ids.map(id => ({ id, name: (allCards.find(c=>c.id===id)||{}).name || 'Unknown', elixir: Math.floor((id % 8) + 1) }));
}

function loadDeck(){
  const url = document.getElementById('deckLink').value;
  const parsed = parseDeckLink(url);
  const container = document.getElementById('deck');
  container.innerHTML = '';
  parsed.forEach(c=>{
    const img = document.createElement('img');
    img.src = `cards/${c.id}.png`;
    img.alt = c.name;
    img.title = c.name + ' (' + c.elixir + ')';
    img.classList.add('card');
    container.appendChild(img);
  });
  const score = rateDeck(parsed);
  document.getElementById('rating').innerText = `Deck Rating: ${score}/10`;
}

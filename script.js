document.getElementById('deckForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const arena = document.getElementById('arena').value;
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const cards = document.getElementById('cards').value;

  const deck = {
    arena,
    title,
    description,
    cards: cards.split(',').map(c => c.trim())
  };

  // Store temporarily in localStorage
  const decks = JSON.parse(localStorage.getItem('decks') || '[]');
  decks.push(deck);
  localStorage.setItem('decks', JSON.stringify(decks));

  showDecks();
  e.target.reset();
});

function showDecks() {
  const decks = JSON.parse(localStorage.getItem('decks') || '[]');
  const container = document.getElementById('decks');
  container.innerHTML = '<h2>Decks</h2>';

  decks.forEach(deck => {
    const div = document.createElement('div');
    div.className = 'deck';
    div.innerHTML = `
      <h3>${deck.title} (${deck.arena})</h3>
      <p>${deck.description}</p>
      <p><strong>Cards:</strong> ${deck.cards.join(', ')}</p>
    `;
    container.appendChild(div);
  });
}

showDecks();

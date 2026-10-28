const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
const searchToggle = document.querySelector('.search-toggle');
const searchPanel = document.querySelector('#search-panel');
const searchInput = document.querySelector('#search-input');
const productCards = [...document.querySelectorAll('.product-card')];
const filters = [...document.querySelectorAll('.filter')];
const emptyState = document.querySelector('#empty-state');
const toast = document.querySelector('#toast');
let bagCount = 0;
let toastTimer;

document.querySelector('#year').textContent = new Date().getFullYear();

menuToggle.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));
searchToggle.addEventListener('click', () => {
  searchPanel.classList.toggle('open');
  if (searchPanel.classList.contains('open')) searchInput.focus();
});
document.querySelector('#search-clear').addEventListener('click', () => {
  searchInput.value = '';
  applyFilters();
  searchInput.focus();
});
searchInput.addEventListener('input', applyFilters);

function applyFilters(category = document.querySelector('.filter.active')?.dataset.filter || 'All') {
  let visible = 0;
  const query = searchInput.value.trim().toLowerCase();
  productCards.forEach(card => {
    const categoryMatch = category === 'All' || card.dataset.category === category;
    const searchMatch = !query || `${card.dataset.name} ${card.dataset.category}`.toLowerCase().includes(query);
    card.hidden = !(categoryMatch && searchMatch);
    if (!card.hidden) visible++;
  });
  emptyState.hidden = visible !== 0;
}
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => item.classList.toggle('active', item === button));
  applyFilters(button.dataset.filter);
}));
document.querySelectorAll('.collection-card').forEach(card => card.addEventListener('click', () => {
  const category = card.dataset.filter;
  filters.forEach(item => item.classList.toggle('active', item.dataset.filter === category));
  applyFilters(category);
}));
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}
document.querySelectorAll('.quick-add').forEach(button => button.addEventListener('click', () => {
  bagCount++;
  document.querySelector('#bag-count').textContent = bagCount;
  showToast(`${button.dataset.product} added to your bag · ₹${Number(button.dataset.price).toLocaleString('en-IN')}`);
}));
document.querySelectorAll('.heart').forEach(button => button.addEventListener('click', () => {
  button.classList.toggle('liked');
  button.textContent = button.classList.contains('liked') ? '♥' : '♡';
  showToast(button.classList.contains('liked') ? 'Added to your wishlist' : 'Removed from your wishlist');
}));
document.querySelector('.bag-toggle').addEventListener('click', () => {
  showToast(bagCount ? `Your demo bag has ${bagCount} item${bagCount === 1 ? '' : 's'}.` : 'Your bag is waiting for something golden.');
});
document.querySelector('#newsletter-form').addEventListener('submit', event => {
  event.preventDefault();
  const email = document.querySelector('#email');
  document.querySelector('#newsletter-message').textContent = `Thank you! ${email.value} has been added in this demo.`;
  email.value = '';
});

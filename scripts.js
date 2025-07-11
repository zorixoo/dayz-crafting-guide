let recipes = [];

fetch('recipes.json')
  .then(response => response.json())
  .then(data => {
    recipes = data;
    populateCategoryFilter();
    displayRecipes(recipes);
  })
  .catch(error => {
    console.error("Failed to load recipes:", error);
  });

function displayRecipes(list) {
  const container = document.getElementById('recipe-list');
  container.innerHTML = '';

  list.forEach(recipe => {
    const ingredientsText = Array.isArray(recipe.ingredients)
      ? recipe.ingredients
          .map(i => `${i.amount ?? '?'} × ${i.item ?? i}`)  // fallback to i if no item property
          .join(', ')
      : 'None';

    const div = document.createElement('div');
    div.className = 'recipe-item';
    div.setAttribute('data-category', recipe.category ?? 'Uncategorized');
    div.innerHTML = `
      <h2>${recipe.name ?? 'Unnamed Recipe'}</h2>
      <p><strong>Category:</strong> ${recipe.category ?? 'Uncategorized'}</p>
      <p><strong>Ingredients:</strong> ${ingredientsText}</p>
    `;

    // Reset animation to replay on each append
    div.style.animation = 'none';
    div.offsetHeight; // Trigger reflow to restart animation
    div.style.animation = '';

    container.appendChild(div);
  });
}

function filterAndDisplay() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  const selectedCategory = document.getElementById('category-filter').value;

  const filtered = recipes.filter(recipe => {
    const matchesSearch = recipe.name?.toLowerCase().includes(searchTerm) ?? false;
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  displayRecipes(filtered);
}

function populateCategoryFilter() {
  const select = document.getElementById('category-filter');
  const categories = Array.from(new Set(recipes.map(r => r.category).filter(Boolean))).sort();

  select.innerHTML = '<option value="All">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });
}

document.getElementById('search').addEventListener('input', filterAndDisplay);
document.getElementById('category-filter').addEventListener('change', filterAndDisplay);

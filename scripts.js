let recipes = [];

fetch('recipes.json')
  .then(response => response.json())
  .then(data => {
    recipes = data;
    populateCategoryFilter();
    displayRecipes(recipes);
  });

function displayRecipes(list) {
  const container = document.getElementById('recipe-list');
  container.innerHTML = '';
  list.forEach(recipe => {
    const div = document.createElement('div');
    div.className = 'recipe-item';
    div.innerHTML = `<h2>${recipe.item}</h2>
                     <p><strong>Category:</strong> ${recipe.category}</p>
                     <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
                     <p><strong>Tools:</strong> ${recipe.tools.length ? recipe.tools.join(', ') : 'None'}</p>
                     <p><strong>Instructions:</strong><br>${recipe.instructions.join('<br>')}</p>`;
    container.appendChild(div);
  });
}

function filterAndDisplay() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  const selectedCategory = document.getElementById('category-filter').value;

  const filtered = recipes.filter(recipe => {
    const matchesSearch = recipe.item.toLowerCase().includes(searchTerm);
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

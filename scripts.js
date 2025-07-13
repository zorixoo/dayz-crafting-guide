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
    const name = recipe.name ?? 'Unnamed Recipe';
    const category = recipe.category ?? 'Uncategorized';
    const ingredientsText = Array.isArray(recipe.ingredients)
      ? recipe.ingredients
          .map(i => `${i.amount ?? '?'} × ${i.item ?? i}`)
          .join(', ')
      : 'None';

    const instructionsText = recipe.instructions ?? ''; // New line

    const fullCraftText = `Recipe: ${name}\nCategory: ${category}\nIngredients: ${ingredientsText}${instructionsText ? `\nInstructions: ${instructionsText}` : ''}`;

    const div = document.createElement('div');
    div.className = 'recipe-item';
    div.setAttribute('data-category', category);
    div.innerHTML = `
      <h2>${name}</h2>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Ingredients:</strong> ${ingredientsText}</p>
      ${instructionsText ? `<p><strong>Instructions:</strong> ${instructionsText}</p>` : ''}
      <button class="copy-btn" data-craft="${fullCraftText.replace(/"/g, '&quot;')}">Copy Craft</button>
    `;

    // Reset animation to replay on each append
    div.style.animation = 'none';
    div.offsetHeight;
    div.style.animation = '';

    container.appendChild(div);
  });

  // Set up copy button event listeners
  document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', () => {
      const craftText = button.getAttribute('data-craft');
      navigator.clipboard.writeText(craftText)
        .then(() => {
          button.textContent = 'Copied!';
          setTimeout(() => {
            button.textContent = 'Copy Craft';
          }, 1200);
        })
        .catch(() => {
          button.textContent = 'Failed to copy';
        });
    });
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

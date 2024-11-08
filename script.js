const apiUrl = 'https://api.spoonacular.com/recipes/complexSearch?apiKey=65198bed37f2490e9ccae40a584a071e&query=';

async function fetchRecipes(query) {
    try {
        const response = await fetch(apiUrl + query);
        const data = await response.json();
        displayRecipes(data.results); // Ensure 'results' key is used correctly
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = ''; // Clear previous search results
    recipes.forEach(recipe => {
        const recipeItem = document.createElement('div');
        recipeItem.className = 'recipe-item';
        recipeItem.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
        `;
        // Add click event to show details
        recipeItem.addEventListener('click', () => fetchRecipeDetails(recipe.id));
        recipeList.appendChild(recipeItem);
    });
}

// Fetch recipe details from Spoonacular using the recipe ID
async function fetchRecipeDetails(recipeId) {
    const detailsUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=YOUR_API_KEY`;
    try {
        const response = await fetch(detailsUrl);
        const recipe = await response.json();
        showRecipeDetails(recipe);
    } catch (error) {
        console.error('Error fetching recipe details:', error);
    }
}

function showRecipeDetails(recipe) {
    const recipeDetails = document.getElementById('recipe-details');
    recipeDetails.innerHTML = `
        <h2>${recipe.title}</h2>
        <img src="${recipe.image}" alt="${recipe.title}">
        <h3>Ingredients</h3>
        <ul>
            ${recipe.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')}
        </ul>
        <h3>Instructions</h3>
        <p>${recipe.instructions || 'No instructions available'}</p>
        <button id="favorite-button">Add to Favorites</button>
    `;
    document.getElementById('favorite-button').addEventListener('click', () => addToFavorites(recipe));
}

document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('search-input').value;
    fetchRecipes(query);
});

function addToFavorites(recipe) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.some(fav => fav.id === recipe.id)) {
        favorites.push(recipe);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Added to favorites!');
    } else {
        alert('This recipe is already in your favorites!');
    }
}

function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';
    favorites.forEach(recipe => {
        const recipeItem = document.createElement('div');
        recipeItem.className = 'recipe-item';
        recipeItem.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
        `;
        recipeItem.addEventListener('click', () => fetchRecipeDetails(recipe.id));
        recipeList.appendChild(recipeItem);
    });
}

document.getElementById('view-favorites').addEventListener('click', displayFavorites);
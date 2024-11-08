const apiUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

document.addEventListener('DOMContentLoaded', () => {
    alert("JavaScript loaded and DOM is ready");
});

async function fetchRecipes(query) {
    try {
        const response = await fetch(apiUrl + query);
        const data = await response.json();
        alert("Recipes fetched successfully");
        displayRecipes(data.meals);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        alert('Error fetching recipes');
    }
}

function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';

    recipes.forEach(recipe => {
        const recipeItem = document.createElement('div');
        recipeItem.className = 'recipe-item';
        recipeItem.innerHTML = `
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
            <h3>${recipe.strMeal}</h3>
        `;

        // Test click event
        recipeItem.onclick = () => {
            alert(`You clicked on ${recipe.strMeal}`);
            console.log(`Click event registered on: ${recipe.strMeal}`);
            showRecipeDetails(recipe);
        };

        recipeList.appendChild(recipeItem);
    });
}

function showRecipeDetails(recipe) {
    const recipeDetails = document.getElementById('recipe-details');
    recipeDetails.innerHTML = `
        <h2>${recipe.strMeal}</h2>
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
        <h3>Ingredients</h3>
        <ul>
            ${Object.keys(recipe)
                .filter(key => key.startsWith('strIngredient') && recipe[key])
                .map(key => `<li>${recipe[key]}</li>`)
                .join('')}
        </ul>
        <h3>Instructions</h3>
        <p>${recipe.strInstructions}</p>
        <button id="favorite-button">Add to Favorites</button>
    `;
    alert(`Showing details for ${recipe.strMeal}`);
    document.getElementById('favorite-button').addEventListener('click', () => addToFavorites(recipe));
}

document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('search-input').value;
    alert(`Searching for recipes with query: ${query}`);
    fetchRecipes(query);
});

function addToFavorites(recipe) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.some(fav => fav.idMeal === recipe.idMeal)) {
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
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
            <h3>${recipe.strMeal}</h3>
        `;
        recipeItem.onclick = () => showRecipeDetails(recipe);
        recipeList.appendChild(recipeItem);
    });
}

document.getElementById('view-favorites').addEventListener('click', displayFavorites);
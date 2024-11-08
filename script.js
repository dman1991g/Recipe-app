const apiUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

async function fetchRecipes(query) {
    try {
        const response = await fetch(apiUrl + query);
        const data = await response.json();
        displayRecipes(data.meals);
    } catch (error) {
        console.error('Error fetching recipes:', error);
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
        recipeItem.addEventListener('click', () => showRecipeDetails(recipe));
        recipeList.appendChild(recipeItem);
    });
}

function showRecipeDetails(recipe) {
    const recipeDetails = document.getElementById('recipe-details');
    const ingredientsList = Object.keys(recipe)
        .filter(key => key.startsWith('strIngredient') && recipe[key]) // Filter only ingredients
        .map((key, index) => {
            // Get the corresponding measure
            const measureKey = `strMeasure${index + 1}`;
            const ingredient = recipe[key];
            const measure = recipe[measureKey] || ''; // Default to empty if no measure is found
            return `<li>${ingredient} - ${measure}</li>`;
        })
        .join('');

    recipeDetails.innerHTML = `
        <button id="back-button">Back to Search Results</button>
        <h2>${recipe.strMeal}</h2>
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
        <h3>Ingredients</h3>
        <ul>${ingredientsList}</ul>
        <h3>Instructions</h3>
        <p>${recipe.strInstructions || "No instructions available"}</p>
    `;

    document.getElementById('back-button').addEventListener('click', () => {
        document.getElementById('recipe-list').style.display = 'flex';
        document.getElementById('recipe-details').style.display = 'none';
    });

    // Hide recipe list and show the details
    document.getElementById('recipe-list').style.display = 'none';
    document.getElementById('recipe-details').style.display = 'block';
}

document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('search-input').value;
    fetchRecipes(query);
});
const apiUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

// Fetch recipes based on the search query
async function fetchRecipes(query) {
    try {
        const response = await fetch(apiUrl + query);
        const data = await response.json();
        console.log('Fetched recipes:', data.meals); // Check if recipes are fetched correctly
        displayRecipes(data.meals);
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

// Display recipes as clickable items
function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';  // Clear any previous recipes

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

// Show detailed information for a clicked recipe
function showRecipeDetails(recipe) {
    console.log('Recipe clicked:', recipe);  // Ensure this is triggered with the correct recipe

    const recipeDetails = document.getElementById('recipe-details');
    recipeDetails.style.display = 'block';  // Make sure the details section is visible

    // Get ingredients dynamically by checking all ingredient fields
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (recipe[`strIngredient${i}`]) {
            ingredients.push(`${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}`);
        }
    }

    recipeDetails.innerHTML = `
        <h2>${recipe.strMeal}</h2>
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
        <h3>Ingredients:</h3>
        <ul>
            ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
        <h3>Instructions:</h3>
        <p>${recipe.strInstructions}</p>
    `;
}

// Handle search form submission
document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('search-input').value;
    fetchRecipes(query);
});
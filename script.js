const apiUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

async function fetchRecipes(query) {
    try {
        const response = await fetch(apiUrl + query);
        const data = await response.json();
        displayRecipes(data.meals);
        customAlert("Fetched recipes for query: " + query);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        customAlert("Error fetching recipes");
    }
}

function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';
    
    if (recipes && recipes.length > 0) {
        recipes.forEach(recipe => {
            const recipeItem = document.createElement('div');
            recipeItem.className = 'recipe-item';
            recipeItem.innerHTML = `
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <h3>${recipe.strMeal}</h3>
            `;
            recipeItem.addEventListener('click', () => {
                customAlert("Clicked on recipe: " + recipe.strMeal);
                showRecipeDetails(recipe);
            });
            recipeList.appendChild(recipeItem);
        });
    } else {
        customAlert("No recipes found for the given search.");
    }
}

function showRecipeDetails(recipe) {
    customAlert("Starting showRecipeDetails function for recipe: " + recipe.strMeal);

    // Collect ingredients
    let ingredientsList = Object.keys(recipe)
        .filter(key => key.startsWith('strIngredient') && recipe[key])
        .map(key => `<li>${recipe[key]}</li>`)
        .join('');

    if (!ingredientsList) {
        ingredientsList = "<li>No ingredients available</li>";
        customAlert("No ingredients found for this recipe.");
    }

    // Recipe details HTML content
    const recipeDetailsContent = `
        <h2>${recipe.strMeal}</h2>
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
        <h3>Ingredients</h3>
        <ul>${ingredientsList}</ul>
        <h3>Instructions</h3>
        <p>${recipe.strInstructions || "No instructions available"}</p>
    `;

    const recipeDetails = document.getElementById('recipe-details');
    recipeDetails.innerHTML = recipeDetailsContent;  // Update the page
    customAlert("Showing details for: " + recipe.strMeal);
}

document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('search-input').value;
    fetchRecipes(query);
});

function customAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.style.position = 'fixed';
    alertBox.style.top = '10px';
    alertBox.style.left = '10px';
    alertBox.style.backgroundColor = '#ff6347';
    alertBox.style.color = 'white';
    alertBox.style.padding = '10px';
    alertBox.style.zIndex = '1000';
    alertBox.textContent = message;

    document.body.appendChild(alertBox);

    setTimeout(() => {
        document.body.removeChild(alertBox);
    }, 3000);
}
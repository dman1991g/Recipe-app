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
    document.getElementById('recipe-details').innerHTML = ''; // Clear any previous recipe details

    if (recipes && recipes.length > 0) {
        recipes.forEach(recipe => {
            const recipeItem = document.createElement('div');
            recipeItem.className = 'recipe-item';
            recipeItem.innerHTML = `
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <h3>${recipe.strMeal}</h3>
            `;
            recipeItem.addEventListener('click', () => {
                showRecipeDetails(recipe);
            });
            recipeList.appendChild(recipeItem);
        });
        recipeList.style.display = 'flex'; // Show the recipe list
    } else {
        customAlert("No recipes found for the given search.");
    }
}

function showRecipeDetails(recipe) {
    customAlert("Showing details for: " + recipe.strMeal);

    // Hide the recipe list
    document.getElementById('recipe-list').style.display = 'none';

    // Collect ingredients
    let ingredientsList = Object.keys(recipe)
        .filter(key => key.startsWith('strIngredient') && recipe[key])
        .map(key => `<li>${recipe[key]}</li>`)
        .join('');

    if (!ingredientsList) {
        ingredientsList = "<li>No ingredients available</li>";
    }

    // Recipe details HTML content
    const recipeDetailsContent = `
        <button id="back-button">Back to Search Results</button>
        <h2>${recipe.strMeal}</h2>
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
        <h3>Ingredients</h3>
        <ul>${ingredientsList}</ul>
        <h3>Instructions</h3>
        <p>${recipe.strInstructions || "No instructions available"}</p>
    `;

    const recipeDetails = document.getElementById('recipe-details');
    recipeDetails.innerHTML = recipeDetailsContent;

    // Add event listener to back button
    document.getElementById('back-button').addEventListener('click', () => {
        recipeDetails.innerHTML = '';  // Clear recipe details
        document.getElementById('recipe-list').style.display = 'flex';  // Show the recipe list again
    });
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
// Add script load check message at the top
document.body.innerHTML += "<p>Script Loaded Successfully!</p>";

// Function to display debug messages on the screen
function showDebugMessage(message) {
    const debugDiv = document.createElement('div');
    debugDiv.style.background = 'yellow';
    debugDiv.style.padding = '10px';
    debugDiv.style.margin = '5px';
    debugDiv.innerText = message;
    document.body.appendChild(debugDiv);
}

// Custom alert function to simulate alerts on the screen
function customAlert(msg) {
    const alertDiv = document.createElement('div');
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '50%';
    alertDiv.style.left = '50%';
    alertDiv.style.transform = 'translate(-50%, -50%)';
    alertDiv.style.backgroundColor = 'white';
    alertDiv.style.border = '2px solid black';
    alertDiv.style.padding = '20px';
    alertDiv.style.zIndex = '1000';
    alertDiv.innerText = msg;
    document.body.appendChild(alertDiv);

    // Remove the alert after a few seconds
    setTimeout(() => {
        document.body.removeChild(alertDiv);
    }, 3000);
}

customAlert("Custom alert test: Script started");

// Define your API endpoint
const apiUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

async function fetchRecipes(query) {
    showDebugMessage("Starting fetchRecipes function with query: " + query);
    try {
        const response = await fetch(apiUrl + query);
        const data = await response.json();
        showDebugMessage("Data fetched successfully");
        displayRecipes(data.meals);
    } catch (error) {
        customAlert('Error fetching recipes: ' + error);
    }
}

function displayRecipes(recipes) {
    showDebugMessage("Starting displayRecipes function");
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';
    recipes.forEach(recipe => {
        const recipeItem = document.createElement('div');
        recipeItem.className = 'recipe-item';
        recipeItem.innerHTML = `
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
            <h3>${recipe.strMeal}</h3>
        `;
        recipeItem.addEventListener('click', () => {
            customAlert("Recipe item clicked: " + recipe.strMeal);
            showRecipeDetails(recipe);
        });
        recipeList.appendChild(recipeItem);
    });
}

function showRecipeDetails(recipe) {
    showDebugMessage("Starting showRecipeDetails function for recipe: " + recipe.strMeal);
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
    `;
    customAlert("Showing details for: " + recipe.strMeal);
}

// Event listener for the search form
document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('search-input').value;
    customAlert("Search submitted with query: " + query);
    fetchRecipes(query);
});
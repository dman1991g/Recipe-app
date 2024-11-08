const apiUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

// Fetch recipes based on the search query
async function fetchRecipes(query) {
    try {
        console.log('Searching for recipes with query:', query); // Log search query
        const response = await fetch(apiUrl + query);
        const data = await response.json();
        
        if (data.meals) {
            console.log('Fetched recipes:', data.meals); // Log the fetched meals data
            displayRecipes(data.meals);
        } else {
            alert('No recipes found for this query');
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
        alert('Error fetching recipes');
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
        
        // Check if the event listener is being added
        console.log(`Attempting to add click listener for: ${recipe.strMeal}`);

        recipeItem.addEventListener('click', () => {
            alert(`Clicked on: ${recipe.strMeal}`); // Confirm the click event
            showRecipeDetails(recipe);
        });

        recipeList.appendChild(recipeItem);
    });
}

// Show detailed information for a clicked recipe
function showRecipeDetails(recipe) {
    console.log('Showing details for:', recipe.strMeal); // Confirm that this function is triggered

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
    if (query.trim() === '') {
        alert('Please enter a search query');
    } else {
        fetchRecipes(query);
    }
});
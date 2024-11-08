const apiUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

async function fetchRecipes(query) {
    try {
        const response = await fetch(apiUrl + query);
        const data = await response.json();
        if (data.meals) {
            alert('Recipes fetched successfully');
            displayRecipes(data.meals);
        } else {
            alert('No recipes found for this query');
        }
    } catch (error) {
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

        recipeItem.addEventListener('click', () => {
            alert(`You clicked on: ${recipe.strMeal}`);
            showRecipeDetails(recipe);
        });

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
    `;

    alert(`Details loaded for: ${recipe.strMeal}`);
}

document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('search-input').value;
    fetchRecipes(query);
});
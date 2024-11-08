const apiUrl = 'https://api.spoonacular.com/recipes/complexSearch?query=';
const apiKey = '65198bed37f2490e9ccae40a584a071e';  // Replace this with your actual Spoonacular API key

async function fetchRecipes(query) {
    try {
        const response = await fetch(`${apiUrl}${query}&apiKey=${65198bed37f2490e9ccae40a584a071e}`);
        const data = await response.json();
        displayRecipes(data.results);  // Spoonacular returns recipes in the 'results' array
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';  // Clear any previous results
    recipes.forEach(recipe => {
        const recipeItem = document.createElement('div');
        recipeItem.className = 'recipe-item';
        recipeItem.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
        `;
        recipeItem.addEventListener('click', () => showRecipeDetails(recipe.id));
        recipeList.appendChild(recipeItem);
    });
}

async function showRecipeDetails(recipeId) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${65198bed37f2490e9ccae40a584a071e}`);
        const recipe = await response.json();
        const recipeDetails = document.getElementById('recipe-details');
        recipeDetails.innerHTML = `
            <h2>${recipe.title}</h2>
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>Ingredients</h3>
            <ul>
                ${recipe.extendedIngredients.map(ingredient => {
                    return `<li>${ingredient.amount} ${ingredient.unit} ${ingredient.name}</li>`;
                }).join('')}
            </ul>
            <h3>Instructions</h3>
            <p>${recipe.instructions || 'No instructions available'}</p>
        `;
    } catch (error) {
        console.error('Error fetching recipe details:', error);
    }
}

document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const query = document.getElementById('search-input').value;
    fetchRecipes(query);
});
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
    recipeList.innerHTML = ''; // Clear the list first
    recipes.forEach(recipe => {
        const recipeItem = document.createElement('div');
        recipeItem.className = 'recipe-item';
        recipeItem.innerHTML = `
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
            <h3>${recipe.strMeal}</h3>
        `;
        recipeItem.addEventListener('click', () => showRecipeDetails(recipe)); // Show details on click
        recipeList.appendChild(recipeItem);
    });
}

function showRecipeDetails(recipe) {
    const recipeDetails = document.getElementById('recipe-details');
    const shoppingListDiv = document.getElementById('shopping-list');

    // Extract ingredients
    const ingredients = Object.keys(recipe)
        .filter(key => key.startsWith('strIngredient') && recipe[key])
        .map(key => recipe[key]);

    // Generate ingredients list with "Add to Shopping List" buttons
    const ingredientsList = ingredients
        .map(ingredient => 
            `<li>${ingredient} <button class="add-to-list" data-ingredient="${ingredient}">+</button></li>`
        )
        .join('');

    recipeDetails.innerHTML = `
        <button id="back-button">Back</button>
        <h2>${recipe.strMeal}</h2>
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
        <h3>Ingredients</h3>
        <ul>${ingredientsList}</ul>
        <h3>Instructions</h3>
        <p>${recipe.strInstructions || "No instructions available"}</p>
    `;

    document.getElementById('back-button').addEventListener('click', () => {
        recipeDetails.style.display = 'none';
        document.getElementById('recipe-list').style.display = 'block';
    });

    document.querySelectorAll('.add-to-list').forEach(button => {
        button.addEventListener('click', (event) => {
            const ingredient = event.target.getAttribute('data-ingredient');
            addToShoppingList(ingredient);
        });
    });

    // Show recipe details and hide others
    recipeDetails.style.display = 'block';
    document.getElementById('recipe-list').style.display = 'none';
    shoppingListDiv.style.display = 'none';
}

// Function to add ingredients to LocalStorage shopping list
function addToShoppingList(ingredient) {
    let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    
    if (!shoppingList.includes(ingredient)) {
        shoppingList.push(ingredient);
        localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
        alert(`${ingredient} added to shopping list!`);
    } else {
        alert(`${ingredient} is already in the shopping list.`);
    }
}

// Function to show shopping list
function showShoppingList() {
    const shoppingListDiv = document.getElementById('shopping-list');
    const recipeList = document.getElementById('recipe-list');
    const recipeDetails = document.getElementById('recipe-details');

    const shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    
    if (shoppingList.length === 0) {
        shoppingListDiv.innerHTML = `<p>Your shopping list is empty.</p>`;
    } else {
        let listHTML = `<h2>Shopping List</h2><ul>`;
        shoppingList.forEach((item, index) => {
            listHTML += `<li>${item} <button class="remove-item" data-index="${index}">Remove</button></li>`;
        });
        listHTML += `</ul><button id="clear-list">Clear List</button>`;
        shoppingListDiv.innerHTML = listHTML;

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (event) => {
                removeFromShoppingList(event.target.getAttribute('data-index'));
            });
        });

        document.getElementById('clear-list').addEventListener('click', clearShoppingList);
    }

    // Show shopping list and hide others
    shoppingListDiv.style.display = 'block';
    recipeList.style.display = 'none';
    recipeDetails.style.display = 'none';
}

// Function to remove an item from shopping list
function removeFromShoppingList(index) {
    let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    shoppingList.splice(index, 1);
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    showShoppingList();
}

// Function to clear the shopping list
function clearShoppingList() {
    localStorage.removeItem('shoppingList');
    showShoppingList();
}

// Event listeners
document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('search-input').value;
    fetchRecipes(query);
});

document.getElementById('shopping-list-btn').addEventListener('click', showShoppingList);
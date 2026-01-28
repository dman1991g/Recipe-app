const apiUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

// ====== COOKBOOK STORAGE ======
function getCookbookRecipes() {
    return JSON.parse(localStorage.getItem('customRecipes')) || [];
}

function saveCookbookRecipes(recipes) {
    localStorage.setItem('customRecipes', JSON.stringify(recipes));
}

// ====== FETCH API RECIPES ======
async function fetchRecipes(query) {
    try {
        const response = await fetch(apiUrl + query);
        const data = await response.json();
        displayRecipes(data.meals);
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

// ====== DISPLAY RECIPES (API + CUSTOM) ======
function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';

    if (!recipes || recipes.length === 0) {
        recipeList.innerHTML = "<p>No recipes found.</p>";
        return;
    }

    recipes.forEach(recipe => {
        const recipeItem = document.createElement('div');
        recipeItem.className = 'recipe-item';

        const image = recipe.strMealThumb || recipe.image || 'https://via.placeholder.com/150';

        recipeItem.innerHTML = `
            <img src="${image}" alt="${recipe.strMeal || recipe.title}">
            <h3>${recipe.strMeal || recipe.title}</h3>
            ${recipe.source === "custom" ? '<span class="badge">My Recipe</span>' : ''}
        `;

        recipeItem.addEventListener('click', () => showRecipeDetails(recipe));
        recipeList.appendChild(recipeItem);
    });

    recipeList.style.display = 'block';
    document.getElementById('recipe-details').style.display = 'none';
    document.getElementById('add-recipe-form').style.display = 'none';
    document.getElementById('shopping-list').style.display = 'none';
}

// ====== SHOW RECIPE DETAILS ======
function showRecipeDetails(recipe) {
    const recipeDetails = document.getElementById('recipe-details');

    let ingredients = [];
    let instructions = "";

    // API recipe
    if (!recipe.source) {
        ingredients = Object.keys(recipe)
            .filter(key => key.startsWith('strIngredient') && recipe[key])
            .map(key => recipe[key]);

        instructions = recipe.strInstructions || "No instructions available";
    } 
    // Custom recipe
    else {
        ingredients = recipe.ingredients;
        instructions = recipe.instructions.join("<br>");
    }

    const ingredientsList = ingredients
        .map(ingredient =>
            `<li>${ingredient} <button class="add-to-list" data-ingredient="${ingredient}">+</button></li>`
        ).join('');

    recipeDetails.innerHTML = `
        <button id="back-button">Back</button>
        <h2>${recipe.strMeal || recipe.title}</h2>
        <img src="${recipe.strMealThumb || recipe.image || 'https://via.placeholder.com/300'}">
        <h3>Ingredients</h3>
        <ul>${ingredientsList}</ul>
        <h3>Instructions</h3>
        <p>${instructions}</p>
        ${recipe.source === "custom" ? `<button id="delete-recipe">Delete Recipe</button>` : ''}
    `;

    document.getElementById('back-button').addEventListener('click', showCookbookOrExplore);

    document.querySelectorAll('.add-to-list').forEach(button => {
        button.addEventListener('click', (event) => {
            addToShoppingList(event.target.getAttribute('data-ingredient'));
        });
    });

    if (recipe.source === "custom") {
        document.getElementById('delete-recipe').addEventListener('click', () => {
            deleteCookbookRecipe(recipe.id);
        });
    }

    recipeDetails.style.display = 'block';
    document.getElementById('recipe-list').style.display = 'none';
    document.getElementById('add-recipe-form').style.display = 'none';
    document.getElementById('shopping-list').style.display = 'none';
}

// ====== ADD TO SHOPPING LIST ======
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

// ====== SHOW SHOPPING LIST ======
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

    shoppingListDiv.style.display = 'block';
    recipeList.style.display = 'none';
    recipeDetails.style.display = 'none';
}

// ====== SHOPPING LIST HELPERS ======
function removeFromShoppingList(index) {
    let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
    shoppingList.splice(index, 1);
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    showShoppingList();
}

function clearShoppingList() {
    localStorage.removeItem('shoppingList');
    showShoppingList();
}

// ====== NAVIGATION ======
function showExplore() {
    document.getElementById('search-form').style.display = 'block';
    fetchRecipes('');
}

function showCookbook() {
    document.getElementById('search-form').style.display = 'none';
    const recipes = getCookbookRecipes();
    displayRecipes(recipes);
}

function showCookbookOrExplore() {
    if (document.getElementById('search-form').style.display === 'none') {
        showCookbook();
    } else {
        showExplore();
    }
}

// ====== SAVE CUSTOM RECIPE WITH IMAGE ======
function saveRecipe() {
    const title = document.getElementById("new-title").value.trim();
    const ingredients = document.getElementById("new-ingredients").value.split("\n").filter(i => i);
    const instructions = document.getElementById("new-instructions").value.split("\n").filter(i => i);
    const cookTime = document.getElementById("new-cookTime").value;
    const servings = document.getElementById("new-servings").value;
    const imageInput = document.getElementById("new-image"); // optional file input
    let imageBase64 = null;

    if (imageInput && imageInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageBase64 = e.target.result;

            addRecipeToLocal(title, ingredients, instructions, cookTime, servings, imageBase64);
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        addRecipeToLocal(title, ingredients, instructions, cookTime, servings, imageBase64);
    }
}

function addRecipeToLocal(title, ingredients, instructions, cookTime, servings, image) {
    if (!title || ingredients.length === 0 || instructions.length === 0) {
        alert("Please fill in title, ingredients, and instructions.");
        return;
    }

    const newRecipe = {
        id: "local_" + Date.now(),
        source: "custom",
        title,
        ingredients,
        instructions,
        cookTime,
        servings,
        image
    };

    const recipes = getCookbookRecipes();
    recipes.push(newRecipe);
    saveCookbookRecipes(recipes);

    alert("Recipe added to My Cookbook!");
    showCookbook();
}

// ====== DELETE CUSTOM RECIPE ======
function deleteCookbookRecipe(id) {
    let recipes = getCookbookRecipes();
    recipes = recipes.filter(r => r.id !== id);
    saveCookbookRecipes(recipes);
    showCookbook();
}

// ====== BUTTON LISTENERS ======
document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('search-input').value;
    fetchRecipes(query);
});

document.getElementById('shopping-list-btn').addEventListener('click', showShoppingList);

document.getElementById('explore-btn').addEventListener('click', showExplore);
document.getElementById('cookbook-btn').addEventListener('click', showCookbook);

document.getElementById('add-recipe-btn').addEventListener('click', () => {
    document.getElementById('add-recipe-form').style.display = 'block';
    document.getElementById('recipe-list').style.display = 'none';
    document.getElementById('recipe-details').style.display = 'none';
    document.getElementById('shopping-list').style.display = 'none';
    document.getElementById('search-form').style.display = 'none';
});

document.getElementById('cancel-add-btn').addEventListener('click', showCookbook);
document.getElementById('save-recipe-btn').addEventListener('click', saveRecipe);

// ====== INITIAL LOAD ======
showExplore();
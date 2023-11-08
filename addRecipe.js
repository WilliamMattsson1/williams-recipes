const addRecipeArrow = document.querySelector('.my-recipes-arrow')
const myRecipesUl = document.querySelector('.my-recipes-ul')
const myRecipes = document.querySelector('.my-recipes')

const addRecipeForm = document.querySelector('#recipe-form')

// Open and close "My recipes"
addRecipeArrow.addEventListener('click', () => {
    if (addRecipeArrow.classList.contains('fa-arrow-right')) {
        addRecipeArrow.setAttribute(
            'class',
            'fa-solid fa-arrow-left my-recipes-arrow'
        )
        myRecipes.classList.remove('my-recipes-fixer')
    } else {
        addRecipeArrow.setAttribute(
            'class',
            'fa-solid fa-arrow-right my-recipes-arrow'
        )
        myRecipes.classList.add('my-recipes-fixer')
    }
})

// Get the meals and add every meal () to my recipes
async function updateMyRecipes() {
    myRecipesUl.innerHTML = ''
    const meals = await getMealsDB()
    for (let i = 0; i < meals.length; i++) {
        const meal = meals[i]
        addMealToMyRecipes(meal)
    }
}

// Gets the meals in the db.
async function getMealsDB() {
    try {
        const respone = await fetch('http://localhost:3000/meals/')
        const data = await respone.json()
        return data
    } catch (error) {
        console.error('Something went worng: ', error)
    }
}

// Creates the <li> and append
function addMealToMyRecipes(meal) {
    const myRecipe = document.createElement('li')
    myRecipe.innerHTML = `<span class="my-recipe-text">${meal.name}</span>
    <div>
        <i class="fa-solid fa-pen my-recipe-edit"></i>
        <i class="fa-solid fa-xmark my-recipe-x"></i>
    </div>`

    // Popup the edit page for the meal pressed
    const editMyRecipeBtn = myRecipe.querySelector('.my-recipe-edit')
    editMyRecipeBtn.addEventListener('click', () => {
        editRecipePopup(meal)
    })

    // removes the meal from db
    const removeMyRecipeBtn = myRecipe.querySelector('.my-recipe-x')
    removeMyRecipeBtn.addEventListener('click', () => {
        removeMealFromMyRecipes(meal.id)
    })

    // popup the recipe when text is pressed
    const myRecipeText = myRecipe.querySelector('.my-recipe-text')
    myRecipeText.addEventListener('click', () => {
        console.log(meal)
        myRecipePopup(meal)
    })

    myRecipesUl.append(myRecipe) // Append
}

// delete method from db
async function removeMealFromMyRecipes(mealID) {
    try {
        await fetch(`http://localhost:3000/meals/${mealID}`, {
            method: 'DELETE'
        })
        updateMyRecipes()
    } catch (error) {
        console.error('Something went wrong: ', error)
    }
}

// Make a object from the form. and post request it to the db
addRecipeForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const recipe = {
        name: addRecipeForm.mealName.value,
        img: addRecipeForm.mealImgUrl.value,
        instructions: addRecipeForm.mealInstructions.value,
        ingredients: addRecipeForm.mealIngredients.value
    }

    try {
        await fetch('http://localhost:3000/meals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recipe)
        })
    } catch (error) {
        console.error('Something went wrong: ', error)
    }

    addRecipeForm.reset() // Clears the form
})

// popup when a recepi from my recipes is pressed
function myRecipePopup(meal) {
    popup.innerHTML = ''
    footer.style.display = 'none'
    const newPopup = document.createElement('div')
    newPopup.classList.add('pop-up-content')

    popupH2.innerText = meal.name
    newPopup.innerHTML = `
            <div class="left">
            <div class="meal-card">
                <div class="meal-card-img-container">
                    <img src="${meal.img}" alt="recipe foto">
                </div>
                <div class="meal-name">
                    <p>${meal.name}</p>
                    <i class="fa-regular fa-heart"></i>
                </div>
            </div>
            <div class="ingredients-div">
                <h2>Ingredients / Measures</h2>
                <p>
                    ${meal.ingredients}
                </p>
            </div>
        </div>
        <div class="right">
            <div>
                <h2>Intructions</h2>
                <p class="meal-info">${meal.instructions}</p>
            </div>

        </div>
    `

    popup.append(newPopup) // append and make it visible
    popupContainer.style.display = 'flex'
}

// Close the popup when X is clicked
closePopupBtn.addEventListener('click', () => {
    popupContainer.style.display = 'none'
    footer.style.display = 'block'
})

// Popup form when edit recipe btn is pressed
function editRecipePopup(meal) {
    console.log('editRecipeBtn pressed', meal)

    popup.innerHTML = ''
    footer.style.display = 'none'
    const newPopup = document.createElement('div')
    newPopup.classList.add('pop-up-content')

    popupH2.innerText = meal.name
    newPopup.innerHTML = `
    <div class="form-container">
    <h2 class="form-title">Edit the recipe</h2>
    <form id="edit-form">
        <div class="recipe-details">
            <div class="input-box">
                <span class="details">Meal name</span>
                <input
                    value = ${meal.name}
                    type="text"
                    name="mealName"
                    placeholder="Enter Your Meals Name..."
                    required
                />
            </div>
            <div class="input-box">
                <span class="details">Image Url</span>
                <input
                    value = ${meal.img}
                    type="text"
                    name="mealImgUrl"
                    placeholder="Enter Your image url..."
                    required
                />
            </div>
            <div class="input-box">
                <span class="details">Instructions</span>
                <textarea
                    required
                    name="mealInstructions"
                    id="instructions"
                    cols="40"
                    rows="8"
                    placeholder="Cut your vegestables in small pieces. Start the oven..."
                >${meal.instructions}</textarea>
            </div>
            <div class="input-box">
                <span class="details">Ingredients</span>
                <textarea
                    required
                    name="mealIngredients"
                    id="ingredients"
                    cols="40"
                    rows="8"
                    placeholder="Tomatoes - 2,
Beef - 500g,
"
                >${meal.ingredients}</textarea>
            </div>
        </div>
        <div class="recipe-btn-container">
            <button id="submit-edit" type="submit" class="add-recipe-btn">
                Edit recipe
            </button>
        </div>
    </form>
</div>
    `
    popup.append(newPopup) // Append
    popupContainer.style.display = 'flex'

    // Takes the new recipe and PUT request it to db
    const editRecipeForm = document.querySelector('#edit-form')
    editRecipeForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        const newRecipe = {
            name: editRecipeForm.mealName.value,
            img: editRecipeForm.mealImgUrl.value,
            instructions: editRecipeForm.mealInstructions.value,
            ingredients: editRecipeForm.mealIngredients.value
        }

        try {
            await fetch(`http://localhost:3000/meals/${meal.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRecipe)
            })
        } catch (error) {
            console.error('Something went wrong: ', error)
        }
    })
}

// display my recipes
updateMyRecipes()

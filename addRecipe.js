const addRecipeArrow = document.querySelector('.my-recipes-arrow')
const myRecipesUl = document.querySelector('.my-recipes-ul')
const myRecipes = document.querySelector('.my-recipes')

// Open and close "My recipes"
addRecipeArrow.addEventListener('click', () => {
    if (addRecipeArrow.classList.contains('fa-arrow-right')) {
        addRecipeArrow.setAttribute(
            'class',
            'fa-solid fa-arrow-left my-recipes-arrow'
        )
        myRecipesUl.style.display = 'block'
        myRecipes.style.height = 'fit-content'
        myRecipes.style.width = 'auto'
    } else {
        addRecipeArrow.setAttribute(
            'class',
            'fa-solid fa-arrow-right my-recipes-arrow'
        )
        myRecipesUl.style.display = 'hidden'
        myRecipes.style.height = '3rem'
        myRecipes.style.width = '3rem'
    }
})

// Get the meals  and add every meal ()
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
    const respone = await fetch('http://localhost:3000/meals/')
    const data = await respone.json()
    return data
}

// Creates the <li> and append
function addMealToMyRecipes(meal) {
    const myRecipe = document.createElement('li')
    myRecipe.innerHTML = `<span class="my-recipe-text">${meal.name}</span>
    <i class="fa-solid fa-xmark my-recipe-x"></i>`

    const removeMyRecipeBtn = myRecipe.querySelector('.my-recipe-x')
    removeMyRecipeBtn.addEventListener('click', () => {
        removeMealFromMyRecipes(meal.id)
    })
    myRecipesUl.append(myRecipe)
}

// delete method the id
async function removeMealFromMyRecipes(mealID) {
    await fetch(`http://localhost:3000/meals/${mealID}`, {
        method: 'DELETE'
    })
    updateMyRecipes()
}

// ! Skapa ett objekt och gör post metod när man trycker på add meal btn

// Get it going
updateMyRecipes()

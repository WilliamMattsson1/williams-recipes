const modeBtn = document.querySelector('.mode-btn > i')
const favContainer = document.querySelector('.fav-meals-container')
const favMealsCounter = document.querySelector('.total-fav-meals')
const favArrow = document.querySelector('.fav-toggle')
const favMealsContainer = document.querySelector('.fav-meals')

const searchInput = document.querySelector('.search-input')
const searchBtn = document.querySelector('.search-btn')
const liSuggestions = document.querySelectorAll('.suggestions > li')
const randomBtn = document.querySelector('.random-btn')

const mealsH3 = document.querySelector('.meals-h3')
const mealsContainer = document.querySelector('.meals')

const popupContainer = document.querySelector('.pop-up-container')
const popupH2 = document.querySelector('.popup-h2')
const closePopupBtn = document.querySelector('.pop-up > i')
const popup = document.querySelector('.pop-up-content')

const footer = document.querySelector('footer')

// Open/close hamburger menu
function toggleMenu() {
    const menu = document.querySelector('.menu-links')
    const icon = document.querySelector('.hamburger-icon')
    menu.classList.toggle('open')
    icon.classList.toggle('open')
}

// Darkmode switching
let darkMode = localStorage.getItem('darkMode')

function enableDarkMode() {
    document.body.classList.add('dark-mode') // change the var colors
    modeBtn.setAttribute('class', 'fa-solid fa-toggle-on') // change FA icon
    localStorage.setItem('darkMode', 'enabled') // Save to LS
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode')
    modeBtn.setAttribute('class', 'fa-solid fa-toggle-off')
    localStorage.setItem('darkMode', 'disabled')
}

if (darkMode === 'enabled') {
    enableDarkMode()
}

modeBtn.addEventListener('click', () => {
    darkMode = localStorage.getItem('darkMode') // Solved bug 3
    if (darkMode !== 'enabled') {
        enableDarkMode()
    } else {
        disableDarkMode()
    }
})

// When search icon is pressed.
searchBtn.addEventListener('click', showResults)
// When Enter is pressed
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        showResults()
    }
})

/* Showing results from search value */
async function showResults() {
    mealsContainer.innerHTML = '' // Empty from previous.
    const searchValue = searchInput.value
    const meals = await fetchMealBySearch(searchValue) // Fetch meals from user input.
    console.log(meals)
    // If there is search results display all results
    if (meals) {
        meals.forEach((meal) => {
            displayMeal(meal)
        })

        // Change the text to this
        mealsH3.innerText = `Search results for: ${searchValue}`
    }

    // If there isnt any search results.
    else {
        mealsH3.innerText = `No meals for: ${searchValue}...`
        mealsContainer.innerHTML = ''
    }
    // Clear the input field
    searchInput.value = ''
}

// Fetch meals by the user input and return
async function fetchMealBySearch(input) {
    try {
        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`
        )
        const data = await response.json()
        const meals = data.meals
        return meals
    } catch (error) {
        console.error('Something went wrong: ', error)
    }
}

// Add meal to mealsContainer, logic behind favorite button and show popup if its pressed
function displayMeal(meal) {
    const mealCard = document.createElement('div')
    mealCard.classList.add('meal-card')
    mealCard.innerHTML = `
            <div class="meal-card-img-container">
                <img src="${meal.strMealThumb}">
            </div>
            <div class="meal-name">
                <i class="fa-solid fa-utensils"></i>
                <p>${meal.strMeal}</p>
                <i class="fa-regular fa-heart"></i>
            </div>
    `

    /* shows popup when utensils btn  */
    const utensilsBtn = mealCard.querySelector('.fa-utensils')
    utensilsBtn.addEventListener('click', () => {
        showMealInfoPopup(meal)
    })

    const favBtn = mealCard.querySelector('.fa-heart')
    favBtn.addEventListener('click', () => {
        if (favBtn.classList.contains('fa-regular')) {
            favBtn.setAttribute('class', 'fa-solid fa-heart')
            addMealStorage(meal.idMeal) // Save id to Local storage
        } else {
            favBtn.setAttribute('class', 'fa-regular fa-heart')
            removeMealStorage(meal.idMeal)
        }
        updateFavMeals()
        updateTotalFavMeals()
    })

    // show popup when meal img is pressed
    mealCard
        .querySelector('.meal-card-img-container')
        .addEventListener('click', () => {
            showMealInfoPopup(meal)
        })

    mealsContainer.append(mealCard)
}

// Listen to the suggestions and send the category to the function
liSuggestions.forEach((li) => {
    li.addEventListener('click', () => {
        const category = li.innerText
        fetchMealsByCategory(category)
    })
})

// Display the results depending on the category
async function fetchMealsByCategory(category) {
    try {
        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
        )
        const data = await response.json()
        const meals = data.meals

        mealsContainer.innerHTML = '' // Empty from previous.
        console.log(meals) // log the deatails (only name, id, img)

        // get the id and fetch to get all data needed
        meals.forEach(async (meal) => {
            const id = meal.idMeal
            const fetchedMeal = await fetchMealById(id)
            displayMeal(fetchedMeal)
        })
        mealsH3.innerText = `Search results for: ${category}`
    } catch {
        console.error('Something went wrong: ', error)
    }
}

// Display one random meal when btn is clicked
randomBtn.addEventListener('click', () => {
    mealsContainer.innerHTML = ''
    mealsH3.innerText = `Random generated meal`
    fetchRandomMeal()
})

// Generate a random meal and calls displayMeal(random)
async function fetchRandomMeal() {
    try {
        const response = await fetch(
            'https://www.themealdb.com/api/json/v1/1/random.php'
        )
        const data = await response.json()
        const randomMeal = data.meals[0]
        console.log(randomMeal)
        displayMeal(randomMeal)
    } catch (error) {
        console.error('Something went wrong: ', error)
    }
}

// Toggle the fav meals
favArrow.addEventListener('click', () => {
    if (favArrow.classList.contains('fa-arrow-down')) {
        favArrow.setAttribute('class', 'fa-solid fa-arrow-up fav-toggle')
        favContainer.style.height = 'auto'
    } else {
        favArrow.setAttribute('class', 'fa-solid fa-arrow-down fav-toggle')
        favContainer.style.height = '2.4rem'
    }
})

async function updateFavMeals() {
    favMealsContainer.innerHTML = ''
    const mealsIds = getMealStorage() // gets the meals from ls in array
    for (let i = 0; i < mealsIds.length; i++) {
        const mealID = mealsIds[i]
        const meal = await fetchMealById(mealID) // get every meals id
        displayFavMeal(meal) // create the element with next function
    }
}

// Update how many favorite meals
async function updateTotalFavMeals() {
    let totalFavMeals = await getMealStorage().length
    favMealsCounter.innerText = totalFavMeals
    localStorage.setItem('totalFavMeals', totalFavMeals)
}

// fetch the meal by ID and returns it
async function fetchMealById(id) {
    try {
        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        )
        const data = await response.json()
        const meal = data.meals[0]
        return meal
    } catch (error) {
        console.error('Something went wrong: ', error)
    }
}

// display the favorites
function displayFavMeal(meal) {
    const favMeal = document.createElement('div')
    favMeal.classList.add('fav-meal')
    favMeal.innerHTML = `
                <div class="fav-meal-content">
                    <div class="fav-meal-img-container">
                        <img src="${meal.strMealThumb}" alt="fav-meal image">
                    </div>
                    <div class="fav-meal-text">
                        <p>${meal.strMeal}</p>
                    </div>
                </div>
                <i class="fa-solid fa-x"></i>
    `

    // Shows popup when the img is clicked.
    favMeal.querySelector('.fav-meal-content').addEventListener('click', () => {
        showMealInfoPopup(meal)
    })

    // The X take it away from fav list and LS
    const x = favMeal.querySelector('.fa-x')
    x.addEventListener('click', () => {
        removeMealStorage(meal.idMeal)
        // Update the favorite button too
        const heartBtns = document.querySelectorAll('.fa-heart')
        heartBtns.forEach((heartBtn) => {
            heartBtn.setAttribute('class', 'fa-regular fa-heart')
        })

        // Update the fav list
        updateFavMeals()
        updateTotalFavMeals()
    })

    // Places it in the container.
    favMealsContainer.append(favMeal)
}

// Get the local storage ids if there is something there.
function getMealStorage() {
    const mealIds = JSON.parse(localStorage.getItem('mealIds'))
    if (mealIds !== null) {
        return mealIds
    } else {
        return []
    }
}

// Add meal to Local storage array
function addMealStorage(mealID) {
    const mealIds = getMealStorage()
    const updatedMealIds = [...mealIds, mealID]
    localStorage.setItem('mealIds', JSON.stringify(updatedMealIds))
}

// Remove meal from local storage array
function removeMealStorage(mealID) {
    const mealIds = getMealStorage()
    updatedMealIds = mealIds.filter((id) => id !== mealID) // removes mealID from array
    localStorage.setItem('mealIds', JSON.stringify(updatedMealIds))
}

// Popup function
function showMealInfoPopup(meal) {
    popup.innerHTML = ''
    //  Hide footer when popup comes
    footer.style.display = 'none'

    // If there is ingridients --> Push in to array. ELSE break the loop.
    const ingredients = []
    let i = 1
    while (meal[`strIngredient${i}`]) {
        ingredients.push(
            `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
        )
        i++
    }

    popupH2.innerText = `${meal.strMeal}`

    popup.innerHTML = `
        <div class="left-side-content">
            <div class="meal-card-img-container">
                <img src="${meal.strMealThumb}" alt="recipe foto">
            </div>
            <div class="ingredients-div">
                <h2>Ingredients / Measures</h2>
                <ul>
                    ${ingredients.map((i) => `<li>${i}</li>`).join('')}
                </ul>
            </div>
        </div>
        <div class="instructions">
                <h2>Intructions</h2>
                <p class="meal-info">${meal.strInstructions}</p>
        </div>
`
    popupContainer.style.display = 'flex' // Make it visible
}

// Close the popup when X is clicked
closePopupBtn.addEventListener('click', () => {
    popupContainer.style.display = 'none'
    footer.style.display = 'block'
})

updateFavMeals()
updateTotalFavMeals()

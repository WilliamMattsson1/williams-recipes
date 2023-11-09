// * To display how many meals we have for every category

// ! Make sure this is linked with <script> in the about.html
let categoryNames = []
let mealsQuantity = []
const ctx = document.getElementById('my-chart')

// Get all categories and create the chart
async function fetchCategories() {
    try {
        const response = await fetch(
            'https://www.themealdb.com/api/json/v1/1/list.php?c=list'
        )
        const data = await response.json()
        const categories = data.meals
        categoryNames = categories.map((category) => category.strCategory)

        for (let i = 0; i < categoryNames.length; i++) {
            await getQuantity(categoryNames[i])
        }

        console.log(categoryNames)
        console.log(mealsQuantity)

        createChart() // Create the chart after fetching data
    } catch (error) {
        console.error('Something went wrong:', error)
    }
}

// get the meals from the (categoryName)
async function getQuantity(categoryName) {
    try {
        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`
        )
        const data = await response.json()
        const category = data.meals
        let quantity = category.length
        mealsQuantity.push(quantity)
    } catch (error) {
        console.error('Something went wrong:', error)
    }
}

// Function to create the chart
function createChart() {
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categoryNames,
            datasets: [
                {
                    label: 'Different Categories',
                    data: mealsQuantity,
                    backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                    borderColor: ['rgba(255, 99, 132, 1)'],
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })
}

// Start the process
fetchCategories()

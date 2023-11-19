// * JS for chart at about page
// * To display how many meals we have for every category

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
        // get the names in the array
        categoryNames = categories.map((category) => category.strCategory)

        // get quantity for every category
        for (let i = 0; i < categoryNames.length; i++) {
            await getQuantity(categoryNames[i])
        }

        console.log(categoryNames)
        console.log(mealsQuantity)

        // display none the loader when data is loaded
        document.querySelector('#loader').style.display = 'none'

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
    const colorPalette = [
        'rgba(255, 99, 132, 0.4)',
        'rgba(54, 162, 235, 0.4)',
        'rgba(255, 206, 86, 0.4)',
        'rgba(75, 192, 192, 0.4)',
        'rgba(153, 102, 255, 0.4)',
        'rgba(255, 159, 64, 0.4)',
        'rgba(200, 0, 0, 0.4)',
        'rgba(0, 200, 0, 0.4)',
        'rgba(0, 0, 200, 0.4)',
        'rgba(200, 200, 0, 0.4)',
        'rgba(200, 0, 200, 0.4)',
        'rgba(0, 200, 200, 0.4)',
        'rgba(100, 100, 100, 0.4)',
        'rgba(180, 180, 180, 0.4)'
    ]
    const colorPaletteBorder = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(200, 0, 0, 0.7)',
        'rgba(0, 200, 0, 0.7)',
        'rgba(0, 0, 200, 0.7)',
        'rgba(200, 200, 0, 0.7)',
        'rgba(200, 0, 200, 0.7)',
        'rgba(0, 200, 200, 0.7)',
        'rgba(100, 100, 100, 0.7)',
        'rgba(180, 180, 180, 0.7)'
    ]

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categoryNames,
            datasets: [
                {
                    label: 'Number of meals',
                    data: mealsQuantity,
                    backgroundColor: colorPalette, // 0.4
                    borderColor: colorPaletteBorder, // 1
                    borderWidth: 2,
                    borderRadius: 6
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            weight: 'bold',
                            size: 12
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            weight: 'bold',
                            size: 10
                        }
                    }
                }
            }
        }
    })
}

// Start the process
fetchCategories()

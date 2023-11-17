# Williams Recipes - School project (Javascript)

Check out the live demo of the website: [WilliamsRecipes](https://williamsrecipes.netlify.app/)

_Note: Certain features may not function as expected without the local development environment. Please follow the instructions below for a complete experience._

## About the project

This is a recipe website developed with HTML, CSS and Javascript. The recipe data is fetched from TheMealDB API. It also includes a chart created with Chart.js library.
I also use a local JSON server as a REST API to demonstrate CRUD operations. Uses for GET, POST, PUT and DELETE request.

The main focus in this project is Javascript. To get familiar with: arrays, objects, functions, parameters, template literals, conditional statements, loops, return values, creating and manipulating nodes, events, webstorage and fetching data.

## Features

-   **Localstorage:** Saves id from meals when you like them to show in "Favroite Meals".
-   **TheMealDB API Integration:** Fetches data from TheMealDB API and displays it dynamically on the webpage.
-   **Local JSON Server:** Demonstrates CRUD operations with a local JSON server, allowing GET, POST, PUT, and DELETE requests.
-   **Interactive Chart with Chart.js:** Using the Chart.js library to create an chart to show relevant information about the recipes.

## Technologies and Tools

-   **HTML**
-   **CSS**
-   **JavaScript**
-   **TheMealDB API (data)**
-   **JSON Server (npm package)**
-   **Chart.js(js library)**

## Installation and Usage

1. Clone the project to your local machine: `git clone https://github.com/WilliamMattsson1/williams-recipes.git`
2. Navigate to the project folder: `cd williams-recipes`
3. Install dependencies: `npm install`
4. Start the JSON Server: `npm run start`
5. Visit the local server in your browser: http://localhost:3000
6. Open the program in vs code.
7. Open the program with live-server.

## CRUD Operations with JSON Server

-   **GET Requests:** Retrieve all recipe data by accessing endpoints like `/meals`.
-   **POST Requests:** Add a new recipe by sending a POST request to `/meals`.
-   **PUT Requests:** Update an existing recipe by sending a PUT request to `/meals/id`.
-   **DELETE Requests:** Delete a recipe by sending a DELETE request to `/meals/id`.

## Developer

-   **William Mattsson:**
    -   [GitHub](https://github.com/WilliamMattsson1/)
    -   [LinkedIn](https://www.linkedin.com/in/williammattsson/)
    -   [Portfolio Website](https://williammattsson.netlify.app/)

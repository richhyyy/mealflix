const search = document.getElementById("search");
const form = document.getElementById("submit");
const mealsEl = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const singleMeal = document.getElementById("single-meal");
const randomBtn = document.getElementById("random");

// Search
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const term = search.value.trim();

  if (term) {
    fetchMeals(term);
  }
});

// Fetch meals
function fetchMeals(term) {
  singleMeal.innerHTML = "";
  resultHeading.innerHTML = " Searching...";

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    .then(res => res.json())
    .then(data => {

      if (!data.meals) {
        resultHeading.innerHTML = "No results found";
        mealsEl.innerHTML = "";
        return;
      }

      resultHeading.innerHTML = `Results for "${term}"`;

      mealsEl.innerHTML = data.meals.map(meal => `
        <div class="meal" data-title="${meal.strMeal}" onclick="getMeal('${meal.idMeal}')">
          <img src="${meal.strMealThumb}" />
        </div>
      `).join("");
    });
}

// Random
randomBtn.addEventListener("click", () => {
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "🍽️ Featured Meal";

  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then(res => res.json())
    .then(data => showMeal(data.meals[0]));
});

// Get meal
function getMeal(id) {
  resultHeading.innerHTML = " Loading recipe...";
  mealsEl.innerHTML = "";

  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data => showMeal(data.meals[0]));
}

// Show meal
function showMeal(meal) {
  resultHeading.innerHTML = "";

  const steps = meal.strInstructions
    .replace(/\r\n/g, ". ")
    .split(". ")
    .filter(step => step.trim().length > 20)
    .map(step => `<li>${step.trim()}.</li>`)
    .join("");

  let ingredients = "";

  for (let i = 1; i <= 20; i++) {
    const ing = meal["strIngredient" + i];
    const measure = meal["strMeasure" + i];

    if (ing && ing.trim() !== "") {
      ingredients += `<li>${ing} - ${measure}</li>`;
    }
  }

  singleMeal.innerHTML = `
    <div class="single-meal">
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" />

      <div class="meal-details">
        <h3>Ingredients</h3>
        <ul>${ingredients}</ul>

        <h3>Instructions</h3>
        <ol class="steps">${steps}</ol>
      </div>
    </div>
  `;

  singleMeal.scrollIntoView({ behavior: "smooth" });
}
let allCategories = [];
const hamburgerMenu =document.getElementById("hamburgerMenu");
document.querySelector(".menu-btn").onclick=()=>{
    hamburgerMenu.classList.add("active");
}
document.querySelector(".close").onclick=()=>{

    hamburgerMenu.classList.remove("active");
}
async function loadCategories(){
    const response=await fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list");
    const data=await response.json();
    const list=document.getElementById("categoryList");
    data.meals.forEach(category=>{
        const li=document.createElement("li");
        li.innerHTML=category.strCategory;
        list.appendChild(li);
    });
}
loadCategories();
async function categoryData(){
    try{
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
        const data = await response.json();
        allCategories = data.categories;
        const categories = document.getElementById("categoriesCards");
        categories.innerHTML = "";
        data.categories.forEach(category => {
            categories.innerHTML += `
                <section class="categoryCard" data-category="${category.strCategory}">
                    <h5>${category.strCategory}</h5>
                    <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
                </section>
            `;
        });
    }catch(error){
        document.getElementById("categoriesCards").textContent = "Unable to load Categories List !";
    }
}
categoryData();
const API = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
document.getElementById("search-btn").addEventListener("click", async function () {
    const name = document.getElementById("mealSearch").value;
    const mealContainer = document.getElementById("mealContainer");
    mealContainer.classList.remove("hidden");
    mealContainer.innerHTML = "";
    document.getElementById("categoriesContainer").classList.remove("hidden");
    document.getElementById("categoryInfo").classList.add("hidden");
    document.getElementById("mealHeading").classList.add("hidden");
    document.getElementById("mealHeadingHr").classList.add("hidden");
    document.getElementById("mealSection").classList.add("hidden");
    document.getElementById("mealDetailsContainer").classList.add("hidden");
    try{
        const response = await fetch(API + name);
        if (!response.ok) {
            throw new Error("Failed to fetch meal data.");
        }
        const data = await response.json();
        mealContainer.innerHTML =`
            <h4>MEALS</h4>
            <hr>
            <section class="searchGrid"></section>
        `;
        const searchGrid = document.querySelector(".searchGrid");
        if (data.meals) {
            data.meals.forEach((meal) => {
                searchGrid.innerHTML += `
                    <section class="searchCards">
                        <h5>${meal.strCategory}</h5>
                        <img src="${meal.strMealThumb}" alt="${meal.strCategory}">
                        <p>${meal.strArea}</p>
                        <h6>${meal.strMeal}</h6>
                    </section>
                `;
            });
        } else {
            mealContainer.innerHTML = "<p>No meals found.</p>";
        }
    }catch(error){
        document.getElementById("mealContainer").textContent = "Unable to search meals list !";
    }
});
document.getElementById("categoriesCards").addEventListener("click", function (e) {
    const card = e.target.closest(".categoryCard");
    if (!card) return;
    const category = card.dataset.category;
    getMeals(category);
});
async function getMeals(category){
    document.getElementById("mealDetailsContainer").classList.add("hidden");
    document.getElementById("mealDetailsContainer").innerHTML = "";
    document.getElementById("categoriesContainer").classList.add("hidden");
    document.getElementById("categoryInfo").classList.remove("hidden");
    document.getElementById("mealContainer").classList.add("hidden");
    document.getElementById("mealHeading").classList.remove("hidden");
    document.getElementById("mealHeadingHr").classList.remove("hidden");
    document.getElementById("mealSection").classList.remove("hidden");
    const selectedCategory = allCategories.find(item => item.strCategory === category);
    document.getElementById("categoryTitle").textContent = selectedCategory.strCategory;
    document.getElementById("categoryDescription").textContent = selectedCategory.strCategoryDescription;
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    const data = await response.json();
    const mealSection = document.getElementById("mealSection");
    mealSection.innerHTML="";
    data.meals.forEach(meal=>{
        mealSection.innerHTML +=`
            <section class="mealCard" data-id="${meal.idMeal}">
                <img src="${meal.strMealThumb}">
                <p>${meal.strArea}</p>
                <h6>${meal.strMeal}</h6>
            </section>
        `;
    });
}
document.getElementById("mealSection").addEventListener("click",function(e){
    const meal = e.target.closest(".mealCard");
    if(!meal) return;
    getMeal(meal.dataset.id);
});
async function getMeal(id) {
    document.getElementById("mealDetailsContainer").classList.remove("hidden");
    document.getElementById("categoriesContainer").classList.remove("hidden");
    document.getElementById("categoryInfo").classList.add("hidden");
    document.getElementById("mealHeading").classList.add("hidden");
    document.getElementById("mealHeadingHr").classList.add("hidden");
    document.getElementById("mealSection").classList.add("hidden");
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    const meal = data.meals[0];
    let tags = "";
    if (meal.strTags) {
        meal.strTags.split(",").forEach(tag => {
            tags += `<span class="tag">${tag.trim()}</span>`;
        });
    }
    let ingredients = "";
    for (let i = 1; meal[`strIngredient${i}`]; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient && ingredient.trim() !== "") {
            ingredients += `
                <li>${ingredient}</li>
            `;
        }
    }
    let measures = "";
    for (let i = 1; meal[`strMeasure${i}`]; i++) {
        const measure = meal[`strIngredient${i}`];
        if (measure && measure.trim() !== " ") {
            measures += `
                <li>${measure}</li>
            `;
        }
    }
    const instructions = meal.strInstructions.split("\r\n").filter(step => step.trim() !== "");
    let instructionList = "";
    instructions.forEach(step => {
        instructionList += `<li>${step}</li>`;
    });
    document.getElementById("mealDetailsContainer").innerHTML = `
        <h1>
            <i class="fa-solid fa-house"></i> >> ${meal.strMeal}
        </h1>
        <h2>Meal Details</h2>
        <hr>
        <section class="mealDetails">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <section class="fullMealDetails">
                <h2>${meal.strMeal}</h2>
                <hr>
                <p><strong>CATEGORY:</strong> <span>${meal.strCategory}</span></p>
                <p><strong>Source:</strong>
                    <a href="${meal.strSource}" target="_blank">
                        ${meal.strSource}
                    </a>
                </p>
                <p><strong>Tags:</strong>
                    ${meal.strTags ? ` ${tags} ` : ""}
                </p>
                <section class="ingredients">
                    <h3>Ingredients:</h3>
                    <ol>
                        ${ingredients}
                    </ol>
                </section>
            </section>
            <section class="measures">
            <h3>Measures:</h3>
                <ul>
                    ${measures}
                </ul>
            </section>
            <section class="instructions">
                <h3>Instructions:</h3>
                <ul>
                    ${instructionList}
                </ul>
            </section>
        </section>
    `;
}

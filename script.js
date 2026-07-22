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
    mealContainer.innerHTML = "";
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
    document.getElementById("categoriesContainer").classList.add("hidden");
    document.getElementById("categoryInfo").classList.remove("hidden");
    document.getElementById("mealHeading").classList.remove("hidden");
    document.getElementById("mealHeadingHr").classList.remove("hidden");
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

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
        const containerCards = data.categories.map((product)=>{
        return(
            `
                <div class="categoryCard">
                    <h5>${product.strCategory}</h5>
                    <img src=${product.strCategoryThumb} alt=${product.strCategory}>
                </div>
            `
        );
    });
    const categories = document.getElementById('categoriesCards');
    categories.innerHTML = containerCards.join(" ");
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
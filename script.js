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
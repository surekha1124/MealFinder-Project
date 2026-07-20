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
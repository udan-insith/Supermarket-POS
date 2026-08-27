const state={cart:[],category:"All",customer:false,paymentMethod:null};
const money=n=>"Rs. "+n.toLocaleString("en-LK",{minimumFractionDigits:2,maximumFractionDigits:2});
const $=id=>document.getElementById(id);

function renderCategories(){
 const cats=["All",...new Set(PRODUCTS.map(p=>p.category))];
 $("categories").innerHTML=cats.map(c=>`<button class="category ${c===state.category?"active":""}" data-cat="${c}">${c}</button>`).join("");
 document.querySelectorAll(".category").forEach(b=>b.onclick=()=>{state.category=b.dataset.cat;renderCategories();renderProducts()});
}
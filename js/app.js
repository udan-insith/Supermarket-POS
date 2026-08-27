const state={cart:[],category:"All",customer:false,paymentMethod:null};
const money=n=>"Rs. "+n.toLocaleString("en-LK",{minimumFractionDigits:2,maximumFractionDigits:2});
const $=id=>document.getElementById(id);

function renderCategories(){
 const cats=["All",...new Set(PRODUCTS.map(p=>p.category))];
 $("categories").innerHTML=cats.map(c=>`<button class="category ${c===state.category?"active":""}" data-cat="${c}">${c}</button>`).join("");
 document.querySelectorAll(".category").forEach(b=>b.onclick=()=>{state.category=b.dataset.cat;renderCategories();renderProducts()});
}
function renderProducts(){
 const q=$("searchInput").value.trim().toLowerCase();
 const list=PRODUCTS.filter(p=>(state.category==="All"||p.category===state.category)&&(!q||p.name.toLowerCase().includes(q)||p.barcode.includes(q)));
 $("products").innerHTML=list.map(p=>`<article class="product" data-id="${p.id}"><div class="product-img">${p.emoji}</div><h3>${p.name}</h3><small>${p.category} · ${p.barcode}</small><div class="price">${money(p.price)}</div></article>`).join("")||`<div class="empty"><div>🔎</div><b>No products found</b><span>Try another product or barcode</span></div>`;
 document.querySelectorAll(".product").forEach(el=>el.onclick=()=>addToCart(+el.dataset.id));
}
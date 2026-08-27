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

function addToCart(id){
 const p=PRODUCTS.find(x=>x.id===id), item=state.cart.find(x=>x.id===id);
 item?item.qty++:state.cart.push({...p,qty:1});
 renderCart();toast(`${p.name} added`);
}
function changeQty(id,delta){
 const item=state.cart.find(x=>x.id===id);if(!item)return;
 item.qty+=delta;if(item.qty<=0)state.cart=state.cart.filter(x=>x.id!==id);
 renderCart();
}
function totals(){
 const subtotal=state.cart.reduce((s,i)=>s+i.price*i.qty,0);
 const discount=state.customer&&subtotal>=3000?Math.round(subtotal*.05):0;
 return {subtotal,discount,total:subtotal-discount};
}
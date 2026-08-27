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

function renderCart(){
 const {subtotal,discount,total}=totals(), count=state.cart.reduce((s,i)=>s+i.qty,0);
 $("itemCount").textContent=`${count} item${count!==1?"s":""}`;
 $("subtotal").textContent=money(subtotal);$("discount").textContent=`− ${money(discount)}`;$("total").textContent=money(total);
 if(!state.cart.length){$("cartItems").innerHTML=`<div class="empty"><div>🛒</div><b>Your cart is empty</b><span>Scan or select a product to begin</span></div>`;return}
 $("cartItems").innerHTML=state.cart.map(i=>`<div class="cart-row"><div class="cart-icon">${i.emoji}</div><div><h4>${i.name}</h4><small>${money(i.price)} each</small><div class="qty"><button onclick="changeQty(${i.id},-1)">−</button><b>${i.qty}</b><button onclick="changeQty(${i.id},1)">+</button></div></div><div class="row-price">${money(i.price*i.qty)}</div></div>`).join("");
}

function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1600)}
$("searchInput").addEventListener("input",renderProducts);
$("customerBtn").onclick=()=>{state.customer=true;$("customerCard").classList.remove("hidden");$("customerBtn").classList.add("hidden");renderCart();toast("Gold customer added — 5% discount applied")};
$("removeCustomer").onclick=()=>{state.customer=false;$("customerCard").classList.add("hidden");$("customerBtn").classList.remove("hidden");renderCart()};
$("clearBtn").onclick=()=>{if(state.cart.length&&confirm("Clear current sale?")){state.cart=[];renderCart();toast("Sale cleared")}};
$("holdBtn").onclick=()=>toast("Sale held successfully");
$("payBtn").onclick=()=>{
 if(!state.cart.length)return toast("Add products before payment");
 $("paymentAmount").textContent=`Total: ${money(totals().total)}`;$("paymentModal").classList.remove("hidden");
};

$("closePayment").onclick=()=>$("paymentModal").classList.add("hidden");
document.querySelectorAll(".payment-methods button").forEach(b=>b.onclick=()=>{
 document.querySelectorAll(".payment-methods button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");state.paymentMethod=b.dataset.method;
 $("cashArea").classList.toggle("hidden",state.paymentMethod!=="Cash");
});
$("cashInput").addEventListener("input",()=>{const c=+$("cashInput").value||0;$("change").textContent=money(Math.max(0,c-totals().total))});

$("completeBtn").onclick=()=>{
 if(!state.paymentMethod)return toast("Select a payment method");
 if(state.paymentMethod==="Cash"&&((+$("cashInput").value||0)<totals().total))return toast("Insufficient cash");
 const invoice="INV-"+Date.now().toString().slice(-8);
 $("paymentModal").classList.add("hidden");state.cart=[];state.customer=false;state.paymentMethod=null;$("customerCard").classList.add("hidden");$("customerBtn").classList.remove("hidden");renderCart();toast(`✓ Sale ${invoice} completed`);
};

document.addEventListener("keydown",e=>{
 if(e.ctrlKey&&e.key.toLowerCase()==="k"){e.preventDefault();$("searchInput").focus()}
 if(e.key==="F2"){e.preventDefault();$("searchInput").focus()}
 if(e.key==="F4"){e.preventDefault();$("payBtn").click()}
 if(e.key==="F8"){e.preventDefault();$("holdBtn").click()}
});
renderCategories();renderProducts();renderCart();
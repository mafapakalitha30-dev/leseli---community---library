// Community Library Management System
// Frontend: HTML/CSS | Backend logic: JavaScript | Database: Local Storage
// DOM is used to create/update the interface without external libraries.

const KEYS = {
  books: "library_books",
  users: "library_users",
  transactions: "library_transactions",
  session: "library_session"
};

const defaultBooks = [
  {id:"b1",title:"Mopheme",author:"S.Matlosa",genre:"Sesotho Novel",isbn:"9780385474542",quantity:34},
  {id:"b2",title:"Mosali A Nkhola",author:"Makalo Khaketla",genre:"moral novel",isbn:"9780061122415",quantity:68},
  {id:"b3",title:"Pitseng",author:"Mokopu Mofolo",genre:"Romance",isbn:"9780262046305",quantity:44},
  {id:"b4",title:"Chaka",author:"Mokopu Mofolo",genre:"Historycal",isbn:"9780123456",quantity:35}
  
];

const defaultUsers = [
  {id:"u1",name:"Library Administrator",membershipId:"ADMIN001",role:"Admin",username:"admin",password:"admin123"}
];

function load(key, fallback){
  const value = localStorage.getItem(key);
  if(value === null){ localStorage.setItem(key, JSON.stringify(fallback)); return structuredClone(fallback); }
  try { return JSON.parse(value); } catch { return structuredClone(fallback); }
}
function save(key,value){ localStorage.setItem(key, JSON.stringify(value)); }
function uid(prefix){ return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

let books = load(KEYS.books, defaultBooks);
let users = load(KEYS.users, defaultUsers);
let transactions = load(KEYS.transactions, []);

const $ = id => document.getElementById(id);

function init(){
  const session = JSON.parse(localStorage.getItem(KEYS.session) || "null");
  if(session) showApp(session); else showLogin();
  renderAll();
}

function showLogin(){
  $("loginScreen").classList.remove("hidden");
  $("app").classList.add("hidden");
}
function showApp(user){
  $("loginScreen").classList.add("hidden");
  $("app").classList.remove("hidden");
  $("welcomeText").textContent = `Welcome, ${user.name}`;
  $("roleBadge").textContent = user.role;
  if(user.role !== "Admin"){
    document.querySelector('[data-page="users"]').classList.add("hidden");
  } else {
    document.querySelector('[data-page="users"]').classList.remove("hidden");
  }
}

$("loginForm").addEventListener("submit", e=>{
  e.preventDefault();
  const username = $("loginUsername").value.trim();
  const password = $("loginPassword").value;
  const user = users.find(u=>u.username === username && u.password === password);
  if(!user){
    $("loginMessage").textContent = "Invalid username or password.";
    $("loginMessage").style.color = "#b91c1c";
    return;
  }
  localStorage.setItem(KEYS.session, JSON.stringify({id:user.id,name:user.name,role:user.role}));
  $("loginMessage").textContent = "";
  showApp(user);
});

$("logoutBtn").addEventListener("click", ()=>{
  localStorage.removeItem(KEYS.session);
  showLogin();
});

document.querySelectorAll(".nav-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active-page"));
    $(btn.dataset.page).classList.add("active-page");
    $("pageTitle").textContent = btn.textContent.replace(/^[^ ]+ /,"");
    renderAll();
  });
});

function renderAll(){
  renderDashboard();
  renderBooks();
  renderTransactions();
  renderUsers();
  fillTransactionBooks();
}

function renderDashboard(){
  const total = books.reduce((sum,b)=>sum + Number(b.quantity),0);
  $("statTitles").textContent = books.length;
  $("statCopies").textContent = total;
  $("statAvailable").textContent = total;
  $("statLow").textContent = books.filter(b=>Number(b.quantity)<2).length;
  const query = ($("dashboardSearch").value || "").toLowerCase();
  const filtered = books.filter(b => [b.title,b.author,b.genre,b.isbn].some(v=>String(v).toLowerCase().includes(query)));
  $("dashboardBooks").innerHTML = filtered.map(b=>`
    <tr>
      <td>${esc(b.title)}</td><td>${esc(b.author)}</td><td>${esc(b.genre)}</td><td>${esc(b.isbn)}</td>
      <td><b>${b.quantity}</b></td>
      <td><span class="${b.quantity < 2 ? "stock-low":"stock-ok"}">${b.quantity < 2 ? "Low Stock":"Available"}</span></td>
    </tr>`).join("") || emptyRow(6,"No books found.");
}
$("dashboardSearch").addEventListener("input", renderDashboard);

$("bookForm").addEventListener("submit", e=>{
  e.preventDefault();
  const id = $("bookId").value;
  const data = {
    title:$("bookTitle").value.trim(), author:$("bookAuthor").value.trim(),
    genre:$("bookGenre").value.trim(), isbn:$("bookISBN").value.trim(),
    quantity:Number($("bookQuantity").value)
  };
  if(data.quantity < 0 || !Number.isInteger(data.quantity)){ return setMessage("bookMessage","Quantity must be a whole number of 0 or more.","error"); }
  if(books.some(b=>b.isbn===data.isbn && b.id!==id)){ return setMessage("bookMessage","A book with this ISBN already exists.","error"); }
  if(id){
    const index = books.findIndex(b=>b.id===id);
    books[index] = {...books[index],...data};
    setMessage("bookMessage","Book updated successfully.","success");
  } else {
    books.push({id:uid("b"),...data});
    setMessage("bookMessage","Book added successfully.","success");
  }
  save(KEYS.books,books); resetBookForm(); renderAll();
});

$("cancelBookEdit").addEventListener("click", resetBookForm);

function editBook(id){
  const b=books.find(x=>x.id===id); if(!b)return;
  $("bookId").value=b.id; $("bookTitle").value=b.title; $("bookAuthor").value=b.author;
  $("bookGenre").value=b.genre; $("bookISBN").value=b.isbn; $("bookQuantity").value=b.quantity;
  $("bookSubmit").textContent="Update Book"; $("cancelBookEdit").classList.remove("hidden");
  window.scrollTo({top:0,behavior:"smooth"});
}
function deleteBook(id){
  const b=books.find(x=>x.id===id); if(!b)return;
  if(!confirm(`Delete "${b.title}"?`))return;
  books=books.filter(x=>x.id!==id); save(KEYS.books,books); renderAll();
}
function resetBookForm(){
  $("bookForm").reset(); $("bookId").value=""; $("bookSubmit").textContent="Add Book"; $("cancelBookEdit").classList.add("hidden");
}

function renderBooks(){
  const query=($("bookSearch").value||"").toLowerCase();
  const filtered=books.filter(b=>[b.title,b.author,b.genre,b.isbn].some(v=>String(v).toLowerCase().includes(query)));
  $("booksTable").innerHTML=filtered.map(b=>`
    <tr>
      <td>${esc(b.title)}</td><td>${esc(b.author)}</td><td>${esc(b.genre)}</td><td>${esc(b.isbn)}</td>
      <td>${b.quantity}</td>
      <td>
        <button class="action-btn edit" onclick="editBook('${b.id}')">Update</button>
        <button class="action-btn delete" onclick="deleteBook('${b.id}')">Delete</button>
      </td>
    </tr>`).join("") || emptyRow(6,"No books found.");
}
$("bookSearch").addEventListener("input",renderBooks);

function fillTransactionBooks(){
  $("transactionBook").innerHTML = books.map(b=>`<option value="${b.id}">${esc(b.title)} (${b.quantity} available)</option>`).join("");
}

$("transactionForm").addEventListener("submit",e=>{
  e.preventDefault();
  const book=books.find(b=>b.id===$("transactionBook").value);
  const type=$("transactionType").value;
  const qty=Number($("transactionQuantity").value);
  if(!book || !Number.isInteger(qty) || qty<1) return setMessage("transactionMessage","Enter a valid quantity.","error");
  if(type==="borrow" && qty>book.quantity) return setMessage("transactionMessage","Not enough stock available for this transaction.","error");
  book.quantity += type==="add" ? qty : -qty;
  const session=JSON.parse(localStorage.getItem(KEYS.session)||"{}");
  transactions.unshift({
    id:uid("t"), bookId:book.id, bookTitle:book.title, type,
    quantity:qty, stockAfter:book.quantity, date:new Date().toLocaleString(), user:session.name||"Unknown"
  });
  save(KEYS.books,books); save(KEYS.transactions,transactions);
  $("transactionForm").reset();
  setMessage("transactionMessage","Transaction recorded successfully.","success");
  renderAll();
});

function renderTransactions(){
  $("transactionsTable").innerHTML=transactions.map(t=>`
    <tr><td>${esc(t.date)}</td><td>${esc(t.bookTitle)}</td>
    <td>${t.type==="add" ? "Stock Added":"Borrowed / Deducted"}</td>
    <td>${t.quantity}</td><td>${t.stockAfter}</td></tr>`).join("") || emptyRow(5,"No transactions recorded.");
}

$("userForm").addEventListener("submit",e=>{
  e.preventDefault();
  const id=$("userId").value;
  const data={
    name:$("userName").value.trim(), membershipId:$("membershipId").value.trim(),
    role:$("userRole").value, username:$("userUsername").value.trim(), password:$("userPassword").value
  };
  if(users.some(u=>u.username===data.username && u.id!==id)) return setMessage("userMessage","Username already exists.","error");
  if(id){
    const i=users.findIndex(u=>u.id===id); users[i]={...users[i],...data};
    setMessage("userMessage","User updated successfully.","success");
  } else {
    users.push({id:uid("u"),...data}); setMessage("userMessage","User added successfully.","success");
  }
  save(KEYS.users,users); resetUserForm(); renderUsers();
});
$("cancelUserEdit").addEventListener("click",resetUserForm);

function renderUsers(){
  $("usersTable").innerHTML=users.map(u=>`
    <tr><td>${esc(u.name)}</td><td>${esc(u.membershipId)}</td><td>${esc(u.role)}</td><td>${esc(u.username)}</td>
    <td><button class="action-btn edit" onclick="editUser('${u.id}')">Update</button>
    <button class="action-btn delete" onclick="deleteUser('${u.id}')">Delete</button></td></tr>`).join("");
}
function editUser(id){
  const u=users.find(x=>x.id===id); if(!u)return;
  $("userId").value=u.id;$("userName").value=u.name;$("membershipId").value=u.membershipId;
  $("userRole").value=u.role;$("userUsername").value=u.username;$("userPassword").value=u.password;
  $("userSubmit").textContent="Update User";$("cancelUserEdit").classList.remove("hidden");
  window.scrollTo({top:0,behavior:"smooth"});
}
function deleteUser(id){
  if(users.length<=1) return alert("At least one user account must remain.");
  const current=JSON.parse(localStorage.getItem(KEYS.session)||"{}");
  if(current.id===id) return alert("You cannot delete the account currently in use.");
  if(!confirm("Delete this user?"))return;
  users=users.filter(u=>u.id!==id);save(KEYS.users,users);renderUsers();
}
function resetUserForm(){
  $("userForm").reset();$("userId").value="";$("userSubmit").textContent="Add User";$("cancelUserEdit").classList.add("hidden");
}

function setMessage(id,text,type){
  const el=$(id);el.textContent=text;el.style.color=type==="error"?"#b91c1c":"#047857";
  setTimeout(()=>{el.textContent=""},3500);
}
function emptyRow(cols,text){return `<tr><td colspan="${cols}" style="text-align:center;color:#64748b;padding:25px">${text}</td></tr>`}
function esc(value){
  return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

window.editBook=editBook; window.deleteBook=deleteBook; window.editUser=editUser; window.deleteUser=deleteUser;
init();

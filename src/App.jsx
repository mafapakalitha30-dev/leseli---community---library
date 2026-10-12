import { useEffect, useState } from "react";
import { NavLink, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { BookOpen, LayoutDashboard, ArrowLeftRight, Users, LogOut, LibraryBig } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Transactions from "./pages/Transactions";
import UsersPage from "./pages/Users";
import { starterBooks, starterUsers } from "./data";

function readData(key, starter) {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : starter;
}

export default function App() {
  const [books, setBooks] = useState(() => readData("leseli-books", starterBooks));
  const [users, setUsers] = useState(() => readData("leseli-users", starterUsers));
  const [transactions, setTransactions] = useState(() => readData("leseli-transactions", []));
  const [currentUser, setCurrentUser] = useState(() => readData("leseli-session", null));
  const navigate = useNavigate();

  useEffect(() => localStorage.setItem("leseli-books", JSON.stringify(books)), [books]);
  useEffect(() => localStorage.setItem("leseli-users", JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem("leseli-transactions", JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem("leseli-session", JSON.stringify(currentUser)), [currentUser]);

  function login(membershipId, password) {
    const found = users.find(u => u.membershipId === membershipId.trim() && u.password === password);
    if (!found) return false;
    setCurrentUser(found);
    navigate("/");
    return true;
  }

  function logout() {
    setCurrentUser(null);
    navigate("/login");
  }

  if (!currentUser) {
    return <Routes>
      <Route path="/login" element={<Login users={users} onLogin={login} />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>;
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon"><LibraryBig size={23} /></div><div><strong>Leseli</strong><small>COMMUNITY LIBRARY</small></div></div>
      <div className="nav-label">WORKSPACE</div>
      <nav>
        <NavLink to="/" end><LayoutDashboard size={18} /> Dashboard</NavLink>
        <NavLink to="/books"><BookOpen size={18} /> Book management</NavLink>
        <NavLink to="/transactions"><ArrowLeftRight size={18} /> Transactions</NavLink>
        <NavLink to="/users"><Users size={18} /> User management</NavLink>
      </nav>
      <div className="sidebar-bottom"><div className="avatar">{currentUser.name[0]}</div><div className="user-summary"><strong>{currentUser.name}</strong><small>{currentUser.role}</small></div><button className="icon-button" title="Log out" onClick={logout}><LogOut size={17} /></button></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div><span className="eyebrow">COMMUNITY LIBRARY</span><h1>Library workspace</h1></div><div className="welcome">Dumela, <strong>{currentUser.name.split(" ")[0]}</strong> <span className="status-dot" /></div></header>
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Dashboard books={books} transactions={transactions} />} />
          <Route path="/books" element={<Books books={books} setBooks={setBooks} />} />
          <Route path="/transactions" element={<Transactions books={books} setBooks={setBooks} transactions={transactions} setTransactions={setTransactions} currentUser={currentUser} />} />
          <Route path="/users" element={<UsersPage users={users} setUsers={setUsers} currentUser={currentUser} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <footer>Leseli Community Library <span>•</span> Learn, share, grow.</footer>
    </main>
  </div>;
}

function Login({ users, onLogin }) {
  const [membershipId, setMembershipId] = useState("MEM001");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  function submit(e) {
    e.preventDefault();
    if (!membershipId.trim() || !password) return setError("Please enter your membership ID and password.");
    if (!onLogin(membershipId, password)) setError("Those login details were not found.");
  }
  return <div className="login-screen">
    <div className="login-art"><div className="art-circle circle-one" /><div className="art-circle circle-two" /><div className="art-content"><div className="brand-icon large"><LibraryBig size={30} /></div><span className="eyebrow light">A PLACE TO GROW</span><h1>Knowledge is a light we share.</h1><p>Welcome to Leseli Community Library, where every book opens a new door.</p><div className="book-stack"><span /><span /><span /><span /></div></div><small className="art-footer">Tsebo ke leseli. · Knowledge is light.</small></div>
    <div className="login-panel"><div className="login-form-wrap"><span className="eyebrow">WELCOME BACK</span><h2>Sign in to your library</h2><p className="muted">Enter your membership details to continue.</p>
      <form onSubmit={submit} className="form-stack"><label>Membership ID<input value={membershipId} onChange={e => setMembershipId(e.target.value)} placeholder="e.g. MEM001" /></label><label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" /></label>{error && <p className="error-message">{error}</p>}<button className="primary-button full-button">Sign in <span>→</span></button></form>
      <div className="demo-box"><strong>Demo accounts</strong><p>Admin: MEM001 / admin123</p><p>Librarian: MEM002 / library123</p><p>Member: MEM003 / member123</p></div>
      <small className="muted">Demo login for coursework only. Do not use real passwords.</small>
    </div></div>
  </div>;
}
import { BookOpen, AlertTriangle, Users, ArrowLeftRight, ArrowUpRight } from "lucide-react";

export default function Dashboard({ books, transactions }) {
  const copies = books.reduce((sum, book) => sum + Number(book.quantity), 0);
  const lowStock = books.filter(book => book.quantity < 2);
  const borrowed = transactions.filter(t => t.type === "Borrow").length;
  return <div className="page-stack">
    <div className="page-intro"><div><span className="eyebrow">OVERVIEW</span><h2>Your library at a glance</h2><p>Here is what is happening in your collection today.</p></div><div className="date-pill">✦ &nbsp; Keep knowledge moving</div></div>
    <div className="stat-grid">
      <Stat icon={<BookOpen />} label="Book titles" value={books.length} note="Unique titles in collection" />
      <Stat icon={<ArrowUpRight />} label="Copies in stock" value={copies} note="Available across all titles" />
      <Stat icon={<AlertTriangle />} label="Low stock" value={lowStock.length} note="Titles with fewer than 2 copies" warning />
      <Stat icon={<ArrowLeftRight />} label="Transactions" value={transactions.length} note="Recorded stock activity" />
    </div>
    <div className="dashboard-grid">
      <section className="panel wide-panel"><div className="section-heading"><div><span className="eyebrow">COLLECTION</span><h3>Book availability</h3></div><span className="soft-tag">{books.length} titles</span></div>
        {books.length ? <div className="table-wrap"><table><thead><tr><th>BOOK TITLE</th><th>AUTHOR</th><th>GENRE</th><th>IN STOCK</th><th>STATUS</th></tr></thead><tbody>{books.map(book => <tr key={book.id}><td><div className="book-cell"><div className="mini-book"><BookOpen size={16} /></div><strong>{book.title}</strong></div></td><td>{book.author}</td><td>{book.genre}</td><td><strong>{book.quantity}</strong></td><td><span className={`stock-pill ${book.quantity < 2 ? "low" : "available"}`}>{book.quantity < 1 ? "Out of stock" : book.quantity < 2 ? "Low stock" : "Available"}</span></td></tr>)}</tbody></table></div> : <p className="empty-state">No books yet. Add your first title on the Book Management page.</p>}
      </section>
      <section className="panel"><div className="section-heading"><div><span className="eyebrow">NEEDS ATTENTION</span><h3>Low stock list</h3></div><AlertTriangle size={20} className="warning-icon" /></div>
        {lowStock.length ? <div className="low-list">{lowStock.map(book => <div className="low-item" key={book.id}><div className="mini-book"><BookOpen size={16} /></div><div className="low-info"><strong>{book.title}</strong><small>{book.author}</small></div><span className="qty-badge">{book.quantity} left</span></div>)}</div> : <div className="success-state">All good! No books are running low.</div>}
      </section>
    </div>
    <section className="quote-banner"><div className="quote-mark">“</div><div><p>Books are quiet friends that help us see beyond our own world.</p><small>LESELI COMMUNITY LIBRARY</small></div><div className="quote-decoration">L</div></section>
  </div>;
}

function Stat({ icon, label, value, note, warning }) {
  return <div className={`stat-card ${warning ? "stat-warning" : ""}`}><div className="stat-top"><span className="stat-icon">{icon}</span><span className="stat-trend">{warning ? "Attention" : "Live data"}</span></div><div className="stat-value">{value}</div><strong>{label}</strong><small>{note}</small></div>;
}
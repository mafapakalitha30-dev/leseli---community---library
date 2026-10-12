import { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, History, ArrowLeftRight } from "lucide-react";

export default function Transactions({ books, setBooks, transactions, setTransactions, currentUser }) {
  const [bookId, setBookId] = useState(books[0]?.id || "");
  const [type, setType] = useState("Borrow");
  const [quantity, setQuantity] = useState(1);
  const [member, setMember] = useState("");
  const [message, setMessage] = useState("");

  function submit(e) {
    e.preventDefault();
    const book = books.find(b => b.id === Number(bookId));
    const amount = Number(quantity);
    if (!book) return setMessage("Please select a book.");
    if (!member.trim()) return setMessage("Enter the member name.");
    if (!Number.isInteger(amount) || amount < 1) return setMessage("Quantity must be at least 1.");
    if (type === "Borrow" && book.quantity < amount) return setMessage("There are not enough copies in stock.");
    const newQuantity = type === "Borrow" ? book.quantity - amount : book.quantity + amount;
    setBooks(books.map(b => b.id === book.id ? { ...b, quantity: newQuantity } : b));
    setTransactions([{ id: Date.now(), bookTitle: book.title, type, quantity: amount, member: member.trim(), by: currentUser.name, date: new Date().toLocaleString() }, ...transactions]);
    setMessage(`${type === "Borrow" ? "Borrowing" : "Stock addition"} recorded successfully.`);
    setMember("");
    setQuantity(1);
  }

  return <div className="page-stack">
    <div className="page-intro"><div><span className="eyebrow">STOCK CONTROL</span><h2>Transactions</h2><p>Record books borrowed and new stock arriving at the library.</p></div><div className="count-card"><History size={20} /><div><strong>{transactions.length}</strong><small>History entries</small></div></div></div>
    <div className="transaction-grid">
      <section className="panel transaction-form-panel"><div className="section-heading"><div><span className="eyebrow">NEW RECORD</span><h3>Record a transaction</h3></div><ArrowLeftRight size={21} /></div>
        <form onSubmit={submit} className="form-stack"><label>Choose book<select value={bookId} onChange={e => setBookId(e.target.value)} required>{books.length ? books.map(book => <option key={book.id} value={book.id}>{book.title} ({book.quantity} in stock)</option>) : <option value="">No books available</option>}</select></label>
          <label>Transaction type<select value={type} onChange={e => setType(e.target.value)}><option value="Borrow">Borrow book (deduct stock)</option><option value="Add stock">Add stock (increase stock)</option></select></label>
          <label>Quantity<input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} required /></label>
          <label>Member name<input value={member} onChange={e => setMember(e.target.value)} placeholder="e.g. Palesa Mafa" required /></label>
          {message && <p className={message.includes("successfully") ? "success-message" : "error-message"}>{message}</p>}
          <button className="primary-button full-button" disabled={!books.length}>Save transaction <span>→</span></button>
        </form>
      </section>
      <section className="panel"><div className="section-heading"><div><span className="eyebrow">HOW IT WORKS</span><h3>Stock guide</h3></div></div><div className="guide-item"><div className="guide-icon borrow"><ArrowUpFromLine size={19} /></div><div><strong>Borrow a book</strong><p>Copies in stock decrease. The system will stop you borrowing more copies than are available.</p></div></div><div className="guide-item"><div className="guide-icon add"><ArrowDownToLine size={19} /></div><div><strong>Add new stock</strong><p>Copies in stock increase when new books arrive at the library.</p></div></div><div className="notice-box">Tip: use the real member's name so the transaction history is easy to understand.</div></section>
    </div>
    <section className="panel"><div className="section-heading"><div><span className="eyebrow">AUDIT TRAIL</span><h3>Transaction history</h3></div><span className="soft-tag">{transactions.length} records</span></div>
      {transactions.length ? <div className="table-wrap"><table><thead><tr><th>DATE</th><th>BOOK</th><th>TYPE</th><th>QTY</th><th>MEMBER</th><th>RECORDED BY</th></tr></thead><tbody>{transactions.map(t => <tr key={t.id}><td className="date-cell">{t.date}</td><td><strong>{t.bookTitle}</strong></td><td><span className={`stock-pill ${t.type === "Borrow" ? "low" : "available"}`}>{t.type}</span></td><td>{t.quantity}</td><td>{t.member}</td><td>{t.by}</td></tr>)}</tbody></table></div> : <div className="empty-state"><History size={26} /><strong>No transactions yet</strong><span>Your borrowing and stock records will appear here.</span></div>}
    </section>
  </div>;
}
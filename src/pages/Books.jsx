import { useMemo, useState } from "react";
import { BookOpen, Search, Trash2, Pencil, LibraryBig } from "lucide-react";
import BookForm from "../components/BookForm";

export default function Books({ books, setBooks }) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [search, setSearch] = useState("");
  const visibleBooks = useMemo(() => books.filter(b => `${b.title} ${b.author} ${b.genre} ${b.isbn}`.toLowerCase().includes(search.toLowerCase())), [books, search]);

  function saveBook(book) {
    if (selectedBook) setBooks(books.map(b => b.id === selectedBook.id ? { ...book, id: selectedBook.id } : b));
    else setBooks([...books, { ...book, id: Date.now() }]);
    setSelectedBook(null);
  }

  function deleteBook(id) {
    if (window.confirm("Delete this book from the library?")) {
      setBooks(books.filter(book => book.id !== id));
      if (selectedBook?.id === id) setSelectedBook(null);
    }
  }

  return <div className="page-stack">
    <div className="page-intro"><div><span className="eyebrow">YOUR COLLECTION</span><h2>Book management</h2><p>Add new titles and keep book information up to date.</p></div><div className="count-card"><LibraryBig size={20} /><div><strong>{books.length}</strong><small>Total titles</small></div></div></div>
    <BookForm selectedBook={selectedBook} onSave={saveBook} onCancel={() => setSelectedBook(null)} />
    <section className="panel"><div className="section-heading"><div><span className="eyebrow">LIBRARY CATALOGUE</span><h3>All books</h3></div><div className="search-box"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search books..." /></div></div>
      {visibleBooks.length ? <div className="table-wrap"><table><thead><tr><th>BOOK</th><th>AUTHOR</th><th>GENRE</th><th>ISBN</th><th>QUANTITY</th><th>ACTIONS</th></tr></thead><tbody>{visibleBooks.map(book => <tr key={book.id}><td><div className="book-cell"><div className="mini-book"><BookOpen size={16} /></div><strong>{book.title}</strong></div></td><td>{book.author}</td><td>{book.genre}</td><td className="isbn">{book.isbn}</td><td><span className={`stock-pill ${book.quantity < 2 ? "low" : "available"}`}>{book.quantity}</span></td><td><div className="action-buttons"><button className="small-action" onClick={() => { setSelectedBook(book); window.scrollTo({ top: 0, behavior: "smooth" }); }} title="Update book"><Pencil size={15} /></button><button className="small-action delete-action" onClick={() => deleteBook(book.id)} title="Delete book"><Trash2 size={15} /></button></div></td></tr>)}</tbody></table></div> : <p className="empty-state">No matching books found.</p>}
    </section>
  </div>;
}
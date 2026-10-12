import { useEffect, useState } from "react";

const emptyBook = { title: "", author: "", genre: "", isbn: "", quantity: 1 };

export default function BookForm({ selectedBook, onSave, onCancel }) {
  const [form, setForm] = useState(emptyBook);

  useEffect(() => {
    setForm(selectedBook ? { ...selectedBook } : emptyBook);
  }, [selectedBook]);

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim() || !form.genre.trim() || !form.isbn.trim()) return;
    onSave({ ...form, title: form.title.trim(), author: form.author.trim(), quantity: Number(form.quantity) });
    setForm(emptyBook);
  }

  return <form className="book-form" onSubmit={submit}>
    <div className="form-heading"><div><span className="eyebrow">{selectedBook ? "EDIT DETAILS" : "NEW COLLECTION"}</span><h3>{selectedBook ? "Update book" : "Add a book"}</h3></div>{selectedBook && <button type="button" className="text-button" onClick={onCancel}>Cancel edit</button>}</div>
    <div className="form-grid">
      <label>Book title<input name="title" value={form.title} onChange={change} required placeholder="e.g. Pitseng" /></label>
      <label>Author<input name="author" value={form.author} onChange={change} required placeholder="Author name" /></label>
      <label>Genre<input name="genre" value={form.genre} onChange={change} required placeholder="e.g. Novel" /></label>
      <label>ISBN<input name="isbn" value={form.isbn} onChange={change} required placeholder="Book ISBN" /></label>
      <label>Initial quantity<input name="quantity" type="number" min="0" value={form.quantity} onChange={change} required /></label>
    </div>
    <button className="primary-button">{selectedBook ? "Save changes" : "Add book"} <span>→</span></button>
  </form>;
}
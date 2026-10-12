import { useState } from "react";
import { UserPlus, Pencil, Trash2, ShieldCheck, Users as UsersIcon } from "lucide-react";

const blankUser = { name: "", membershipId: "", role: "Member", password: "" };

export default function UsersPage({ users, setUsers, currentUser }) {
  const [form, setForm] = useState(blankUser);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const isAdmin = currentUser.role === "Admin";

  function submit(e) {
    e.preventDefault();
    if (!isAdmin) return setMessage("Only an Admin can manage user accounts.");
    if (users.some(u => u.membershipId.toLowerCase() === form.membershipId.trim().toLowerCase() && u.id !== editingId)) return setMessage("That membership ID is already being used.");
    if (editingId) {
      setUsers(users.map(u => u.id === editingId ? { ...form, id: editingId, password: form.password || u.password } : u));
      setMessage("User details updated.");
    } else {
      setUsers([...users, { ...form, id: Date.now(), name: form.name.trim(), membershipId: form.membershipId.trim(), password: form.password || "welcome123" }]);
      setMessage("User added. Default password is welcome123 if no password was entered.");
    }
    setForm(blankUser);
    setEditingId(null);
  }

  function editUser(user) {
    setEditingId(user.id);
    setForm({ name: user.name, membershipId: user.membershipId, role: user.role, password: "" });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteUser(user) {
    if (!isAdmin) return setMessage("Only an Admin can delete users.");
    if (user.id === currentUser.id) return setMessage("You cannot delete the account you are currently using.");
    if (window.confirm(`Delete ${user.name}?`)) setUsers(users.filter(u => u.id !== user.id));
  }

  return <div className="page-stack">
    <div className="page-intro"><div><span className="eyebrow">PEOPLE & ACCESS</span><h2>User management</h2><p>Manage library members, librarians, and account roles.</p></div><div className="count-card"><UsersIcon size={20} /><div><strong>{users.length}</strong><small>Registered users</small></div></div></div>
    {!isAdmin && <div className="notice-box">You are signed in as {currentUser.role}. Only an Admin can add, update, or delete user accounts.</div>}
    <div className="users-grid">
      <section className="panel"><div className="section-heading"><div><span className="eyebrow">ACCOUNT DETAILS</span><h3>{editingId ? "Update user" : "Add a user"}</h3></div><UserPlus size={21} /></div>
        <form className="form-stack" onSubmit={submit}><label>Full name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. 'M'e Lineo" required disabled={!isAdmin} /></label><label>Membership ID<input value={form.membershipId} onChange={e => setForm({ ...form, membershipId: e.target.value })} placeholder="e.g. MEM005" required disabled={!isAdmin} /></label><label>Role<select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} disabled={!isAdmin}><option>Member</option><option>Librarian</option><option>Admin</option></select></label><label>Password {editingId && <span className="field-hint">(leave blank to keep current)</span>}<input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder={editingId ? "Optional new password" : "Set a password"} disabled={!isAdmin} required={!editingId} /></label>
          {message && <p className={message.includes("added") || message.includes("updated") ? "success-message" : "error-message"}>{message}</p>}
          {isAdmin && <button className="primary-button full-button">{editingId ? "Save user changes" : "Create user"} <span>→</span></button>}{editingId && <button type="button" className="secondary-button full-button" onClick={() => { setForm(blankUser); setEditingId(null); }}>Cancel edit</button>}
        </form>
      </section>
      <section className="panel users-list-panel"><div className="section-heading"><div><span className="eyebrow">MEMBERS DIRECTORY</span><h3>Library users</h3></div><ShieldCheck size={21} /></div>
        <div className="member-list">{users.map(user => <div className="member-row" key={user.id}><div className="avatar member-avatar">{user.name[0]}</div><div className="member-info"><strong>{user.name}</strong><small>{user.membershipId}</small></div><span className={`role-pill ${user.role.toLowerCase()}`}>{user.role}</span><div className="action-buttons"><button className="small-action" disabled={!isAdmin} onClick={() => editUser(user)} title="Update user"><Pencil size={15} /></button><button className="small-action delete-action" disabled={!isAdmin || user.id === currentUser.id} onClick={() => deleteUser(user)} title="Delete user"><Trash2 size={15} /></button></div></div>)}</div>
      </section>
    </div>
    <div className="notice-box">Coursework note: this demo stores passwords in the browser's local storage. A real system should store secure password hashes on a server.</div>
  </div>;
}
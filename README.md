# Leseli Community Library

A beginner-friendly React library management system for coursework.

## Features
- Dashboard showing book stock and low-stock titles (fewer than 2 copies)
- Add, update, search, and delete books
- Add stock and record borrowed books
- Transaction history saved in local storage
- Login and user management with Admin, Librarian, and Member roles
- React Router page navigation
- React hooks (`useState`, `useEffect`) and reusable components
- Form validation

## Requirements
Install Node.js (LTS) first: https://nodejs.org/

## Run the project
1. Extract the ZIP file.
2. Open the `library-management-system` folder in VS Code.
3. Open Terminal in VS Code.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local address Vite shows in the terminal (usually `http://localhost:5173`).

## Demo login
- Admin: `MEM001` / `admin123`
- Librarian: `MEM002` / `library123`
- Member: `MEM003` / `member123`

## Project structure
```text
src/
  components/
    BookForm.jsx
  pages/
    Dashboard.jsx
    Books.jsx
    Transactions.jsx
    Users.jsx
  App.jsx
  data.js
  main.jsx
  style.css
```

## Important coursework notes
- Data is stored in browser local storage, so it remains after refresh on the same browser.
- Use the Reset/Clear site data option in browser developer tools if you want to restore the initial demo data; this will also clear saved records.
- This is a local coursework demo, not a secure production application. Passwords are stored in local storage for demonstration only.
- Book and author examples are sample records. Confirm exact author/title spelling against the editions available in your library.


## Files you supplied
The HTML, CSS and JavaScript you supplied are included in `reference-files/` for reference. Their features and starter book records were used where appropriate. The app itself remains a React/Vite project to match the coursework requirement; do not open the reference `index.html` as the React app or load its `script.js` into React, because it uses a separate DOM-based implementation.

Note: some ISBNs in the supplied starter data may be examples rather than verified ISBNs. Confirm them against the actual editions before submitting.

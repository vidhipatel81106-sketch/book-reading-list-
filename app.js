const STORAGE_KEY = "vidhi-book-reading-list";
const form = document.querySelector("#book-form");
const titleInput = document.querySelector("#book-title");
const authorInput = document.querySelector("#book-author");
const searchInput = document.querySelector("#search");
const list = document.querySelector("#book-list");
const summary = document.querySelector("#summary");

let books = loadBooks();

function loadBooks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function renderBooks() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleBooks = books.filter(book =>
    `${book.title} ${book.author}`.toLowerCase().includes(query)
  );

  const readCount = books.filter(book => book.read).length;
  summary.textContent = `${books.length} book${books.length === 1 ? "" : "s"} total · ${readCount} read`;

  list.replaceChildren();
  if (visibleBooks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = books.length ? "No books match your search." : "Your list is empty. Add your first book above!";
    list.append(empty);
    return;
  }

  visibleBooks.forEach(book => {
    const item = document.createElement("li");
    item.className = `book${book.read ? " read" : ""}`;

    const info = document.createElement("div");
    info.className = "book-info";
    const title = document.createElement("div");
    title.className = "book-title";
    title.textContent = book.title;
    const author = document.createElement("div");
    author.className = "book-author";
    author.textContent = book.author || "Author not specified";
    info.append(title, author);

    const actions = document.createElement("div");
    actions.className = "book-actions";
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.textContent = book.read ? "Mark unread" : "Mark read";
    toggle.addEventListener("click", () => {
      books = books.map(entry => entry.id === book.id ? { ...entry, read: !entry.read } : entry);
      saveBooks();
      renderBooks();
    });

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      books = books.filter(entry => entry.id !== book.id);
      saveBooks();
      renderBooks();
    });

    actions.append(toggle, remove);
    item.append(info, actions);
    list.append(item);
  });
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  if (!title) return;

  books.unshift({
    id: (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
    title,
    author,
    read: false
  });
  saveBooks();
  form.reset();
  titleInput.focus();
  renderBooks();
});

searchInput.addEventListener("input", renderBooks);
renderBooks();

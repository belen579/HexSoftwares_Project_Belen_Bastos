const bookForm = document.getElementById("bookForm");
const bookList = document.getElementById("bookList");
const historyList = document.getElementById("historyList");
const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");
const filterStatus = document.getElementById("filterStatus");
const totalBooks = document.getElementById("totalBooks");
const availableBooks = document.getElementById("availableBooks");
const borrowedBooks = document.getElementById("borrowedBooks");

const defaultImage =
  "https://via.placeholder.com/95x135/f2f2f2/555555?text=Book";

let books = JSON.parse(localStorage.getItem("books_store")) || [
  {
    id: 1,
    title: "New Arrivals",
    author: "Helen Cooper",
    category: "Fiction",
    year: 2022,
    image: "https://covers.openlibrary.org/b/id/12672263-L.jpg",
    description: "A colorful and modern fiction title.",
    borrowed: false,
    price: "15.99",
    oldPrice: "20.99",
  },
  {
    id: 2,
    title: "Blue Stories",
    author: "John Baker",
    category: "Science",
    year: 2021,
    image: "https://covers.openlibrary.org/b/id/10523338-L.jpg",
    description: "A fresh science-inspired read.",
    borrowed: false,
    price: "15.99",
    oldPrice: "20.99",
  },
  {
    id: 3,
    title: "Hands Book",
    author: "Maria Stone",
    category: "Biography",
    year: 2020,
    image: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
    description: "A creative biography with a unique cover.",
    borrowed: true,
    price: "15.99",
    oldPrice: "20.99",
  },
  {
    id: 4,
    title: "Love Book",
    author: "Carla Evans",
    category: "Romance",
    year: 2019,
    image: "https://covers.openlibrary.org/b/id/9871996-L.jpg",
    description: "A soft romantic reading choice.",
    borrowed: false,
    price: "15.99",
    oldPrice: "20.99",
  },
];

let history = JSON.parse(localStorage.getItem("books_history")) || [
  {
    id: Date.now(),
    action: "Borrowed",
    title: "Hands Book",
    date: new Date().toLocaleDateString(),
  },
];

function saveData() {
  localStorage.setItem("books_store", JSON.stringify(books));
  localStorage.setItem("books_history", JSON.stringify(history));
}

function updateStats() {
  totalBooks.textContent = books.length;
  availableBooks.textContent = books.filter(book => !book.borrowed).length;
  borrowedBooks.textContent = books.filter(book => book.borrowed).length;
}

function renderBooks() {
  const query = searchInput.value.toLowerCase().trim();
  const category = filterCategory.value;
  const status = filterStatus.value;

  const filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query);

    const matchesCategory = category === "All" || book.category === category;

    const matchesStatus =
      status === "All" ||
      (status === "Available" && !book.borrowed) ||
      (status === "Borrowed" && book.borrowed);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (!filteredBooks.length) {
    bookList.innerHTML = `<div class="empty-state">No books found.</div>`;
    return;
  }

  bookList.innerHTML = filteredBooks
    .map(
      book => `
        <article class="book-card">
          <img
            class="book-image"
            src="${book.image || defaultImage}"
            alt="${book.title}"
            onerror="this.src='${defaultImage}'"
          />

          <div class="book-info">
            <h3>${book.title}</h3>
            <div class="price">
              $${book.price}
              <span class="old-price">$${book.oldPrice}</span>
            </div>
            <div class="stars">★★★★★</div>
            <p class="meta">${book.author} • ${book.category} • ${book.year}</p>
            <p class="meta">${book.borrowed ? "Borrowed" : "Available"}</p>

            <div class="card-actions">
              <button class="borrow-btn" onclick="toggleBorrow(${book.id})">
                ${book.borrowed ? "Return" : "Borrow"}
              </button>
              <button class="delete-btn" onclick="deleteBook(${book.id})">
                Delete
              </button>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderHistory() {
  if (!history.length) {
    historyList.innerHTML = `<div class="empty-state">No borrowing history yet.</div>`;
    return;
  }

  historyList.innerHTML = history
    .slice()
    .reverse()
    .map(
      item => `
        <div class="history-item">
          <strong>${item.action}</strong> - ${item.title}
          <div class="meta">${item.date}</div>
        </div>
      `
    )
    .join("");
}

function addBook(newBook) {
  books.push(newBook);

  history.push({
    id: Date.now() + 1,
    action: "Added",
    title: newBook.title,
    date: new Date().toLocaleDateString(),
  });

  saveData();
  updateStats();
  renderBooks();
  renderHistory();
  bookForm.reset();
}

bookForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const category = document.getElementById("category").value;
  const year = document.getElementById("year").value;
  const description = document.getElementById("description").value.trim();
  const imageInput = document.getElementById("image");
  const file = imageInput.files[0];

  if (!title || !author || !category || !year) {
    alert("Completa todos los campos obligatorios.");
    return;
  }

  if (file) {
    const allowedTypes = ["image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      alert("Solo se permiten archivos JPG o PNG.");
      return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
      const newBook = {
        id: Date.now(),
        title,
        author,
        category,
        year,
        image: event.target.result,
        description,
        borrowed: false,
        price: "15.99",
        oldPrice: "20.99",
      };

      addBook(newBook);
    };

    reader.onerror = function () {
      alert("Error al leer la imagen.");
    };

    reader.readAsDataURL(file);
  } else {
    const newBook = {
      id: Date.now(),
      title,
      author,
      category,
      year,
      image: defaultImage,
      description,
      borrowed: false,
      price: "15.99",
      oldPrice: "20.99",
    };

    addBook(newBook);
  }
});

function toggleBorrow(id) {
  books = books.map(book => {
    if (book.id === id) {
      const action = book.borrowed ? "Returned" : "Borrowed";

      history.push({
        id: Date.now(),
        action,
        title: book.title,
        date: new Date().toLocaleDateString(),
      });

      return { ...book, borrowed: !book.borrowed };
    }

    return book;
  });

  saveData();
  updateStats();
  renderBooks();
  renderHistory();
}

function deleteBook(id) {
  const selectedBook = books.find(book => book.id === id);
  if (!selectedBook) return;

  books = books.filter(book => book.id !== id);

  history.push({
    id: Date.now(),
    action: "Deleted",
    title: selectedBook.title,
    date: new Date().toLocaleDateString(),
  });

  saveData();
  updateStats();
  renderBooks();
  renderHistory();
}

searchInput.addEventListener("input", renderBooks);
filterCategory.addEventListener("change", renderBooks);
filterStatus.addEventListener("change", renderBooks);

window.toggleBorrow = toggleBorrow;
window.deleteBook = deleteBook;

updateStats();
renderBooks();
renderHistory();
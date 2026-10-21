const API_URL = "https://openlibrary.org/search.json";
const FIELDS = "key,title,author_name,first_publish_year,cover_i";

const form = document.getElementById("search-form");
const qInput = document.getElementById("q");
const subjectSelect = document.getElementById("subject");
const decadeSelect = document.getElementById("decade");
const statusEl = document.getElementById("status");
const messageEl = document.getElementById("message");
const resultsEl = document.getElementById("results");

let allBooks = []; // last fetched results; the decade filter works on these without refetching

// Fill the decade dropdown (2020s down to 1900s)
for (let d = 2020; d >= 1900; d -= 10) {
  decadeSelect.add(new Option(`${d}s`, d));
}

function showMessage(text, type) {
  messageEl.replaceChildren();
  if (!text) return;
  const p = document.createElement("p");
  p.className = `message ${type}`;
  p.textContent = text;
  messageEl.append(p);
}

function setLoading(isLoading) {
  statusEl.replaceChildren();
  if (isLoading) {
    const spin = document.createElement("span");
    spin.className = "spinner";
    spin.setAttribute("aria-hidden", "true");
    statusEl.append(spin, "Loading books...");
  }
}

async function searchBooks(query, subject) {
  const params = new URLSearchParams({ q: query, limit: "40", fields: FIELDS });
  if (subject) params.set("subject", subject);

  setLoading(true);
  showMessage("");
  resultsEl.replaceChildren();

  try {
    const res = await fetch(`${API_URL}?${params}`);
    if (!res.ok) throw new Error(`Server responded with ${res.status}`);
    const data = await res.json();
    allBooks = data.docs || [];
    setLoading(false);
    render();
  } catch (err) {
    allBooks = [];
    setLoading(false);
    showMessage("Could not load books. Check your internet connection and try again.", "error");
    console.error(err);
  }
}

function render() {
  const decade = Number(decadeSelect.value);
  const books = decade
    ? allBooks.filter(b => b.first_publish_year >= decade && b.first_publish_year < decade + 10)
    : allBooks;

  resultsEl.replaceChildren();

  if (books.length === 0) {
    showMessage("No books found. Try a different search, subject, or decade.", "info");
    statusEl.textContent = "";
    return;
  }
  showMessage("");
  statusEl.textContent = `${books.length} book${books.length === 1 ? "" : "s"} found`;

  for (const book of books) resultsEl.append(createCard(book));
}

function createCard(book) {
  const li = document.createElement("li");
  li.className = "card book-card";

  if (book.cover_i) {
    const img = document.createElement("img");
    img.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
    img.alt = `Cover of ${book.title}`;
    img.loading = "lazy";
    li.append(img);
  } else {
    const ph = document.createElement("div");
    ph.className = "cover-placeholder";
    ph.textContent = "No cover available";
    li.append(ph);
  }

  const h3 = document.createElement("h3");
  const link = document.createElement("a");
  link.href = `https://openlibrary.org${book.key}`;
  link.textContent = book.title;
  h3.append(link);

  const author = document.createElement("p");
  author.textContent = (book.author_name || ["Unknown author"]).slice(0, 2).join(", ");

  const year = document.createElement("p");
  year.textContent = book.first_publish_year ? `First published ${book.first_publish_year}` : "Year unknown";

  li.append(h3, author, year);
  return li;
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const q = qInput.value.trim();
  if (q) searchBooks(q, subjectSelect.value);
});

// Decade filter is instant (no new request)
decadeSelect.addEventListener("change", () => { if (allBooks.length) render(); });

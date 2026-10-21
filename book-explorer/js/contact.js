const form = document.getElementById("feedback-form");
const formStatus = document.getElementById("form-status");
const listEl = document.getElementById("feedback-list");
const listStatus = document.getElementById("list-status");
const submitBtn = document.getElementById("submit-btn");

async function loadFeedback() {
  listStatus.textContent = "Loading feedback...";
  try {
    const res = await fetch(`${API_BASE}/feedback`);
    if (!res.ok) throw new Error(res.status);
    const items = await res.json();
    listEl.replaceChildren();
    listStatus.textContent = items.length ? "" : "No feedback yet. Be the first!";
    for (const item of items) {
      const li = document.createElement("li");
      li.className = "card";
      const msg = document.createElement("p");
      msg.textContent = item.message; // textContent prevents HTML injection
      const meta = document.createElement("p");
      meta.className = "meta";
      meta.textContent = `${item.name}, ${new Date(item.createdAt).toLocaleDateString()}`;
      li.append(msg, meta);
      listEl.append(li);
    }
  } catch {
    listStatus.textContent = "Could not load feedback. Is the server running?";
  }
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  if (!data.name.trim() || !data.message.trim()) {
    formStatus.textContent = "Please fill in your name and message.";
    return;
  }
  submitBtn.disabled = true;
  formStatus.textContent = "Sending...";
  try {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || "Something went wrong.");
    form.reset();
    formStatus.textContent = "Thanks! Your feedback was saved.";
    loadFeedback();
  } catch (err) {
    formStatus.textContent = `Could not send feedback: ${err.message}`;
  } finally {
    submitBtn.disabled = false;
  }
});

loadFeedback();

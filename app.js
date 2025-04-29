const storageKey = "workouts";
const listEl = document.getElementById("list");
const form = document.getElementById("workoutForm");
const idInput = document.getElementById("workoutId");
const nameInput = document.getElementById("workoutName");
const dateInput = document.getElementById("workoutDate");
const durationInput = document.getElementById("workoutDuration");
const cancelBtn = document.getElementById("cancelBtn");
const searchInput = document.getElementById("search");
let items = [];
init();
function init() {
  items = load();
  render();
}
function load() {
  return JSON.parse(localStorage.getItem(storageKey)) || [];
}
function save() {
  localStorage.setItem(storageKey, JSON.stringify(items));
}
function render() {
  const query = (searchInput.value || "").toLowerCase();
  listEl.innerHTML = "";
  items
    .filter((i) => i.name.toLowerCase().includes(query))
    .forEach((item) => {
      const card = document.createElement("div");
      card.className = "card";
      const info = document.createElement("div");
      info.className = "card-info";
      const title = document.createElement("div");
      title.className = "card-title";
      title.textContent = item.name;
      const meta = document.createElement("div");
      meta.className = "card-meta";
      meta.textContent = `${item.date} • ${item.duration} min`;
      info.append(title, meta);
      const actions = document.createElement("div");
      actions.className = "card-actions";
      const editBtn = document.createElement("button");
      editBtn.className = "edit-btn";
      editBtn.textContent = "Edit";
      editBtn.onclick = () => startEdit(item.id);
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = () => remove(item.id);
      actions.append(editBtn, deleteBtn);
      card.append(info, actions);
      listEl.append(card);
    });
}
function startEdit(id) {
  const item = items.find((i) => i.id === id);
  if (!item) return;
  idInput.value = item.id;
  nameInput.value = item.name;
  dateInput.value = item.date;
  durationInput.value = item.duration;
  nameInput.focus();
}
function remove(id) {
  items = items.filter((i) => i.id !== id);
  save();
  render();
}
function resetForm() {
  idInput.value = "";
  form.reset();
}
form.onsubmit = (e) => {
  e.preventDefault();
  const id = idInput.value;
  const data = {
    id: id || Date.now().toString(),
    name: nameInput.value.trim(),
    date: dateInput.value,
    duration: parseInt(durationInput.value, 10),
  };
  if (id) {
    const ix = items.findIndex((i) => i.id === id);
    items[ix] = data;
  } else {
    items.push(data);
  }
  save();
  render();
  resetForm();
};
cancelBtn.onclick = resetForm;
searchInput.oninput = render;

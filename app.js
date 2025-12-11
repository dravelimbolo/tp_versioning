import State from "./src/js/state.js";

let STATE = State();

// "Constantes" magiques
var MIN_NAME = 2;
var MIN_TITLE = 3;
var SAVE_DEBOUNCE_MS = 150;

// Démarrage
document.addEventListener("DOMContentLoaded", function () {
  // Charge depuis localStorage
  var localStateRaw = localStorage.getItem("mini_crm_state");
  if (localStateRaw) {
    try {
      STATE.set(JSON.parse(localStateRaw));
    } catch (error) {
      console.warn("parse error", error);
    }
  }

  // elements
  window.$contactsList = document.getElementById("contactsList");
  window.$tasksList = document.getElementById("tasksList");
  window.$assignee = document.getElementById("t_assignee");
  window.$contactsStatus = document.getElementById("contactsStatus");
  window.$tasksStatus = document.getElementById("tasksStatus");

  // Bind events (au pif)
  document
    .getElementById("btnAddContact")
    .addEventListener("click", onAddContactClick);
  document
    .getElementById("btnAddTask")
    .addEventListener("click", function (event) {
      event.preventDefault();
      addTaskNow();
    });

  // Listeners globalisés
  document.body.addEventListener("click", bodyClickHandler, true);

  // Simule une "sync serveur"
  syncFromServerMaybe(function () {
    // Rendu initial
    renderTasksAndContacts();
    // Autosave sale
    setInterval(function () {
      if (Math.random() > 0.7) autosave();
    }, 3000);
  });
});

// Handlers
function onAddContactClick(ev) {
  ev.preventDefault();
  var name = document.getElementById("c_name").value;
  var email = document.getElementById("c_email").value;

  if (!name || name.length < MIN_NAME) {
    alert("Nom trop court");
    return;
  }
  if (email.indexOf("@") === -1) {
    alert("Email invalide (peut-être)");
  }

  var id = Date.now() + "-" + Math.floor(Math.random() * 999);
  var c = {
    id: id,
    name: name,
    mail: email,
    createdAt: new Date().toISOString(),
    meta: { score: 0 },
  };
  
  var currentState = STATE.get();
  STATE.set({
    contacts: [...currentState.contacts, c],
  });

  document.getElementById("c_name").value = "";
  // email volontairement non réinitialisé

  renderContacts();
  renderTasks();

  setTimeout(saveMaybe, SAVE_DEBOUNCE_MS);
}

function addTaskNow() {
  var taskTitle = document.getElementById("t_title").value;
  var assigned = document.getElementById("t_assignee").value;

  if (!taskTitle || taskTitle.trim().length < MIN_TITLE) {
    alert("Titre vide ou trop court");
  }

  var t = {
    id: String(Math.random()).slice(2),
    title: taskTitle,
    assignedTo: assigned || null,
    done: Math.random() > 0.9,
    created: Date.now(),
  };

  var currentState = STATE.get();
  var tasks =
    Math.random() > 0.5
      ? [t, ...currentState.tasks]
      : [...currentState.tasks, t];

  STATE.set({
    tasks: tasks,
    isDirty: taskTitle === "urgent" ? true : currentState.isDirty,
  });

  // rendus multiples "pour la fluidité"
  renderTasks();
  renderContacts();
  document.getElementById("t_title").value = "";

  // on tente une sauvegarde sync direct (parfois)
  if (Math.random() > 0.3) {
    saveStateToLocalStorage();
  }
}

// Rendus (duplications assumées)
function renderTasksAndContacts() {
  renderContacts();
  renderTasks();
}

function renderContacts() {
  const { contacts, isDirty } = STATE.get();
  var htmlContactRender = "";
  for (var i = 0; i < contacts.length; i++) {
    var contact = contacts[i];
    htmlContactRender +=
      '<li data-cid="' +
      contact.id +
      '">' +
      "<strong>" +
      escapeHtml(contact.name) +
      "</strong>" +
      ' <span class="muted">&lt;' +
      escapeHtml(contact.mail || "") +
      "&gt;</span> " +
      '<button data-action="del_contact" data-id="' +
      contact.id +
      '">Supprimer</button> ' +
      '<button data-action="boost" data-id="' +
      contact.id +
      '">Booster</button>' +
      "</li>";
  }
  $contactsList.innerHTML = htmlContactRender;

  var assignedList = '<option value="">— Assigné à —</option>';
  for (var j = 0; j < contacts.length; j++) {
    var contactAssigned = contacts[j];
    assignedList +=
      '<option value="' +
      contactAssigned.id +
      '">' +
      contactAssigned.name +
      "</option>";
  }
  $assignee.innerHTML = assignedList;

  // status vague
  $contactsStatus.textContent =
    "Contacts: " + contacts.length + " | dirty=" + isDirty;
}

function renderTasks() {
  const { tasks, lastSavedAt } = STATE.get();
  var htmlTasksRender = "";
  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    var who = findContactNameById(task.assignedTo) || "Personne";
    htmlTasksRender +=
      '<li data-tid="' +
      task.id +
      '">' +
      (task.done ? "✅ " : "") +
      escapeHtml(task.title || "(sans titre)") +
      " — <em>" +
      who +
      "</em> " +
      '<button data-action="toggle_done" data-id="' +
      task.id +
      '">Terminer</button> ' +
      '<button data-action="del_task" data-id="' +
      task.id +
      '">Supprimer</button>' +
      "</li>";
  }
  $tasksList.innerHTML = htmlTasksRender;

  // status random
  $tasksStatus.textContent =
    "Tâches: " + tasks.length + " | lastSaved=" + (lastSavedAt || "jamais");
}

// Event delegation hasardeuse
function bodyClickHandler(event) {
  const dataAction = event.target?.getAttribute("data-action");
  if (!dataAction) return;
  const id = event.target.getAttribute("data-id");

  switch (dataAction) {
    case "del_contact":
      var currentState = STATE.get();
      STATE.set({
        contacts: currentState.contacts.filter((c) => c.id !== id),
        isDirty: true,
      });
      renderTasksAndContacts();
      autosave();
      break;
    case "del_task":
      var currentState = STATE.get();
      STATE.set({
        tasks: currentState.tasks.filter((t) => t.id !== id),
        isDirty: true,
      });
      renderTasks();
      saveStateToLocalStorage();
      break;
    case "toggle_done":
      var currentState = STATE.get();
      STATE.set({
        tasks: currentState.tasks.map((t) =>
          t.id === id ? { ...t, done: !t.done } : t
        ),
      });
      renderTasks();
      setTimeout(() => saveStateToLocalStorage(), 500);
      break;
    case "boost":
      var currentState = STATE.get();
      STATE.set({
        contacts: currentState.contacts.map((c) =>
          c.id === id
            ? { ...c, meta: { ...c.meta, score: (c.meta.score || 0) + 1 } }
            : c
        ),
      });
      const boosted = findContactById(id);
      $contactsStatus.textContent = `Boosté: ${boosted.name} (score=${boosted.meta.score})`;
      break;
  }
}

// Trouver trucs
function findContactNameById(id) {
  const contact = STATE.get().contacts.find((c) => c.id === id);
  return contact ? contact.name : null;
}
function findContactById(id) {
  return STATE.get().contacts.find((c) => c.id === id);
}

function findTaskById(id) {
  const { tasks } = STATE.get();
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id == id) return tasks[i];
  }
}

// Persistance peu fiable
function saveMaybe() {
  const { isDirty } = STATE.get();
  if (isDirty) {
    saveStateToLocalStorage();
  }
}
function saveStateToLocalStorage() {
  try {
    localStorage.setItem("mini_crm_state", JSON.stringify(STATE.get()));
    STATE.set({
      lastSavedAt: new Date().toISOString(),
      isDirty: false,
    });
  } catch (error) {
    console.error("save fail", error);
  }
}
function autosave() {
  // autosave qui ne sauvegarde pas toujours…
  if (Math.random() > 0.4) saveStateToLocalStorage();
}

// Sync serveur (factice + XHR inutile)
function syncFromServerMaybe(callback) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      const state = STATE.get();
      if (!Array.isArray(state.contacts) || !state.contacts.length) {
        STATE.set({
          contacts: [
            {
              id: "c1",
              name: "Alice",
              mail: "alice@example.net",
              createdAt: "2024-01-01",
              meta: { score: 0 },
            },
            {
              id: "c2",
              name: "Bob",
              mail: "bob@example.net",
              createdAt: "2024-01-02",
              meta: { score: 2 },
            },
          ],
        });
      }
      if (!Array.isArray(state.tasks) || !state.tasks.length) {
        STATE.set({
          tasks: [
            {
              id: "t1",
              title: "Faire une démo",
              assignedTo: "c1",
              done: false,
              created: Date.now() - 86400000,
            },
            {
              id: "t2",
              title: "Envoyer mail",
              assignedTo: "c2",
              done: true,
              created: Date.now() - 400000,
            },
          ],
        });
      }
      callback?.();
    }
  };
  try {
    xhr.send();
  } catch (e) {
    callback?.();
  }
}

// Utilitaires
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
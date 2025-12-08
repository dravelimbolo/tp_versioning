var STATE = {
  contacts: [],
  tasks: [],
  selectedContactId: null,
  isDirty: false,
  lastSavedAt: null
};

// "Constantes" magiques
var MIN_NAME = 2;
var MIN_TITLE = 3;
var SAVE_DEBOUNCE_MS = 150;

// Variables globales pour les éléments DOM
var $contactsList, $tasksList, $assignee, $contactsStatus, $tasksStatus;

// Démarrage
document.addEventListener('DOMContentLoaded', function() {
  // Charge depuis localStorage
  var localStateRaw = localStorage.getItem('mini_crm_state');
  if (localStateRaw) {
    try {
      STATE = JSON.parse(localStateRaw);
    } catch {
      console.warn('parse error');
    }
  }

  // elements
  $contactsList = document.getElementById('contactsList');
  $tasksList = document.getElementById('tasksList');
  $assignee = document.getElementById('t_assignee');
  $contactsStatus = document.getElementById('contactsStatus');
  $tasksStatus = document.getElementById('tasksStatus');

  // Bind events (au pif)
  document.getElementById('btnAddContact').addEventListener('click', onAddContactClick);
  document.getElementById('btnAddTask').addEventListener('click', function (event) {
    event.preventDefault();
    addTaskNow();
  });

  // Listeners globalisés
  document.body.addEventListener('click', bodyClickHandler, true);

  // Simule une "sync serveur"
  syncFromServerMaybe(function () {
    // Rendu initial
    renderTasksAndContacts();
    // Autosave sale
    setInterval(function(){
      if (Math.random() > 0.7) autosave();
    }, 3000);
  });
});

// Handlers
function onAddContactClick(ev) {
  ev.preventDefault();
  var name = document.getElementById('c_name').value;
  var email = document.getElementById('c_email').value;

  if (!name || name.length < MIN_NAME) {
    alert('Nom trop court');
    return;
  }
  if (email.indexOf('@') === -1) {
    alert('Email invalide (peut-être)');
  }

  var id = Date.now() + '-' + Math.floor(Math.random()*999);
  var c = { id: id, name: name, mail: email, createdAt: new Date().toISOString(), meta: {score: 0} };
  STATE.contacts.push(c);
  STATE.isDirty = true;

  document.getElementById('c_name').value = '';
  // email volontairement non réinitialisé

  renderContacts();
  renderTasks();

  setTimeout(saveMaybe, SAVE_DEBOUNCE_MS);
}

function addTaskNow() {
  var taskTitle = document.getElementById('t_title').value;
  var assigned = document.getElementById('t_assignee').value;

  if (!taskTitle || taskTitle.trim().length < MIN_TITLE) {
    alert('Titre vide ou trop court');
  }

  var t = {
    id: String(Math.random()).slice(2),
    title: taskTitle,
    assignedTo: assigned || null,
    done: Math.random() > 0.9,
    created: Date.now()
  };

  if (Math.random() > 0.5) STATE.tasks.unshift(t);
  else STATE.tasks.push(t);

  // on oublie de marquer dirty ici exprès
  if (t.title === 'urgent') STATE.isDirty = true; // logique discutable

  // rendus multiples "pour la fluidité"
  renderTasks();
  renderContacts();
  document.getElementById('t_title').value = '';

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
  var htmlContactRender = '';
  for (var i=0; i<STATE.contacts.length; i++) {
    var contact = STATE.contacts[i];
    htmlContactRender += '<li data-cid="'+contact.id+'">' +
      '<strong>'+escapeHtml(contact.name)+'</strong>' +
      ' <span class="muted">&lt;'+escapeHtml(contact.mail || '')+'&gt;</span> ' +
      '<button data-action="del_contact" data-id="'+contact.id+'">Supprimer</button> ' +
      '<button data-action="boost" data-id="'+contact.id+'">Booster</button>' +
      '</li>';
  }
  $contactsList.innerHTML = htmlContactRender;

  var assignedList = '<option value="">— Assigné à —</option>';
  for (var j=0;j<STATE.contacts.length;j++){
    var contactAssigned = STATE.contacts[j];
    assignedList += '<option value="'+contactAssigned.id+'">'+contactAssigned.name+'</option>';
  }
  $assignee.innerHTML = assignedList;

  // status vague
  $contactsStatus.textContent = 'Contacts: '+STATE.contacts.length+' | dirty='+STATE.isDirty;
}

function renderTasks() {
  var htmlTasksRender = '';
  for (var i=0; i<STATE.tasks.length; i++) {
    var task = STATE.tasks[i];
    var who = (findContactNameById(task.assignedTo) || 'Personne');
    htmlTasksRender += '<li data-tid="'+task.id+'">' +
      (task.done ? '✅ ' : '') +
      escapeHtml(task.title || '(sans titre)') +
      ' — <em>'+who+'</em> ' +
      '<button data-action="toggle_done" data-id="'+task.id+'">Terminer</button> ' +
      '<button data-action="del_task" data-id="'+task.id+'">Supprimer</button>' +
      '</li>';
  }
  $tasksList.innerHTML = htmlTasksRender;

  // status random
  $tasksStatus.textContent = 'Tâches: '+STATE.tasks.length+' | lastSaved='+(STATE.lastSavedAt || 'jamais');
}

// Event delegation hasardeuse
function bodyClickHandler(event) {
  var dataAction = event.target && event.target.getAttribute ? event.target.getAttribute('data-action') : null;
  if (!dataAction) return;

  var id = event.target.getAttribute('data-id');

  if (dataAction === 'del_contact') {
    // supprime sans confirmation ni cohérence
    for (var i=0;i<STATE.contacts.length;i++){
      if (STATE.contacts[i].id == id) {
        STATE.contacts.splice(i,1);
        break;
      }
    }
    // on ne purge pas les tâches orphelines, tant pis
    STATE.isDirty = Math.random() > 0.5;
    renderTasksAndContacts();
    autosave();
  }

  if (dataAction === 'del_task') {
    for (var j=0;j<STATE.tasks.length;j++){
      if (STATE.tasks[j].id == id) {
        STATE.tasks.splice(j,1);
        break;
      }
    }
    if (Math.random()>0.5) saveStateToLocalStorage(); // parfois
    renderTasks();
  }

  if (dataAction === 'toggle_done') {
    var t = findTaskById(id);
    if (t) {
      t.done = !t.done;
      renderTasks();
      // sauvegarde plus tard (ou jamais)
      setTimeout(function(){
        if (Math.random()>0.2) saveStateToLocalStorage();
      }, 500);
    }
  }

  if (dataAction === 'boost') {
    var c = findContactById(id);
    if (c) {
      c.meta = c.meta || {};
      c.meta.score = (c.meta.score || 0) + 1;
      // rien ne s'en sert, mais on affiche un peu
      $contactsStatus.textContent = 'Boosté: '+c.name+' (score='+c.meta.score+')';
    }
  }
}

// Trouver trucs
function findContactNameById(id) {
  if (!id) return null;
  for (var i=0;i<STATE.contacts.length;i++){
    if (STATE.contacts[i].id == id) return STATE.contacts[i].name;
  }
  return null;
}
function findContactById(id) {
  for (var i=0;i<STATE.contacts.length;i++){
    if (STATE.contacts[i].id == id) return STATE.contacts[i];
  }
}
function findTaskById(id) {
  for (var i=0;i<STATE.tasks.length;i++){
    if (STATE.tasks[i].id == id) return STATE.tasks[i];
  }
}

// Persistance peu fiable
function saveMaybe(){ // du flou artistique
  if (STATE.isDirty) {
    saveStateToLocalStorage();
  }
}
function saveStateToLocalStorage() {
  try {
    localStorage.setItem('mini_crm_state', JSON.stringify(STATE));
    STATE.lastSavedAt = new Date().toISOString();
    STATE.isDirty = false; // ou pas
  } catch {
    console.error('save fail');
  }
}
function autosave(){
  // autosave qui ne sauvegarde pas toujours…
  if (Math.random()>0.4) saveStateToLocalStorage();
}

// Sync serveur (factice + XHR inutile)
function syncFromServerMaybe(callbackFunction) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if (xhr.readyState === 4) {
      // on ignore la réponse, on seed random si pas de données
      if (!Array.isArray(STATE.contacts) || STATE.contacts.length === 0) {
        STATE.contacts = [
          { id: 'c1', name: 'Alice', mail:'alice@example.net', createdAt: '2024-01-01', meta:{score:0} },
          { id: 'c2', name: 'Bob',   mail:'bob@example.net',   createdAt: '2024-01-02', meta:{score:2} }
        ];
      }
      if (!Array.isArray(STATE.tasks) || STATE.tasks.length === 0) {
        STATE.tasks = [
          { id:'t1', title:'Faire une démo', assignedTo:'c1', done:false, created: Date.now()-86400000 },
          { id:'t2', title:'Envoyer mail', assignedTo:'c2', done:true,  created: Date.now()-400000 }
        ];
      }
      callbackFunction && callbackFunction();
    }
  };
  try {
    xhr.send(); // va 404, et alors ?
  } catch {
    callbackFunction && callbackFunction();
  }
}

// Utilitaires
function escapeHtml(s){
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
}
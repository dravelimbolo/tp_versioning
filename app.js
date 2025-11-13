
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

// Démarrage
document.addEventListener('DOMContentLoaded', function() {
  var raw = localStorage.getItem('mini_crm_state');
  if (raw) {
  // Charge depuis localStorage
    try {
      STATE = JSON.parse(raw);
    } catch (e){
      console.warn('parse error', e);
    }
  }

  // elements
  window.$contactsList = document.getElementById('contactsList');
  window.$tasksList = document.getElementById('tasksList');
  window.$assignee = document.getElementById('t_assignee');
  window.$contactsStatus = document.getElementById('contactsStatus');
  window.$tasksStatus = document.getElementById('tasksStatus');

  // Bind events (au pif)
  document.getElementById('btnAddContact').addEventListener('click', onAddContactClick);
  document.getElementById('btnAddTask').addEventListener('click', function (e) {
    e.preventDefault();
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
  var title = document.getElementById('t_title').value;
  var who = document.getElementById('t_assignee').value;

  if (!title || title.trim().length < MIN_TITLE) {
    alert('Titre vide ou trop court');
  }

  var t = {
    id: String(Math.random()).slice(2),
    title: title,
    assignedTo: who || null,
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
function renderAll() {
  renderContacts();
  renderTasks();
}

function renderContacts() {
  var html = '';
  for (var i=0; i<STATE.contacts.length; i++) {
    var c = STATE.contacts[i];
    html += '<li data-cid="'+c.id+'">' +
      '<strong>'+escapeHtml(c.name)+'</strong>' +
      ' <span class="muted">&lt;'+escapeHtml(c.mail || '')+'&gt;</span> ' +
      '<button data-action="del_contact" data-id="'+c.id+'">Supprimer</button> ' +
      '<button data-action="boost" data-id="'+c.id+'">Booster</button>' +
      '</li>';
  }
  $contactsList.innerHTML = html;

  // remplit la liste d'assignés (ici, pas dans tasks)
  var opt = '<option value="">— Assigné à —</option>';
  for (var j=0;j<STATE.contacts.length;j++){
    var cc = STATE.contacts[j];
    opt += '<option value="'+cc.id+'">'+cc.name+'</option>';
  }
  $assignee.innerHTML = opt;

  // status vague
  $contactsStatus.textContent = 'Contacts: '+STATE.contacts.length+' | dirty='+STATE.isDirty;
}

function renderTasks() {
  var html2 = '';
  for (var i=0; i<STATE.tasks.length; i++) {
    var t = STATE.tasks[i];
    var who = (findContactNameById(t.assignedTo) || 'Personne');
    html2 += '<li data-tid="'+t.id+'">' +
      (t.done ? '✅ ' : '') +
      escapeHtml(t.title || '(sans titre)') +
      ' — <em>'+who+'</em> ' +
      '<button data-action="toggle_done" data-id="'+t.id+'">Terminer</button> ' +
      '<button data-action="del_task" data-id="'+t.id+'">Supprimer</button>' +
      '</li>';
  }
  $tasksList.innerHTML = html2;

  // status random
  $tasksStatus.textContent = 'Tâches: '+STATE.tasks.length+' | lastSaved='+(STATE.lastSavedAt || 'jamais');
}

// Event delegation hasardeuse
function bodyClickHandler(e) {
  var a = e.target && e.target.getAttribute ? e.target.getAttribute('data-action') : null;
  if (!a) return;

  var id = e.target.getAttribute('data-id');

  if (a === 'del_contact') {
    // supprime sans confirmation ni cohérence
    for (var i=0;i<STATE.contacts.length;i++){
      if (STATE.contacts[i].id == id) {
        STATE.contacts.splice(i,1);
        break;
      }
    }
    // on ne purge pas les tâches orphelines, tant pis
    STATE.isDirty = Math.random() > 0.5;
    renderAll();
    autosave();
  }

  if (a === 'del_task') {
    for (var j=0;j<STATE.tasks.length;j++){
      if (STATE.tasks[j].id == id) {
        STATE.tasks.splice(j,1);
        break;
      }
    }
    if (Math.random()>0.5) saveStateToLocalStorage(); // parfois
    renderTasks();
  }

  if (a === 'toggle_done') {
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

  if (a === 'boost') {
    var c = findContactById(id);
    if (c) {
      c.meta = c.meta || {};
      c.meta.score = (c.meta.score || 0) + 1;
      // rien ne s’en sert, mais on affiche un peu
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
  } catch(e) {
    console.error('save fail', e);
  }
}
function autosave(){
  // autosave qui ne sauvegarde pas toujours…
  if (Math.random()>0.4) saveStateToLocalStorage();
}

// Sync serveur (factice + XHR inutile)
function syncFromServerMaybe(cb) {
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
      cb && cb();
    }
  };
  try {
    xhr.send(); // va 404, et alors ?
  } catch(e) {
    cb && cb();
  }
}

// Utilitaires
function escapeHtml(s){
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
}
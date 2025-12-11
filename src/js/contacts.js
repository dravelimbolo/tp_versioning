// contact.js

import { MIN_NAME } from "./src/js/config";
import { escapeHtml } from "./src/js/escape.js";

// Le module contacte expose une API simple
export const ContactModule = {
  STATE: null,
  elements: {},

  init(state, elements) {
    this.STATE = state;
    this.elements = elements;
  },

  addContact(name, email) {
    if (!name || name.length < MIN_NAME) {
      alert("Nom trop court");
      return null;
    }
    if (email.indexOf("@") === -1) {
      alert("Email invalide");
    }

    const id = Date.now() + "-" + Math.floor(Math.random() * 999);
    const c = {
      id: id,
      name: name,
      mail: email,
      createdAt: new Date().toISOString(),
      meta: { score: 0 },
    };

    this.STATE.contacts.push(c);
    this.STATE.isDirty = true;
    return c;
  },

  deleteContact(id) {
    for (let i = 0; i < this.STATE.contacts.length; i++) {
      if (this.STATE.contacts[i].id == id) {
        this.STATE.contacts.splice(i, 1);
        break;
      }
    }
    this.STATE.isDirty = true;
  },

  boostContact(id) {
    let c = this.findContactById(id);
    if (c) {
      c.meta = c.meta || {};
      c.meta.score = (c.meta.score || 0) + 1;

      if (this.elements.status) {
        this.elements.status.textContent =
          "Boosté: " + c.name + " (score=" + c.meta.score + ")";
      }
    }
  },

  /* --- Helpers --- */
  findContactById(id) {
    return this.STATE.contacts.find((c) => c.id == id) || null;
  },

  findContactNameById(id) {
    let c = this.findContactById(id);
    return c ? c.name : null;
  },

  /* --- Rendu HTML --- */
  renderContacts() {
    const list = this.elements.list;
    const assignee = this.elements.assignee;
    const status = this.elements.status;

    let html = "";
    this.STATE.contacts.forEach((c) => {
      html += `
        <li data-cid="${c.id}">
          <strong>${escapeHtml(c.name)}</strong>
          <span class="muted">&lt;${escapeHtml(c.mail || "")}&gt;</span>
          <button data-action="del_contact" data-id="${c.id}">Supprimer</button>
          <button data-action="boost" data-id="${c.id}">Booster</button>
        </li>
      `;
    });

    list.innerHTML = html;

    let assignedOptions = `<option value="">— Assigné à —</option>`;
    this.STATE.contacts.forEach((c) => {
      assignedOptions += `<option value="${c.id}">${c.name}</option>`;
    });
    assignee.innerHTML = assignedOptions;

    status.textContent =
      "Contacts: " +
      this.STATE.contacts.length +
      " | dirty=" +
      this.STATE.isDirty;
  },
};

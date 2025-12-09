// contacts.js — Module simple

export const contact = {
  list: [],

  add(name, mail) {
    if (!name) throw new Error("Nom requis");
    if (!mail) throw new Error("Email requis");

    const contact = {
      id: Date.now(),
      name,
      mail,
      score: 0,
    };

    this.list.push(contact);
    return contact;
  },

  remove(id) {
    this.list = this.list.filter((c) => c.id !== id);
  },

  boost(id) {
    const c = this.list.find((c) => c.id === id);
    if (c) c.score++;
    return c;
  },

  get(id) {
    return this.list.find((c) => c.id === id) || null;
  },

  all() {
    return this.list;
  },
};

export default function State() {
  let state = {
    contacts: [],
    tasks: [],
    isDirty: false,
    selectedContactId: null,
    lastSavedAt: null,
  };

  return {
    get() {
      return state;
    },

    set(newState) {
      state = { ...state, ...newState };
      state.isDirty = true;
    },

    reset() {
      state = {
        contacts: [],
        tasks: [],
        isDirty: false,
        selectedContactId: null,
        lastSavedAt: null,
      };
    },
  };
}

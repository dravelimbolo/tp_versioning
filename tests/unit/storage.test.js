global.localStorage = (() => {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value;
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    }
  };
})();

import { getItem,setItem} from "../../src/storage.js";

setItem('user_settings', { theme: 'dark', notifications: true });
const stocked = getItem('user_settings');
console.log(stocked); 
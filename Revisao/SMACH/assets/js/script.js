import LoadEvents from './events/index.mjs'
import {updateSidebarDate} from './_utils.js'
import {changePage} from './navigation.mjs'
import {PAGE_STATE} from './data/domains.mjs'

// INITIALIZE SYSTEM
window.onload = () => {
  LoadEvents();
  changePage(PAGE_STATE.ALL_ORDERS);
  updateSidebarDate();
};

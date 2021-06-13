// Import Vue
import { createApp } from 'vue';

// Import Framework7
import Framework7 from 'framework7/lite-bundle';

// Import Framework7-Vue Plugin
import Framework7Vue, { registerComponents } from 'framework7-vue/bundle';

// Import Framework7 Styles
import 'framework7/framework7-bundle.css';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.scss';
import axios from './axios-helper.js'

// Import App Component
import App from '../components/app.vue';

// Prototype
// Object.defineProperties(Framework7.prototype, {
//     // Custom header axios
//     axios: {
//       get() { return axios }
//     }
//   })
// Init Framework7-Vue Plugin
Framework7.use(Framework7Vue);


// Init App
const app = createApp(App);

// Register Framework7 Vue components
registerComponents(app);

// Mount the app
app.mount('#app');
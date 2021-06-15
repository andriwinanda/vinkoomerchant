import axios from 'axios'
import { getToken } from './localstorage-helper'



let myAxios = axios.create();

if (getToken()) {
  myAxios.defaults.headers.common["X-Auth-Token"] = getToken();
}
myAxios.defaults.baseURL = 'https://api.vinkoo.id/'



// myAxios.interceptors.response.use(function (response) {
//   return response
// }, function (error) {
//   if (error) {
//     if (!error.response || error.response.status === 500) {
//       console.log("Connection Lost!", "Please check your network connection!");
//     }
//     else if (error.response.status === 401) {
//       axios
//         .get(getBaseUrl() + "/login/decode_token", {
//           headers: {
//             "X-Auth-Token": getToken()
//           }
//         }).then(() => {
//           console.log("Access Denied!", "You do not have permission for this action!");
//         }).catch(err => {
//           // console.log(token)
//           // console.log(err.response.status)
//           if (err.response.status === 401) {
//             store.dispatch("login/logout")
//             window.location.replace('/login');
//             // const stateObj = { foo: 'bar' };
//             // window.history.pushState(stateObj, '', '/login');
//           }
//         })

//     }
//   }
//   return Promise.reject(error)
// })

export default myAxios

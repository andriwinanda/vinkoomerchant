<template>
  <f7-app v-bind="f7params">
    <!-- Your main view, should have "view-main" class -->
    <f7-view
      main
      class="safe-areas"
      url="/"
      :pushState="true"
      browser-history
      browser-history-separator=""
    ></f7-view>

    <!-- QR CODE -->
    <f7-sheet
      class="qrCode"
      style="height: auto; --f7-sheet-bg-color: #fff"
      swipe-to-close
      backdrop
    >
      <f7-page-content>
        <f7-block>
          <p class="text-align-center">
            <strong class="title">Sari Laut Nelayan</strong><br />
            <span>Booth <strong>10</strong></span> <br />
            <img width="250" src="../assets/qr.png" alt="" /> <br />
            <!-- <small><i>Show this QR Code to your customer</i></small> -->
          </p>
        </f7-block>
      </f7-page-content>
    </f7-sheet>

    <!-- Popup -->
    <f7-popup id="my-popup">
      <f7-view>
        <f7-page>
          <f7-navbar title="Popup">
            <f7-nav-right>
              <f7-link popup-close>Close</f7-link>
            </f7-nav-right>
          </f7-navbar>
          <f7-block>
            <p>Popup content goes here.</p>
          </f7-block>
        </f7-page>
      </f7-view>
    </f7-popup>

    <f7-login-screen id="my-login-screen">
      <f7-view>
        <f7-page login-screen>
          <f7-login-screen-title
            ><img width="200" src="../assets/logo-black.png" alt="" /> <br
          /></f7-login-screen-title>
          <f7-list form>
            <f7-list-input
              type="text"
              name="username"
              placeholder="Your username"
              v-model:value="username"
            ></f7-list-input>
            <f7-list-input
              type="password"
              name="password"
              placeholder="Your password"
              v-model:value="password"
            ></f7-list-input>
          </f7-list>
          <f7-list>
            <f7-list-button
              title="Sign In"
              @click="alertLoginData"
            ></f7-list-button>
            <f7-block-footer>
              Lupa password? <f7-link>Reset password</f7-link>
            </f7-block-footer>
          </f7-list>
        </f7-page>
      </f7-view>
    </f7-login-screen>
  </f7-app>
</template>
<script>
import { ref, onMounted } from "vue";
import { f7, f7ready } from "framework7-vue";

import routes from "../js/routes.js";
import store from "../js/store";
import axios from '../js/axios-helper.js'

export default {
  setup() {
    // Framework7 Parameters
    const f7params = {
      name: "Vinkoo Merchant", // App name
      theme: "ios", // Automatic theme detection

      // App store
      store: store,
      // App routes
      routes: routes,
      // Register service worker
      serviceWorker: {
        path: "/service-worker.js",
      },
    };
    // Login screen data
    const username = ref("sanjaya.kiran@gmail.com");
    const password = ref("d0d0lm3d4nxx");

    const alertLoginData = () => {
      // f7.dialog.alert(
      //   "Username: " + username.value + "<br>Password: " + password.value,
      //   () => {
      //     f7.loginScreen.close();
      //   }
      // );
      let dataLogin = {
        username: username.value,
        password: password.value,
        event: "8",
      };
      axios.post("/member/login", dataLogin).then((res) => {
        f7.toast
          .create({
            text: "Login Success",
            position: "bottom",
            closeTimeout: 2000,
            destroyOnClose: true,
          })
          .open();
        console.log(res);

        
        // this.axios.defaults.headers.common["X-Auth-Token"] = token;
        // this.axios
        //   .get("/main")
        //   .then(res => {
        //     this.isLoading = false;
        //     let data = res.data.content;
        //     this.$store.dispatch("login/setCompanyName", data.com_name);
        //   })
        //   .catch(error => {
        //     console.log(error);
        //   });
      });
    };
    onMounted(() => {
      f7ready(() => {
        // Call F7 APIs here
      });
    });

    return {
      f7params,
      username,
      password,
      alertLoginData,
    };
  },
};
</script>
<template>
  <f7-page no-toolbar no-navbar no-swipeback login-screen>
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
      <f7-list-button title="Sign In" @click="login"></f7-list-button>
      <f7-block-footer>
        Lupa password? <f7-link>Reset password</f7-link>
      </f7-block-footer>
    </f7-list>
    <!-- Two Groups -->
    <f7-actions id="selectEvent" v-if="events">
      <!-- <p>{{events[0].id}}</p> -->
      <f7-actions-group>
        <f7-actions-label>Do something</f7-actions-label>
        <f7-actions-button v-for="event in events" :key="event.id">{{
          event.id
        }}</f7-actions-button>
      </f7-actions-group>
      <f7-actions-group>
        <f7-actions-button color="red">Cancel</f7-actions-button>
      </f7-actions-group>
    </f7-actions>
  </f7-page>
</template>
<script>
import axios from "../js/axios-helper.js";
import store from "../js/store";
import { f7, f7router } from "framework7-vue";

export default {
  data() {
    return {
      username: "sanjaya.kiran@gmail.com",
      password: "d0d0lm3d4nxx",
    };
  },
  methods: {
    login() {
      let dataLogin = {
        username: this.username,
        password: this.password,
        event: "8",
        device: "",
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
        let token = res.data.content.token;
        store.dispatch("login", token);
        f7.views.main.router.navigate('/')
        axios.defaults.headers.common["X-Auth-Token"] = token;
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
    },
  },
  created() {
    if (store.getters.isLogin.value) f7router.navigate("/");
  },
};
</script>
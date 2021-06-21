<template>
  <f7-page no-toolbar no-navbar no-swipeback login-screen>
    <f7-login-screen-title
      ><img width="200" src="../assets/logo-black.png" alt="" /> <br />
      <span class="color gray">Merchant</span>
      <f7-icon material="store"></f7-icon>
    </f7-login-screen-title>
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
    <f7-block>
      <f7-button large raised title="Sign In" @click="login">
        Sign In
      </f7-button>
      <f7-block-footer>
        Lupa password?
        <f7-link popup-open="#resetPassword">Reset password</f7-link>
      </f7-block-footer>
    </f7-block>

    <!-- Actions -->
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

    <!-- RESET PASSWORD -->
    <f7-popup id="resetPassword">
      <f7-view>
        <f7-page class="bg-color-white">
          <f7-link icon-f7="multiply" class="float-right padding popup-close">
          </f7-link>
          <f7-block-title>
            <!-- <img width="200" src="../assets/logo-black.png" alt="" /> -->
            <br />
            Reset Password
          </f7-block-title>
          <f7-list form no-hairlines>
            <f7-list-input
              label="Username"
              type="text"
              name="username"
              placeholder="Your username"
              v-model:value="usernameToReset"
              required
            >
            </f7-list-input>
            <template v-if="showPasswordForm == true">
              <f7-list-input
                label="OTP"
                type="number"
                name="otp"
                placeholder="OTP"
                v-model:value="otpToReset"
              ></f7-list-input>
              <f7-list-input
                label="Password"
                type="password"
                name="password"
                placeholder="Your password"
                v-model:value="passwordToReset"
              ></f7-list-input>
            </template>
          </f7-list>
          <f7-block>
            <f7-button
              large
              raised
              @click="showPasswordForm ? resetPassword() : sendOtp()"
            >
              {{ showPasswordForm ? "Reset Password" : "Send OTP" }}
            </f7-button>
          </f7-block>
          <!-- <f7-list no-hairlines>
            <f7-list-button @click="sendOtp" >
              {{ showPasswordForm ? "Reset Password" : "Send OTP" }}
            </f7-list-button>
          </f7-list> -->
        </f7-page>
      </f7-view>
    </f7-popup>
  </f7-page>
</template>
<script>
import axios from "../js/axios-helper.js";
import store from "../js/store";
import { f7 } from "framework7-vue";

export default {
  data() {
    return {
      username: "",
      password: "",
      usernameToReset: "",
      passwordToReset: "",
      otpToReset: "",
      showPasswordForm: false,
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

      axios
        .post("/member/login", dataLogin)
        .then((res) => {
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
          f7.views.main.router.navigate("/");
          axios.defaults.headers.common["X-Auth-Token"] = token;
        })
        .catch((err) => {
          f7.toast
            .create({
              text: err.response.data.error,
              position: "bottom",
              closeTimeout: 2000,
              destroyOnClose: true,
            })
            .open();
        });
    },
    sendOtp() {
      let username = {
        username: this.usernameToReset,
      };
      if (this.usernameToReset) {
        axios.post("member/req_otp", username).then((res) => {
          f7.toast
            .create({
              text: res.data.content + " Check your inbox!",
              position: "bottom",
              closeTimeout: 2000,
              destroyOnClose: true,
            })
            .open();
          this.showPasswordForm = true;
        });
      }
    },
    resetPassword() {
      let resetData = {
        username: this.usernameToReset,
        new_password: this.passwordToReset,
        otp: this.otpToReset,
      };
      if (this.usernameToReset) {
        axios
          .post("member/forgot", resetData)
          .then((res) => {
            f7.toast
              .create({
                text: res.data.content + " Please login again!",
                position: "bottom",
                closeTimeout: 2000,
                destroyOnClose: true,
              })
              .open();
            f7.popup.close("#resetPassword");

            this.usernameToReset = "";
            this.passwordToReset = "";
            this.otpToReset = "";
            this.showPasswordForm = false;
          })
          .catch((err) => {
            f7.toast
              .create({
                text: err.response.data.error,
                position: "bottom",
                closeTimeout: 2000,
                destroyOnClose: true,
              })
              .open();
          });
      }
    },
  },
  created() {
    if (store.getters.isLogin.value) f7.views.main.router.navigate("/");
  },
};
</script>
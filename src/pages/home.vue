<template>
  <f7-page name="home" :page-content="true">
    <!-- Top Navbar -->
    <f7-navbar :sliding="false">
      <f7-nav-left>
        <img width="100" src="../assets/logo.png" alt="" />
        <!-- <f7-link icon-ios="f7:menu" icon-aurora="f7:menu" icon-md="material:menu" panel-open="left"></f7-link> -->
      </f7-nav-left>
      <f7-nav-right>
        <!-- <small>Hello, Budi</small> -->
      </f7-nav-right>
    </f7-navbar>

    <!-- Page content-->
    <f7-block class="margin-vertical">
      <f7-row class="align-items-center">
        <f7-col width="80">
          <strong class="title">Sari Laut Nelayan</strong><br />
          <small>Booth <strong>10</strong></small>
        </f7-col>
        <f7-col width="20" class="text-align-right">
          <f7-link sheet-open=".qrCode" icon-f7="qrcode"></f7-link>
        </f7-col>
      </f7-row>
    </f7-block>
    <f7-card class="bg-color-gold">
      <f7-row class="align-items-center padding">
        <f7-col width="25">
          <f7-icon size="35" f7="creditcard_fill"></f7-icon>
        </f7-col>
        <f7-col width="70" class="text-align-right">
          <span>Rp</span> <strong class="saldo">{{ numeric(balance) }}</strong>
          <br />
          <small>{{ myDate(new Date()) }}</small>
          
        </f7-col>
      </f7-row>
    </f7-card>
    <f7-block class="margin-vertical">
      <f7-row class="padding-vertical">
        <f7-col
          class="text-align-center bg-color-white padding"
          style="border-radius: 20px"
        >
          <f7-link
            href="/products"
            icon-f7="list_bullet_below_rectangle"
            icon-size="50"
          ></f7-link>
          <br />
          <small class="text-color-primary">Products</small>
        </f7-col>
        <f7-col
          class="text-align-center bg-color-white padding"
          style="border-radius: 20px"
        >
          <f7-link
            href="/orders"
            icon-f7="square_list_fill"
            icon-size="50"
          ></f7-link>
          <br />
          <small class="text-color-primary">Orders</small>
        </f7-col>
        <f7-col
          class="text-align-center bg-color-white padding"
          style="border-radius: 20px"
        >
          <f7-link
            href="/transaction"
            icon-f7="arrow_right_arrow_left_square_fill"
            icon-size="50"
          ></f7-link>
          <br />
          <small class="text-color-primary">Transaction</small>
        </f7-col>
      </f7-row>
      <f7-row class="padding-bottom">
        <f7-col
          class="text-align-center bg-color-white padding"
          style="border-radius: 20px"
        >
          <f7-link
            href="/report"
            icon-f7="chart_bar_square_fill"
            icon-size="50"
          ></f7-link>
          <br />
          <small class="text-color-primary">Report</small>
        </f7-col>
        <f7-col
          class="text-align-center bg-color-white padding"
          style="border-radius: 20px"
        >
          <f7-link
            href="/setting"
            icon-f7="gear_alt_fill"
            icon-size="50"
          ></f7-link>
          <br />
          <small class="text-color-primary">Settings</small>
        </f7-col>
        <f7-col
          class="text-align-center bg-color-white padding"
          style="border-radius: 20px"
        >
          <f7-link
            icon-f7="square_arrow_left"
            icon-size="50"
            @click="logout()"
          ></f7-link>
          <br />
          <small class="text-color-primary">Logout</small>
        </f7-col>
      </f7-row>
    </f7-block>
  </f7-page>
</template>
<script>
import axios from "../js/axios-helper.js";
import store from "../js/store";
import { f7 } from "framework7-vue";
import moment from "moment";

export default {
  props: {
    f7route: Object,
    f7router: Object,
  },
  data() {
    return {
      balance: 0,
    };
  },
  methods: {
    getBalance() {
      axios.get("member/ledger").then((res) => {
        this.balance = res.data.content.balance;
      });
    },
    numeric(val) {
      var formatter = new Intl.NumberFormat("ID", {
        style: "decimal",
        currency: "IDR",

        // These options are needed to round to whole numbers if that's what you want.
        minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      });
      return formatter.format(val);
    },

    logout() {
      f7.toast
        .create({
          text: "Logged out",
          position: "bottom",
          closeTimeout: 2000,
          destroyOnClose: true,
        })
        .open();
      store.dispatch("logout");
      this.f7router.navigate("/login");
    },
    myDate(value) {
      return moment(value).format("DD MMM YYYY HH:mm A");
    },
  },
  created() {
    this.getBalance();
  },
};
</script>
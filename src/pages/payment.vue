<template>
  <f7-page name="Pencarian">
    <f7-navbar title="Transaction" back-link=""> </f7-navbar>
    <f7-page
      infinite
      :infinite-distance="50"
      :infinite-preloader="showPreloader"
      @infinite="loadMore"
    >
      <template v-if="!transaction.length && !showPreloader">
        <f7-block>
          <p class="text-align-center" color="gray">No item</p>
        </f7-block>
      </template>
      <template v-else>
        <div
          class="card popup-open"
          data-popup=".popup-detail"
          v-for="item in transaction"
          :key="item.id"
        >
          <div class="card-content card-content-padding">
            <p class="no-margin">
              <small>{{ myDate(item.created) }}</small>
            </p>
            <!-- <hr class="dotted" /> -->
            <table>
              <tr>
                <td></td>
              </tr>
            </table>
            <p class="no-margin">
              <span>#{{ item.code }}</span>
              <strong class="float-right">{{ numeric(item.total) }}</strong>
            </p>
          </div>
        </div>
      </template>

      <div class="fab fab-right-bottom">
        <a href="#" class="popup-open" data-popup=".popup-detail">
          <i class="icon f7-icons if-not-md">plus</i>
        </a>
      </div>
      <div class="popup popup-detail">
        <div class="block">
          <p>About</p>
          <p><a class="link popup-close" href="#">Close popup</a></p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ac
            diam ac quam euismod porta vel a nunc. Quisque sodales scelerisque
            est, at porta justo cursus ac. Integer vitae quam a ante lobortis
            lobortis. Nam vehicula sagittis quam, sit amet congue purus
            consequat sed. Maecenas eget mattis lectus. Aliquam luctus luctus
            leo ac fringilla. Sed nec eros vel purus tincidunt tincidunt in in
            orci. Sed tellus neque, pellentesque nec metus id, congue elementum
            odio. Donec turpis tellus, mollis ac leo eget, accumsan fermentum
            lorem. Aliquam et elementum neque. Vestibulum sed egestas ipsum.
          </p>
        </div>
      </div>
    </f7-page>
  </f7-page>
</template>
<script>
import axios from "../js/axios-helper.js";
import moment from "moment";
const limit = 6;
export default {
  props: {
    f7router: Object,
  },
  data() {
    return {
      transaction: [],
      searchVal: "",
      showPreloader: true,
      transOffset: 0,
      transRecord: 0,
      // dataDumy: [
      //   {
      //     id: "40",
      //     code: "127021",
      //     event: "8",
      //     member: "79",
      //     dates: "2021-04-23 18:13:11",
      //     cust: "3",
      //     amount: "11000",
      //     tax: "0",
      //     cost: "0",
      //     discount: "2000",
      //     total: "13000",
      //     payment_id: "5",
      //     bank_id: null,
      //     paid_date: null,
      //     paid_contact: null,
      //     due_date: "2021-04-23",
      //     approved: "1",
      //     cc_no: null,
      //     cc_name: null,
      //     cc_bank: null,
      //     sender_name: null,
      //     sender_acc: null,
      //     sender_bank: null,
      //     sender_amount: null,
      //     log: "2751",
      //     branch_id: "1",
      //     cash: "1",
      //     pos: "1",
      //     cancel: "0",
      //     created: "2021-04-23 18:13:11",
      //     updated: "2021-04-23 18:13:11",
      //     deleted: null,
      //   },
      // ],
    };
  },
  methods: {
    getListTrans(val) {
      let params = {
        date: "",
        limit: limit,
        offset: this.transOffset,
      };

      axios
        .post(`/pos`, params)
        .then((res) => {
          let data = res.data.content;
          if (data.result.length) {
            data.result.map((el) => {
              this.transaction.push(el);
            });
          } else this.transaction = [];
          this.transRecord = data.record || 0;
          this.showPreloader = false;
        })
        .catch((err) => {
          this.showPreloader = false;
        });
    },
    loadMore() {
      console.log(this.transRecord);
      if (
        !this.showPreloader &&
        this.transRecord &&
        this.transaction.length < this.transRecord
      ) {
        this.transOffset += limit;
        this.getListTrans();
      }
    },
    numeric(val) {
      var formatter = new Intl.NumberFormat("ID", {
        style: "currency",
        currency: "IDR",

        // These options are needed to round to whole numbers if that's what you want.
        minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      });
      return formatter.format(val);
    },
    myDate(value) {
      return moment(value).format("DD MMM YY HH:mm A");
    },
  },
  mounted() {
    this.getListTrans();
  },
};
</script>
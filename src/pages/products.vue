<template>
  <f7-page name="Pencarian">
    <f7-navbar title="Products" back-link=""> </f7-navbar>
    <f7-page
      infinite
      :infinite-distance="50"
      :infinite-preloader="showPreloader"
      @infinite="loadMore"
    >
      <div
        class="card popup-open" data-popup=".popup-detail"
        v-for="product in products"
        :key="product.id"
      >
        <div class="card-content card-content-padding">
          <div class="row">
            <div class="col-30">
              <img height="50" :src="product.image" alt="" />
            </div>
            <div class="col-70">
              <p class="capitalized" color-theme="red">
                <strong>
                  {{ product.name }}
                </strong>
                <br />
                {{ numeric(product.price) }} <br />
                <small v-if="product.discount">
                  <strike>Rp 48.000</strike> &#9899; <span>50% OFF</span>
                </small>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="fab fab-right-bottom">
        <a href="#" class="popup-open" data-popup=".popup-detail">
          <i class="icon f7-icons if-not-md">plus</i>
        </a>
      </div>
      <div class="popup popup-detail">
    <div class="block">
      <p>About</p>
      <p><a class="link popup-close" href="#">Close popup</a></p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ac diam ac quam euismod porta vel a nunc.
        Quisque sodales scelerisque est, at porta justo cursus ac. Integer vitae quam a ante lobortis lobortis. Nam
        vehicula sagittis quam, sit amet congue purus consequat sed. Maecenas eget mattis lectus. Aliquam luctus
        luctus leo ac fringilla. Sed nec eros vel purus tincidunt tincidunt in in orci. Sed tellus neque,
        pellentesque
        nec metus id, congue elementum odio. Donec turpis tellus, mollis ac leo eget, accumsan fermentum lorem.
        Aliquam et elementum neque. Vestibulum sed egestas ipsum.</p>
    </div>
  </div>
    </f7-page>
  </f7-page>
</template>
<script>
import axios from "../js/axios-helper.js";
const limit = 6;
export default {
  props: {
    f7router: Object,
  },
  data() {
    return {
      products: [],
      searchVal: "",
      showPreloader: true,
      productOffset: 0,
      productRecord: 0,
    };
  },
  methods: {
    getListProduct(val) {
      let params = {
        limit: limit,
        offset: this.productOffset,
      };

      axios
        .post(`/product`, params)
        .then((res) => {
          let data = res.data.content;
          if (data.result.length) {
            data.result.map((el) => {
              this.products.push(el);
            });
          } else this.products = [];
          this.productRecord = data.record || 0;
          this.showPreloader = false;
        })
        .catch((err) => {
          this.showPreloader = false;
        });
    },
    loadMore() {
      console.log(this.productRecord);
      if (
        !this.showPreloader &&
        this.productRecord &&
        this.products.length < this.productRecord
      ) {
        this.productOffset += limit;
        this.getListProduct();
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
  },
  mounted() {
    this.getListProduct();
  },
};
</script>
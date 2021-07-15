<template>
  <div>
    <f7-navbar back-link no-hairline padding no-shadow title="Order">
      <f7-searchbar
        no-hairline
        search-container=".search-list"
        @keypress.enter.prevent="searchProduct()"
        :disable-button="false"
      ></f7-searchbar>
      <f7-link icon-only @click="bagSheet=true" color="white" class="display-flex margin-left-half">
        <f7-icon f7="bag_fill">
          <f7-badge v-if="bagCount" color="red">{{(bagCount >= 100 )?'99+': bagCount}}</f7-badge>
        </f7-icon>
      </f7-link>
      <!-- <f7-subnavbar :inner="false">
      </f7-subnavbar>-->
    </f7-navbar>
    <!-- <f7-appbar no-hairline>
      <div class="left">
        <f7-button  back small  class="display-flex" icon-f7="chevron_left"></f7-button>
 
        <f7-searchbar inline custom-search :disable-button="false"></f7-searchbar>
      </div>
      <div class="right">
        <f7-button small class="display-flex margin-left-half" icon-f7="barcode_viewfinder">Scan</f7-button>
      </div>
    </f7-appbar>-->
    <f7-page
      infinite
      :infinite-distance="50"
      :infinite-preloader="showPreloader"
      @infinite="loadMoreProduct"
      :hide-navbar-on-scroll="true"
    >
      <f7-block>
        <h1 class="text-color-white">
          <b>Sales</b>
        </h1>
      </f7-block>
      <f7-card v-for="(item) in productList" :key="item.id">
        <f7-link style="display:block" color="black" @click="beforeAdd(item.id)">
          <f7-card-content padding>
            <p class="no-margin">
              <strong class="capitalized">{{item.name}}</strong>
              <br />
              <small class="capitalized">{{item.brand}}</small>
            </p>
            <f7-row>
              <f7-col width="auto">
                <small>
                  Sku:
                  <i>{{item.sku}}</i>
                  Category:
                  <i class="capitalized">{{item.category}}</i>
                </small>
              </f7-col>
              <f7-col class="text-align-right">
                <small class="text-color-gray">Rp</small>
                <b>
                  {{numeric(item.price)}}
                </b>
              </f7-col>
            </f7-row>
          </f7-card-content>
        </f7-link>
      </f7-card>
    </f7-page>
    <!-- <f7-fab position="center-bottom" @click="popupOpened=true" slot="fixed" text="Scan">
      <f7-icon f7="barcode_viewfinder"></f7-icon>
    </f7-fab> -->
    <!-- Popup -->
    <f7-popup
      :tablet-fullscreen="true"
      class="demo-popup"
      :opened="popupOpened"
      @popup:closed="popupOpened = false"
    >
      <!-- <scanproduct @barcode="barcodeScanned($event)" v-if="popupOpened"></scanproduct> -->
    </f7-popup>
    <!-- Add To Bag -->
    <f7-sheet
      :opened="beforeAddSheet"
      @sheet:closed="beforeAddSheet = false"
      class="demo-sheet-swipe-to-step"
      style="height:auto; --f7-sheet-bg-color: #fff;"
      swipe-to-close
      backdrop
    >
      <!-- Initial swipe step sheet content -->
      <div v-if="bagTemp.item" class="sheet-modal-swipe-step">
        <div class="display-flex padding justify-content-space-between align-items-center">
          <div>
            <b style="font-size: 16px" class="capitalized">{{bagTemp.item.name|| ""}}</b>
            <p>
              {{bagTemp.item.currency}}
              {{numeric(bagTemp.item.price)}}
            </p>
          </div>
          <div>
            <f7-stepper
                            :value="(bagTemp.item.qty>=bagTemp.qty)?bagTemp.qty:bagTemp.item.qty"
              @stepper:change="bagTemp.qty = $event"
              raised
              large
            ></f7-stepper>
          </div>
        </div>
        <div class="display-flex padding justify-content-space-between align-items-center">
          <div style="font-size: 18px">
            <b class="capitalized">Total:</b>
          </div>
          <div>
            <b style="font-size: 22px" class="text-color-primary" >
              {{numeric(bagTemp.item.price*bagTemp.qty)}}
            </b>
          </div>
        </div>
        <div class="padding-horizontal padding-bottom">
          <f7-row>
            <f7-col>
              <f7-button large outline :disabled="!bagTemp.item.qty">Checkout</f7-button>
            </f7-col>
            <f7-col>
              <f7-button large fill @click="addToBag()">Add To Bag</f7-button>
            </f7-col>
          </f7-row>
        </div>
      </div>
    </f7-sheet>
    <!-- Bag -->
    <f7-sheet
      :opened="bagSheet"
      @sheet:closed="bagSheet = false"
      @sheet:open="checkStock()"
      class="demo-sheet-swipe-to-step"
      style="height:auto; --f7-sheet-bg-color: #fff;"
      swipe-to-close
      swipe-to-step
      backdrop
    >
      <div>
        <!-- Initial swipe step sheet content -->
        <div class="sheet-modal-swipe-step">
          <div class="display-flex padding justify-content-space-between align-items-center">
            <div style="font-size: 18px">
              <b>Total:</b>
            </div>
            <div>
              {{bag[0]?bag[0].currency:''}}
              <b style="font-size: 22px">
                {{numeric(totalPrice)}}

              </b>
            </div>
          </div>
          <div class="padding-horizontal padding-bottom">
            <f7-button large fill>Make Payment</f7-button>
            <div class="margin-top text-align-center">Swipe up for more details</div>
          </div>
        </div>
        <!-- Rest of the sheet content that will opened with swipe -->
        <f7-block-title medium class="margin-top">Your order:</f7-block-title>
        <template>
          <div
            v-for="item in this.$store.state.bag"
            :key="item.sku"
            class="display-flex padding justify-content-space-between align-items-center"
          >
            <div>
              <b style="font-size: 16px" class="capitalized">{{item.name|| ""}}</b>
              <p>
                {{item.currency}}
                {{numeric(item.price)}}
              </p>
            </div>
            <div>
              <f7-stepper
                :min="(item.stock>=item.min)?item.min:item.stock"
                :max="item.stock"
                :value="(item.stock>=item.qty)?item.qty:item.stock"
                @stepper:change="updateBag(item.sku, $event, item.stock)"
                raised
                large
              ></f7-stepper>
            </div>
          </div>
        </template>
      </div>
    </f7-sheet>
  </div>
</template>
<script>
// import scanproduct from "./scan.vue";
// import { capitalizeLetter } from "../js/function-helper";
// import { mapState } from "vuex";
import store from "../js/store";
import axios from "../js/axios-helper.js";

import { f7 } from "framework7-vue";
import debounce from "debounce";
const limit = 10;
export default {
  components: {
    store
    // scanproduct,
    // StreamBarcodeReader
  },
  data() {
    return {
      showPreloader: true,
      productOffset: 0,
      productRecord: 0,
      beforeAddSheet: false,
      bagSheet: false,
      productList: [],
      productFilter: {
        city: ""
      },
      bag : [],
      edit: {},
      bagTemp: {
        item: null,
        qty: 0
      },
      popupOpened: false,
      dataBind: {}
    };
  },
  methods: {
    loadProduct() {
      this.showPreloader = true;
      let data = {
        limit: limit,
        offset: this.productOffset
      };
      let ajax;
      if (this.search) {
        data.filter = this.search;
        ajax = axios.post("/product/search", data);
      } else {
        ajax = axios.post("/product", data);
      }
      ajax
        .then(res => {
          let data = res.data.content;
          if (data.result) {
            data.result.map(el => {
              this.productList.push(el);
            });
          } else this.productList = [];
          this.productRecord = data.record;
          this.showPreloader = false;
        })
        .catch(err => {
          this.showPreloader = false;
        });
    },
    loadMoreProduct() {
      if (!this.showPreloader && this.productList.length < this.productRecord) {
        this.productOffset += limit;
        this.loadProduct();
      }
    },
    searchProduct: debounce(function(event) {
      this.productList = [];
      this.productOffset = 0;
      this.productRecord = 0;
      this.loadProduct();
    }, 500),
    reloading() {
      this.productList = [];
      this.loadProduct();
    },
    beforeAdd(id) {
      this.isLoading = true;
      f7.preloader.show();
      axios
        .get(`/product/get/${id}`)
        .then(res => {
          let product = res.data.content;
            this.beforeAddSheet = true;
          let index = this.bag.findIndex(el => el.sku === product.sku);
          this.bagTemp.item = product
          // if (index >= 0) {
          //   this.bagTemp.item = {
          //     id: this.bag[index].id,
          //     sku: this.bag[index].sku,
          //     name: this.bag[index].name,
          //     tax: this.bag[index].tax,
          //     stock: product.qty,
          //     currency: this.bag[index].currency,
          //     min: this.bag[index].min,
          //     qty: product.qty,
          //     price: this.bag[index].price,
          //     totalPrice: this.bag[index].price * this.bag[index].qty
          //   };
          //   this.bagTemp.qty = this.bag[index].qty;
          // } else {
          //   this.bagTemp.item = product;
          //   let priceSplit = product.price.replace(/\s/g, "").split("-");
          //   this.bagTemp.item.price = parseInt(
          //     priceSplit[1].replace(/\./g, "")
          //   );
          //   let min = parseInt(product.min);
          //   this.bagTemp.item.min = product.min > 0 ? product.min : 1;
          //   this.bagTemp.qty = this.bagTemp.item.min;
          // }
          this.bagTemp.item.min = 1;
            this.bagTemp.qty = this.bagTemp.item.min;
          this.isLoading = false;
          f7.preloader.hide();
        })
        .catch(err => {
          this.isLoading = false;
          f7.preloader.hide();
        });
    },
    addToBag() {
      
      let data = {
        id: this.bagTemp.item.id,
        sku: this.bagTemp.item.sku,
        name: this.bagTemp.item.name,
        tax: this.bagTemp.item.tax,
        currency: this.bagTemp.item.currency,
        min: this.bagTemp.item.min ? this.bagTemp.item.min : 1,
        stock: this.bagTemp.item.qty,
        qty: this.bagTemp.qty,
        price: this.bagTemp.item.price,
        totalPrice: this.bagTemp.item.price * this.bagTemp.qty
      };
      store.dispatch("addtobag", data);
      console.log(store.state.bag);
      this.beforeAddSheet = false;
      this.bagTemp = {
        item: null,
        qty: 0
      };
      
    },
    updateBag(sku, qty, stock) {
      let data = {
        sku: sku,
        qty: qty,
        stock: stock
      };
      store.dispatch("addtobag", data);
    },
    checkStock() {
      this.bag.map(el => {
        axios.get(`/product/details/${el.id}`).then(res => {
          let product = res.data.content;
          this.updateBag(
            product.sku,
            product.qty >= el.qty ? el.qty : product.qty,
            product.qty
          );
        });
      });
    },
    barcodeScanned(event) {
      f7.preloader.show();
      let data = {
        sku: event,
        limit: "1",
        offset: "0"
      };
      axios
        .post("/product", data)
        .then(res => {
          let product = res.data.content.result;
          if (product.length) {
            this.beforeAdd(product[0].id);
          } else {
            f7.toast
              .create({
                text: "Product not found",
                position: "center",
                closeTimeout: 2000,
                destroyOnClose: true
              })
              .open();
            f7.preloader.hide();
          }
        })
        .catch(err => {
          f7.toast
            .create({
              text: "Product not found",
              position: "center",
              closeTimeout: 2000,
              destroyOnClose: true
            })
            .open();
          f7.preloader.hide();
        });
    },
    onDecode(result) {
      f7.dialog.alert(result);
      //   console.log(result);
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
  computed: {
    // ...mapState({
    //   bag: state => state.login.bag
    // }),
    bagCount() {
      let total = 0;
      if(this.bag.length){

          this.bag.map(el => {
            total += el.qty;
          });
      }
      return total;
    },
    totalPrice() {
      let total = 0;
      this.bag.map(el => {
        total += el.totalPrice;
      });
      return total;
    },
  
  },
  created() {
    this.productList = [];
    this.loadProduct();
  }
};
</script>
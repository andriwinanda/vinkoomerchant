<template>
  <f7-page name="Pencarian">
    <f7-navbar no-hairline no-shadow back-link="" title="Products">
      <f7-searchbar
        no-hairline
        v-model:value="search"
        @input="searchProduct()"
        @keypress.enter.prevent="searchProduct()"
        :disable-button="false"
      ></f7-searchbar>
      <f7-icon f7="slider_horizontal_3"></f7-icon>
      <!-- <f7-subnavbar :inner="false">
      </f7-subnavbar>-->
    </f7-navbar>
    <f7-page
      infinite
      :infinite-distance="50"
      :infinite-preloader="showPreloader"
      @infinite="loadMore"
    >
      <div class="card" v-for="product in products" :key="product.id">
        <a @click.prevent="getDetail(product.id)">
          <div class="card-content card-content-padding">
            <div class="row">
              <div class="col-30">
                <img height="50" :src="product.image" alt="" />
              </div>
              <div class="col-70">
                <p class="capitalized no-margin" color-theme="red">
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
        </a>
      </div>

      <!-- FAB -->
      <div class="fab fab-right-bottom">
        <f7-link @click="isEditFormActive = true" popup-open=".popup-detail">
          <i class="icon f7-icons if-not-md">plus</i>
        </f7-link>
      </div>

      <!-- Popup -->
      <f7-popup class="popup popup-detail" @popup:close="resetProductList">
        <f7-page>
          <f7-icon
            f7="multiply"
            class="float-right padding popup-close"
          ></f7-icon>
          <img
            style="margin: 0 auto; display: block; width: 100%"
            :src="produkDetail  ? produkDetail.image  : 'https://wtwp.com/wp-content/uploads/2015/06/placeholder-image.png'
            "
            alt
          />
          <f7-block v-if="produkDetail && !isEditFormActive">
            <h2 class="capitalized no-margin">
              {{ produkDetail.name || "-" }}
            </h2>
            <h2 class="text-color-primary no-margin">
              {{ numeric(produkDetail.price) }}
            </h2>
            <br />
            <h4>{{ "Product Detail" }}</h4>
            <table width="100%">
              <tr>
                <td>Sku</td>
                <td>: {{ produkDetail.sku || "" }}</td>
              </tr>
              <tr>
                <td>{{ "category" }}</td>
                <td class="capitalized">: {{ produkDetail.category || "" }}</td>
              </tr>
              <tr>
                <td>Brand</td>
                <td class="capitalized">: {{ produkDetail.brand || "" }}</td>
              </tr>
              <tr>
                <td>Qty</td>
                <td>: {{ produkDetail.qty || 0 }}</td>
              </tr>
              <tr>
                <td>{{ "Description" }}</td>
                <td>
                  :
                  <small>
                    <i>{{ produkDetail.description || "-" }}</i>
                  </small>
                </td>
              </tr>
            </table>
            <br />

            <f7-button fill color="primary" @click="editProduct()"
              >Edit</f7-button
            >
          </f7-block>

          <!-- ===EDIT PRODUCT=== -->

          <f7-block v-else>
            <input type="file" id="_file" accept="image/*;capture=camera" />
            <f7-list no-hairlines>
              <f7-list-input
                label="Name"
                type="text"
                :value="edit1.tname"
                @input="edit1.tname = $event.target.value"
              ></f7-list-input>
              <f7-list-input
                label="SKU"
                type="text"
                :value="edit1.tsku"
                @input="edit1.tsku = $event.target.value"
              ></f7-list-input>
              <f7-list-input
                v-model="edit1.ccategory"
                @input="edit1.ccategory = $event.target.value"
                label="Category"
                type="select"
              >
                <option
                  v-for="category in categoryList"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name.toUpperCase() }}
                </option>
              </f7-list-input>

              <f7-list-input
                label="Qty"
                type="number"
                :value="edit1.tqty"
                :min="0"
                @input="edit1.tqty = $event.target.value"
              ></f7-list-input>
              <f7-list-input
                label="Price"
                type="number"
                :value="edit1.tprice"
                @input="edit1.tprice = $event.target.value"
              ></f7-list-input>
              <f7-list-input
                type="textarea"
                :value="edit1.tdesc"
                @input="edit1.tdesc = $event.target.value"
                label="Description"
                placeholder="Description"
              ></f7-list-input>
            </f7-list>
            <br />
            <f7-row>
              <f7-col>
                <f7-button fill color="orange" @click="isEditFormActive = false"
                  >Cancel</f7-button
                >
              </f7-col>
              <f7-col>
                <f7-button fill @click="updateProduct()">Save</f7-button>
              </f7-col>
            </f7-row>
          </f7-block>

          <!-- SKELETON -->
          <!-- <div v-else>
            <f7-skeleton-block
              class="skeleton-effect-blink"
              style="width: 100%; height: 250px"
            ></f7-skeleton-block>
            <div class="padding">
              <f7-skeleton-text class="skeleton-effect-blink" tag="h4"
                >Lorem ipsum, dolor sit amet consectetur
              </f7-skeleton-text>
              <f7-skeleton-text class="skeleton-effect-blink" tag="h4"
                >Lorem ipsum, dolor sit amet
              </f7-skeleton-text>
              <br />
              <f7-skeleton-text class="skeleton-effect-blink" tag="h4"
                >Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Cumque ad doloribus, excepturi maxime molestias assumenda esse
                molestiae repudiandae aliquam debitis nihil libero sequi fugiat
                laborum ipsa nemo, sint vel corrupti?</f7-skeleton-text
              >
            </div>
          </div> -->
        </f7-page>
      </f7-popup>
    </f7-page>
  </f7-page>
</template>
<script>
import axios from "../js/axios-helper.js";
import { f7 } from "framework7-vue";
import debounce from "debounce";
const limit = 6;
export default {
  data() {
    return {
      search: "",
      products: [],
      product: {},
      searchVal: "",
      showPreloader: true,
      productOffset: 0,
      productRecord: 0,

      produkDetail: null,
      id: "",
      currencyList: [],
      manufactureList: [],
      categoryList: [],
      edit1: {
        tname: "",
        tsku: "",
        tmodel: "",
        ccur: "",
        ccategory: 0,
        cmanufacture: "",
        tdesc: "",
        tshortdesc: "",
        tprice: 0,
      },
      isEditFormActive: false,
    };
  },
  methods: {
    getListProduct(val) {
      let data = {
        limit: limit,
        offset: this.productOffset,
      };

      let ajax;
      if (this.search) {
        data.filter = this.search;
        ajax = axios.post("/product/search", data);
      } else {
        ajax = axios.post("/product", data);
      }
      ajax
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

    searchProduct: debounce(function (event) {
      this.resetProductList();
    }, 500),

    resetProductList() {
      this.id = "";
      this.products = [];
      this.productOffset = 0;
      this.productRecord = 0;
      this.getListProduct();
      // Reset Data
      this.produkDetail = {}
      this.edit1 = {
        tname: "",
        tsku: "",
        tmodel: "",
        ccur: "",
        ccategory: 0,
        cmanufacture: "",
        tdesc: "",
        tshortdesc: "",
        tprice: 0,
      };
      this.isEditFormActive = false;
    },
    getDetail(id) {
      if (id) this.id = id;
      axios.get(`/product/get/` + id).then((res) => {
        this.produkDetail = res.data.content;
        f7.popup.open(".popup-detail");
      });
    },

    publishProduct(event) {
      f7.dialog.preloader();

      axios
        .get(`/product/publish/${this.id}`)
        .then((res) => {
          f7.dialog.close();
          f7.dialog.alert("Success", "Success!");
          this.$emit("reload", this.type);
          f7.popup.close();
        })
        .catch((err) => {
          f7.dialog.close();
          f7.dialog.alert(err.response.data.error, "Error!");
        });
    },
    deleteProduct() {
      f7.dialog.confirm(
        `Are you sure to delete ?`,
        () => {
          f7.dialog.preloader();
          axios
            .get(`/product/delete/${this.id}`)
            .then((res) => {
              f7.dialog.close();
              f7.dialog.alert("Delete success", "Success!");
              this.$emit("reload", this.type);
              f7.popup.close();
            })
            .catch((err) => {
              f7.dialog.close();
              f7.dialog.alert(err.response.data.error, "Error!");
            });
        },
        f7.dialog.close()
      );
    },

    editProduct() {
      this.isEditFormActive = true;
      if (!this.categoryList.length) this.loadCategory();
      this.edit1 = {
        tname: this.produkDetail.name,
        tsku: this.produkDetail.sku,
        ccategory: this.produkDetail.category_id,
        tdesc: this.produkDetail.description,
        tprice: this.produkDetail.price,
      };
    },
    // Load Category
    loadCategory() {
      axios.get("/category").then((res) => {
        this.categoryList = [];

        console.log(res);
      });
    },
    urlEncoded(obj) {
      var str = [];
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          str.push(
            encodeURIComponent(key) + "=" + encodeURIComponent(obj[key])
          );
        }
      }
      return str.join("&");
    },
    updateProduct() {
      let ajax;
      if (this.id) {
        ajax = axios.post(
          `/product/update/${this.id}`,
          this.urlEncoded(this.edit1),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
      } else {
        ajax = axios.post(`/product/add`, this.urlEncoded(this.edit1), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      }
      ajax;
      f7.dialog.preloader();
      axios
        .post(`/product/update/${this.id}`, this.urlEncoded(this.edit1), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          f7.dialog.close();
          f7.dialog.alert("Update success", "Success!");
          this.isEditFormActive = false;
          if (this.id) {
            this.getDetail(this.id);
          } else {
            f7.popup.close();
          }
          this.id = "";
          this.edit1 = {
            tname: "",
            tsku: "",
            tmodel: "",
            ccur: "",
            ccategory: 0,
            cmanufacture: "",
            tdesc: "",
            tshortdesc: "",
            tprice: 0,
          };
          this.isEditFormActive = false;
        })
        .catch((err) => {
          f7.dialog.close();
          f7.dialog.alert(err.response.data.error, "Error!");
        });
    },
  },
  mounted() {
    this.getListProduct();
    if (!this.categoryList.length) this.loadCategory();
  },
};
</script>
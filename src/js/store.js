
import { createStore } from 'framework7/lite';
import {
  getBaseUrl, setBaseUrl, removeBaseUrl, setCompany, getCompany, removeCompany,
  setToken, getToken, removeToken, getDataUser, setDataUser, removeDataUser, getBag, addToBag, removeBag, getDarkMode,
  setDarkMode, removeDarkMode
} from '@/js/localstorage-helper'

const store = createStore({
  state: {
    isLoggedIn: !!(getToken()),
    bag: getBag() || [],
  },
  getters: {
    bag({ state }) {
      return state.bag;
    },
    isLogin({ state }) {
      return state.isLoggedIn;
    }
  },
  actions: {
    // addProduct({ state }, product) {
    //   state.products = [...state.products, product];
    // },
    addtobag({ state }, item) {

      // let index = state.bag.findIndex(el => el.sku === item.sku);
      // if (index >= 0) {
      //   state.bag[index].qty = item.qty
      //   state.bag[index].stock = item.stock
      //   state.bag[index].totalPrice = state.bag[index].price * item.qty
      // } else {
      state.bag = [...state.bag, item];
      // }
      // let data = [{ "id":"770","sku": "CMH08-GLD", "name": "roller type r (roda 4 s80)", "currency": "IDR", "min": 1, "stock": 5, "qty": 5, "price": 0, "totalPrice": 0 }, {  "id":"771","sku": "KRT07-DI", "name": "door bumper (stoper handle)", "currency": "IDR", "min": "2", "stock": 100, "qty": 13, "price": 15000, "totalPrice": 195000 }, {  "id":"236","sku": "CW5012-TW", "name": "TULANG SUDUT 135", "currency": "", "min": 1, "stock": 18, "qty": 9, "price": 0, "totalPrice": 0 }]
      addToBag(JSON.stringify(state.bag))

    },
    login({ state }, token) {
      state.isLoggedIn = true
      setToken(token)
    },
    logout({ state }) {
      state.isLoggedIn = false
      removeToken()
    },
  },
})
export default store;

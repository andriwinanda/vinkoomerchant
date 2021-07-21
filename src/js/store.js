
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

      let index = state.bag.findIndex(el => el.sku === item.sku);
      if (index >= 0) {
        state.bag[index].qty = [...state.bag, item.qty] 
        state.bag[index].stock = [...state.bag, item.stock] 
        // state.bag[index].totalPrice = [...state.bag, state.bag[index].price * item.qty]
      } else {
      state.bag = [...state.bag, item];
      }
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

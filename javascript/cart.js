import productInfoModal from "./components/productInfoModal.js";

const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "steven1220";

// 加入全部規則
Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== "default") {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

// 加入中文語系
VeeValidateI18n.loadLocaleFromURL(
  "https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json",
);

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize("zh_TW"),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const app = Vue.createApp({
  components: {
    productInfoModal,
  },

  data() {
    return {
      cartData: {
        carts: [],
      },
      products: [],
      product: {},
      productId: "",
      loadingState: "",
      isLoading: false,
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
    };
  },

  methods: {
    getProducts() {
      this.isLoading = true;
      axios
        .get(`${apiUrl}/api/${apiPath}/products/all`)
        .then((res) => {
          // console.log(res);
          this.products = res.data.products;
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 取得單一產品資訊
    openProductInfo(id) {
      this.productId = id;
      axios
        .get(`${apiUrl}/api/${apiPath}/product/${id}`)
        .then((res) => {
          console.log(res);
          this.product = res.data.product;
          this.$refs.productInfoRef.openModal();
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 取得購物車列表
    getCartList() {
      axios
        .get(`${apiUrl}/api/${apiPath}/cart`)
        .then((res) => {
          console.log(res);
          this.cartData = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //加入購物車， quantity = 1 預設數量 1
    addToCart(id, quantity = 1) {
      const data = {
        product_id: id,
        qty: quantity,
      };
      this.loadingState = id;
      axios
        .post(`${apiUrl}/api/${apiPath}/cart`, { data })
        .then((res) => {
          console.log(res);
          // 再取得購物車列表
          this.getCartList();
          // 把 modal 關閉
          this.$refs.productInfoRef.closeModal();
          // 清空讀取狀態
          this.loadingState = "";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 刪除特定購物車產品
    removeCartItem(id) {
      this.loadingState = id;
      axios
        .delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
        .then((res) => {
          console.log(res);
          // 再取得購物車列表
          this.getCartList();
          this.loadingState = "";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //清空全部購物車產品
    deleteAllCartItem() {
      this.isLoading = true;
      axios
        .delete(`${apiUrl}/api/${apiPath}/carts`)
        .then((res) => {
          console.log(res);
          // 再取得購物車列表
          this.getCartList();
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //變更購物車數量
    updateCartNumber(item) {
      // 判斷是否為 0 或是負數
      if (item.qty == 0 || item.qty < 0) {
        alert("數量至少為1個");
        this.getCartList();
        return;
      }
      const data = {
        product_id: item.id,
        qty: item.qty,
      };
      this.loadingState = item.id;
      axios
        .put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, { data })
        .then((res) => {
          console.log(res);
          // 再取得購物車列表
          this.getCartList();
          // 清空讀取狀態
          this.loadingState = "";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //送出訂單
    sendOrder() {
      const order = this.form;
      // console.log(order);
      // 若沒有輸入內容就點擊送出，就觸發表單驗證
      this.$refs.form.validate().then((valid) => {
        if (!valid) {
          return;
        }
      });
      axios
        .post(`${apiUrl}/api/${apiPath}/order`, { data: order })
        .then((res) => {
          console.log(res);
          alert(res.data.message);
          this.$refs.form.resetForm();
          this.form.message = "";
          // 再取得購物車列表
          this.getCartList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  mounted() {
    this.getProducts();
    this.getCartList();
  },
});

//全域註冊驗證功能
app.component("VForm", VeeValidate.Form);
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);
// console.log(VueLoading);
app.component("loading", VueLoading.Component);
app.mount("#app");

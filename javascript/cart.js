import productInfoModal from './components/productInfoModal.js'

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'steven1220';

// 加入全部規則
Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

// 加入中文語系
VeeValidateI18n.loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

// Activate the locale
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
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
            productId: '',
            loadingState: '',
            isLoading: false,
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            },
        }
    },

    methods: {
        getProducts() {
            this.isLoading = true;
            axios.get(`${apiUrl}/api/${apiPath}/products/all`)
                .then(res => {
                    // console.log(res);
                    this.products = res.data.products;
                    this.isLoading = false
                })
                .catch(err => {
                    console.log(err);
                })
        },
        openProductInfo(id) {
            this.productId = id;
            this.$refs.productInfoRef.openModal();
        },
        // 取得購物車列表
        getCartList() {
            axios.get(`${apiUrl}/api/${apiPath}/cart`)
                .then(res => {
                    console.log(res);
                    this.cartData = res.data.data;
                })
                .catch(err => {
                    console.log(err);
                })
        },
        //加入購物車， quantity = 1 預設數量 1
        addToCart(id, quantity = 1) {
            const data = {
                product_id: id,
                qty: quantity
            }
            this.loadingState = id;
            axios.post(`${apiUrl}/api/${apiPath}/cart`, { data })
                .then(res => {
                    console.log(res);
                    // 再取得購物車列表
                    this.getCartList();
                    // 把 modal 關閉
                    this.$refs.productInfoRef.closeModal();
                    // 清空讀取狀態
                    this.loadingState = ''
                })
                .catch(err => {
                    console.log(err);
                })
        },
        // 刪除特定購物車產品
        removeCartItem(id) {
            this.loadingState = id;
            axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
                .then(res => {
                    console.log(res);
                    // 再取得購物車列表
                    this.getCartList();
                    this.loadingState = '';
                })
                .catch(err => {
                    console.log(err);
                })
        },
        //清空全部購物車產品
        deleteAllCartItem() {
            axios.delete(`${apiUrl}/api/${apiPath}/carts`)
                .then(res => {
                    console.log(res);
                    // 再取得購物車列表
                    this.getCartList();
                    alert('成功清除購物車所有產品');
                })
                .catch(err => {
                    console.log(err);
                })
        },
        //變更購物車數量
        updateCartNumber(item) {
            const data = {
                product_id: item.id,
                qty: item.qty
            }
            this.loadingState = item.id;
            axios.put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, { data })
                .then(res => {
                    console.log(res);
                    // 再取得購物車列表
                    this.getCartList();
                    // 清空讀取狀態
                    this.loadingState = ''
                })
                .catch(err => {
                    console.log(err);
                })
        },
        //送出訂單
        sendOrder() {

            const order = this.form
            console.log(order);
            axios.post(`${apiUrl}/api/${apiPath}/order`, { data: order })
                .then(res => {
                    console.log(res);
                    alert(res.data.message);
                    this.$refs.form.resetForm();
                    // 再取得購物車列表
                    this.getCartList();
                })
                .catch(err => {
                    console.log(err);
                })
        }
    },

    mounted() {
        this.getProducts();
        this.getCartList();
    },
});

//全域註冊驗證功能
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
// console.log(VueLoading);
app.component('loading', VueLoading.Component)
app.mount('#app');
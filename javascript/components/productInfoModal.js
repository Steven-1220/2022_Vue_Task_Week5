export default {

    props: ['id'],
    template: '#userProductModal',

    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'steven1220',
            modal: {},
            product: {},
            quantity: 1,
        }
    },
    // 監聽 id 的變動，有變動則觸發
    watch: {
        id() {
            this.getProductInfo();
        }
    },
    methods: {
        openModal() {
            this.modal.show();
        },
        closeModal() {
            this.modal.hide();
        },
        // 取得特定產品資訊
        getProductInfo() {
            axios.get(`${this.apiUrl}/api/${this.apiPath}/product/${this.id}`)
                .then(res => {
                    console.log(res);
                    this.product = res.data.product;
                })
                .catch(err => {
                    console.log(err);
                })
        },
        // 加入購物車
        addToCart() {
            this.$emit('add-cart', this.product.id, this.quantity);
        }
    },

    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.modalRef, {
            keyboard: false
        })
    },

}
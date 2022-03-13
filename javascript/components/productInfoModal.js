export default {
  props: {
    productM: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  template: "#userProductModal",

  // 使用 watch 將 productM 的值傳給 product
  watch: {
    productM(value) {
      this.product = value;
    },
  },

  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "steven1220",
      modal: {},
      product: {},
      quantity: 1,
    };
  },

  methods: {
    openModal() {
      this.modal.show();
    },
    closeModal() {
      this.modal.hide();
    },

    // 加入購物車
    addToCart() {
      this.$emit("add-cart", this.product.id, this.quantity);
      // 加入購物車後重置數量
      setTimeout(() => {
        this.quantity = 1;
      }, 1000);
    },
  },

  mounted() {
    // 將 modal 與 ref 綁定
    this.modal = new bootstrap.Modal(this.$refs.modalRef, {
      keyboard: false,
    });
  },
};

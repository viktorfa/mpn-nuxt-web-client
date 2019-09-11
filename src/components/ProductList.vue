<template>
  <div>
    <div class="flex flex-wrap justify-around">
      <template v-for="product in _products">
        <ProductListItem
          :key="product.id"
          :showDealerLogo="showDealerLogo"
          :showSubtitle="showSubtitle"
          v-bind="product"
        />
      </template>
    </div>
    <v-btn
      v-if="isMore"
      v-enter-viewport="useInfiniteScroll ? showMore : null"
      color="blue darken-4"
      block
      text
      @click="showMore"
    >mer</v-btn>
    <br v-else />
  </div>
</template>

<script>
import take from "lodash/take";
import ProductListItem from "./ProductListItem";

export default {
  name: "ProductList",
  components: { ProductListItem },
  props: {
    products: { type: Array, default: () => [] },
    showSubtitle: { type: Boolean, default: true },
    showDealerLogo: { type: Boolean, default: true },
    pageSize: { type: Number, default: 10 },
    useInfiniteScroll: { type: Boolean, default: true },
  },
  data() {
    return {
      pageNumber: 1,
    };
  },
  computed: {
    limit() {
      return this.pageSize * this.pageNumber;
    },
    isMore() {
      return this.products.length > this.limit;
    },
    _products() {
      return take(this.products, this.limit);
    },
  },
  methods: {
    showMore() {
      this.pageNumber += 1;
    },
  },
};
</script>

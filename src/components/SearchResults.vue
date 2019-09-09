<template>
  <div>
    <SortAndFilterMenu />
    <div v-if="allProducts.length > 0" class="offer-search-results">
      <ProductListBanner class="bg-amp-purple text-white">{{ allProducts.length }} tilbud</ProductListBanner>
      <ProductList :products="allProducts" :showSubtitle="false" />
    </div>
  </div>
</template>

<script>
import sortBy from "lodash/sortBy";
import ProductList from "./ProductList";
import ProductListBanner from "../components/ProductListBanner.vue";
import SortAndFilterMenu from "../components/SortAndFilterMenu.vue";
import { getStandardProduct } from "~/util/products/convert";

const sortResults = (results) => sortBy(results, (result) => -result.score);

export default {
  name: "SearchResults",
  components: {
    ProductList,
    ProductListBanner,
    SortAndFilterMenu,
  },
  props: {
    results: Array,
  },
  computed: {
    allProducts: function() {
      return sortResults(this.results.map(getStandardProduct)) || [];
    },
  },
};
</script>

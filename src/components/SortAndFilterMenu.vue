<template>
  <div>
    Sort And Filter Menu
    <div v-for="(config, k) of filterOptions" :key="config.key" class="flex flex-wrap">
      <div v-if="config.type === 'enum'">
        <v-btn
          v-for="item of config.items"
          :key="item.key"
          small
          :color="options.filter[`${config.key}.${item.key}`] === false ? '' : 'orange'"
          @click="(event) => handleClickFilterButton({event, config, item})"
        >{{item.text}}</v-btn>
      </div>
      <div v-if="config.type === 'include'">
        <v-btn
          v-for="item of config.items"
          :key="item.key"
          small
          :color="options.filter[`${config.key}.${item.key}`] === true ? 'orange' : ''"
          @click="(event) => handleClickFilterButton({event, config, item})"
        >{{item.text}}</v-btn>
      </div>
      <div v-else-if="config.type === 'number'">
        <div>
          Min
          <input
            type="number"
            @change="(event) => handleClickFilterButton({event, config, boundary: 'min'})"
          />
        </div>
        <div>
          Max
          <input
            type="number"
            @change="(event) => handleClickFilterButton({event, config, boundary: 'max'})"
          />
        </div>
      </div>
      <div v-else-if="config.type === 'boolean'">
        <div>
          {{config.text}}
          <input
            type="checkbox"
            @change="(event) => handleClickFilterButton({event, config})"
          />
        </div>
      </div>
    </div>
    <div class="flex flex-wrap">
      <v-btn
        v-for="(config, k) of sortOptions"
        :key="config.key"
        small
        :color="options.sort.key === config.key ? 'orange' : ''"
        @click="(event) => handleClickSortButton({event, config})"
      >{{config.text}}</v-btn>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import { getFilterFunctions } from "~/util/products/filter";
import { getSortFunction } from "~/util/products/sort";

const defaultFilterOptions = {
  dealers: {
    key: "dealers",
    type: "enum",
    path: ["provenance"],
    items: [
      { key: "holdbart.no", text: "holdbart" },
      { key: "gottebiten.se", text: "gottebiten" },
      { key: "swecandy.se", text: "swecandy" },
      { key: "yoolando.com", text: "yoolando" },
    ],
  },
  price: {
    key: "price",
    type: "number",
    path: ["pricing", "price"],
  },
  promoted: {
    key: "promoted",
    text: "Is Promoted",
    type: "boolean",
    path: ["is_promoted"],
  },
  category: {
    key: "category",
    type: "include",
    path: ["categories"],
    items: [
      { key: "snacks", text: "Snacks", value: "Snacks" },
      { key: "godteri", text: "Godteri", value: "Godteri" },
    ],
  },
};

const defaultSortOptions = {
  price: {
    key: "price",
    text: "Pris",
    path: ["pricing", "price"],
    toggleable: true,
    defaultDesc: false,
  },
  size: {
    key: "size",
    text: "Størrelse",
    path: ["quantity", "size"],
    toggleable: true,
  },
  value: {
    key: "value",
    text: "Verdi",
    calculation: {
      op1: ["pricing", "price"],
      operand: "/",
      op2: ["quantity", "size"],
    },
    defaultDesc: false,
  },
  score: { key: "score", text: "Relevans", path: ["score"] },
};

export default {
  name: "SortAndFilterMenu",
  data() {
    return {
      options: { sort: { key: "score", desc: true }, filter: {} },
      filterOptions: defaultFilterOptions,
      sortOptions: defaultSortOptions,
    };
  },
  computed: {
    ...mapState(["searchResults"]),
  },
  methods: {
    handleClickSortButton({ event, config }) {
      let desc = config.defaultDesc !== false;
      if (config.toggleable) {
        if (this.options.sort.key === config.key) {
          desc = !this.options.sort.desc;
        }
      }
      const newSelectedSort = { key: config.key, desc };
      this.options = { ...this.options, sort: newSelectedSort };
      const filterFunctions = getFilterFunctions({
        selectedOptions: this.options.filter,
        filterOptions: this.filterOptions,
      });
      const sortFunction = getSortFunction({
        selectedOption: this.options.sort,
        sortOptions: this.sortOptions,
      });
      this.$store.dispatch("FILTER", {
        filters: filterFunctions,
        sort: sortFunction,
      });
    },
    handleClickFilterButton({ event, config, item, boundary }) {
      if (config.type === "enum") {
        this.options.filter = {
          ...this.options.filter,
          [`${config.key}.${item.key}`]:
            this.options.filter[`${config.key}.${item.key}`] === false,
        };
      } else if (config.type === "include") {
        this.options.filter = {
          ...this.options.filter,
          [`${config.key}.${item.key}`]:
            this.options.filter[`${config.key}.${item.key}`] !== true,
        };
      } else if (config.type === "number") {
        this.options.filter = {
          ...this.options.filter,
          [`${config.key}.${boundary}`]: event.target.value,
        };
      } else if (config.type === "boolean") {
        this.options.filter = {
          ...this.options.filter,
          [`${config.key}`]: event.target.checked,
        };
      }
      const filterFunctions = getFilterFunctions({
        selectedOptions: this.options.filter,
        filterOptions: this.filterOptions,
      });
      const sortFunction = getSortFunction({
        selectedOption: this.options.sort,
        sortOptions: this.sortOptions,
      });
      this.$store.dispatch("FILTER", {
        filters: filterFunctions,
        sort: sortFunction,
      });
    },
  },
};
</script>

<style>
</style>

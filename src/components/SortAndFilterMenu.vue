<template>
  <div>
    Sort And Filter Menu
    <div v-for="(config, k) of filterOptions" :key="config.key" class="flex flex-wrap">
      <div v-if="config.type === 'enum'">
        <v-btn
          v-for="item of config.items"
          :key="item.key"
          small
          :color="options[`${k}.${item.key}`] === false ? '' : 'orange'"
          @click="(event) => handleClickFilterButton({event, config, item})"
        >{{item.text}}</v-btn>
      </div>
      <div v-if="config.type === 'include'">
        <v-btn
          v-for="item of config.items"
          :key="item.key"
          small
          :color="options[`${k}.${item.key}`] === true ? 'orange' : ''"
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
  </div>
</template>

<script>
import { mapState } from "vuex";

import { getFilterFunctions } from "~/util/products/filter";

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

export default {
  name: "SortAndFilterMenu",
  data() {
    return {
      options: {},
      filterOptions: defaultFilterOptions,
    };
  },
  computed: {
    ...mapState(["searchResults"]),
  },
  methods: {
    handleClickFilterButton({ event, config, item, boundary }) {
      if (config.type === "enum") {
        this.options = {
          ...this.options,
          [`${config.key}.${item.key}`]:
            this.options[`${config.key}.${item.key}`] === false,
        };
      } else if (config.type === "include") {
        this.options = {
          ...this.options,
          [`${config.key}.${item.key}`]:
            this.options[`${config.key}.${item.key}`] !== true,
        };
      } else if (config.type === "number") {
        this.options = {
          ...this.options,
          [`${config.key}.${boundary}`]: event.target.value,
        };
      } else if (config.type === "boolean") {
        this.options = {
          ...this.options,
          [`${config.key}`]: event.target.checked,
        };
      }
      const filterFunctions = getFilterFunctions({
        selectedOptions: this.options,
        filterOptions: this.filterOptions,
      });
      this.$store.dispatch("FILTER", {
        filter: {
          filters: filterFunctions,
        },
      });
    },
  },
};
</script>

<style>
</style>

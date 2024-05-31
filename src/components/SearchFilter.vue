<template>
  <input type="text" v-model="searchQuery" @input="handleInput" placeholder="Search operators..." />
</template>

<script>
export default {
  data() {
    return {
      searchQuery: ''
    }
  },
  methods: {
    handleInput() {
      this.$emit('search-query-updated', this.searchQuery)
    }
  }
}
</script>

<style scoped>
/* Styles for SearchFilter component */
</style>

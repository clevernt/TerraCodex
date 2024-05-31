<template>
  <div class="profession-filter-item" :class="{ active: isActive }" @click="toggleProfessionFilter">
    {{ displayName }}
  </div>
</template>

<script>
export default {
  props: {
    displayName: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    toggleProfessionFilter() {
      this.$emit('profession-filter-toggled')
    }
  }
}
</script>

<style scoped>
.filter {
  margin-bottom: 20px;
}

.profession-filter-item {
  padding: 5px 10px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  background-color: #e0e0e0;
}

.profession-filter-item.active {
  background-color: #2f78cc;
  color: #fff;
}
</style>

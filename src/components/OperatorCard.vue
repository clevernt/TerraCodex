<template>
  <router-link :to="{ name: 'operator-details', params: { id: operator.id } }" class="card-link">
    <div class="avatar">
      <img :src="getOperatorImageUrl(operator.id)" :alt="operator.name" class="operator-avatar" />
    </div>
    <div class="operator-name">{{ operator.name }}</div>
  </router-link>
</template>

<script>
import { BASE_AVATAR_URL } from '../config'
export default {
  props: {
    operator: {
      type: Object,
      required: true
    }
  },
  methods: {
    getOperatorImageUrl(id) {
      return `${BASE_AVATAR_URL}${id}.png`
    }
  }
}
</script>

<style scoped>
.avatar {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  flex-grow: 1;
  flex-basis: calc(33.33% - 20px);
  margin-bottom: 20px;
  max-width: 120px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.operator-avatar {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.operator-name {
  max-width: 120px;
  margin-top: -25px;
  text-align: center;
  padding: 10px 0;
  font-size: 18px;
  text-wrap: wrap;
}
</style>

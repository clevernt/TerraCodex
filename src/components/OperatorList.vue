<template>
  <div class="operator-list container">
    <div class="filter">
      <input
        type="text"
        v-model="searchQuery"
        @input="handleSearchDebounce"
        placeholder="Search operators..."
      />

      <div class="profession-filter">
        <div
          v-for="(displayName, professionCode) in professionDisplayNames"
          :key="professionCode"
          class="profession-filter-item"
          :class="{ active: isProfessionSelected(professionCode) }"
          @click="toggleProfessionFilter(professionCode)"
        >
          {{ displayName }}
        </div>
      </div>
    </div>
    <div v-if="loading" class="spinner-border m-5" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-else class="grid">
      <div class="operator-card" v-for="operator in filteredOperators" :key="operator.id">
        <router-link
          :to="{ name: 'operator-details', params: { id: operator.id } }"
          class="card-link"
        >
          <div class="avatar">
            <img
              :src="getOperatorImageUrl(operator.id)"
              :alt="operator.name"
              class="operator-avatar"
            />
          </div>
          <div class="operator-name">{{ operator.name }}</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'

import { fetchOperatorsData } from '../services/fetchOperators'
import { BASE_AVATAR_URL } from '../config'

export default {
  data() {
    return {
      operators: [],
      loading: true,
      error: null,
      selectedProfessions: [],
      searchQuery: ''
    }
  },
  async mounted() {
    try {
      const data = await fetchOperatorsData()
      this.operators = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
        rarity: data[key].rarity.slice(-1)
      }))

      this.sortOperatorsByRarity()
    } catch (e) {
      this.error = 'Failed to load operators'
    } finally {
      this.loading = false
    }
  },
  computed: {
    professionDisplayNames() {
      return {
        SNIPER: 'Sniper',
        PIONEER: 'Vanguard',
        WARRIOR: 'Guard',
        CASTER: 'Caster',
        SUPPORT: 'Supporter',
        MEDIC: 'Medic',
        TANK: 'Defender'
      }
    },
    filteredOperators() {
      let filtered = this.operators.filter((operator) => operator.id.startsWith('char'))

      if (this.selectedProfessions.length > 0) {
        filtered = filtered.filter((operator) =>
          this.selectedProfessions.includes(operator.profession)
        )
      }

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter((operator) => operator.name.toLowerCase().includes(query))
      }

      return filtered
    }
  },
  methods: {
    getOperatorImageUrl(id) {
      return `${BASE_AVATAR_URL}${id}.png`
    },
    sortOperatorsByRarity() {
      this.operators.sort((a, b) => b.rarity - a.rarity)
    },
    handleSearchDebounce: debounce(function () {}, 300),
    toggleProfessionFilter(professionCode) {
      if (this.selectedProfessions.includes(professionCode)) {
        this.selectedProfessions = this.selectedProfessions.filter(
          (code) => code !== professionCode
        )
      } else {
        this.selectedProfessions.push(professionCode)
      }
    },
    isProfessionSelected(professionCode) {
      return this.selectedProfessions.includes(professionCode)
    }
  }
}
</script>

<style scoped>
.container {
  margin-left: 200px;
}

.operator-list {
  margin-top: 20px;
}

.filter {
  margin-bottom: 20px;
}

.loading,
.error {
  margin-top: 20px;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.operator-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  flex-grow: 1;
  flex-basis: calc(33.33% - 20px);
  margin-bottom: 20px;
  max-width: 120px;
}

.card-link {
  text-decoration: none;
  color: inherit;
}

.avatar {
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
  text-align: center;
  padding: 10px 0;
  font-size: 14px;
}

.profession-filter {
  display: flex;
  flex-wrap: wrap;
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

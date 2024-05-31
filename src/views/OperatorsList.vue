<template>
  <div class="operator-list container">
    <SearchFilter @search-query-updated="updateSearchQuery" />
    <div class="profession-filter">
      <ProfessionFilter
        v-for="(displayName, professionCode) in professionDisplayNames"
        :key="professionCode"
        :displayName="displayName"
        :isActive="isProfessionSelected(professionCode)"
        @profession-filter-toggled="toggleProfessionFilter(professionCode)"
      />
    </div>
    <div class="grid">
      <OperatorCard v-for="operator in filteredOperators" :key="operator.id" :operator="operator" />
    </div>
  </div>
</template>

<script>
import OperatorCard from '@/components/OperatorCard.vue'
import SearchFilter from '@/components/SearchFilter.vue'
import ProfessionFilter from '@/components/ProfessionFilter.vue'
import { fetchOperatorsData } from '@/services/fetchOperators'

export default {
  components: {
    OperatorCard,
    SearchFilter,
    ProfessionFilter
  },
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
    updateSearchQuery(query) {
      this.searchQuery = query
    },
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
    },
    sortOperatorsByRarity() {
      this.operators.sort((a, b) => b.rarity - a.rarity)
    }
  }
}
</script>

<style scoped>
.profession-filter {
  display: flex;
  flex-wrap: wrap;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.card-link {
  text-decoration: none;
  color: inherit;
}

.container {
  margin-top: 20px;
}
</style>

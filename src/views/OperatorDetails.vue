User
<template>
  <div class="operator-details" :style="{ backgroundImage: `url(${backgroundImageUrl})` }">
    <div class="background-overlay"></div>
    <div v-if="loading" class="spinner-border m-5" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="details-container">
      <div class="left-panel">
        <h1>{{ operator.name }}</h1>
        <img :src="operatorImageUrl" :alt="operator.name" class="operator-image" />
        <p class="profession">{{ getCustomProfessionName(operator.profession) }}</p>
      </div>
      <div class="right-panel">
        <div class="traits-box">
          <h2 class="section-title">Trait</h2>
          <p class="description">{{ operator.description.replace(/<[^>]+>/g, '') }}</p>
        </div>
        <div v-if="operator.talents && operator.talents.length" class="talents-container">
          <div class="talent-navbar">
            <button
              v-for="(talent, index) in operator.talents"
              :key="index"
              @click="selectTalent(index)"
              :class="{ active: selectedTalentIndex === index }"
              class="talent-button"
            >
              {{ talent.candidates[0].name }}
            </button>
          </div>
          <div class="talent-details">
            <div
              v-for="(talent, index) in operator.talents"
              :key="index"
              v-show="selectedTalentIndex === index"
              class="talent-box border"
            >
              <h2 class="section-title">{{ talent.candidates[0].name }}</h2>
              <p class="description">
                {{ talent.candidates[0].description.replace(/<[^>]+>/g, '') }}
              </p>
            </div>
          </div>
        </div>
        <div v-if="operator.skills && operator.skills.length" class="skills-container">
          <div class="skill-level-slider">
            <span
              v-for="(label, index) in skillLevelLabels"
              :key="index"
              class="level-rectangle"
              @click="selectLevel(index + 1)"
              :class="{ active: selectedLevelIndex === index + 1 }"
              >{{ label }}</span
            >
          </div>
          <div class="skills-navbar">
            <button
              v-for="(skill, index) in operator.skills"
              :key="index"
              @click="selectSkill(index)"
              :class="{ active: selectedSkillIndex === index }"
              class="skill-button"
            >
              {{ getSkillName(skill.skillId) }}
            </button>
          </div>
          <div class="skill-details">
            <div
              v-for="(skill, index) in operator.skills"
              :key="index"
              v-show="selectedSkillIndex === index"
              class="skill-box border"
            >
              <div class="skill-content">
                <div class="skill-header">
                  <img
                    :src="getSkillIcon(skill.skillId)"
                    :alt="getSkillName(skill.skillId)"
                    class="skill-icon"
                  />
                  <div>
                    <h2 class="section-title">{{ getSkillName(skill.skillId) }}</h2>
                    <p class="description">
                      {{ getSkillDescription(skill.skillId, selectedLevelIndex) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchOperatorsData } from '../services/fetchOperators'
import { fetchSkillsData } from '../services/fetchSkills'
import { insertBlackboard } from '@/services/insertBlackboard'
import { BASE_PORTRAIT_URL, BASE_SKILL_ICON_URL } from '../config'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      operator: null,
      skills: null,
      loading: true,
      error: null,
      selectedLevelIndex: 1,
      selectedTalentIndex: 0,
      selectedSkillIndex: 0,
      backgroundImageUrl: '',
      skillLevelLabels: ['SL1', 'SL2', 'SL3', 'SL4', 'SL5', 'SL6', 'SL7', 'M1', 'M2', 'M3']
    }
  },
  async mounted() {
    try {
      const [operatorData, skillsData] = await Promise.all([
        fetchOperatorsData(),
        fetchSkillsData()
      ])
      this.operator = operatorData[this.id]
      this.skills = skillsData
      this.backgroundImageUrl = `https://raw.githubusercontent.com/fexli/ArknightsResource/main/charpack/${this.id}_2.png`
    } catch (e) {
      this.error = 'Failed to load operator details'
    } finally {
      this.loading = false
    }
  },
  computed: {
    operatorImageUrl() {
      return `${BASE_PORTRAIT_URL}${this.id}_1.png`
    },
    getCustomProfessionName() {
      return function (professionCode) {
        const professionDisplayNames = {
          SNIPER: 'Sniper',
          PIONEER: 'Vanguard',
          WARRIOR: 'Guard',
          CASTER: 'Caster',
          SUPPORT: 'Supporter',
          MEDIC: 'Medic',
          TANK: 'Defender',
          SPECIAL: 'Specialist'
        }
        return professionDisplayNames[professionCode] || professionCode
      }
    },
    selectedLevelLabel() {
      return this.selectedLevelIndex <= 7
        ? `Skill Level ${this.selectedLevelIndex}`
        : `Mastery ${this.selectedLevelIndex - 7}`
    }
  },
  methods: {
    selectTalent(index) {
      this.selectedTalentIndex = index
    },
    selectLevel(level) {
      this.selectedLevelIndex = level
    },
    selectSkill(index) {
      this.selectedSkillIndex = index
    },
    getSkillName(skillId) {
      return this.skills[skillId]?.levels[0]?.name || 'Unknown Skill'
    },
    getSkillDescription(skillId, levelIndex) {
      const skill = this.skills[skillId]?.levels[levelIndex - 1]
      if (!skill) return 'N/A'

      let description = skill.description
      description = insertBlackboard(description, skill.blackboard)

      return description
    },
    getSkillIcon(skillId) {
      return `${BASE_SKILL_ICON_URL}skill_icon_${skillId}.png`
    }
  }
}
</script>

<style scoped>
/* Fonts */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap');
/* Global Styles */
body {
  font-family: 'Montserrat', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #111;
}

/* Operator Details Section */
.operator-details {
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  padding: 40px;
  position: relative;
  background-size: cover;
  background-position: center center;
  min-height: 100vh;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1;
}

.details-container {
  display: flex;
  gap: 40px;
  max-width: 1200px;
  width: 100%;
  position: relative;
  z-index: 2;
  background: rgba(32, 32, 32, 0.95);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  animation: fadeIn 1s ease;
}

/* Left Panel */
.left-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 300px;
}

/* Right Panel */
.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Typography */
h1 {
  font-size: 48px;
  margin-bottom: 20px;
  color: #fff;
  animation: fadeIn 1s ease 0.5s;
}

/* Operator Image */
.operator-image {
  width: 100%;
  max-width: 200px;
  border: 5px solid #000000;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease;
}

.operator-image:hover {
  transform: scale(1.05);
}

/* Profession */
.profession {
  color: #ffffff;
  font-size: 48px;
  font-weight: 500;
  margin-top: 10px;
}

/* Traits Box */
.traits-box {
  background: rgba(20, 20, 20, 0.95);
  color: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

/* Talents Container */
.talents-container {
  margin-top: 20px;
}

/* Talent Navbar */
.talent-navbar {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  margin-bottom: -28px;
}

.talent-button {
  padding: 10px 15px;
  color: #000000;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.talent-button.active {
  background-color: #007bff;
  color: #fff;
}

.talent-button:not(.active) {
  background-color: #2b2b2b;
  color: #fff;
}

/* Talent Details */
.talent-details {
  margin-top: 20px;
}

/* Talent Box */
.talent-box {
  background: #202020;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.talent-box.active {
  border: 2px solid #007bff;
}

.talent-box .section-title {
  color: #d4d4d4;
  font-size: 24px;
  margin-bottom: 10px;
}

.talent-box .description {
  color: #d1d1d1;
  font-size: 18px;
  line-height: 1.6;
}

/* Skills Container */
.skills-container {
  margin-top: 20px;
}

/* Skills Navbar */
.skills-navbar {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  margin-bottom: -28px;
}

.skill-button {
  padding: 10px 15px;
  color: #000000;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.skill-button.active {
  background-color: #007bff;
  color: #fff;
}

.skill-button:not(.active) {
  background-color: #2b2b2b;
  color: #fff;
}

/* Skill Details */
.skill-details {
  margin-top: 20px;
}

/* Skill Box */
.skill-box {
  background: #3b3b3b;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.skill-box.active {
  border: 2px solid #007bff;
}

.skill-box .section-title {
  color: #d1d1d1;
  font-size: 24px;
  margin-bottom: 10px;
}

.skill-box .description {
  color: #c9c9c9;
  font-size: 18px;
  line-height: 1.6;
}

.skill-content .skill-header {
  display: flex;
  align-items: center;
}

.skill-icon {
  height: auto;
  max-height: 50px; /* Adjust the max-height as needed */
  margin-right: 20px;
}

/* Card */
.card {
  background: rgba(255, 255, 255, 0.95);
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Error Message */
.error {
  color: #ff5555;
  text-align: center;
  font-size: 18px;
}

/* Skill Level Slider */
.skill-level-slider {
  display: flex;
  align-items: center;
  justify-content: left;
  border: none;
}

.level-rectangle {
  width: 40px;
  height: 40px;
  background-color: #383838;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 5px;
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.level-rectangle.active,
.level-rectangle:hover {
  background-color: #007bff;
}
</style>

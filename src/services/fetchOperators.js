import axios from 'axios'

const API_URL =
  'https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData_YoStar/main/en_US/gamedata/excel/character_table.json'

export async function fetchOperatorsData() {
  try {
    const response = await axios.get(API_URL)
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch operators data')
  }
}

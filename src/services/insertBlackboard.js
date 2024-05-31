export function insertBlackboard(text, blackboard) {
  function removeStyleTags(text) {
    return text ? text.replace(/<[^>]+>/g, '') : ''
  }

  function formatVariable(chunk, blackboard) {
    const tag = chunk.split(':')[0].toLowerCase()
    const isNegative = tag.startsWith('-')
    const key = isNegative ? tag.slice(1) : tag
    const variable = blackboard.find((entry) => entry.key === key.toLowerCase())

    if (!variable) return null

    let value = variable.value
    if (isNegative) value *= -1

    const lastChar = chunk.charAt(chunk.length - 1)
    if (lastChar === '%' && !isNaN(value)) {
      value = `${Math.round(value * 100)}%`
    }

    return value
  }

  const textWithoutTags = removeStyleTags(text.trim())
  if (!textWithoutTags) return null

  const chunks = textWithoutTags.split(/{|}/)
  const processedText = chunks
    .map((chunk) => {
      if (chunk.toLowerCase().endsWith(':')) return chunk
      const formattedValue = formatVariable(chunk, blackboard)
      return formattedValue !== null ? formattedValue : chunk
    })
    .join('')

  return processedText
}

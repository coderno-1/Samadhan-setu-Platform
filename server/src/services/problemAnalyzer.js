const categoryKeywords = {
  Healthcare: [
    "hospital",
    "medicine",
    "medical",
    "doctor",
    "health",
    "ambulance",
    "treatment",
  ],

  Sanitation: [
    "garbage",
    "waste",
    "drain",
    "drainage",
    "toilet",
    "dirty",
    "clean",
    "waterlogging",
  ],

  Roads: [
    "road",
    "pothole",
    "traffic",
    "highway",
    "street",
    "footpath",
  ],

  Infrastructure: [
    "street light",
    "light",
    "footpath",
    "building",
    "infrastructure",
    "damaged",
    "broken",
  ],

  "Public Safety": [
    "danger",
    "unsafe",
    "safety",
    "stray dog",
    "accident",
    "crime",
  ],

  "Water & Sanitation": [
    "drinking water",
    "water supply",
    "water",
    "sewer",
    "sewage",
  ],
}

const priorityKeywords = {
  urgent: [
    "emergency",
    "urgent",
    "critical",
    "life threatening",
    "immediate",
  ],

  high: [
    "danger",
    "dangerous",
    "unsafe",
    "accident",
    "overflow",
    "health risk",
    "not working",
    "broken",
  ],

  medium: [
    "damaged",
    "problem",
    "issue",
    "poor",
    "needs improvement",
  ],
}

function normalizeText(text = "") {
  return text.toLowerCase().replace(/[^\w\s]/g, " ")
}

function findCategory(text) {
  let bestCategory = "General"
  let bestScore = 0

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    let score = 0

    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        score++
      }
    }

    if (score > bestScore) {
      bestScore = score
      bestCategory = category
    }
  }

  return {
    category: bestCategory,
    score: bestScore,
  }
}

function findPriority(text, userPriority) {
  if (userPriority) {
    return userPriority
  }

  for (const [priority, keywords] of Object.entries(priorityKeywords)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        return priority
      }
    }
  }

  return "medium"
}

function calculateConfidence(categoryScore, text) {
  if (!text.trim()) return 0

  if (categoryScore >= 3) return 0.95
  if (categoryScore === 2) return 0.85
  if (categoryScore === 1) return 0.70

  return 0.50
}

export function analyzeProblem({
  title = "",
  description = "",
  category,
  priority,
}) {
  const text = normalizeText(`${title} ${description}`)

  const categoryResult = findCategory(text)

  const detectedPriority = findPriority(text, priority)

  const confidence = calculateConfidence(
    categoryResult.score,
    text
  )

  return {
    category: categoryResult.category,
    priority: detectedPriority,
    confidence,
  }
}
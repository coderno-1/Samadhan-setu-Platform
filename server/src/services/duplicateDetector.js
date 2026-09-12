import Problem from "../models/Problem.js";

function normalizeText(text = "") {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getWords(text) {
  return new Set(
    normalizeText(text)
      .split(" ")
      .filter((word) => word.length > 2),
  );
}

function calculateSimilarity(text1, text2) {
  const words1 = getWords(text1);
  const words2 = getWords(text2);

  if (words1.size === 0 || words2.size === 0) {
    return 0;
  }

  const intersection = [...words1].filter((word) => words2.has(word));

  const union = new Set([...words1, ...words2]);

  return intersection.length / union.size;
}

export async function findDuplicateProblem({
  title,
  description,
  problemId,
  createdAt,
}) {
  const query = {
    _id: { $ne: problemId },
  };

  if (createdAt) {
    query.createdAt = { $lt: createdAt };
  }

  const existingProblems = await Problem.find(query).select(
    "_id title description createdAt",
  );

  const newText = `${title} ${description}`;

  let bestMatch = null;
  let highestSimilarity = 0;

  for (const existingProblem of existingProblems) {
    const existingText = `${existingProblem.title} ${existingProblem.description}`;

    const similarity = calculateSimilarity(newText, existingText);

    if (similarity > highestSimilarity) {
      highestSimilarity = similarity;
      bestMatch = existingProblem;
    }
  }

  // 70% or more similarity = duplicate
  if (bestMatch && highestSimilarity >= 0.7) {
    return {
      isDuplicate: true,
      duplicateOf: bestMatch._id,
      similarity: highestSimilarity,
    };
  }

  return {
    isDuplicate: false,
    duplicateOf: null,
    similarity: highestSimilarity,
  };
}

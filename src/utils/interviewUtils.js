/**
 * Utility functions for interview process
 */

/**
 * Generates interview questions based on difficulty levels
 * @returns {Array} - Array of question objects
 */
export const generateQuestions = () => {
  // In a real implementation, we would call an AI API to generate questions
  // For this example, we'll use predefined questions
  
  const questions = [
    // Easy questions (20s each)
    {
      id: 1,
      text: 'What is JSX in React?',
      difficulty: 'easy',
      timeLimit: 20,
    },
    {
      id: 2,
      text: 'Explain the difference between state and props in React.',
      difficulty: 'easy',
      timeLimit: 20,
    },
    // Medium questions (60s each)
    {
      id: 3,
      text: 'Describe the React component lifecycle methods and their purpose.',
      difficulty: 'medium',
      timeLimit: 60,
    },
    {
      id: 4,
      text: 'How would you optimize the performance of a React application?',
      difficulty: 'medium',
      timeLimit: 60,
    },
    // Hard questions (120s each)
    {
      id: 5,
      text: 'Explain how you would implement a custom hook for form validation in React.',
      difficulty: 'hard',
      timeLimit: 120,
    },
    {
      id: 6,
      text: 'Describe how you would architect a large-scale React application with Redux, including folder structure and state management strategies.',
      difficulty: 'hard',
      timeLimit: 120,
    },
  ];
  
  return questions;
};

/**
 * Evaluates candidate answers and generates a score and summary
 * @param {Array} questions - The questions asked
 * @param {Array} answers - The candidate's answers
 * @returns {Object} - Score and summary
 */
export const evaluateAnswers = (questions, answers) => {
  // In a real implementation, we would call an AI API to evaluate answers
  // For this example, we'll simulate the evaluation
  
  // Calculate a score based on answer length and complexity
  let totalScore = 0;
  const maxScore = questions.length * 10; // 10 points per question
  
  const evaluations = questions.map((question, index) => {
    const answer = answers[index] || '';
    
    // Simple scoring based on answer length and keywords
    let score = 0;
    
    // Basic length check
    if (answer.length > 50) score += 3;
    else if (answer.length > 20) score += 2;
    else if (answer.length > 0) score += 1;
    
    // Check for relevant keywords based on question difficulty
    const relevantKeywords = {
      easy: ['react', 'component', 'jsx', 'props', 'state'],
      medium: ['lifecycle', 'performance', 'optimization', 'useEffect', 'memo'],
      hard: ['architecture', 'custom', 'hook', 'redux', 'context', 'scale'],
    };
    
    const keywords = relevantKeywords[question.difficulty];
    keywords.forEach(keyword => {
      if (answer.toLowerCase().includes(keyword)) {
        score += 1;
      }
    });
    
    // Cap at 10 points
    score = Math.min(score, 10);
    totalScore += score;
    
    return {
      questionId: question.id,
      score,
      feedback: generateFeedback(score, question.difficulty),
    };
  });
  
  // Calculate percentage score
  const percentageScore = Math.round((totalScore / maxScore) * 100);
  
  // Generate summary
  const summary = generateSummary(percentageScore, evaluations);
  
  return {
    score: percentageScore,
    evaluations,
    summary,
  };
};

/**
 * Generates feedback for an individual answer
 * @param {number} score - The score for the answer
 * @param {string} difficulty - The difficulty level
 * @returns {string} - Feedback text
 */
const generateFeedback = (score, difficulty) => {
  if (score >= 8) {
    return `Excellent answer for a ${difficulty} question. Comprehensive and well-articulated.`;
  } else if (score >= 5) {
    return `Good answer for a ${difficulty} question. Covers the main points but could be more detailed.`;
  } else if (score >= 3) {
    return `Adequate answer for a ${difficulty} question. Basic understanding demonstrated.`;
  } else {
    return `Limited answer for a ${difficulty} question. Consider reviewing this topic.`;
  }
};

/**
 * Generates an overall summary of the candidate's performance
 * @param {number} percentageScore - The overall percentage score
 * @param {Array} evaluations - The evaluations for each question
 * @returns {string} - Summary text
 */
const generateSummary = (percentageScore, evaluations) => {
  let strengthsCount = 0;
  let weaknessesCount = 0;
  
  evaluations.forEach(evaluation => {
    if (evaluation.score >= 7) strengthsCount++;
    if (evaluation.score <= 3) weaknessesCount++;
  });
  
  let summary = `The candidate scored ${percentageScore}% overall. `;
  
  if (percentageScore >= 80) {
    summary += 'This is an excellent result, indicating strong React and Node.js knowledge. ';
  } else if (percentageScore >= 60) {
    summary += 'This is a good result, showing solid understanding of React and Node.js concepts. ';
  } else if (percentageScore >= 40) {
    summary += 'This is an average result, with basic React and Node.js knowledge demonstrated. ';
  } else {
    summary += 'This result suggests limited React and Node.js knowledge. ';
  }
  
  if (strengthsCount > 0) {
    summary += `The candidate showed strength in ${strengthsCount} area${strengthsCount > 1 ? 's' : ''}. `;
  }
  
  if (weaknessesCount > 0) {
    summary += `There ${weaknessesCount > 1 ? 'are' : 'is'} ${weaknessesCount} area${weaknessesCount > 1 ? 's' : ''} that could use improvement. `;
  }
  
  summary += 'Overall recommendation: ';
  if (percentageScore >= 70) {
    summary += 'Consider for next interview stage.';
  } else if (percentageScore >= 50) {
    summary += 'May be suitable for junior positions or with additional training.';
  } else {
    summary += 'Not recommended for current React/Node.js positions.';
  }
  
  return summary;
};
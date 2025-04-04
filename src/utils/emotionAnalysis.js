/**
 * Emotion types definition
 */
export const EmotionTypes = {
  HAPPY: 'happy',
  SAD: 'sad',
  ENERGETIC: 'energetic',
  CALM: 'calm',
  ROMANTIC: 'romantic',
  MYSTERIOUS: 'mysterious',
  HOPEFUL: 'hopeful',
  DRAMATIC: 'dramatic',
  MELANCHOLIC: 'melancholic',
  JOYFUL: 'joyful',
};

/**
 * Emotion keywords mapping
 * Used for simple emotion analysis
 */
const emotionKeywords = {
  [EmotionTypes.HAPPY]: ['happy', 'joy', 'cheerful', 'excited', 'delighted', 'pleased', 'content', 'thrilled', 'blissful'],
  [EmotionTypes.SAD]: ['sad', 'sorrow', 'unhappy', 'depressed', 'grief', 'miserable', 'down', 'gloomy', 'tearful'],
  [EmotionTypes.ENERGETIC]: ['energetic', 'passionate', 'lively', 'vibrant', 'dynamic', 'active', 'spirited', 'vigorous', 'robust'],
  [EmotionTypes.CALM]: ['calm', 'peaceful', 'serene', 'tranquil', 'relaxed', 'composed', 'quiet', 'still', 'meditative'],
  [EmotionTypes.ROMANTIC]: ['romantic', 'love', 'affection', 'tender', 'passionate', 'intimate', 'adoring', 'sentimental', 'amorous'],
  [EmotionTypes.MYSTERIOUS]: ['mysterious', 'unknown', 'magical', 'enigmatic', 'cryptic', 'puzzling', 'curious', 'intriguing', 'secretive'],
  [EmotionTypes.HOPEFUL]: ['hopeful', 'expectation', 'aspire', 'optimistic', 'promising', 'bright', 'forward-looking', 'encouraged', 'positive'],
  [EmotionTypes.DRAMATIC]: ['dramatic', 'intense', 'grand', 'powerful', 'theatrical', 'striking', 'impactful', 'emotional', 'impressive'],
  [EmotionTypes.MELANCHOLIC]: ['melancholic', 'moody', 'wistful', 'nostalgic', 'reflective', 'bittersweet', 'yearning', 'longing', 'pensive'],
  [EmotionTypes.JOYFUL]: ['joyful', 'celebration', 'festive', 'happy', 'elated', 'merry', 'upbeat', 'jubilant', 'gleeful'],
};

/**
 * Simple emotion analysis, determines possible emotion type based on text content
 * @param {string} text - Input text
 * @returns {Object} Emotion analysis result
 */
export function analyzeEmotion(text) {
  if (!text || typeof text !== 'string') {
    return randomEmotion();
  }
  
  // Text preprocessing: convert to lowercase
  const lowerText = text.toLowerCase();
  
  // Calculate matching scores for each emotion type
  let maxScore = 0;
  let primaryEmotion = null;
  
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    const score = keywords.reduce((sum, keyword) => {
      return sum + (lowerText.includes(keyword.toLowerCase()) ? 1 : 0);
    }, 0);
    
    if (score > maxScore) {
      maxScore = score;
      primaryEmotion = emotion;
    }
  });
  
  // If no emotion matches, return a random emotion
  if (maxScore === 0) {
    return randomEmotion();
  }
  
  // Generate emotion intensity (0.5-1.0)
  const intensity = 0.5 + Math.random() * 0.5;
  
  // Determine emotion based on intensity
  return {
    primaryEmotion,
    intensity,
    tempo: intensity > 0.7 ? 'fast' : 'slow',
    complexity: Math.random() > 0.5 ? 'high' : 'low'
  };
}

/**
 * Generate random emotion
 * @returns {Object} Random emotion analysis result
 */
function randomEmotion() {
  const emotions = Object.values(EmotionTypes);
  const randomIndex = Math.floor(Math.random() * emotions.length);
  const intensity = 0.5 + Math.random() * 0.5;
  
  return {
    primaryEmotion: emotions[randomIndex],
    intensity,
    tempo: intensity > 0.7 ? 'fast' : 'slow',
    complexity: Math.random() > 0.5 ? 'high' : 'low'
  };
}

/**
 * Get music generation parameters related to emotion
 * @param {Object} emotionData - Emotion analysis result
 * @returns {Object} Music generation parameters
 */
export function getMusicalParameters(emotionData) {
  const { primaryEmotion, intensity, tempo } = emotionData;
  
  // Default parameters
  const params = {
    scale: 'major',
    tempo: 120,
    baseNote: 'C4',
    rhythmComplexity: 0.5,
    harmonicComplexity: 0.5,
    dynamicRange: 0.7,
    instrumentType: 'piano'
  };
  
  // Adjust parameters based on emotion
  switch (primaryEmotion) {
    case EmotionTypes.HAPPY:
      params.scale = 'major';
      params.tempo = 120 + Math.floor(intensity * 40);
      params.rhythmComplexity = 0.6;
      params.dynamicRange = 0.8;
      break;
    
    case EmotionTypes.SAD:
      params.scale = 'minor';
      params.tempo = 70 + Math.floor(intensity * 20);
      params.baseNote = 'A3';
      params.harmonicComplexity = 0.7;
      params.dynamicRange = 0.5;
      break;
    
    case EmotionTypes.ENERGETIC:
      params.scale = 'major';
      params.tempo = 140 + Math.floor(intensity * 40);
      params.rhythmComplexity = 0.8;
      params.dynamicRange = 0.9;
      params.instrumentType = 'synth';
      break;
    
    case EmotionTypes.CALM:
      params.scale = 'major';
      params.tempo = 60 + Math.floor(intensity * 20);
      params.baseNote = 'G3';
      params.rhythmComplexity = 0.3;
      params.harmonicComplexity = 0.6;
      params.dynamicRange = 0.4;
      break;
    
    case EmotionTypes.ROMANTIC:
      params.scale = 'major';
      params.tempo = 80 + Math.floor(intensity * 30);
      params.baseNote = 'F3';
      params.harmonicComplexity = 0.7;
      params.dynamicRange = 0.6;
      break;
    
    case EmotionTypes.MYSTERIOUS:
      params.scale = 'minor';
      params.tempo = 90 + Math.floor(intensity * 20);
      params.baseNote = 'E3';
      params.harmonicComplexity = 0.8;
      params.rhythmComplexity = 0.6;
      params.dynamicRange = 0.7;
      break;
      
    // Add parameter settings for other emotion types
    default:
      // Use default parameters
  }
  
  // Adjust speed based on tempo property
  if (tempo === 'fast') {
    params.tempo = Math.max(params.tempo, 120);
  } else if (tempo === 'slow') {
    params.tempo = Math.min(params.tempo, 90);
  }
  
  return params;
}

/**
 * Get gradient color corresponding to emotion
 * @param {string} emotion - Emotion type
 * @returns {string} CSS gradient color
 */
export function getEmotionGradient(emotion) {
  switch (emotion) {
    case EmotionTypes.HAPPY:
      return 'linear-gradient(135deg, #FFC107, #FF9800)';
    case EmotionTypes.SAD:
      return 'linear-gradient(135deg, #42A5F5, #1976D2)';
    case EmotionTypes.ENERGETIC:
      return 'linear-gradient(135deg, #F44336, #E91E63)';
    case EmotionTypes.CALM:
      return 'linear-gradient(135deg, #26A69A, #00796B)';
    case EmotionTypes.ROMANTIC:
      return 'linear-gradient(135deg, #EC407A, #D81B60)';
    case EmotionTypes.MYSTERIOUS:
      return 'linear-gradient(135deg, #5E35B1, #3949AB)';
    case EmotionTypes.HOPEFUL:
      return 'linear-gradient(135deg, #66BB6A, #43A047)';
    case EmotionTypes.DRAMATIC:
      return 'linear-gradient(135deg, #8E24AA, #5E35B1)';
    case EmotionTypes.MELANCHOLIC:
      return 'linear-gradient(135deg, #7986CB, #3F51B5)';
    case EmotionTypes.JOYFUL:
      return 'linear-gradient(135deg, #FFD54F, #FFA000)';
    default:
      return 'linear-gradient(135deg, #9e69fd, #64c2ff)';
  }
} 
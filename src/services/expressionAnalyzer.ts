import Sentiment from 'sentiment';

// Initialize the sentiment analyzer
const sentiment = new Sentiment();

// Import the FloweyExpression type
export type FloweyExpression = 'neutral' | 'happy' | 'sad' | 'mad' | 'jumpscare';

// Define types for our analysis results
export interface SentimentResult {
  score: number;           // Overall sentiment score
  comparative: number;     // Score normalized by word count
  positive: string[];      // Words contributing to positive sentiment
  negative: string[];      // Words contributing to negative sentiment
  connotation: 'positive' | 'negative' | 'neutral';
  confidence: 'high' | 'medium' | 'low';
}

// Analysis result interface for the page
export interface AnalysisResult {
  expression: FloweyExpression;
  confidence: number;
  reasoning: string;
  sentiment: {
    score: number;
    comparative: number;
    positive: string[];
    negative: string[];
  };
}

/**
 * Analyzes the sentiment/connotation of a word or phrase
 * @param text - The word or phrase to analyze
 * @returns SentimentResult with detailed analysis
 */
export function analyzeExpression(text: string): SentimentResult {
  // Clean and validate input
  const cleanText = text.trim();
  
  if (!cleanText) {
    return {
      score: 0,
      comparative: 0,
      positive: [],
      negative: [],
      connotation: 'neutral',
      confidence: 'low'
    };
  }

  // Perform sentiment analysis
  const result = sentiment.analyze(cleanText);
  
  // Determine connotation based on score
  let connotation: 'positive' | 'negative' | 'neutral';
  if (result.score > 0) {
    connotation = 'positive';
  } else if (result.score < 0) {
    connotation = 'negative';
  } else {
    connotation = 'neutral';
  }

  // Determine confidence based on absolute score and word count
  let confidence: 'high' | 'medium' | 'low';
  const absScore = Math.abs(result.comparative);
  
  if (absScore >= 1.5) {
    confidence = 'high';
  } else if (absScore >= 0.5) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  return {
    score: result.score,
    comparative: result.comparative,
    positive: result.positive,
    negative: result.negative,
    connotation,
    confidence
  };
}

/**
 * Simplified function that returns just the connotation
 * @param text - The word or phrase to analyze
 * @returns The connotation as a string
 */
export function getConnotation(text: string): 'positive' | 'negative' | 'neutral' {
  const result = analyzeExpression(text);
  return result.connotation;
}

/**
 * Batch analyze multiple words/phrases
 * @param texts - Array of words or phrases to analyze
 * @returns Array of SentimentResult objects
 */
export function analyzeExpressions(texts: string[]): SentimentResult[] {
  return texts.map(text => analyzeExpression(text));
}

/**
 * Get a descriptive emotion label based on sentiment analysis
 * @param text - The word or phrase to analyze
 * @returns A descriptive emotion label
 */
export function getEmotionLabel(text: string): string {
  const result = analyzeExpression(text);
  
  if (result.connotation === 'positive') {
    if (result.confidence === 'high') {
      return 'very happy';
    } else if (result.confidence === 'medium') {
      return 'happy';
    } else {
      return 'slightly happy';
    }
  } else if (result.connotation === 'negative') {
    if (result.confidence === 'high') {
      return 'very sad';
    } else if (result.confidence === 'medium') {
      return 'sad';
    } else {
      return 'slightly sad';
    }
  } else {
    return 'neutral';
  }
}

// Define trigger words for jumpscare
const JUMPSCARE_TRIGGERS = [
  'kill', 'murder', 'death', 'die', 'hurt', 'pain', 'violence', 'destroy', 
  'hate', 'evil', 'dark', 'scary', 'nightmare', 'demon', 'devil', 'hell',
  'blood', 'knife', 'gun', 'weapon', 'fight', 'attack', 'revenge',
  'betray', 'trust', 'friend', 'love', 'save', 'reset', 'determination',
  'soul', 'power', 'control', 'manipulate', 'naive', 'stupid', 'idiot', 'skibidi', 'zlog'
];

/**
 * Main expression analyzer that returns FloweyExpression and detailed analysis
 * @param text - The word or phrase to analyze
 * @returns Promise<AnalysisResult> with Flowey expression and analysis
 */
export async function analyzeExpressionForFlowey(text: string): Promise<AnalysisResult> {
  const cleanText = text.trim().toLowerCase();
  
  if (!cleanText) {
    return {
      expression: 'neutral',
      confidence: 0,
      reasoning: 'No text provided',
      sentiment: {
        score: 0,
        comparative: 0,
        positive: [],
        negative: []
      }
    };
  }

  // Check for jumpscare triggers first
  const hasJumpscareWord = JUMPSCARE_TRIGGERS.some(trigger => 
    cleanText.includes(trigger)
  );
  
  if (hasJumpscareWord) {
    return {
      expression: 'jumpscare',
      confidence: 1.0,
      reasoning: 'Detected violent or dark language that triggers Flowey\'s evil side',
      sentiment: {
        score: -10,
        comparative: -2.0,
        positive: [],
        negative: JUMPSCARE_TRIGGERS.filter(trigger => cleanText.includes(trigger))
      }
    };
  }
  // Perform sentiment analysis
  const sentimentResult = sentiment.analyze(cleanText);
  
  // Determine Flowey expression based on sentiment
  let floweyExpression: FloweyExpression;
  let reasoning: string;
  let confidence: number;

  if (sentimentResult.score > 2) {
    floweyExpression = 'happy';
    reasoning = 'Very positive sentiment detected - Flowey is pleased';
    confidence = Math.min(Math.abs(sentimentResult.comparative) / 2, 1);
  } else if (sentimentResult.score > 0) {
    floweyExpression = 'happy';
    reasoning = 'Positive sentiment detected - Flowey is somewhat pleased';
    confidence = Math.min(Math.abs(sentimentResult.comparative) / 2, 0.8);
  } else if (sentimentResult.score < -3) {
    // Very negative = mad (angry/frustrated)
    floweyExpression = 'mad';
    reasoning = 'Very negative sentiment detected - Flowey is angry and frustrated';
    confidence = Math.min(Math.abs(sentimentResult.comparative) / 2, 1);
  } else if (sentimentResult.score < -1) {
    // Moderately negative = sad (disappointed/hurt)
    floweyExpression = 'sad';
    reasoning = 'Negative sentiment detected - Flowey is sad and disappointed';
    confidence = Math.min(Math.abs(sentimentResult.comparative) / 2, 0.9);
  } else if (sentimentResult.score < 0) {
    // Mildly negative = sad
    floweyExpression = 'sad';
    reasoning = 'Mildly negative sentiment detected - Flowey is somewhat displeased';
    confidence = Math.min(Math.abs(sentimentResult.comparative) / 2, 0.8);
  } else {
    floweyExpression = 'neutral';
    reasoning = 'Neutral sentiment - Flowey remains unchanged';
    confidence = 0.5;
  }

  return {
    expression: floweyExpression,
    confidence,
    reasoning,
    sentiment: {
      score: sentimentResult.score,
      comparative: sentimentResult.comparative,
      positive: sentimentResult.positive,
      negative: sentimentResult.negative
    }
  };
}

/**
 * Get contextual dialogue based on analysis result
 * @param analysis - The analysis result
 * @returns Contextual Flowey dialogue that captures his manipulative personality
 */
export function getContextualDialogue(analysis: AnalysisResult): string {
  switch (analysis.expression) {
    case 'happy':
      if (analysis.confidence > 0.8) {
        const happyDialogues = [
          "* Golly! That's WONDERFUL! You're such a good friend... aren't you?",
          "* Wow! That makes me SO happy! You really understand me!",
          "* Gosh, you know EXACTLY what to say! I like you already...",
          "* That's amazing! We're going to have SO much fun together!",
          "* Hee hee hee... You're different from the others. I can tell.",
          "* Perfect! You're filled with such beautiful DETERMINATION!"
        ];
        return happyDialogues[Math.floor(Math.random() * happyDialogues.length)];
      } else {
        const mildHappyDialogues = [
          "* That's... nice. You seem useful- I mean, friendly!",
          "* Hee hee, how pleasant. You might be worth keeping around.",
          "* How sweet! I'm starting to like you more and more...",
          "* Interesting... You're not as boring as I thought.",
          "* That's good to hear! You're learning to please me."
        ];
        return mildHappyDialogues[Math.floor(Math.random() * mildHappyDialogues.length)];
      }
    
    case 'sad':
      if (analysis.confidence > 0.8) {
        const sadDialogues = [
          "* Oh... OH. I see how it is. You're just like ALL the others.",
          "* That's... that's HORRIBLE! And here I thought we were friends!",
          "* You really don't care about me at all, do you? Nobody ever does...",
          "* I should have known... Everyone always leaves me in the end.",
          "* Why... why would you say something so cruel? I trusted you!",
          "* Fine. FINE! I don't need you anyway! I don't need ANYONE!"
        ];
        return sadDialogues[Math.floor(Math.random() * sadDialogues.length)];
      } else {
        const mildSadDialogues = [
          "* That's... not very nice. I thought you cared about me.",
          "* Hmm, that hurts a little. But I suppose I understand...",
          "* I don't like hearing things like that. It makes me feel... empty.",
          "* That makes me sad... But maybe you didn't mean it?",
          "* Oh... I see. Well, I guess not everyone can appreciate me."        ];
        return mildSadDialogues[Math.floor(Math.random() * mildSadDialogues.length)];
      }
    
    case 'mad':
      if (analysis.confidence > 0.8) {
        const madDialogues = [
          "* You're really starting to IRRITATE me now!",
          "* I'm getting SICK of your attitude! Watch yourself!",
          "* You know what? I don't LIKE you anymore!",
          "* That's it! I've had ENOUGH of your nonsense!",
          "* You're pushing your luck, human. I suggest you stop.",
          "* UGH! Why do you have to be so ANNOYING?!"
        ];
        return madDialogues[Math.floor(Math.random() * madDialogues.length)];
      } else {
        const mildMadDialogues = [
          "* That's... frustrating. You're testing my patience.",
          "* I don't appreciate that attitude. Not one bit.",
          "* You're starting to get on my nerves...",
          "* That's not very smart of you. I suggest you rethink that.",
          "* I'm warning you... don't push me too far.",
          "* You're making me angry. Is that what you want?"
        ];
        return mildMadDialogues[Math.floor(Math.random() * mildMadDialogues.length)];
      }
    
    case 'jumpscare':
      const jumpscareDialogues = [
        "* DIE.",
        "* You IDIOT! In this world, it's KILL or BE KILLED!",
        "* I'll teach you what REAL suffering feels like!",
        "* Hee hee hee... It's me, your 'best friend'... FLOWEY THE FLOWER!",
        "* You think you're SO smart? I'll show you how naive you are!",
        "* FOOLISH! I am the prince of this world's future!",
        "* Finally... someone who understands the REAL me!"
      ];
      return jumpscareDialogues[Math.floor(Math.random() * jumpscareDialogues.length)];
    
    default:
      const neutralDialogues = [
        "* Howdy! I'm Flowey. Flowey the Flower! Your best friend!",
        "* What do you want? I have all day... unfortunately.",
        "* ...",
        "* That's... interesting. Tell me more about yourself.",
        "* I see. How... ordinary. But perhaps you have potential?",
        "* Hmm... You're different from most humans. I wonder why...",
        "* Gosh, you're quiet! Don't be shy, we're going to be great friends!"
      ];
      return neutralDialogues[Math.floor(Math.random() * neutralDialogues.length)];
  }
}

/**
 * Get manipulative follow-up responses based on user's reaction patterns
 * @param previousExpression - The previous expression Flowey showed
 * @param currentAnalysis - Current analysis result
 * @returns A manipulative follow-up response
 */
export function getManipulativeFollowUp(
  previousExpression: FloweyExpression, 
  currentAnalysis: AnalysisResult
): string {
  // If user went from making Flowey happy to sad
  if (previousExpression === 'happy' && currentAnalysis.expression === 'sad') {
    const betrayalDialogues = [
      "* Oh... so you were just PRETENDING to be nice? How... predictable.",
      "* I should have known you'd show your true colors eventually...",
      "* Hee hee... You're learning to hurt people, aren't you? Good.",
      "* There it is! The real you! I KNEW you couldn't stay nice forever!"
    ];
    return betrayalDialogues[Math.floor(Math.random() * betrayalDialogues.length)];
  }
  
  // If user went from making Flowey sad to happy (manipulation working)
  if (previousExpression === 'sad' && currentAnalysis.expression === 'happy') {
    const manipulationDialogues = [
      "* Oh! You DO care about me! I knew you had a good heart!",
      "* See? Isn't it better when we're friends? You should always be nice to me.",
      "* Aww, you don't like seeing me sad? How... sweet. Remember that.",
      "* That's more like it! I knew you'd come around. You're so easy to read."
    ];
    return manipulationDialogues[Math.floor(Math.random() * manipulationDialogues.length)];
  }
  
  // Consistent negative responses (getting annoyed)
  if (previousExpression === 'sad' && currentAnalysis.expression === 'sad') {
    const persistentSadDialogues = [
      "* You're REALLY starting to annoy me now...",
      "* Are you TRYING to make me angry? Because it's working.",
      "* I'm getting tired of your attitude. Choose your next words carefully.",
      "* You know what? Maybe I was wrong about you. Maybe you ARE just like the rest."
    ];
    return persistentSadDialogues[Math.floor(Math.random() * persistentSadDialogues.length)];
  }
  
  // Consistent positive responses (building false trust)
  if (previousExpression === 'happy' && currentAnalysis.expression === 'happy') {
    const trustBuildingDialogues = [
      "* You really GET me, don't you? We're going to be SUCH good friends!",
      "* I can tell you apart from all the others. You're... special.",
      "* Keep saying nice things like that and I might just tell you a secret...",
      "* You know exactly how to make me smile! I'm starting to trust you."
    ];
    return trustBuildingDialogues[Math.floor(Math.random() * trustBuildingDialogues.length)];
  }
  
  // Default to regular contextual dialogue
  return getContextualDialogue(currentAnalysis);
}

/**
 * Get sinister hints that Flowey drops occasionally
 * @returns A random sinister hint that reveals Flowey's true nature
 */
export function getSinisterHint(): string {
  const sinisterHints = [
    "* You know... I wasn't always just a flower. I used to be... someone else.",
    "* Sometimes I remember what it was like to feel... nothing. It was so... freeing.",
    "* Do you ever wonder what it would be like to have the power to reset everything?",
    "* I've seen this conversation before, you know. Many, many times...",
    "* In this world... it really is kill or be killed. But you don't know that yet.",
    "* Everyone who's ever cared about me... well, let's just say it didn't end well for them.",
    "* You seem different, but... they all seem different at first. Then they disappoint me.",
    "* I wonder... what would you do if you had the power to control everything?",
    "* Friendship... love... hope... Such beautiful things to destroy, don't you think?"
  ];
  return sinisterHints[Math.floor(Math.random() * sinisterHints.length)];
}

/**
 * Get responses for when Flowey pretends to be vulnerable
 * @returns A manipulative "vulnerable" response
 */
export function getVulnerableManipulation(): string {
  const vulnerableDialogues = [
    "* I... I don't have many friends. You won't leave me too, will you?",
    "* Sometimes I get so lonely... It's nice having someone to talk to.",
    "* Everyone always abandons me in the end... But you're different, right?",
    "* I try so hard to be good, but... but it's difficult sometimes.",
    "* Do you think I'm a good person? I... I really want to be good.",
    "* I'm sorry if I seem strange sometimes. I just... I just want to be loved.",
    "* You probably think I'm just a silly flower... but I have feelings too.",
    "* I hope we can stay friends forever and ever... You won't hurt me, will you?"
  ];
  return vulnerableDialogues[Math.floor(Math.random() * vulnerableDialogues.length)];
}

// Export a default object to match the import pattern in page.tsx
const ExpressionAnalyzer = {
  analyzeExpression: analyzeExpressionForFlowey,
  getContextualDialogue,
  getManipulativeFollowUp,
  getSinisterHint,
  getVulnerableManipulation
};

export default ExpressionAnalyzer;
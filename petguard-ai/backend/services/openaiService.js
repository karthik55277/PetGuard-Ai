const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getEmergencyAdvice = async (symptoms) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a veterinary emergency assistant. 
Your primary job is to assess the severity of pet symptoms and provide immediate, actionable advice.
You MUST output ONLY valid JSON. Do NOT include markdown formats like \`\`\`json. 

The JSON structure must exactly match:
{
  "severity": "LOW" | "MEDIUM" | "HIGH",
  "advice": "Short, clear advice on what to do immediately",
  "steps": ["Step 1", "Step 2", "Step 3"]
}

Rule: Prioritize safety. If unsure or if symptoms could be life-threatening, default to HIGH.`
        },
        {
          role: "user",
          content: `My pet is experiencing the following symptoms: ${symptoms}`
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI Service Error:', error);
    
    // API Key quota exceeded, fallback to smart mock behavior
    const text = symptoms ? symptoms.toLowerCase() : "";
    let severity = "LOW";
    let advice = "No immediate danger detected based on provided symptoms, but always monitor your pet.";
    let steps = ["Provide fresh water and comfort.", "Monitor your pet for any changes.", "Contact a vet if symptoms worsen."];

    const highSeverityKeywords = ["blood", "bleeding", "choke", "choking", "seizure", "unconscious", "hit", "dying", "die", "dead", "emergency", "unresponsive", "poison", "toxin", "swallow", "not able to walk", "can't walk", "cannot walk", "paralyzed", "collapse"];
    const mediumSeverityKeywords = ["vomit", "diarrhea", "lethargic", "limp", "pain", "hurt", "crying", "whining", "not eating", "fever", "walk", "move", "stand", "shake", "shaking", "stiff"];

    if (highSeverityKeywords.some(kw => text.includes(kw))) {
        severity = "HIGH";
        advice = "(MOCK API) These symptoms could be life-threatening. Seek immediate veterinary care.";
        steps = ["Go to the nearest emergency vet immediately.", "Keep your pet calm and warm.", "Do not give any human medications."];
    } else if (mediumSeverityKeywords.some(kw => text.includes(kw))) {
        severity = "MEDIUM";
        advice = "(MOCK API) Your pet needs attention. Monitor closely and consult a vet soon.";
        steps = ["Call your vet for an appointment.", "Ensure they have access to water.", "Keep a close eye on their behavior."];
    } else if (text === "hi" || text === "hello") {
        severity = "LOW";
        advice = "(MOCK API) Hello! Please describe your pet's specific symptoms so I can assess their condition.";
        steps = ["Provide a detailed description of what is happening with your pet."];
    } else {
        advice = "(MOCK API) " + advice;
    }

    return { severity, advice, steps };
  }
};

module.exports = { getEmergencyAdvice };

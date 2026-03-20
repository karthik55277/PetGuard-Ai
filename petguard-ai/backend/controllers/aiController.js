const { getEmergencyAdvice } = require('../services/openaiService');

const analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms) {
      return res.status(400).json({ error: 'Symptoms are required' });
    }

    const aiResponse = await getEmergencyAdvice(symptoms);
    
    // Attempt to parse if string, just in case
    let parsedResponse = aiResponse;
    if (typeof aiResponse === 'string') {
        try {
            parsedResponse = JSON.parse(aiResponse);
        } catch (e) {
            console.error('Failed to parse AI response:', aiResponse);
            return res.status(500).json({ error: 'Failed to parse AI response' });
        }
    }

    return res.status(200).json(parsedResponse);
  } catch (error) {
    console.error('Error in analyzeSymptoms controller:', error);
    return res.status(500).json({ error: 'Internal server error while analyzing symptoms' });
  }
};

module.exports = { analyzeSymptoms };

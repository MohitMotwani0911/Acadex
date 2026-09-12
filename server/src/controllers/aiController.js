const { generateAIResponse } = require("../services/aiService");

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const response = await generateAIResponse(message);

    res.status(200).json({
      success: true,
      response,
    });
 } catch (error) {
  console.error("AI Error:", error);
  console.error("AI Error Message:", error.message);
  console.error("AI Error Status:", error.status);
  console.error("AI Error Code:", error.code);

  res.status(500).json({
    success: false,
    message: error.message || "Failed to generate AI response",
  });
}
};

module.exports = {
  chatWithAI,
};
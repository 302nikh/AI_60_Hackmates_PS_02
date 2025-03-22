const express = require("express");
const router = express.Router();  // ✅ Define the router
const FAQ = require("../models/FAQ");
const Unanswered = require("../models/Unanswered");
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/ask", async (req, res) => {
  console.log("📥 Received query:", req.body);

  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    console.log("🔍 Searching in FAQ...");
    let response = await FAQ.findOne({ question: query });

    if (response) {
      console.log("✅ Found in FAQ:", response.answer);
      return res.json({ answer: response.answer });
    }

    console.log("❌ Not found in FAQ. Storing for review...");
    
    try {
      const newUnanswered = await Unanswered.create({ question: query });
      console.log("📌 Unanswered question stored:", newUnanswered);
    } catch (dbError) {
      console.error("❌ Error saving unanswered question:", dbError);
    }

    console.log("🤖 Generating AI response...");
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: query }],
    });

    response = { answer: aiResponse.choices[0].message.content };

    console.log("✅ AI Response:", response.answer);
    res.json({ answer: response.answer });
  } catch (error) {
    console.error("❌ Internal Server Error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

module.exports = router;  // ✅ Export the router

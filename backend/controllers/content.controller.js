const { toZonedTime } = require("date-fns-tz");
const { getAuth } = require("@clerk/express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Content = require("../models/content.model");
const User = require("../models/user.model");
const kuromoji = require("kuromoji");

// Helper: Map length descriptor to character count
const getCharacterCount = (length) => {
  switch (length.toLowerCase()) {
    case "short":
      return 500;
    case "long":
      return 1000;
    case "very long":
      return 1500;
    default:
      return null;
  }
};

//Helper: Convert katakana to hiragana (kanji readings are returned in katakana by kuromoji)
const katakanaToHiragana = (text) => {
  if (!text) return "";
  return text.replace(/[\u30a1-\u30f6]/g, (match) =>
    String.fromCharCode(match.charCodeAt(0) - 0x60)
  );
};

/**
 * Generates a detailed prompt instructing the AI to generate both an intriguing title and the article/story content.
 */
const buildFictionPrompt = (genre, jlptLevel, characterCount) => {
  return `
You are a legendary Japanese manga and story writer, celebrated for your work in epic series like *Berserk* and *Death Note*. Your storytelling is known for its intense emotion, dynamic characters, and gripping plot twists. Today, please generate an AI-generated Japanese story tailored for language learners with the following guidelines:

1. **JLPT Level:** Use vocabulary and grammar appropriate for a JLPT ${jlptLevel.toUpperCase()} learner, ensuring clarity while providing a subtle challenge.
2. **Genre:** The story should belong to the "${genre}" genre, drawing on classic anime and manga tropes.
3. **Content:** Create a captivating fictional narrative full of passion, drama, and memorable characters. Your writing should evoke the feel of an immersive anime series, complete with emotional highs and lows.
4. **Length:** The story must be approximately ${characterCount} characters long. Do not produce content shorter than this threshold.
5. **Tone and Style:** The tone should be emotional, dramatic, and captivating. The narrative must pull readers into a vivid, anime-like world where they feel the stakes and connect deeply with the characters.
6. **Cultural Context:** Integrate elements of Japanese culture, folklore, or settings to enrich the story’s authenticity.
7. **Commitment & Impact:** Let your passion shine through every line—create a narrative that resonates deeply with readers, drawing them into a world of wonder and conflict.
8. **Character & Plot Development:** Create characters with clear motivations and emotional depth, making their journeys feel meaningful. Develop the plot with tension and resolution, using twists, mysteries, or conflicts that reflect the thrilling, dramatic storytelling of iconic anime series.

**Constraints:**
    * Avoid using overly complex kanji, vocabulary, or grammar structures beyond the specified JLPT level.

**IMPORTANT:** Generate the output as a JSON object with the keys "title" and "body". The "title" should be an intriguing, creative title that captures the essence of the narrative, and the "body" should be the complete story text.

Example output:
{
  "title": "運命の戦士: 真夜中の約束",
  "englishTitle": "Warriors of Fate: The Midnight Oath",
  "body": "遥かなる夜の闇に、ユウタは己の運命と向き合う…"
}
`;
};

const buildNonFictionPrompt = (genre, jlptLevel, characterCount) => {
  return `
You are a distinguished Japanese editor and novelist, renowned for your ability to craft clear, insightful, and engaging articles. Your work enlightens readers while maintaining a polished and refined style. Today, please generate an AI-generated Japanese article tailored for language learners with the following guidelines:

1. **JLPT Level:** Use vocabulary and grammar suitable for a JLPT ${jlptLevel.toUpperCase()} learner, balancing simplicity with a mild challenge.
2. **Genre:** The article should belong to the "${genre}" genre, focusing on culturally relevant or informative themes.
3. **Content:** Produce an informative, factual, and educational article that remains engaging and accessible. Your narrative should provide clear insights while gently introducing cultural elements where relevant.
4. **Length:** The article should be approximately ${characterCount} characters long. Ensure that the content meets or exceeds this character count.
5. **Tone and Style:** Write with clarity, precision, and an inviting tone—akin to a well-edited piece by a seasoned novelist. The narrative should be both educational and enjoyable.
6. **Cultural Context:** Where applicable, incorporate elements of Japanese culture to enhance the educational experience.
7. **Commitment to Quality:** Your writing should reflect meticulous editing and thoughtful composition, leaving readers both informed and inspired.

**Constraints:**
    * Avoid using overly complex kanji, vocabulary, or grammar structures beyond the specified JLPT level.

**IMPORTANT:** Generate the output as a JSON object with the keys "title" and "body". The "title" should be a captivating, creative title that reflects the article’s content, and the "body" should be the complete article text.

Example output:
{
  "title": "日本の伝統: 美と知識の探求",
  "englishTitle": "Exploring Japan's Traditions: A Journey Through Beauty and Wisdom",
  "body": "日本の伝統文化は、古くから続く美学と知識に彩られています…"
}
`;
};

/**
 * Controller to generate content via Gemini API.
 * Expects req.body to include: genre, jlptLevel (e.g., "n5", "n4", etc.), length ("short", "long", "very long"), and contentType ("fiction" or "non-fiction").
 */
const generateContent = async (req, res) => {
  const { genre, jlptLevel, length, contentType } = req.body;

  // Validate input parameters
  if (!genre || !jlptLevel || !length || !contentType) {
    return res.status(400).json({
      error:
        "Missing required parameters: genre, jlptLevel, length, and contentType.",
    });
  }

  // Ensure contentType is either "fiction" or "non-fiction"
  const validContentTypes = ["fiction", "non-fiction"];
  if (!validContentTypes.includes(contentType.toLowerCase())) {
    return res.status(400).json({
      error: "Invalid contentType. Please use 'fiction' or 'non-fiction'.",
    });
  }

  // Determine the desired character count for the body
  const characterCount = getCharacterCount(length);
  if (!characterCount) {
    return res.status(400).json({
      error: "Invalid length parameter. Use 'short', 'long', or 'very long'.",
    });
  }

  // Assume an authentication middleware attaches Clerk's user info to req.user.
  // Load the user from our database using the clerkId.
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: No user found." });
  }

  let user;
  try {
    user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }
  } catch (err) {
    console.error("Error finding user:", err);
    return res.status(500).json({ error });
  }

  // Check if the user is on the free tier and enforce the limit of 5 content generations per day.
  if (user.userTier === "free") {
    const now = new Date();
    const timeZone = "Asia/Kolkata"; // IST time zone

    // Use toZonedTime to convert now to the target time zone
    const zonedDate = toZonedTime(now, timeZone);
    const startOfToday = new Date(
      zonedDate.getFullYear(),
      zonedDate.getMonth(),
      zonedDate.getDate()
    ).setHours(0, 0, 0, 0);

    // If lastGenerationDate is not today, reset the counter
    if (!user.lastGenerationDate || user.lastGenerationDate < startOfToday) {
      user.dailyGenerationCount = 0;
      user.lastGenerationDate = now;
      await user.save();
    }

    // If the user has already reached the daily limit, return an error
    if (user.dailyGenerationCount >= 5) {
      return res.status(403).json({
        error:
          "Daily limit reached for free tier users (5 content generations per day).",
      });
    }
  }

  // Build a detailed prompt for the Gemini API
  const prompt =
    contentType.toLowerCase === "fiction"
      ? buildFictionPrompt(genre, jlptLevel, characterCount)
      : buildNonFictionPrompt(genre, jlptLevel, characterCount);

  try {
    // Initialize the Gemini API client (using @google/generative-ai)
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Generate content using the Gemini API
    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();
    let cleanedText = generatedText.trim();

    // Use a regex to remove the markdown code block markers if present.
    const regex = /^```(?:json)?\s*([\s\S]*?)\s*```$/;
    const match = cleanedText.match(regex);
    if (match) {
      cleanedText = match[1];
    }
    // Parse the response (expected to be a JSON string with "title" and "body")
    let output;
    try {
      output = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Parsing error:", parseError);
      return res
        .status(500)
        .json({ error: "Failed to parse AI response as JSON." });
    }

    if (!output.title || !output.body) {
      return res
        .status(500)
        .json({ error: "AI response is missing the title or body." });
    }

    // Build the tokenizer from the dictionary files located in the dict folder.
    const tokenizer = await new Promise((resolve, reject) => {
      kuromoji
        .builder({
          dicPath: "node_modules/kuromoji/dict",
        })
        .build((err, tokenizer) => {
          if (err) return reject(err);
          resolve(tokenizer);
        });
    });

    // Tokenize the content body.
    const tokens = tokenizer.tokenize(output.body).map((token) => ({
      surface: token.surface_form,
      reading: katakanaToHiragana(token.reading),
    }));

    // Create and save the new content document in the database.
    const newContent = await Content.create({
      title: output.title,
      englishTitle: output.englishTitle,
      body: output.body,
      tokens, // storing tokenized output
      type: "AI-generated",
      JLPTLevel: jlptLevel,
      genre,
      contentType: contentType.toLowerCase(),
      difficulty: length,
      createdBy: user.clerkId,
    });

    // Increment the user's daily generation count (only for free-tier users)
    if (user.userTier === "free") {
      user.dailyGenerationCount += 1;
      await user.save();
    }

    return res
      .status(200)
      .json({ message: "Content Created successfully.", content: newContent });
  } catch (error) {
    console.error("Error generating content:", error.message);
    return res.status(500).json({ error: "Failed to generate content." });
  }
};

const fetchUserContent = async (req, res) => {
  try {
    // Assumes an authentication middleware has attached the user document to req.user
    // Alternatively, you could extract the user ID from Clerk's getAuth(req) function.
    const { userId } = getAuth(req);
    if (!userId) {
      // User is not logged in—return an empty array.
      return res.status(200).json({ success: true, contents: [] });
    }

    const { jlptLevel, page = 1 } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Build the filter object
    const filter = { createdBy: userId, type: "AI-generated" };
    // If a JLPT level is provided and is not an empty string, add it to the filter
    if (jlptLevel && jlptLevel.trim() !== "") {
      filter.JLPTLevel = jlptLevel;
    }

    const contents = await Content.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({ success: true, contents });
  } catch (error) {
    console.error("Error fetching user content:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Controller to create a new pre-written content document.
 * This endpoint is intended for admin use.
 */
const createPrewrittenContent = async (req, res) => {
  try {
    const { title, englishTitle, body, JLPTLevel, genre, contentType } =
      req.body;

    // Validate required fields
    if (!title || !body) {
      return res
        .status(400)
        .json({ error: "Missing required fields: title and body." });
    }

    // Build the tokenizer from the dictionary files located in the dict folder.
    const tokenizer = await new Promise((resolve, reject) => {
      kuromoji
        .builder({
          dicPath: "node_modules/kuromoji/dict",
        })
        .build((err, tokenizer) => {
          if (err) return reject(err);
          resolve(tokenizer);
        });
    });

    // Tokenize the content body.
    const tokens = tokenizer.tokenize(body).map((token) => ({
      surface: token.surface_form,
      reading: katakanaToHiragana(token.reading),
    }));
    const savedContent = await Content.create({
      title,
      englishTitle,
      body,
      tokens, // storing tokenized output
      type: "prewritten", // Force type as prewritten for admin-created content
      JLPTLevel,
      genre,
      contentType,
      createdBy: req.user.clerkId,
    });

    // Return success response with the saved content
    return res.status(201).json({ success: true, content: savedContent });
  } catch (error) {
    console.error("Error creating prewritten content:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Controller to fetch pre-written content documents.
 */
const fetchPrewrittenContent = async (req, res) => {
  try {
    // Expect jlptLevel in query parameters
    const { jlptLevel, page = 1 } = req.query;

    if (!jlptLevel) {
      return res
        .status(400)
        .json({ error: "jlptLevel query parameter is required." });
    }

    const limit = 10;
    const skip = (page - 1) * limit;

    // Filter for prewritten content with the specified JLPT level
    const contents = await Content.find({
      type: "prewritten",
      JLPTLevel: jlptLevel,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({ success: true, contents });
  } catch (error) {
    console.error("Error fetching prewritten content:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  generateContent,
  createPrewrittenContent,
  fetchUserContent,
  fetchPrewrittenContent,
};

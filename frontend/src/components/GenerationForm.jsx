import { ContentContext } from "../Context/Context";
import axios from "../utils/axios";
import React, { useContext, useState } from "react";

function GenerationForm({ setIsGenFormOpen, isGenerating, setIsGenerating }) {
  console.log(isGenerating);
  const [jlptLevel, setJlptLevel] = useState("");
  const [length, setLength] = useState("");
  const [genre, setGenre] = useState("");
  const [contentType, setContentType] = useState("");

  const { setGeneratedContentArray, setFetchedUser, genratedContentJlptLevel } =
    useContext(ContentContext);

  const jlptOptions = ["N5", "N4", "N3", "N2", "N1"];
  const genreOptions = [
    "Fantasy",
    "Science Fiction",
    "Mystery",
    "Romance",
    "Horror",
    "Historical Fiction",
    "Thriller",
    "Adventure",
    "Comedy",
    "Slice of Life",
    "Drama",
    "Action",
    "Supernatural",
    "Mythology",
    "Detective",
    "Psychological",
    "Cyberpunk",
    "Steampunk",
    "Dystopian",
    "Utopian",
    "Sports",
    "Martial Arts",
    "Military",
    "Philosophical",
    "Political",
    "Tragedy",
    "Survival",
    "Crime",
    "Magical Realism",
    "Espionage",
    "Post-Apocalyptic",
    "Coming of Age",
  ];
  const contentTypeOptions = ["fiction", "non-fiction"];

  const handleSubmit = async (e) => {
    if (isGenerating) return; // Avoid multiple submissions

    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await axios.post("/api/generateContent", {
        genre,
        jlptLevel,
        length,
        contentType,
      });
      if (genratedContentJlptLevel === jlptLevel) {
        setGeneratedContentArray((prev) => [response.data.content, ...prev]);
      }
      // Appening the generated content to the existing array
      setFetchedUser((prev) => ({
        ...prev,
        dailyGenerationCount: prev.dailyGenerationCount + 1,
      })); // Incrementing the daily generation count

      setIsGenFormOpen(false);
    } catch (error) {
      console.error("Error generating content", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="absolute left-1/2 top-1/2 bg-[#fcf4e7] p-6 rounded-md transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg border-2 ">
      <h2 className="text-3xl  w-full text-center font-['Ortland']!">
        Generate Content
      </h2>
      <h3 className="w-full text-center text-xs mb-5 uppercase tracking-wider">
        Customize for your Taste.
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* JLPT Level */}
        <div>
          <label htmlFor="jlptLevel" className="block font-bold text-lg mb-1">
            JLPT Level
          </label>
          <select
            id="jlptLevel"
            value={jlptLevel}
            onChange={(e) => setJlptLevel(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="" className="bg-[#fcf4e7]">
              Select JLPT Level
            </option>
            {jlptOptions.map((level) => (
              <option key={level} value={level} className="bg-[#fcf4e7]">
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Length */}
        <div>
          <label htmlFor="length" className="block text-lg mb-1">
            Length
          </label>
          <select
            id="length"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Select Length</option>
            <option value="short">Short (500 Char)</option>
            <option value="long">Long (1000 Char)</option>
            <option value="very long">Very Long (1500 Char)</option>
          </select>
        </div>

        {/* Genre */}
        <div>
          <label htmlFor="genre" className="block font-bold text-lg mb-1">
            Genre
          </label>
          <select
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="" className="bg-[#fcf4e7]">
              Select Genre
            </option>
            {genreOptions.map((option) => (
              <option key={option} value={option} className="bg-[#fcf4e7]">
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Content Type */}
        <div>
          <label htmlFor="contentType" className="block font-bold text-lg mb-1">
            Content Type
          </label>
          <select
            id="contentType"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="" className="bg-[#fcf4e7]">
              Select Content Type
            </option>
            {contentTypeOptions.map((option) => (
              <option key={option} value={option} className="bg-[#fcf4e7]">
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button
            type="submit"
            className={`px-4 py-2 ${
              isGenerating ? "bg-[#232221]" : "bg-[#2D2E26] hover:bg-[#232221]"
            } text-xl text-white rounded w-[70%] mx-auto font-['Ortland']!`}
          >
            {isGenerating ? "Generating..." : "Generate"}
          </button>
          {isGenerating && (
            <p className="w-full text-center text-xs mt-3">
              Wait 1-2 min while our writer creates your content.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default GenerationForm;

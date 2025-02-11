// components/AdminPanel.js
import React, { useState } from "react";
import axios from "../utils/axios";

const AdminPanel = () => {
  const [title, setTitle] = useState("");
  const [englishTitle, setEnglishTitle] = useState("");
  const [body, setBody] = useState("");
  const [JLPTLevel, setJLPTLevel] = useState("");
  const [genre, setGenre] = useState("");
  const [contentType, setContentType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Dropdown options (customize as needed)
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
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const response = await axios.post(
        "/api/admin/createContent",
        { title, englishTitle, body, JLPTLevel, genre, contentType },
        { withCredentials: true } // sends Clerk's cookies automatically
      );

      if (response.data.success) {
        setSuccessMessage("Content created successfully!");
        // Clear the form fields after successful submission
        // setTitle("");
        // setBody("");
        // setJLPTLevel("");
        // setGenre("");
        // setContentType("");
      } else {
        setError("Error creating content.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcf4e7] p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-[#2D2E26]">
          Admin Panel - Create Content
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-lg font-medium text-[#2D2E26] mb-1"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2D2E26]"
              placeholder="Enter title"
              required
            />
          </div>
          <div>
            <label
              htmlFor="englishTitle"
              className="block text-lg font-medium text-[#2D2E26] mb-1"
            >
              English Title
            </label>
            <input
              id="englishTitle"
              type="text"
              value={englishTitle}
              onChange={(e) => setEnglishTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2D2E26]"
              placeholder="Enter English title"
              required
            />
          </div>

          <div>
            <label
              htmlFor="body"
              className="block text-lg font-medium text-[#2D2E26] mb-1"
            >
              Body
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2D2E26]"
              placeholder="Enter content body..."
              rows="6"
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="jlptLevel"
                className="block text-lg font-medium text-[#2D2E26] mb-1"
              >
                JLPT Level
              </label>
              <select
                id="jlptLevel"
                value={JLPTLevel}
                onChange={(e) => setJLPTLevel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2D2E26]"
                required
              >
                <option value="">Select JLPT Level</option>
                {jlptOptions.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="genre"
                className="block text-lg font-medium text-[#2D2E26] mb-1"
              >
                Genre
              </label>
              <select
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2D2E26]"
                required
              >
                <option value="">Select Genre</option>
                {genreOptions.map((gen) => (
                  <option key={gen} value={gen}>
                    {gen}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="contentType"
                className="block text-lg font-medium text-[#2D2E26] mb-1"
              >
                Content Type
              </label>
              <select
                id="contentType"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2D2E26]"
                required
              >
                <option value="">Select Content Type</option>
                {contentTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#2D2E26] text-white font-semibold rounded-lg hover:bg-[#1b1c18] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2D2E26]"
            >
              {loading ? "Creating Content..." : "Create Content"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;

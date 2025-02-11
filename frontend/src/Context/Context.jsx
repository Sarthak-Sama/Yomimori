import React, { createContext, useEffect, useState } from "react";
import axios from "../utils/axios";
import { useUser } from "@clerk/clerk-react";

export const ContentContext = createContext();

function ContentProvider({ children }) {
  const { user } = useUser();
  const [fetchedUser, setFetchedUser] = useState(null);

  const [generatedContentArray, setGeneratedContentArray] = useState(null);
  const [archiveContent, setArchiveContent] = useState(null);
  const [jlptLevel, setJlptLevel] = useState("N5"); // Default level
  const [genratedContentJlptLevel, setGeneratedContentJlptLevel] =
    useState("N5");
  const [page, setPage] = useState(1);
  const [generatedContentPage, setGeneratedContentPage] = useState(1);

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/fetchUser");
      setFetchedUser(response.data.user);
    } catch (error) {}
  };

  const fetchArchive = async (level, pageNum = 1) => {
    try {
      const response = await axios.get("/api/fetchPreWrittenContent", {
        params: {
          jlptLevel: level,
          page: pageNum,
        },
      });
      // Assuming response.data.contents holds the relevant data.
      setArchiveContent(response.data.contents);
    } catch (error) {
      console.error("Error fetching prewritten content:", error);
    }
  };

  const fetchGeneratedContent = async (level, page = 1) => {
    try {
      const response = await axios.get("/api/fetchCreatedContent", {
        // Send jlptLevel and page as query parameters
        params: {
          jlptLevel: level,
          page: page,
        },
      });
      console.log(response);
      // Check if the API responded with success and then update your state
      if (response.data.success) {
        setGeneratedContentArray(response.data.contents);
      } else {
        console.error("Failed to fetch content:", response.data.error);
      }
    } catch (error) {
      console.error("Error fetching generated content:", error);
    }
  };

  useEffect(() => {
    if (user) {
      console.log(user);
      fetchUser();
    }
  }, [user]);

  useEffect(() => {
    fetchArchive(jlptLevel, page);
  }, [jlptLevel, page]);

  useEffect(() => {
    fetchGeneratedContent(genratedContentJlptLevel, generatedContentPage);
  }, [genratedContentJlptLevel, generatedContentPage]);

  return (
    <ContentContext.Provider
      value={{
        user,
        fetchedUser,
        setFetchedUser,
        jlptLevel,
        setJlptLevel,
        genratedContentJlptLevel,
        setGeneratedContentJlptLevel,
        page,
        setPage,
        generatedContentPage,
        setGeneratedContentPage,
        generatedContentArray,
        setGeneratedContentArray,
        archiveContent,
        setArchiveContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export default ContentProvider;

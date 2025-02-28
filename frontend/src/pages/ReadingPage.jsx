import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../utils/axios";
import { ContentContext } from "../Context/Context";
import { RiHome2Fill } from "@remixicon/react";
import ToggleSwitch from "../components/partials/ToggleSwitch"; // Import the ToggleSwitch component
import Skeleton from "react-loading-skeleton";

function ReadingPage() {
  const { archiveContent, generatedContentArray } = useContext(ContentContext);
  const { id } = useParams();
  const [popup, setPopup] = useState(null);
  const [showFurigana, setShowFurigana] = useState(true); // State to manage furigana display
  const navigate = useNavigate();
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(null);
  const tokenContainerRef = useRef(null);
  const [popupPosition, setPopupPosition] = useState({ left: 0, top: 0 });
  const [openContent, setOpenContent] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  let lastTokenValue = "";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (archiveContent && generatedContentArray) {
      const combined = [...archiveContent, ...generatedContentArray];
      const content = combined.find((content) => content._id === id);
      setOpenContent(content);
    }
  }, [archiveContent, generatedContentArray, id]);

  useEffect(() => {
    if (!openContent) return;
    console.log("Open content:", openContent);
  }, [openContent]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tokenContainerRef.current &&
        !tokenContainerRef.current.contains(event.target)
      ) {
        setPopup(null);
        setSelectedTokenIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleTokenClick = async (token, index, e) => {
    e.stopPropagation();
    if (!token || !token.surface) {
      console.error("Token or token.surface is undefined");
      return;
    }
    const clickX = e.clientX;
    const clickY = e.clientY;

    setPopup({
      token,
      result: null,
      loading: true,
      error: null,
      position: { x: clickX, y: clickY },
    });

    // Set the selected token index
    setSelectedTokenIndex(index);

    // Get the bounding rectangle of the clicked element
    const rect = e.target.getBoundingClientRect();
    const popupWidth = 200; // Adjust this value based on your popup width
    const popupHeight = 100; // Adjust this value based on your popup height

    // Calculate the position of the popup
    let left = rect.left + window.scrollX;
    let top = rect.bottom + window.scrollY;

    // Adjust the position if the popup goes beyond the viewport boundaries
    if (left + popupWidth > window.innerWidth) {
      left = window.innerWidth - popupWidth - 10; // Add some padding
    }
    if (top + popupHeight > window.innerHeight) {
      top = window.innerHeight - popupHeight - 10; // Add some padding
    }

    // Set the position of the popup
    setPopupPosition({ left, top });

    // Send a request to the backend to fetch the word's meaning using axios
    try {
      const response = await axios.get(`/api/entries/word/${token.surface}`);
      setPopup((prev) => ({
        ...prev,
        result: response.data,
        loading: false,
      }));
    } catch (error) {
      console.error(error);
      setPopup((prev) => ({
        ...prev,
        result: null,
        loading: false,
        error: "Error fetching definition.",
      }));
    }
  };

  const lastTapRef = useRef(0);
  const DOUBLE_TAP_DELAY = 300; // milliseconds

  const handleTouchEnd = (token, index, e) => {
    e.preventDefault();
    e.stopPropagation();
    const now = Date.now();
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      handleTokenClick(token, index, e);
    }
    lastTapRef.current = now;
  };

  return (
    <div
      className="relative w-full h-full overflow-y-scroll p-4 pl-10 pt-10 md:pl-15 md:pr-10 md:py-10"
      onClick={() => setPopup(null)}
    >
      <div className="w-full flex flex-col md:flex-row items-center justify-between">
        <h1 className="font-['boldKana']! text-4xl md:text-6xl">
          {openContent && openContent.title ? (
            openContent.title
          ) : (
            <Skeleton width={isMobile ? 335 : 735} height={80} />
          )}
        </h1>
        <span
          onClick={() => navigate("/")}
          className="hidden sm:block opacity-80 hover:opacity-100 transition-all duration-300 ease-in-out mt-4 md:mt-0"
        >
          <RiHome2Fill size={45} />
        </span>
      </div>
      <div className="w-full md:w-[55%] mt-5 flex flex-col md:flex-row items-center justify-between">
        <h2 className="text-lg md:text-xl">
          {openContent && openContent.englishTitle ? (
            openContent.englishTitle
          ) : (
            <Skeleton width={300} height={40} />
          )}
        </h2>
        <div className="mb-2 flex items-center">
          {openContent ? (
            <>
              <ToggleSwitch
                isOn={showFurigana}
                handleToggle={() => setShowFurigana(!showFurigana)}
              />
              <span className="ml-3 translate-y-[10px] inline-block">
                Toggle Furigana
              </span>
            </>
          ) : (
            <Skeleton
              style={{ transform: "translateY(5px)" }}
              width={180}
              height={30}
            />
          )}
        </div>
      </div>

      <hr className="w-full md:w-[60%] my-10" />

      <div ref={tokenContainerRef}>
        {openContent && openContent.tokens ? (
          openContent.tokens.map((token, index) => {
            if (!token) return null; // Skip undefined/null tokens
            if (token.surface === "/n") return <br key={index} />;
            else if (token.surface === "/") {
              lastTokenValue = "/";
              return null;
            } else if (token.surface === "n" && lastTokenValue === "/") {
              lastTokenValue = "";
              return <br key={index} />;
            }
            return (
              <span
                key={index}
                className={`inline-block cursor-pointer text-lg md:text-2xl my-2 ${
                  !!popup && selectedTokenIndex === index
                    ? "bg-[#2D2E26] text-[#fcf4e7]"
                    : ""
                }`}
                onClick={
                  !isMobile && token && token.surface
                    ? (e) => handleTokenClick(token, index, e)
                    : undefined
                }
                onTouchEnd={
                  isMobile && token && token.surface
                    ? (e) => handleTouchEnd(token, index, e)
                    : undefined
                }
              >
                {showFurigana && token.reading !== token.surface ? (
                  <ruby>
                    {token.surface}
                    <rt className="furigana">{token.reading}</rt>
                  </ruby>
                ) : (
                  token.surface
                )}
              </span>
            );
          })
        ) : (
          <Skeleton count={15} height={35} />
        )}
      </div>

      {popup && popup.token && (
        <div
          style={{ top: popupPosition.top, left: popupPosition.left }}
          className="absolute bg-white p-4 border border-gray-400 rounded shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {popup.loading ? (
            <p>Loading definition...</p>
          ) : popup.error ? (
            <p>{popup.error}</p>
          ) : (
            <>
              <p className="font-bold text-2xl">{popup.token.surface}</p>
              {popup.result ? (
                <ul className="mt-2 text-lg">
                  <li>
                    <strong>Reading:</strong> {popup.result.reading}
                  </li>
                  <li>
                    <strong>Meaning:</strong> {popup.result.englishMeaning}
                  </li>
                </ul>
              ) : (
                <p>No definition found.</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ReadingPage;

import React, { useContext, useEffect, useState } from "react";
import ContentCard from "../components/partials/ContentCard";
import { ContentContext } from "../Context/Context";
import { RiAddFill } from "@remixicon/react";
import GenerationForm from "../components/GenerationForm";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Homepage({ setIsLoginBoxVisible }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isgenFormOpen, setIsGenFormOpen] = useState(false);
  // Fetch archive content when component mounts and when jlptLevel changes
  const {
    user,
    jlptLevel,
    setJlptLevel,
    genratedContentJlptLevel,
    setGeneratedContentJlptLevel,
    setPage,
    setGeneratedContentPage,
    archiveContent,
    generatedContentArray,
  } = useContext(ContentContext);

  const isMobileScreen = () => {
    const mobileBreakpoint = 768; // Define the breakpoint for mobile screens
    return window.innerWidth <= mobileBreakpoint;
  };
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(isMobileScreen());
    };

    // Check screen size on initial render
    checkScreenSize();

    // Add event listener to check screen size on window resize
    window.addEventListener("resize", checkScreenSize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <div className="w-full h-full overflow-x-hidden overflow-y-scroll pl-15 py-10">
      <div>
        <div className="w-full flex flex-col sm:flex-row justify-center sm:justify-between items-start sm:items-center sm:px-10">
          <h2 className="font-['Ortland']! text-5xl">Yomimori Archive</h2>
          {/* Dropdown to select JLPT level */}
          <div className="w-[90%] sm:w-fit my-4 sm:block flex items-center justify-between">
            <label htmlFor="jlptLevel" className="mr-2 font-['Ortland']!">
              Select JLPT Level:
            </label>
            <select
              id="jlptLevel"
              value={jlptLevel}
              onChange={(e) => {
                setJlptLevel(e.target.value);
                setPage(1); // reset page if needed
              }}
              className="border border-gray-300 rounded p-2 font-['Ortland']! bg-[#2D2E26] text-[#fcf4e7]"
            >
              <option
                value="N5"
                className="font-['Ortland']! bg-[#2D2E26] text-[#fcf4e7]"
              >
                N5
              </option>
              <option
                value="N4"
                className="font-['Ortland']! bg-[#2D2E26] text-[#fcf4e7]"
              >
                N4
              </option>
              <option
                value="N3"
                className="font-['Ortland']! bg-[#2D2E26] text-[#fcf4e7]"
              >
                N3
              </option>
              <option
                value="N2"
                className="font-['Ortland']! bg-[#2D2E26] text-[#fcf4e7]"
              >
                N2
              </option>
              <option
                value="N1"
                className="font-['Ortland']! bg-[#2D2E26] text-[#fcf4e7]"
              >
                N1
              </option>
            </select>
          </div>
        </div>

        {/* Render archive content */}
        <div className="w-full overflow-x-scroll mt-5 pb-5">
          <div className="w-fit flex gap-5">
            {archiveContent
              ? archiveContent.map((contentData, index) => (
                  <ContentCard key={index} data={contentData} />
                ))
              : [1, 2, 3, 4, 5].map((_, i) => (
                  <Skeleton
                    key={i}
                    borderRadius="0.75rem"
                    width="15rem"
                    height="18.5rem"
                  />
                ))}
          </div>
        </div>

        <div>
          <div className="w-full flex flex-col sm:flex-row justify-center sm:justify-between items-start sm:items-center sm:px-10 mt-15">
            <h2 className="font-['Ortland']! text-5xl">
              Generate {isMobile && <br />} using AI
            </h2>
            {/* Dropdown to select JLPT level */}
            <div className="w-[90%] sm:w-fit my-4 sm:block flex items-center justify-between">
              <label htmlFor="jlptLevel" className="mr-2 font-['Ortland']!">
                Select JLPT Level:
              </label>
              <select
                id="jlptLevel"
                value={genratedContentJlptLevel}
                onChange={(e) => {
                  setGeneratedContentJlptLevel(e.target.value);
                  setGeneratedContentPage(1); // reset page if needed
                }}
                className="border border-gray-300 rounded p-2 font-['Ortland']! bg-[#2D2E26] text-[#fcf4e7]"
              >
                <option
                  value="N5"
                  className="font-['Ortland']! bg-[#2D2E26] text-[#fcf4e7]"
                >
                  N5
                </option>
                <option
                  value="N4"
                  className="font-['Ortland']! bg-[#2D2E26] text-[#fcf4e7]"
                >
                  N4
                </option>
                <option
                  value="N3"
                  className="font-['Ortland']! bg-[#2D2E26] text-[#fcf4e7]"
                >
                  N3
                </option>
                <option
                  value="N2"
                  className="font-['Ortland']! bg-[#2D2E26] text-[#fcf4e7]"
                >
                  N2
                </option>
                <option
                  value="N1"
                  className="font-['Ortland']! bg-[#2D2E26] text-[#fcf4e7]"
                >
                  N1
                </option>
              </select>
            </div>
          </div>
          <div className="w-full overflow-x-scroll mt-5 pb-5">
            <div className="flex w-fit gap-5">
              {generatedContentArray ? (
                <>
                  <div
                    onClick={() => {
                      if (user) {
                        setIsGenFormOpen(true);
                      } else {
                        setIsLoginBoxVisible(true);
                      }
                    }}
                    className="w-[15rem] aspect-[4/5] border-2 rounded-xl overflow-hidden flex flex-col justify-center items-center relative group"
                  >
                    <span className="scale-[0.7] group-hover:scale-[1.5] transition-all duration-300 ease-out">
                      <RiAddFill size={100} />
                    </span>
                    <span className="absolute inline-block bottom-5 left-1/2 -translate-x-1/2 text-lg group-hover:tracking-[0.3rem] transition-all duration-300 ease-out">
                      GENERATE
                    </span>
                  </div>
                  {generatedContentArray?.map((contentData, index) => (
                    <ContentCard key={index} data={contentData} />
                  ))}
                </>
              ) : (
                [1, 2, 3, 4, 5].map((_, i) => (
                  <Skeleton
                    key={i}
                    borderRadius="0.75rem"
                    width={240}
                    height={320}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      {isgenFormOpen && (
        <div className="absolute left-0 top-0 w-screen h-screen">
          <div
            onClick={() => setIsGenFormOpen(false)}
            className="w-full h-full bg-black/30"
          ></div>
          <GenerationForm setIsGenFormOpen={setIsGenFormOpen} />
        </div>
      )}
    </div>
  );
}

export default Homepage;

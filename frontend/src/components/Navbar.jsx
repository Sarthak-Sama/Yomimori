import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { RiUserFill } from "@remixicon/react";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { ContentContext } from "../Context/Context";

function Navbar({ isOpen, setIsOpen, setIsLoginBoxVisible }) {
  const { fetchedUser } = useContext(ContentContext);

  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) {
      // Swiped left
      setIsOpen(false);
    }
  };

  return (
    <motion.div
      // Using fixed positioning to have the navbar slide in from the left.
      className="fixed left-0 top-0 h-screen  w-[20rem]! bg-[#fcf4e7] border-r-2 border-[#2D2E26] shadow-2xl"
      initial={{ x: "-94%" }}
      animate={{ x: isOpen ? 0 : "-94%" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="p-4 flex flex-col items-center">
        <Link to={"/"} className="font-['Ortland']! text-[8vw] sm:text-[3rem]">
          YomiMori
        </Link>
        <hr className="w-[80%] mx-auto mt-2 mb-10" />

        <SignedIn>
          <div className="w-full flex flex-col items-center justify-center">
            <h3 className="text-[5vw] sm:text-[1.5rem]">Your Profile</h3>
            <div className="scale-[2.5] mt-12">
              <UserButton />
            </div>
            <h3 className="text-[5vw] sm:text-[1.75vw] mt-8">
              {fetchedUser?.name}
            </h3>
            <hr className="w-[80%] mx-auto mt-10 mb-5" />
            <div className="w-full mt-15 flex flex-col items-center">
              <h4 className="text-[4vw] sm:text-[1.25rem]">
                Today's Generation Count
              </h4>
              <div id="progress-bar" className="relative w-[80%] mt-2">
                <hr className="absolute border-[0.4rem] w-full border-[#2D2E26] rounded-full" />
                <hr
                  className={`absolute border-[0.4rem] border-[#50C878] rounded-full`}
                  style={{
                    width: `${(fetchedUser?.dailyGenerationCount * 100) / 5}%`,
                  }}
                />
              </div>

              <span className="font-bold text-[5vw] sm:text-[1.25vw] mt-5">
                {fetchedUser ? fetchedUser.dailyGenerationCount : ""} / 5
              </span>
              <h5 className="text-[4vw] text-center sm:text-[0.9vw] opacity-80 mt-5">
                *You get to generate 5 stories/articles per day.*
              </h5>
            </div>
          </div>
        </SignedIn>
        <SignedOut>
          <h3 className="mt-10 text-center text-[5vw] sm:text-[1.5rem]">
            Welcome!! Login and Start Generating...
          </h3>
          <div
            onClick={() => setIsLoginBoxVisible(true)}
            className="text-[5vw] sm:text-[1.5vw] mx-auto border-[1px] w-fit px-10 py-2 rounded-full mt-5 hover:bg-[#2D2E26] hover:text-[#fcf4e7] transition-all duration-300 ease-in-out"
          >
            LOGIN
          </div>
        </SignedOut>
      </div>

      {/* The clickable circle that toggles the navbar. */}
      <div
        onClick={() => setIsOpen(true)}
        className="cursor-pointer rounded-full bg-[#fcf4e7] w-[3rem] h-[3rem] absolute top-1/2 right-0 translate-x-[50%] -translate-y-1/2 flex items-center justify-center"
      >
        <RiUserFill
          size={18}
          color="#2D2E26"
          className="sm:scale-100 translate-x-[5%] scale-150"
        />
        {/* Right half border overlay */}
        <span
          className="absolute top-0 right-0 h-full w-1/2 pointer-events-none"
          style={{
            borderTop: "2px solid #2D2E26",
            borderBottom: "2px solid #2D2E26",
            borderRight: "2px solid #2D2E26",
            borderLeft: "none",
            borderTopRightRadius: "9999px",
            borderBottomRightRadius: "9999px",
          }}
        ></span>
      </div>
    </motion.div>
  );
}

export default Navbar;

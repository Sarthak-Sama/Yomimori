import React from "react";
import { Link } from "react-router-dom";
import kanjiHM from "../../constants/genreKanji";

const ContentCard = React.forwardRef(({ data }, ref) => {
  return (
    <Link
      ref={ref}
      to={`/read/${data._id}`}
      className="w-[15rem] aspect-[4/5] border-2 rounded-xl overflow-hidden"
    >
      <div className="w-full h-[70%] text-white flex flex-col gap-3 items-center justify-center bg-[#2D2E26] rounded-b-xl group">
        <span
          className={`font-['boldKana']! group-hover:text-[#e94545] text-[6rem] text-[#fcf4e7] transition-all duration-300 ease-in-out`}
        >
          {kanjiHM[data.genre]}
        </span>
        <span className="uppercase tracking-[0.5rem] group-hover:text-[#e94545] transition-all duration-300 ease-in-out">
          {data.genre}
        </span>
      </div>
      <div className="w-full h-[30%] bg-[#fcf4e7] flex flex-col">
        <h3 className="w-full p-2 mt-3 font-semibold text-lg/[0.4rem] ">
          {data.title}
        </h3>
        <h3 className="w-full p-2 text-sm -mt-1">{data.englishTitle}</h3>
      </div>
    </Link>
  );
});

export default ContentCard;

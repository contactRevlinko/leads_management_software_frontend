import React from "react";
import { TrendingUp } from "lucide-react";



const TypeOfCard = ({ name, leads }) => {


  return (
    <div className="flex md:gap-4 gap-2  md:m-1 w-full  p-2 bg-white rounded-xl border-2 border-gray-200 ">
      <div className=" m-2 " >
        <TrendingUp className="bg-indigo-50  w-10 h-10 p-2 rounded-xl text-indigo-700" />
      </div>
      <div>
        <p  className="text-gray-700 text-xs whitespace-break-spaces  md:text-sm">{name}</p>
        <span className="text-xl font-medium">{leads}</span>
      </div>
    </div>
  );
};

export default TypeOfCard;

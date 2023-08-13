import React from "react";
import { iconUrlFromCode } from "../services/weatherService";

function Forecast({ title, items }) {
  return (
    <>
    
      <div className="py-2">
        <p className="text-white font-medium px-2 pb-2 text-lg ">{title}</p>
        <hr className="py-1" />
        <div className="flex flex-row items-center justify-between ">
        {items.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center "
          >
          <p className="font-light text-sm "> {item.time || item.day } </p>
          <img
              src={iconUrlFromCode(item.icon)}
            className="w-13 my-1"
            alt=""
            />
          <p className="font-medium"> {`${item.temp.toFixed()}°`} </p>
        </div>
            ))}
            </div>
      </div>
    </>
  );
}

export default Forecast;

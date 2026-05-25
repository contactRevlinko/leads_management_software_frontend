import React, { useState } from "react";
import {
  ChartNoAxesGantt,
  Download,
  ListFilter,
  Calendar,
  Upload,
} from "lucide-react";
import CustomDropDown from "./CustomDropDown";

const LeadManageRow = ({
  filter,
  setFilter,
  selectDate,
  setSelectDate,
  handleExportExcel,
  filtered,
  setSortOrder,
  sortOrder,
  handleUploadFile,
}) => {
  const [openSort, setOpenSort] = useState(false);
  const [value, setValue] = useState("High");
  // console.log(filtered)

  // console.log(openSort);

  return (
    <div className="bg-white md:flex md:justify-between p-4 md:items-center rounded-2xl border-2 border-gray-200 md:mt-6">
      <div className="md:flex   md:justify-evenly md:gap-16 lg:flex-row lg:items-center lg:justify-evenly w-full ">
        <div className=" p-2 md:w-full  bg-indigo-50 flex mb-2 justify-evenly rounded-2xl md:gap-3 mr-2  md:justify-evenly lg:justify-evenly border-2 border-gray-200 ">
          <div className="flex p-2 gap-4 mr-4 border-r-2 border-gray-200 ">
            <ListFilter className=" mr-10 mt-2" size={17} />
            <div className="-ml-8">
              <CustomDropDown
                options={[
                  "All",
                  "New",
                  "Contacted",
                  "Interested",
                  "Closed Won",
                  "Closed Lost",
                ]}
                value={filter}
                onChange={setFilter}
              />
            </div>
          </div>

          <div className="mt-2 ">
            <CustomDropDown
              options={["High", "Medium", "Low"]}
              value={value}
              onChange={setValue}
            />
          </div>
        </div>

        <div className="flex md:justify-between md:items-center md:-ml-10 ">
          <div className=" bg-indigo-50 md:p-3 p-1 lg:p-3  md:text-sm lg:text-sm rounded-xl border-2 border-gray-200 ">
            <input
              value={selectDate}
              onChange={(e) => setSelectDate(e.target.value)}
              type="date"
              className="text-gray-500 outline-none"
            />
          </div>

          <div className="flex gap-5 items-center lg:gap-16 whitespace-nowrap ">
            <button
              className=" lg:ml-10  ml-5 gap-2 flex whitespace-nowrap items-center"
              onClick={() => setOpenSort(!openSort)}
            >
              <ChartNoAxesGantt width={17} />
              <p className="text-sm  hidden lg:block">Sort </p>
            </button>

            {openSort && (
              <div className=" bg-white border  border-gray-200 rounded-xl shadow-lg ">
                <button
                  onClick={() => {
                    setSortOrder("asc");
                    setOpenSort(false);
                  }}
                  className="  px-1 text-xs hover:bg-indigo-50"
                >
                  Asc
                </button>

                <button
                  onClick={() => {
                    setSortOrder("desc");
                    setOpenSort(false);
                  }}
                  className=" px-1 text-xs hover:bg-indigo-50"
                >
                  desc
                </button>
              </div>
            )}

            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                console.log(e.dataTransfer.files[0]);
                const file = e.dataTransfer.files[0];
                console.log(e.dataTransfer.files[0]);

                if (file) {
                  handleUploadFile({ target: { files: [file] } });
                }
              }}
              className=" text-sm lg:flex gap-2 whitespace-nowrap"
            >
              <Upload width={17} />
              <input
                type="file"
                accept=".xlsx , .xls"
                hidden
                onChange={handleUploadFile}
              />
              <p className="hidden lg:block "> Upload File </p>
            </label>

            <div className="flex gap-1 text-sm ">
              <button onClick={handleExportExcel} className="flex gap-2">
                <Download width={17} />
                <p className="hidden lg:block">Export</p>{" "}
              </button>
            </div>
            <div />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadManageRow;

import React from "react";

import { IoIosArrowBack,IoIosSearch,IoMdWallet } from "react-icons/io";
import { IoMenu,IoCloudUpload } from "react-icons/io5";
import { RiSortAsc,RiSortDesc } from "react-icons/ri";

import { FaRegCircle,FaRegCheckCircle,FaChevronCircleRight } from "react-icons/fa";
import { HiRefresh } from "react-icons/hi";
export const Icon = (props) => {
  const src = ""
  return (
    <img alt="" src={src} {...props} />
  )
}


export const Icons = {
  "back": <IoIosArrowBack/>,
  "menu": <IoMenu/>,
  "upload": <IoCloudUpload/>,
  "refresh": <HiRefresh/>,
  "wallet": <IoMdWallet/>,
  "search": <IoIosSearch/>,
  "sortAsc": <RiSortAsc/>,
  "sortDesc": <RiSortDesc/>,
  "FaRegCircle": <FaRegCircle/>,
  "FaRegCheckCircle": <FaRegCheckCircle/>,
  "FaChevronCircleRight": <FaChevronCircleRight/>
}

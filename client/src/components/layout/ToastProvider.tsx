"use client";

import { Toaster } from "react-hot-toast";
import { globalToastOptions } from "@/utils/ToasterProps";

const ToasterProvider = () => {
  return <Toaster {...globalToastOptions} />;
};

export default ToasterProvider;

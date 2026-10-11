"use client";

import React from "react";
import { BeatLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 w-full h-[100dvh] bg-white flex items-center justify-center m-0 p-0 overflow-hidden">
      <div className="flex items-center justify-center p-4">
        <BeatLoader
          color="#FF6C0C"
          size={14}
          margin={5}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </div>
  );
};

export default Loading;


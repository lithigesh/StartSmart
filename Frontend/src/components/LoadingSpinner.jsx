import React from "react";
import { FaSpinner } from "react-icons/fa";
import clsx from "clsx";

const SIZE_CLASSES = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const LoadingSpinner = ({
  message,
  size = "lg",
  fullScreen = false,
  containerClassName,
  spinnerClassName,
  messageClassName,
}) => {
  const resolvedContainerClassName =
    containerClassName ||
    (fullScreen
      ? "min-h-screen bg-black flex items-center justify-center"
      : "flex items-center justify-center");

  const sizeClassName = SIZE_CLASSES[size] || size;

  return (
    <div className={resolvedContainerClassName}>
      <div className="text-center">
        <FaSpinner
          className={clsx(
            sizeClassName,
            "animate-spin text-current mx-auto",
            spinnerClassName
          )}
        />
        {message ? (
          <p className={clsx("mt-4 text-white font-manrope", messageClassName)}>
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default LoadingSpinner;

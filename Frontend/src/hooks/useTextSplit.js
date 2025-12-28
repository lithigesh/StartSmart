import { useEffect, useState } from "react";

export const useTextSplit = (
  text,
  { delay = 0, staggerDelay = 50, type = "chars" } = {}
) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const splitText = () => {
    if (type === "words") {
      return text.split(" ").map((word, i) => ({
        content: word,
        delay: i * staggerDelay,
      }));
    }
    // Split by characters
    return text.split("").map((char, i) => ({
      content: char,
      delay: i * staggerDelay,
    }));
  };

  return { isVisible, items: splitText() };
};

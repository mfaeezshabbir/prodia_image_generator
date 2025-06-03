import React, { useState, useEffect } from "react";

interface TypeEffectProps {
  textArray: string[]; // Array of strings to type out
  typingSpeed?: number; // Speed of typing (milliseconds per character)
  delay?: number; // Delay before starting to type the next word
}

const TypeEffect: React.FC<TypeEffectProps> = ({
  textArray,
  typingSpeed = 100, // Default speed of 100ms per character
  delay = 2000, // Default delay of 2 seconds before next sentence
}) => {
  const [displayText, setDisplayText] = useState(""); // Current text displayed
  const [index, setIndex] = useState(0); // Current index of the string being typed
  const [subIndex, setSubIndex] = useState(0); // Current character index
  const [isDeleting, setIsDeleting] = useState(false); // Whether we are deleting text
  const [pause, setPause] = useState(false); // Pause flag between strings

  useEffect(() => {
    if (pause) return; // If paused, don't continue typing

    if (subIndex === textArray[index].length + 1 && !isDeleting) {
      // When the sentence is fully typed
      setPause(true); // Pause before deleting
      setTimeout(() => {
        setIsDeleting(true);
        setPause(false);
      }, delay); // Delay before starting to delete text
    } else if (subIndex === 0 && isDeleting) {
      // When text is fully deleted
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % textArray.length); // Move to the next word
    }

    const timeout = setTimeout(
      () => {
        setSubIndex((prev) => {
          const newIndex = prev + (isDeleting ? -1 : 1);
          setDisplayText(textArray[index].substring(0, newIndex));
          return newIndex;
        }); // Add or remove characters
      },
      isDeleting ? typingSpeed / 2 : typingSpeed
    ); // Speed is faster for deletion

    return () => clearTimeout(timeout); // Cleanup timeout
  }, [subIndex, index, isDeleting, pause, textArray, delay, typingSpeed]);

  return (
    <div className="inline">
      <span>{`${displayText}${
        subIndex === textArray[index].length ? "" : "|"
      }`}</span>
    </div>
  );
};

export default TypeEffect;

import { useState, useEffect, useRef } from "react";
import "./TypewriterText.scss";

interface TypewriterTextProps {
  text: string;
  speed?: number;
}

export const TypewriterText = ({ text, speed = 30 }: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayedText("");
    indexRef.current = 0;

    const intervalId = setInterval(() => {
      if (indexRef.current >= text.length) {
        clearInterval(intervalId);
        return;
      }

      const nextChar = text.charAt(indexRef.current);
      setDisplayedText((prev) => prev + nextChar);
      indexRef.current++;
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return (
    <div className="typewriter-content">
      {displayedText}
      {displayedText.length < text.length && <span className="cursor">|</span>}
    </div>
  );
};

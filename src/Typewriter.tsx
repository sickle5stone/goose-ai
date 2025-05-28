import { useEffect, useRef, useState } from "react";

interface TypewriterProps {
  text: string;
  delay: number;
  onUpdate?: () => void;
}

const Typewriter = ({ text, delay, onUpdate }: TypewriterProps) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);

        // Call onUpdate callback to trigger scroll
        if (onUpdate) {
          onUpdate();
        }

        // Scroll the current element into view
        if (textRef.current) {
          textRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [text, currentIndex, delay, onUpdate]);

  // Reset when text changes
  useEffect(() => {
    setCurrentText("");
    setCurrentIndex(0);
  }, [text]);

  return <div ref={textRef}>{currentText}</div>;
};

export default Typewriter;

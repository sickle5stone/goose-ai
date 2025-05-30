import { TextFormatter, defaultTextFormatter } from "./utils/textFormatter";
import { useEffect, useRef, useState } from "react";

interface TypewriterProps {
  text: string;
  delay: number;
  onUpdate?: () => void;
  formatterOptions?: TextFormatterOptions;
  disableAutoScroll?: boolean;
}

const Typewriter = ({
  text,
  delay,
  onUpdate,
  formatterOptions,
  disableAutoScroll,
}: TypewriterProps) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);

  // Create formatter instance with custom options if provided
  const formatter = formatterOptions
    ? new TextFormatter(formatterOptions)
    : defaultTextFormatter;

  const formatText = (text: string) => {
    return formatter.formatText(text);
  };

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
        if (textRef.current && !disableAutoScroll) {
          textRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }, delay + currentIndex * 0.01);

      return () => clearTimeout(timeout);
    }
  }, [text, currentIndex, delay, onUpdate, disableAutoScroll]);

  // Reset when text changes
  useEffect(() => {
    setCurrentText("");
    setCurrentIndex(0);
  }, [text]);

  return <div ref={textRef}>{formatText(currentText)}</div>;
};

export default Typewriter;

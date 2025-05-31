import { TextFormatter, defaultTextFormatter } from "./utils/textFormatter";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import type { TypewriterProps } from "./types";

interface TypewriterRef {
  cancel: () => void;
}

const Typewriter = forwardRef<TypewriterRef, TypewriterProps>(
  (
    {
      text,
      delay,
      onUpdate,
      formatterOptions,
      disableAutoScroll,
      onTypingStatusChange,
      onCancel,
    },
    ref
  ) => {
    const [currentText, setCurrentText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isCancelled, setIsCancelled] = useState(false);
    const textRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Create formatter instance with custom options if provided
    const formatter = formatterOptions
      ? new TextFormatter(formatterOptions)
      : defaultTextFormatter;

    const formatText = (text: string) => {
      return formatter.formatText(text);
    };

    // Function to determine if we should scroll at this character
    const shouldScrollAtPosition = (index: number, text: string): boolean => {
      if (index >= text.length) return false;

      const char = text[index];
      const prevChar = index > 0 ? text[index - 1] : "";
      const nextChar = index < text.length - 1 ? text[index + 1] : "";

      // Scroll at logical breakpoints:
      // 1. End of sentences (. ! ?)
      if ((char === "." || char === "!" || char === "?") && nextChar === " ") {
        return true;
      }

      // 2. After bullet points (* followed by space)
      if (prevChar === "*" && char === " ") {
        return true;
      }

      // 3. After commas in lists (when followed by space)
      if (char === "," && nextChar === " ") {
        return true;
      }

      // 4. At paragraph breaks (double newlines or significant spacing)
      if (char === "\n" || (char === " " && prevChar === " ")) {
        return true;
      }

      // 5. After parenthetical statements
      if (char === ")" && nextChar === " ") {
        return true;
      }

      // 6. After code blocks (closing backtick)
      if (char === "`" && prevChar !== "`") {
        return true;
      }

      // 7. Every 50 characters as a fallback for very long unbroken text
      if (index > 0 && index % 50 === 0) {
        return true;
      }

      return false;
    };

    // Handle cancellation
    const handleCancel = () => {
      setIsCancelled(true);
      // Don't set the full text - just stop where we are
      // setCurrentText(text); // Removed this line
      // setCurrentIndex(text.length); // Removed this line

      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Notify parent that typing is complete
      if (onTypingStatusChange) {
        onTypingStatusChange(false);
      }

      // Call the onCancel callback if provided
      if (onCancel) {
        onCancel();
      }
    };

    // Expose cancel function to parent via ref
    useImperativeHandle(ref, () => ({
      cancel: handleCancel,
    }));

    useEffect(() => {
      // Notify parent about typing status
      const isTyping = currentIndex < text.length && !isCancelled;
      if (onTypingStatusChange) {
        onTypingStatusChange(isTyping);
      }

      if (currentIndex < text.length && !isCancelled) {
        timeoutRef.current = setTimeout(() => {
          setCurrentText(text.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);

          // Call onUpdate callback to trigger scroll only at logical moments
          if (onUpdate && shouldScrollAtPosition(currentIndex, text)) {
            onUpdate();
          }

          // Scroll the current element into view at logical moments
          if (
            textRef.current &&
            !disableAutoScroll &&
            shouldScrollAtPosition(currentIndex, text)
          ) {
            textRef.current.scrollIntoView({
              behavior: "smooth",
              block: "end",
            });
          }
        }, delay + currentIndex * 0.01);

        return () => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        };
      }
    }, [
      text,
      currentIndex,
      delay,
      onUpdate,
      disableAutoScroll,
      onTypingStatusChange,
      isCancelled,
    ]);

    // Reset when text changes
    useEffect(() => {
      setCurrentText("");
      setCurrentIndex(0);
      setIsCancelled(false);

      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }, [text]);

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return <div ref={textRef}>{formatText(currentText)}</div>;
  }
);

Typewriter.displayName = "Typewriter";

export default Typewriter;

import { useEffect, useRef, useState } from "react";

export const useScrollHandler = () => {
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const conversationContainerRef = useRef<HTMLDivElement>(null);
  const mainConversationRef = useRef<HTMLDivElement>(null);
  const debouncedScrollToBottom = useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);

  // Function to check if user is at the bottom of a container
  const isAtBottom = (element: HTMLDivElement): boolean => {
    const threshold = 50; // 50px threshold to account for minor differences
    return (
      Math.abs(
        element.scrollHeight - element.scrollTop - element.clientHeight
      ) <= threshold
    );
  };

  // Handle scroll events to detect user scroll behavior
  const handleScroll = (element: HTMLDivElement | null) => {
    if (!element) return;

    if (isAtBottom(element)) {
      // User is at bottom, enable auto-scroll
      setIsAutoScrollEnabled(true);
    } else {
      // User has scrolled up, disable auto-scroll
      setIsAutoScrollEnabled(false);
    }
  };

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTo({
        top: conversationContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
    if (mainConversationRef.current) {
      mainConversationRef.current.scrollTo({
        top: mainConversationRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Debounced scroll function for typewriter updates
  const smoothScrollToBottom = () => {
    if (!isAutoScrollEnabled) return; // Don't scroll if user has scrolled up

    if (debouncedScrollToBottom.current) {
      clearTimeout(debouncedScrollToBottom.current);
    }
    debouncedScrollToBottom.current = setTimeout(() => {
      scrollToBottom();
    }, 100); // Slightly longer debounce since we're scrolling at logical moments
  };

  // Add scroll event listeners
  useEffect(() => {
    const handleDesktopScroll = () =>
      handleScroll(conversationContainerRef.current);
    const handleMobileScroll = () => handleScroll(mainConversationRef.current);

    const desktopContainer = conversationContainerRef.current;
    const mobileContainer = mainConversationRef.current;

    if (desktopContainer) {
      desktopContainer.addEventListener("scroll", handleDesktopScroll);
    }
    if (mobileContainer) {
      mobileContainer.addEventListener("scroll", handleMobileScroll);
    }

    return () => {
      if (desktopContainer) {
        desktopContainer.removeEventListener("scroll", handleDesktopScroll);
      }
      if (mobileContainer) {
        mobileContainer.removeEventListener("scroll", handleMobileScroll);
      }
    };
  }, []);

  // Cleanup debounced scroll timeout on unmount
  useEffect(() => {
    return () => {
      if (debouncedScrollToBottom.current) {
        clearTimeout(debouncedScrollToBottom.current);
      }
    };
  }, []);

  return {
    isAutoScrollEnabled,
    setIsAutoScrollEnabled,
    conversationContainerRef,
    mainConversationRef,
    scrollToBottom,
    smoothScrollToBottom,
  };
};

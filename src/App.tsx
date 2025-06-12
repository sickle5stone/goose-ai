import { useEffect, useRef, useState } from "react";

// Components
import ChatWindow from "./components/ChatWindow";
import ConversationWindow from "./components/ConversationWindow";
import FormattingTestPage from "./components/FormattingTestPage";
import type { Model } from "./types";
import RateLimitNotification from "./components/RateLimitNotification";
// Utils
import { generatePersonalizedAvatar } from "./utils/animalHelpers";
import { useConversation } from "./hooks/useConversation";
// Hooks
import { useScrollHandler } from "./hooks/useScrollHandler";

function App() {
  const activeModels: Model[] = [{ id: 3, name: "gemini-2.0-flash-exp" }];

  // State
  const [activeModel, setActiveModel] = useState<Model>(activeModels[0]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [gooseName, setGooseName] = useState("");

  // Refs for conversation display
  const conversationDisplayRef = useRef<{
    cancelCurrentTyping: () => void;
  } | null>(null);
  const mobileConversationDisplayRef = useRef<{
    cancelCurrentTyping: () => void;
  } | null>(null);

  // Custom hooks
  const {
    isAutoScrollEnabled,
    setIsAutoScrollEnabled,
    conversationContainerRef,
    mainConversationRef,
    scrollToBottom,
    smoothScrollToBottom,
  } = useScrollHandler();

  const {
    conversation,
    isLoading,
    showRateLimitNotification,
    setShowRateLimitNotification,
    rateLimitResetTime,
    handleSubmit,
  } = useConversation();

  // Load goose name from localStorage
  useEffect(() => {
    const name = localStorage.getItem("gooseName");
    if (name && name.length > 0) {
      setGooseName(name);
    }
  }, []);

  // Generate custom avatar when goose name or conversation changes
  useEffect(() => {
    if (gooseName && gooseName.length > 0) {
      const timeoutId = setTimeout(() => {
        const avatar = generatePersonalizedAvatar(gooseName, conversation);
        setCustomAvatar(avatar);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setCustomAvatar(null);
    }
  }, [gooseName, conversation]);

  // Scroll to bottom whenever conversation updates (only if auto-scroll is enabled)
  useEffect(() => {
    if (isAutoScrollEnabled) {
      scrollToBottom();
    }
  }, [conversation, isAutoScrollEnabled, scrollToBottom]);

  // Check if we should show the formatting test page
  const urlParams = new URLSearchParams(window.location.search);
  const showTest = urlParams.get("test") === "formatting";

  if (showTest) {
    return <FormattingTestPage />;
  }

  // Handle typing status changes from conversation displays
  const handleTypingStatusChange = (isCurrentlyTyping: boolean) => {
    setIsTyping(isCurrentlyTyping);
  };

  // Handle cancel typing from the fixed stop button
  const handleCancelTyping = () => {
    if (conversationDisplayRef.current) {
      conversationDisplayRef.current.cancelCurrentTyping();
    }
    if (mobileConversationDisplayRef.current) {
      mobileConversationDisplayRef.current.cancelCurrentTyping();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Container with proper spacing and responsive layout */}
      <div
        className={`transition-all duration-700 ease-in-out ${
          conversation.length > 0
            ? "container mx-auto px-4 py-6 lg:py-8"
            : "h-screen flex items-center justify-center px-4"
        }`}
      >
        {/* Mobile-first: Single column on mobile, side-by-side on desktop */}
        <div
          className={`transition-all duration-700 ease-in-out ${
            conversation.length > 0
              ? "lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start"
              : "w-full max-w-md"
          }`}
        >
          {/* Chat Input Window - Centered when no conversation, left column when conversation exists */}
          <div
            className={`transition-all duration-700 ease-in-out ${
              conversation.length > 0
                ? "lg:col-span-5 lg:sticky lg:top-8"
                : "w-full"
            }`}
          >
            <ChatWindow
              activeModels={activeModels}
              activeModel={activeModel}
              setActiveModel={setActiveModel}
              message={message}
              setMessage={setMessage}
              isLoading={isLoading}
              conversation={conversation}
              isAutoScrollEnabled={isAutoScrollEnabled}
              setIsAutoScrollEnabled={setIsAutoScrollEnabled}
              isTyping={isTyping}
              customAvatar={customAvatar}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              mainConversationRef={mainConversationRef}
              gooseName={gooseName}
              setGooseName={setGooseName}
              onSubmit={handleSubmit}
              onScroll={smoothScrollToBottom}
              onTypingStatusChange={handleTypingStatusChange}
              onCancelTyping={handleCancelTyping}
              mobileConversationDisplayRef={mobileConversationDisplayRef}
            />
          </div>

          {/* Conversation Window - Appears with smooth transition */}
          <div
            className={`hidden lg:block transition-all duration-700 ease-in-out ${
              conversation.length > 0
                ? "lg:col-span-7 opacity-100 translate-x-0"
                : "opacity-0 translate-x-8 pointer-events-none"
            }`}
          >
            <ConversationWindow
              conversation={conversation}
              isLoading={isLoading}
              isTyping={isTyping}
              conversationContainerRef={conversationContainerRef}
              onTypewriterUpdate={smoothScrollToBottom}
              onTypingStatusChange={handleTypingStatusChange}
              onCancelTyping={handleCancelTyping}
              conversationDisplayRef={conversationDisplayRef}
            />
          </div>
        </div>
      </div>

      {/* Rate Limit Notification */}
      <RateLimitNotification
        isVisible={showRateLimitNotification}
        resetTime={rateLimitResetTime}
        onClose={() => setShowRateLimitNotification(false)}
      />
    </div>
  );
}

export default App;

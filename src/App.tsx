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
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Main Chat Window */}
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

      {/* Desktop Conversation Window */}
      <div
        className={`hidden ${
          conversation.length > 0 ? "lg:flex" : "hidden"
        } lg:my-20`}
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

import ConversationDisplay from "./ConversationDisplay";
import type { Message } from "../types";

interface ConversationWindowProps {
  conversation: Message[];
  isLoading: boolean;
  isTyping: boolean;
  conversationContainerRef: React.RefObject<HTMLDivElement | null>;
  onTypewriterUpdate: () => void;
  onTypingStatusChange: (isTyping: boolean) => void;
  onCancelTyping: () => void;
  conversationDisplayRef: React.RefObject<{
    cancelCurrentTyping: () => void;
  } | null>;
}

export default function ConversationWindow({
  conversation,
  isLoading,
  isTyping,
  conversationContainerRef,
  onTypewriterUpdate,
  onTypingStatusChange,
  onCancelTyping,
  conversationDisplayRef,
}: ConversationWindowProps) {
  return (
    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 relative">
      <div
        ref={conversationContainerRef}
        className="max-h-[70vh] overflow-y-auto mb-4 no-scrollbar relative"
      >
        <ConversationDisplay
          ref={conversationDisplayRef}
          conversation={conversation}
          isLoading={isLoading}
          onTypewriterUpdate={onTypewriterUpdate}
          className="w-full space-y-6"
          disableTypewriterScroll={false}
          onTypingStatusChange={onTypingStatusChange}
        />

        {/* Fixed stop button when typing (desktop) */}
        {isTyping && (
          <div className="sticky bottom-4 flex justify-center mt-6 animate-fadeIn">
            <button
              onClick={onCancelTyping}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-xl transform-gpu"
              style={{
                animation: "slideUp 0.3s ease-out",
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="font-medium">Stop Generation</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

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
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 h-fit animate-fadeInScale">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Conversation
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Your chat history appears here
        </p>
      </div>

      {/* Conversation Content */}
      <div className="relative">
        <div
          ref={conversationContainerRef}
          className="max-h-[calc(100vh-16rem)] overflow-y-auto p-6 no-scrollbar relative"
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

          {/* Fixed stop button when typing */}
          {isTyping && (
            <div className="sticky bottom-4 flex justify-center mt-8 animate-fadeIn">
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

        {/* Loading indicator when no conversation yet */}
        {conversation.length === 0 && isLoading && (
          <div className="p-12 text-center">
            <div className="animate-pulse">
              <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-4 animate-bounce"></div>
              <p className="text-gray-500">Starting conversation...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

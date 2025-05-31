import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import type { ConversationDisplayProps } from "../types";
import Typewriter from "../Typewriter";

interface ConversationDisplayRef {
  cancelCurrentTyping: () => void;
}

const ConversationDisplay = forwardRef<
  ConversationDisplayRef,
  ConversationDisplayProps
>(
  (
    {
      conversation,
      isLoading,
      onTypewriterUpdate,
      className = "",
      messageClassName = "",
      disableTypewriterScroll = false,
      onTypingStatusChange,
    },
    ref
  ) => {
    const [typingMessageId, setTypingMessageId] = useState<number | null>(null);
    const typewriterRefs = useRef<Map<number, { cancel: () => void }>>(
      new Map()
    );

    const handleTypingStatusChange = (messageId: number, isTyping: boolean) => {
      setTypingMessageId(isTyping ? messageId : null);

      // Notify parent component about typing status
      if (onTypingStatusChange) {
        onTypingStatusChange(isTyping);
      }
    };

    // Expose cancel function to parent
    useImperativeHandle(ref, () => ({
      cancelCurrentTyping: () => {
        if (typingMessageId) {
          const typewriterRef = typewriterRefs.current.get(typingMessageId);
          if (typewriterRef) {
            typewriterRef.cancel();
          }
        }
      },
    }));

    // Clean up refs when conversation changes
    useEffect(() => {
      // Remove refs for messages that no longer exist
      const currentMessageIds = new Set(conversation.map((m) => m.id));
      const refKeys = Array.from(typewriterRefs.current.keys());
      refKeys.forEach((id) => {
        if (!currentMessageIds.has(id)) {
          typewriterRefs.current.delete(id);
        }
      });
    }, [conversation]);

    if (conversation.length === 0 && !isLoading) {
      return null;
    }

    return (
      <div className={className}>
        {conversation.map((message) => (
          <div
            key={message.id}
            data-message-id={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-4 rounded-lg max-w-[80%] ${
                message.role === "user"
                  ? "bg-gray-100 text-right"
                  : "bg-blue-100 text-left"
              } ${messageClassName}`}
            >
              {message.role === "user" ? (
                message.message
              ) : (
                <Typewriter
                  ref={(typewriterRef) => {
                    if (typewriterRef) {
                      typewriterRefs.current.set(message.id, typewriterRef);
                    }
                  }}
                  text={message.message}
                  delay={10}
                  onUpdate={onTypewriterUpdate}
                  disableAutoScroll={disableTypewriterScroll}
                  onTypingStatusChange={(isTyping) =>
                    handleTypingStatusChange(message.id, isTyping)
                  }
                />
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="animate-pulse flex bg-blue-100 rounded-lg px-4 py-2 max-w-[80%]">
              <span className="text-2xl font-bold text-yellow-500">. . .</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

ConversationDisplay.displayName = "ConversationDisplay";

export default ConversationDisplay;

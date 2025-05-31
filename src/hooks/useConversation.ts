import { checkRateLimit, incrementRateLimit } from "../utils/rateLimiter";

import type { Message } from "../types";
import { useState } from "react";

export const useConversation = () => {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showRateLimitNotification, setShowRateLimitNotification] =
    useState(false);
  const [rateLimitResetTime, setRateLimitResetTime] = useState(new Date());

  const constructConversation = (question: string, role: string) => {
    setConversation((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        role,
        message: question,
      },
    ]);
  };

  const handleSubmit = async (message: string, model: string) => {
    // Check rate limit before proceeding
    const rateLimitCheck = checkRateLimit();
    if (!rateLimitCheck.allowed) {
      setRateLimitResetTime(new Date(rateLimitCheck.resetTime));
      setShowRateLimitNotification(true);
      return;
    }

    // check model and send message to backend
    constructConversation(message, "user");

    setIsLoading(true);

    try {
      // Increment rate limit counter
      incrementRateLimit();

      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL || "http://localhost:3008"
        }/api/v1/chat/initiate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            model: model,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      constructConversation(data.response, "bot");
    } catch (error) {
      console.error("Error submitting message:", error);
      // If there's an error, still increment the rate limit to prevent abuse
      constructConversation(
        "Sorry, I'm having trouble connecting right now. Please try again later.",
        "bot"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    conversation,
    isLoading,
    showRateLimitNotification,
    setShowRateLimitNotification,
    rateLimitResetTime,
    handleSubmit,
    constructConversation,
  };
};

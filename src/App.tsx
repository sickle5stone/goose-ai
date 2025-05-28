import { useEffect, useRef, useState } from "react";

import type { ChangeEvent } from "react";
import React from "react";
import Typewriter from "./Typewriter";
import gooseLogo from "./assets/goose.svg";
import quackIcon from "./assets/quack.svg";
import talkingDuck from "./assets/talking-duck.svg";

interface Message {
  id: number;
  role: string;
  message: string;
}

interface Model {
  id: number;
  name: string;
}

function App() {
  const activeModels: Model[] = [
    // { id: 1, name: "gpt-4o" },
    // { id: 2, name: "anthropic-claude-3-5-sonnet" },
    { id: 3, name: "gemini-2.0-flash-exp" },
  ];

  const [activeModel, setActiveModel] = useState<Model>(activeModels[0]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const conversationContainerRef = useRef<HTMLDivElement>(null);
  const mainConversationRef = useRef<HTMLDivElement>(null);
  const [gooseName, setGooseName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("gooseName");
    if (name && name.length > 0) {
      setGooseName(name);
    }
  }, []);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const debouncedSave = (value: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      localStorage.setItem("gooseName", value);
    }, 1000);
  };

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop =
        conversationContainerRef.current.scrollHeight;
    }
    if (mainConversationRef.current) {
      mainConversationRef.current.scrollTop =
        mainConversationRef.current.scrollHeight;
    }
  };

  // Scroll to bottom whenever conversation updates
  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

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
    // check model and send message to backend

    constructConversation(message, "user");

    setIsLoading(true);

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3008";

    await fetch(`${apiUrl}/api/v1/chat/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, model }),
    })
      .then((res) => res.json())
      .then((data) => {
        constructConversation(data.response, "assistant");
        setMessage("");
      });

    setIsLoading(false);
  };

  const renderConversationWindow = () => {
    if (conversation.length === 0) {
      return;
    }

    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex flex-row items-center justify-center gap-2">
          <img src={talkingDuck} alt="duck1" className="w-10 h-10" />
          <span className="text-2xl font-bold text-orange-500">Duck 1</span>
        </div>

        <div
          ref={conversationContainerRef}
          className="bg-white lg:ml-20 rounded-2xl p-4 space-y-4 overflow-y-auto"
        >
          <div className="hidden lg:flex">
            {/* goose is quacking to you */}
            <h1 className="text-2xl font-bold flex gap-2">
              {/* some quack icon */}
              <img src={quackIcon} alt="quack" className="w-10 h-10" />
              <span className="text-2xl font-bold text-yellow-500">Quack!</span>
            </h1>
          </div>
          {conversation.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-4 rounded-lg max-w-[80%] ${
                  message.role === "user"
                    ? "bg-gray-100 text-right"
                    : "bg-blue-100 text-left"
                }`}
              >
                {message.role === "user" ? (
                  message.message
                ) : (
                  <Typewriter
                    text={message.message}
                    delay={10}
                    onUpdate={scrollToBottom}
                  />
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              {/* fade in and out elipsis animation */}
              <div className="animate-pulse flex bg-blue-100 rounded-lg px-4 py-2 max-w-[80%]">
                <span className="text-2xl font-bold text-yellow-500">
                  . . .
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderChatWindow = () => {
    return (
      <div className="lg:sticky lg:bottom-10 lg:top-10 max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="flex justify-center space-x-8 mb-8">
          <a
            href={import.meta.env.VITE_GOOSE_URL}
            target="_blank"
            className="transition-transform hover:scale-110"
          >
            <img
              src={gooseLogo}
              className="h-16 w-16 animate-spin-slow hover:drop-shadow-lg"
              alt="React logo"
            />
          </a>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Talk to me{" "}
          <input
            type="text"
            value={gooseName}
            tabIndex={-1}
            placeholder="Goose"
            onChange={(e) => {
              setGooseName(e.target.value);
              debouncedSave(e.target.value);
            }}
            className={`border-1 p-2 rounded-lg ${
              gooseName.length > 0 ? "border-orange-500" : "border-gray-300"
            } focus:outline-none focus:border-blue-500 bg-transparent inline-block w-full max-w-full placeholder:text-yellow-500 text-orange-500 `}
            style={{
              width: `${Math.max(
                gooseName.length > 0 ? gooseName.length + 3 : 5,
                8
              )}rem`,
              transition: "width 0.2s ease-in-out",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
          />
        </h1>

        <div
          ref={mainConversationRef}
          className="lg:hidden flex flex-col gap-2 max-h-64 overflow-y-auto mb-4 no-scrollbar"
        >
          {conversation.length > 0 && (
            <div className="w-full space-y-4">
              {conversation.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-4 rounded-lg max-w-[80%] ${
                      message.role === "user"
                        ? "bg-gray-100 text-right"
                        : "bg-blue-100 text-left"
                    }`}
                  >
                    {message.role === "user" ? (
                      message.message
                    ) : (
                      <Typewriter
                        text={message.message}
                        delay={10}
                        onUpdate={scrollToBottom}
                      />
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="animate-pulse flex bg-blue-100 rounded-lg px-4 py-2 max-w-[80%]">
                    <span className="text-2xl font-bold text-yellow-500">
                      . . .
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 rounded-xl p-6 mb-6">
          {/* // multiline text area input */}
          <div className="relative w-full">
            <textarea
              placeholder="Ask me anything..."
              className="w-full p-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 min-h-[100px] resize-none"
              rows={2}
              value={message}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setMessage(e.target.value)
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (
                  e.key === "Enter" &&
                  (e.shiftKey || e.ctrlKey || e.metaKey) &&
                  !isLoading &&
                  message.length > 0
                ) {
                  e.preventDefault();
                  handleSubmit(message, activeModel.name);
                }
              }}
            />
            {/* // onclick has a effect of sending the message to the backend */}
            <div
              className="absolute right-3 bottom-6 p-2 text-gray-500 hover:text-blue-500 transition-colors cursor-pointer hover:scale-110"
              onClick={() => {
                if (!isLoading && message.length > 0) {
                  handleSubmit(message, activeModel.name);
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </div>
          </div>

          <select
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
            value={activeModel.id.toString()}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              const selectedModel = activeModels.find(
                (model) => model.id.toString() === e.target.value
              );
              if (selectedModel) {
                setActiveModel(selectedModel);
              }
            }}
          >
            {activeModels.map((model) => (
              <option key={model.id} value={model.id.toString()}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        <p className="text-gray-500 text-sm">This is a work in progress.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {renderChatWindow()}
      <div
        className={`hidden ${
          conversation.length > 0 ? "lg:flex" : "hidden"
        } lg:w-1/4 lg:my-20`}
      >
        {renderConversationWindow()}
      </div>
    </div>
  );
}

export default App;

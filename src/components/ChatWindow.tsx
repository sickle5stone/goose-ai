import { useRef, type ChangeEvent } from "react";
import type { Message, Model } from "../types";
import ConversationDisplay from "./ConversationDisplay";
import { getAnimalColorScheme } from "../utils/animalHelpers";
import { playAnimalSound, getAnimalFromAvatar } from "../utils/animalSounds";
import gooseLogo from "../assets/goose.svg";

interface ChatWindowProps {
  activeModels: Model[];
  activeModel: Model;
  setActiveModel: (model: Model) => void;
  message: string;
  setMessage: (message: string) => void;
  isLoading: boolean;
  conversation: Message[];
  isAutoScrollEnabled: boolean;
  setIsAutoScrollEnabled: (enabled: boolean) => void;
  isTyping: boolean;
  customAvatar: string | null;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  mainConversationRef: React.RefObject<HTMLDivElement | null>;
  gooseName: string;
  setGooseName: (name: string) => void;
  onSubmit: (message: string, model: string) => void;
  onScroll: () => void;
  onTypingStatusChange: (isTyping: boolean) => void;
  onCancelTyping: () => void;
  mobileConversationDisplayRef: React.RefObject<{
    cancelCurrentTyping: () => void;
  } | null>;
}

export default function ChatWindow(props: ChatWindowProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  const handleAvatarClick = () => {
    const animal = getAnimalFromAvatar(props.customAvatar);
    playAnimalSound(animal);
  };

  const getCurrentAnimal = () => {
    if (props.customAvatar) {
      return getAnimalFromAvatar(props.customAvatar);
    }
    return "goose";
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleAvatarClick}
            className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
            aria-label="Play animal sound"
          >
            <img
              src={props.customAvatar || gooseLogo}
              className="h-16 w-16 animate-spin-slow hover:drop-shadow-lg cursor-pointer"
              alt="AI Assistant Avatar"
            />
          </button>
        </div>

        {/* Title with Name Input */}
        <div className="text-center">
          <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-2 tracking-tight">
            Talk to me{" "}
            <input
              type="text"
              value={props.gooseName}
              tabIndex={-1}
              placeholder="Goose"
              onChange={(e) => {
                props.setGooseName(e.target.value);
                debouncedSave(e.target.value);
              }}
              className={`border-0 border-b-2 px-2 py-1 rounded-none bg-transparent inline-block font-semibold text-2xl lg:text-3xl tracking-tight transition-all duration-200 ${
                props.gooseName.length > 0
                  ? `${getAnimalColorScheme(getCurrentAnimal()).border} ${
                      getAnimalColorScheme(getCurrentAnimal()).text
                    }`
                  : "border-gray-300 text-gray-500"
              } ${
                getAnimalColorScheme(getCurrentAnimal()).focusBorder
              } focus:outline-none ${
                getAnimalColorScheme(getCurrentAnimal()).placeholder
              }`}
              style={{
                width: `${Math.max(
                  props.gooseName.length > 0 ? props.gooseName.length + 1 : 5,
                  6
                )}ch`,
                transition: "width 0.2s ease-in-out",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            />
          </h1>
        </div>
      </div>

      {/* Mobile Conversation Section */}
      <div className="lg:hidden">
        <div
          ref={props.mainConversationRef}
          className="flex flex-col gap-2 max-h-64 overflow-y-auto p-4 no-scrollbar relative border-b border-gray-100"
        >
          <ConversationDisplay
            ref={props.mobileConversationDisplayRef}
            conversation={props.conversation}
            isLoading={props.isLoading}
            onTypewriterUpdate={props.onScroll}
            className="w-full space-y-4"
            disableTypewriterScroll={true}
            onTypingStatusChange={props.onTypingStatusChange}
          />

          {!props.isAutoScrollEnabled && (
            <div className="sticky bottom-2 flex justify-center">
              <button
                onClick={() => {
                  props.setIsAutoScrollEnabled(true);
                  props.onScroll();
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transition-all duration-200 hover:scale-105 text-sm"
              >
                Scroll down
              </button>
            </div>
          )}

          {props.isTyping && (
            <div className="flex justify-center mt-2 mb-1 animate-fadeIn">
              <button
                onClick={props.onCancelTyping}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl transform-gpu text-sm"
              >
                Stop
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Input Form Section */}
      <div className="p-6">
        <div className="relative w-full">
          <div className="relative">
            <textarea
              placeholder="Ask me anything..."
              className="w-full p-4 pr-12 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] resize-none transition-all duration-200"
              rows={3}
              value={props.message}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                props.setMessage(e.target.value)
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (
                  e.key === "Enter" &&
                  (e.shiftKey || e.ctrlKey || e.metaKey) &&
                  !props.isLoading &&
                  props.message.length > 0
                ) {
                  e.preventDefault();
                  props.onSubmit(props.message, props.activeModel.name);
                  props.setMessage("");
                }
              }}
            />
            <button
              onClick={() => {
                if (!props.isLoading && props.message.length > 0) {
                  props.onSubmit(props.message, props.activeModel.name);
                  props.setMessage("");
                }
              }}
              disabled={props.isLoading || props.message.length === 0}
              className="absolute right-3 bottom-3 p-2 text-gray-400 hover:text-blue-500 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors cursor-pointer hover:scale-110 disabled:hover:scale-100"
              aria-label="Send message"
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
            </button>
          </div>

          {/* Send Instructions */}
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-500">
              Press{" "}
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                Cmd/Ctrl + Enter
              </kbd>{" "}
              to send
            </p>
          </div>
        </div>
      </div>

      {/* Model Selection */}
      <div className="px-6 pb-6">
        <div className="relative" ref={dropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AI Model
          </label>
          <button
            onClick={() => props.setIsDropdownOpen(!props.isDropdownOpen)}
            className="w-full p-3 text-left bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">
                {props.activeModel.name}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  props.isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>

          {props.isDropdownOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg">
              {props.activeModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    props.setActiveModel(model);
                    props.setIsDropdownOpen(false);
                  }}
                  className={`w-full p-3 text-left hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl transition-colors duration-200 ${
                    model.id === props.activeModel.id
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {model.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

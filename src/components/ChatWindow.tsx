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
    <div className="lg:sticky lg:bottom-10 lg:top-10 max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      {/* Avatar */}
      <div className="flex justify-center space-x-8 mb-8">
        <button
          onClick={handleAvatarClick}
          className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
        >
          <img
            src={props.customAvatar || gooseLogo}
            className="h-16 w-16 animate-spin-slow hover:drop-shadow-lg cursor-pointer"
            alt="AI Assistant Avatar"
          />
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight">
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
            className={`border-0 border-b-2 px-2 py-1 rounded-none bg-transparent inline-block font-semibold text-3xl tracking-tight transition-all duration-200 ${
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

      {/* Mobile Conversation */}
      <div
        ref={props.mainConversationRef}
        className="lg:hidden flex flex-col gap-2 max-h-64 overflow-y-auto mb-4 no-scrollbar relative"
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

      {/* Input Form */}
      <div className="sticky bottom-0 bg-gray-50 rounded-xl p-6 mb-6">
        <div className="relative w-full">
          <textarea
            placeholder="Ask me anything..."
            className="w-full p-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 min-h-[100px] resize-none"
            rows={2}
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
          <div
            className="absolute right-3 bottom-6 p-2 text-gray-500 hover:text-blue-500 transition-colors cursor-pointer hover:scale-110"
            onClick={() => {
              if (!props.isLoading && props.message.length > 0) {
                props.onSubmit(props.message, props.activeModel.name);
                props.setMessage("");
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

        {/* Model Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4 bg-white cursor-pointer flex items-center justify-between"
            onClick={() => props.setIsDropdownOpen(!props.isDropdownOpen)}
          >
            <span className="text-gray-700">{props.activeModel.name}</span>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
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

          {props.isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {props.activeModels.map((model) => (
                <div
                  key={model.id}
                  className={`p-3 cursor-pointer hover:bg-blue-50 transition-colors ${
                    props.activeModel.id === model.id
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-700"
                  }`}
                  onClick={() => {
                    props.setActiveModel(model);
                    props.setIsDropdownOpen(false);
                  }}
                >
                  {model.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-500 text-sm">This is a work in progress.</p>
    </div>
  );
}

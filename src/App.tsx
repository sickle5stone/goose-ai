import Typewriter from "./Typewriter";
import gooseLogo from "./assets/goose.svg";
import quackIcon from "./assets/quack.svg";
import talkingDuck from "./assets/talking-duck.svg";
import { useState } from "react";

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
        // setMessage("");
      });

    setIsLoading(false);
  };

  const renderConversationWindow = () => {
    if (conversation.length === 0) {
      return;
    }

    return (
      <div className="flex flex-col items-center justify-center gap-2 max-w-[30%]">
        <div className="flex flex-row items-center justify-center gap-2">
          <img src={talkingDuck} alt="duck1" className="w-10 h-10" />
          <span className="text-2xl font-bold">Duck 1</span>
        </div>

        <div className="bg-white ml-20 rounded-2xl p-4 space-y-4">
          <div>
            {/* goose is quacking to you */}
            <h1 className="text-2xl font-bold flex gap-2 items-center">
              {/* some quack icon */}
              <img src={quackIcon} alt="quack" className="w-10 h-10" />
              <span className="text-2xl font-bold text-yellow-500">Quack!</span>
            </h1>
          </div>
          {conversation.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg ${
                message.role === "user"
                  ? "bg-gray-100 ml-8"
                  : "bg-blue-100 mr-8"
              }`}
            >
              {message.role === "user" ? (
                message.message
              ) : (
                <Typewriter text={message.message} delay={10} />
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex">
              {/* fade in and out elipsis animation */}
              <div className="animate-pulse flex bg-blue-100 rounded-lg px-4 py-2">
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
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="flex justify-center space-x-8 mb-8">
          <a
            href="https://react.dev"
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
          Talk to me "Goose"
        </h1>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          {/* // multiline text area input */}
          <div className="relative w-full">
            <textarea
              placeholder="Ask me anything..."
              className="w-full p-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 min-h-[100px] resize-none"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  (e.shiftKey || e.ctrlKey || e.metaKey)
                ) {
                  e.preventDefault();
                  handleSubmit(message, activeModel.name);
                }
              }}
            />
            {/* // onclick has a effect of sending the message to the backend */}
            <div
              className="absolute right-3 bottom-6 p-2 text-gray-500 hover:text-blue-500 transition-colors cursor-pointer hover:scale-110"
              onClick={() => handleSubmit(message, activeModel.name)}
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
          <button
            onClick={() => handleSubmit(message, activeModel.name)}
            className="bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Submit
          </button>

          <select
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
            value={activeModel.id.toString()}
            onChange={(e) => {
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
      {renderConversationWindow()}
    </div>
  );
}

export default App;

"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Send } from "lucide-react";

export default function Chat() {
  const [input, setInput] = useState("");
  // useChat hook manages message state and communication with the server
  const { messages, sendMessage, isLoading } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only send if there's input and not already processing
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header section with title */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm px-6 py-4">
        <h1 className="text-2xl font-semibold text-white">Query GPT</h1>
        <p className="text-sm text-slate-400 mt-1">
          Query your database naturally
        </p>
      </div>

      {/* Messages container - scrollable area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          // Empty state when no messages
          <div className="flex items-center justify-center h-full text-slate-400">
            <p className="text-center">
              Start a conversation to query your database
            </p>
          </div>
        ) : (
          // Message list
          messages.map((message) => (
            <div
              key={message.id}
              // Align user messages right, AI messages left
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  // User messages: blue background, white text
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : // AI messages: slate background, light text
                      "bg-slate-700 text-slate-100 rounded-bl-none"
                }`}
              >
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    // Regular text message
                    case "text":
                      return (
                        <div
                          key={`${message.id}-${i}`}
                          className="mt-4 whitespace-pre-wrap"
                        >
                          {part.text}
                        </div>
                      );
                    // Database query result
                    case "tool-db":
                      return (
                        <pre
                          key={`${message.id}-${i}`}
                          className="bg-slate-900 rounded p-2 text-xs overflow-x-auto mt-2"
                        >
                          <code className="text-green-400">
                           Called : {JSON.stringify(part.type)}
                          </code>
                        </pre>
                      );
                    // Database schema
                    case "tool-schema":
                      return (
                        <pre
                          key={`${message.id}-${i}`}
                          className="bg-slate-900 rounded p-2 text-xs overflow-x-auto mt-2"
                        >
                          <code className="text-amber-400">
                            Called {JSON.stringify(part.type)}
                          </code>
                        </pre>
                      );
                  }
                })}
              </div>
            </div>
          ))
        )}
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-slate-100 px-4 py-3 rounded-lg rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input section - sticky at bottom */}
      <div className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          {/* Text input field */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            placeholder="Ask something about your database..."
            className="flex-1 bg-slate-800 text-white placeholder-slate-500 rounded-lg px-4 py-3 border border-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
          {/* Submit button with icon */}
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg flex items-center justify-center transition"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

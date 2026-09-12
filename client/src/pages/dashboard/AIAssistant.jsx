import { useState } from "react";
import ReactMarkdown from "react-markdown";
import aiService from "../../services/aiService";

const AIAssistant = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    // Add user's message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const data = await aiService.sendMessage(userMessage);

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: data.response,
        },
      ]);
    } catch (error) {
      console.error("AI Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "Sorry, I couldn't generate a response right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col px-6 pt-6 pb-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          AI Assistant
        </h1>

        <p className="text-gray-500 mt-1">
          Your personal academic assistant
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-5">
            {/* Welcome Message */}
            {messages.length === 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                    AI
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      Acadex AI
                    </p>

                    <p className="text-xs text-gray-500">
                      Academic Assistant
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 leading-7">
                  Hello! I'm your Acadex AI Assistant. I can help you
                  understand concepts, solve programming questions, prepare
                  for exams, create study plans, and improve your academic
                  productivity.
                </p>

                {/* Suggested Questions */}
                <div className="mt-5">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Try asking:
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {[
                      "Explain binary search in simple language",
                      "Give me a study plan for exams",
                      "Explain the difference between stack and queue",
                      "How can I improve my productivity?",
                    ].map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => setMessage(question)}
                        className="text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {/* AI Avatar */}
                {msg.role === "ai" && (
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm mr-3 mt-1 flex-shrink-0">
                    AI
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-50 border border-gray-200 text-gray-900"
                  }`}
                >
                  {msg.role === "user" ? (
                    <p className="text-sm leading-6 whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  ) : (
                    <div className="text-sm leading-7">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-xl font-bold text-gray-900 mb-3 mt-2">
                              {children}
                            </h1>
                          ),

                          h2: ({ children }) => (
                            <h2 className="text-lg font-bold text-gray-900 mb-2 mt-5">
                              {children}
                            </h2>
                          ),

                          h3: ({ children }) => (
                            <h3 className="text-base font-semibold text-gray-900 mb-2 mt-4">
                              {children}
                            </h3>
                          ),

                          p: ({ children }) => (
                            <p className="mb-3 text-gray-700">
                              {children}
                            </p>
                          ),

                          ul: ({ children }) => (
                            <ul className="list-disc pl-5 mb-3 space-y-1 text-gray-700">
                              {children}
                            </ul>
                          ),

                          ol: ({ children }) => (
                            <ol className="list-decimal pl-5 mb-3 space-y-1 text-gray-700">
                              {children}
                            </ol>
                          ),

                          li: ({ children }) => (
                            <li className="pl-1">
                              {children}
                            </li>
                          ),

                          strong: ({ children }) => (
                            <strong className="font-semibold text-gray-900">
                              {children}
                            </strong>
                          ),

                          em: ({ children }) => (
                            <em className="italic">
                              {children}
                            </em>
                          ),

                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-indigo-400 pl-4 my-4 text-gray-600 italic">
                              {children}
                            </blockquote>
                          ),

                          code: ({ className, children, ...props }) => {
                            const isInline =
                              !className ||
                              !className.includes("language-");

                            if (isInline) {
                              return (
                                <code
                                  className="bg-gray-200 text-indigo-700 px-1.5 py-0.5 rounded text-sm"
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            }

                            return (
                              <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 overflow-x-auto my-4 text-sm">
                                <code className={className}>
                                  {children}
                                </code>
                              </pre>
                            );
                          },

                          hr: () => (
                            <hr className="my-4 border-gray-200" />
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Message */}
            {loading && (
              <div className="flex justify-start">
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm mr-3 mt-1">
                  AI
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      Acadex AI is thinking
                    </span>

                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                      <span
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></span>
                      <span
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-4">
          <form
            onSubmit={handleSend}
            className="max-w-4xl mx-auto flex gap-3"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask Acadex AI anything..."
              disabled={loading}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />

            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>

          <p className="max-w-4xl mx-auto text-xs text-gray-400 mt-2 text-center">
            Acadex AI can make mistakes. Verify important academic
            information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
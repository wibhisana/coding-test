import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [salesReps, setSalesReps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/data")
      .then((res) => res.json())
      .then((data) => {
        setSalesReps(data.salesReps || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
        setLoading(false);
      });
  }, []);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
  
    const userMessage = { role: "user", content: question };
    setChatHistory((prev) => [...prev, userMessage]);
    setQuestion("");
  
    try {
      const response = await fetch("http://localhost:8000/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      const aiMessage = { role: "ai", content: data.answer };
      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error in AI request:", error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6 sm:p-10 font-sans">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-blue-800 drop-shadow-sm">
          🚀 Sales Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Next.js + FastAPI Integration</p>
      </header>

      <main className="max-w-6xl mx-auto space-y-16">
        {/* Sales Reps Section */}
        <section>
          <h2 className="text-2xl font-semibold text-purple-700 mb-6">
            Sales Representatives
          </h2>
          {loading ? (
            <p className="text-gray-500">Loading data...</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {salesReps.map((rep) => (
                <Link href={`/sales/${rep.id}`}>
                  <div
                    key={rep.id}
                    className="bg-white shadow-xl rounded-xl p-5 border border-purple-100 hover:shadow-2xl transition transform hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-bold text-lg">
                        {rep.name[0]}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {rep.name}
                        </h3>
                        <p className="text-sm text-gray-500">{rep.role}</p>
                      </div>
                    </div>
                  </div>
                </Link>
           
              ))}
            </div>
          )}
        </section>

        {/* AI Question Section */}
        <section className="mt-10 max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">AI Assistant</h2>

          <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-100 self-end text-right"
                    : "bg-gray-100 self-start"
                }`}
              >
                <p className="text-sm text-gray-600 mb-1">
                  {msg.role === "user" ? "You" : "AI"}
                </p>
                <div className="text-gray-800">{msg.content}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 items-center">
            <input
              className="flex-1 border p-2 rounded"
              type="text"
              placeholder="Ask something..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAskQuestion()}
            />
            <button
              onClick={handleAskQuestion}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}

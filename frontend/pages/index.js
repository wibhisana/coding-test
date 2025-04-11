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
    try {
      const response = await fetch("http://localhost:8000/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setAnswer(data.answer);
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


        <section>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">
            Ask a Question to AI 🤖
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Type your question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={handleAskQuestion}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-lg transition"
            >
              Ask AI
            </button>
          </div>
          {answer && (
            <div className="mt-6 bg-green-100 border border-green-300 text-green-900 p-4 rounded-lg shadow-sm">
              <strong>AI Response:</strong> {answer}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

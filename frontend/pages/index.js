import { useState, useEffect } from "react";

export default function Home() {
  const [salesReps, setSalesReps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

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
    <div style={{ padding: "2rem" }}>
      <h1>Next.js + FastAPI Sample</h1>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Sales Reps</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {salesReps.map((rep) => (
              <li key={rep.id}>
                {rep.name} - {rep.role}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Ask a Question (AI Endpoint)</h2>
        <div>
          <input
            type="text"
            placeholder="Enter your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button onClick={handleAskQuestion}>Ask</button>
        </div>
        {answer && (
          <div style={{ marginTop: "1rem" }}>
            <strong>AI Response:</strong> {answer}
          </div>
        )}
      </section>
    </div>
  );
}

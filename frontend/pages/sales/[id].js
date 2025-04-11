import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SalesDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [rep, setRep] = useState(null);

  useEffect(() => {
    if (id) {
      fetch("http://localhost:8000/api/data")
        .then((res) => res.json())
        .then((data) => {
          const foundRep = data.salesReps.find((r) => r.id === parseInt(id));
          setRep(foundRep);
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  if (!rep) return <p className="p-4">Loading...</p>;

  const totalSales = rep.deals.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6 sm:p-10 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-8">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Sales List
        </Link>

        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">{rep.name}</h1>
        <p className="text-purple-600 text-lg font-medium mb-4">{rep.role} - {rep.region}</p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {rep.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Deals</h2>
          <div className="space-y-2">
            {rep.deals.map((deal, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-gray-200 bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">{deal.client}</p>
                  <p className="text-sm text-gray-500">{deal.status}</p>
                </div>
                <p className="text-blue-700 font-semibold">${deal.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Clients</h2>
          <ul className="space-y-2">
            {rep.clients.map((client, idx) => (
              <li
                key={idx}
                className="p-4 rounded-lg bg-white border border-purple-200 shadow-sm"
              >
                <p className="font-medium text-gray-800">{client.name} ({client.industry})</p>
                <p className="text-sm text-gray-500">{client.contact}</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Sales</h2>
          <p className="text-2xl font-bold text-green-600">${totalSales.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

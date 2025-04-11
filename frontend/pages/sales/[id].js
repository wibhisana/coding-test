import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SalesDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [rep, setRep] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8000/api/data/${id}`)
        .then((res) => res.json())
        .then((data) => setRep(data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  if (!rep) return <p className="p-4">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6">
        <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
          ← Back to Sales List
        </Link>

        <h1 className="text-2xl font-bold mb-4">{rep.name}</h1>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Role:</span> {rep.role}
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">Region:</span> {rep.region}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Total Sales:</span> {rep.totalSales}
        </p>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { getGlobalStats } from "../../../../services/meilisearch/indexes";

// Define types for the responses
interface IndexInfo {
  numberOfDocuments: number;
  isIndexing: boolean;
}

interface GlobalStatsResponse {
  databaseSize: number;
  lastUpdate: string;
  indexes: Record<string, IndexInfo>;
}

interface ErrorResponse {
  message: string;
  code: string;
  type: string;
  link?: string;
}

// Define the props type
interface HealthWidgetProps {
  instanceState: {
    host: string;
    key: string;
  };
}

// Utility type to handle union of response types
type ApiResponse = GlobalStatsResponse | ErrorResponse;

const HealthWidget: React.FC<HealthWidgetProps> = ({ instanceState }) => {
  const [res, setRes] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getGlobalStats(instanceState.host, instanceState.key);
        if ("message" in response) {
          setError(response.message); // Handle error response
        } else {
          setRes(response); // Handle success response
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
        console.error(err);
      }
    };

    fetchStats();
  }, [instanceState]);

  if (error) {
    return (
      <div className="health-widget">
        <p className="error-message">Error: {error}</p>
      </div>
    );
  }

  if (!res) {
    return (
      <div className="health-widget">
        <p>Loading...</p>
      </div>
    );
  }

  if ("message" in res) {
    // This should never be reached since we handle errors separately
    return (
      <div className="health-widget">
        <p>Error: {res.message}</p>
      </div>
    );
  }

  return (
    <div className="health-widget p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">Database Stats</h2>
      <p className="mb-4 text-gray-700">Database Size: {res.databaseSize} bytes</p>
      <h3 className="text-md font-semibold mb-2">Indexes</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="pb-2">Index Name</th>
            <th className="pb-2">Documents</th>
            <th className="pb-2">Indexing</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(res.indexes).map(([indexName, indexInfo]) => (
            <tr key={indexName} className="border-b">
              <td className="py-2">{indexName}</td>
              <td className="py-2">{indexInfo.numberOfDocuments}</td>
              <td className="py-2 flex items-center">
                {indexInfo.isIndexing ? (
                  <span className="text-yellow-600 flex items-center">
                    Building
                  </span>
                ) : (
                  <span className="text-green-600 flex items-center">
                    Idle
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HealthWidget;
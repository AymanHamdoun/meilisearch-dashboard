// @ts-ignore
import React, { useState, useEffect } from "react";
import { getGlobalStats } from "../../../../services/meilisearch/indexes";
import {useTranslation} from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ErrorType } from "../InstanceErrorPage";

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
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getGlobalStats(instanceState.host, instanceState.key);

        // Check if response is undefined/null (connection error)
        if (!response) {
          console.error("Failed to connect to Meilisearch instance");
          navigate('/instance/error', { state: { errorType: ErrorType.CONNECTION } });
          return;
        }

        if ("message" in response) {
          // Check if it's an authentication error
          if (response.code === 'invalid_api_key' ||
              response.code === 'missing_authorization_header' ||
              response.message?.toLowerCase().includes('api key')) {
            console.error("API Key error:", response.message);
            navigate('/instance/error', { state: { errorType: ErrorType.API_KEY } });
          } else {
            // For other errors, might be connection issues
            console.error("Meilisearch error:", response);
            navigate('/instance/error', { state: { errorType: ErrorType.UNKNOWN } });
          }
        } else {
          setRes(response); // Handle success response
        }
      } catch (err: any) {
        console.error("Connection error:", err);

        // Determine error type from the error object
        let errorType = ErrorType.CONNECTION;
        if (err.errorType) {
          errorType = err.errorType;
        } else if (err.name === 'AbortError' || err.message?.includes('timeout')) {
          errorType = ErrorType.TIMEOUT;
        } else if (err.message?.toLowerCase().includes('api key')) {
          errorType = ErrorType.API_KEY;
        }

        // Navigate to error page with appropriate error type
        navigate('/instance/error', { state: { errorType } });
      }
    };

    fetchStats();
  }, [instanceState, navigate]);

  if (error) {
    return (
      <div className="health-widget">
        <p className="error-message">{t("error")}: {error}</p>
      </div>
    );
  }

  if (!res) {
    return (
      <div className="health-widget">
        <p>{t("loading")}</p>
      </div>
    );
  }

  if ("message" in res) {
    // This should never be reached since we handle errors separately
    return (
      <div className="health-widget">
        <p>{t("error")}: {res.message}</p>
      </div>
    );
  }

  return (
    <div className="health-widget p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">{t("meili.database_stats")}</h2>
      <p className="mb-4 text-gray-700">{t("meili.database_size")}: {res.databaseSize} bytes</p>
      <h3 className="text-md font-semibold mb-2">{t("meili.indices")}</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="pb-2">{t("meili.index_name")}</th>
            <th className="pb-2">{t("meili.documents")}</th>
            <th className="pb-2">{t("meili.index_status")}</th>
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
                    {t("meili.statuses.building")}
                  </span>
                ) : (
                  <span className="text-green-600 flex items-center">
                    {t("meili.statuses.idle")}
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
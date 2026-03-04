// @ts-ignore
import React, { useState, useEffect } from "react";
import { getGlobalStats, getVersion } from "../../../../services/meilisearch/indexes";
import { getHealth } from "../../../../services/meilisearch/metrics";
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

const formatBytes = (bytes: number): string => {
  if (bytes >= 1e9) return (bytes / 1e9).toFixed(2) + ' GB';
  if (bytes >= 1e6) return (bytes / 1e6).toFixed(2) + ' MB';
  if (bytes >= 1e3) return (bytes / 1e3).toFixed(2) + ' KB';
  return bytes + ' B';
};

const HealthWidget: React.FC<HealthWidgetProps> = ({ instanceState }) => {
  const [res, setRes] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [versionInfo, setVersionInfo] = useState<{ pkgVersion: string; commitSha: string; commitDate: string } | null>(null);
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getGlobalStats(instanceState.host, instanceState.key);

        // Check if response is undefined/null (connection error)
        if (!response) {
          console.error("Failed to connect to Meilisearch instance");
          navigate('/instance/error', { state: { error: new Error('No response received') } });
          return;
        }

        // Check if response contains an error message
        if ("message" in response) {
          console.error("Meilisearch error:", response);
          navigate('/instance/error', { state: { error: response } });
        } else {
          setRes(response); // Handle success response
        }
      } catch (err: any) {
        console.error("Connection error:", err);
        navigate('/instance/error', { state: { error: err } });
      }
    };

    const fetchVersion = async () => {
      try {
        const data = await getVersion(instanceState.host, instanceState.key);
        setVersionInfo(data);
      } catch {
        // Version info is optional
      }
    };

    const fetchHealth = async () => {
      try {
        const data = await getHealth(instanceState);
        setHealthStatus(data.status || 'available');
      } catch {
        setHealthStatus('unavailable');
      }
    };

    fetchStats();
    fetchVersion();
    fetchHealth();
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
    return (
      <div className="health-widget">
        <p>{t("error")}: {res.message}</p>
      </div>
    );
  }

  return (
    <div className="health-widget p-4 border rounded-lg shadow-md">
      {/* Version and Health Status */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{t("meili.database_stats")}</h2>
        <div className="flex items-center gap-3">
          {healthStatus && (
            <span className={`flex items-center gap-1 text-sm ${healthStatus === 'available' ? 'text-green-600' : 'text-red-600'}`}>
              <span className={`w-2 h-2 rounded-full ${healthStatus === 'available' ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {healthStatus === 'available' ? 'Healthy' : 'Unavailable'}
            </span>
          )}
          {versionInfo && (
            <span className="text-sm text-gray-500">
              v{versionInfo.pkgVersion}
            </span>
          )}
        </div>
      </div>

      <p className="mb-4 text-gray-700">{t("meili.database_size")}: {formatBytes(res.databaseSize)}</p>
      {res.lastUpdate && (
        <p className="mb-4 text-sm text-gray-500">Last update: {new Date(res.lastUpdate).toLocaleString()}</p>
      )}

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
              <td className="py-2">{indexInfo.numberOfDocuments.toLocaleString()}</td>
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
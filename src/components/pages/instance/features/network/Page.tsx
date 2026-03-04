import React, { useState, useEffect } from 'react';
import useMeiliInstance from '../../../../../hooks/useMeiliInstance';
import { getNetwork, updateNetwork } from '../../../../../services/meilisearch/network';
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { json } from "@codemirror/lang-json";
import HelpPanel from '../../../../commons/HelpPanel';
import { useDocs } from '../../../../../contexts/DocsContext';

const NetworkPage: React.FC = () => {
    const { instanceState } = useMeiliInstance();
    const [networkConfig, setNetworkConfig] = useState<any>(null);
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        if (!instanceState.isLoaded) return;
        setIsLoading(true);
        getNetwork(instanceState)
            .then((data) => {
                setNetworkConfig(data);
                setCode(JSON.stringify(data, null, 2));
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err.message || 'Failed to load network configuration');
                setIsLoading(false);
            });
    }, [instanceState]);

    const handleSave = async () => {
        try {
            const parsed = JSON.parse(code);
            await updateNetwork(instanceState, parsed);
            setNetworkConfig(parsed);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to update network configuration');
        }
    };

    let featureDoc = undefined;
    try { const { getFeatureDoc } = useDocs(); featureDoc = getFeatureDoc('network'); } catch {}

    return (
        <div className="px-4 py-5">
            <div className="mb-8">
                <h1 className="text-3xl font-semibold mb-2">Network</h1>
                <p className="text-gray-600">
                    Configure network topology for horizontal database partitioning and federated search
                </p>
            </div>

            <HelpPanel featureDoc={featureDoc} />

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
            )}

            {saveSuccess && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    Network configuration updated successfully!
                </div>
            )}

            <div className="bg-white rounded-lg shadow p-6">
                {isLoading ? (
                    <div className="text-center py-12 text-gray-500">Loading network configuration...</div>
                ) : networkConfig ? (
                    <div className="flex flex-col gap-4">
                        <h2 className="text-lg font-semibold">Network Configuration</h2>
                        {networkConfig.self && (
                            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                <div><span className="font-medium">Self URL:</span> <span className="text-gray-600">{networkConfig.self || '-'}</span></div>
                            </div>
                        )}
                        {networkConfig.remotes && Object.keys(networkConfig.remotes).length > 0 && (
                            <div className="mb-4">
                                <h3 className="text-sm font-medium mb-2">Remote Nodes</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {Object.entries(networkConfig.remotes).map(([name, url]: [string, any]) => (
                                        <div key={name} className="border border-gray-200 rounded p-2 text-sm">
                                            <span className="font-medium">{name}:</span> <span className="text-gray-600">{String(url)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div>
                            <h3 className="text-sm font-medium mb-2">Edit Configuration (JSON)</h3>
                            <CodeMirror
                                value={code}
                                extensions={[json()]}
                                basicSetup={{ lineNumbers: true, highlightActiveLine: true }}
                                onChange={(newCode) => setCode(newCode)}
                                style={{ fontSize: "14px", border: "1px solid #ccc", borderRadius: "5px", overflow: "hidden" }}
                                theme={vscodeDark}
                            />
                        </div>
                        <button
                            onClick={handleSave}
                            className="border border-primary text-primary rounded py-2 px-4 hover:bg-primary hover:text-white transition-all"
                        >
                            Save Network Configuration
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            Network feature is not enabled. Enable it in experimental features first.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NetworkPage;

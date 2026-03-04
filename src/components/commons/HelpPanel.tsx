import React, { useState } from 'react';
import { FeatureDoc } from '../../docs/types';

interface HelpPanelProps {
    featureDoc: FeatureDoc | undefined;
    defaultExpanded?: boolean;
}

const HelpPanel: React.FC<HelpPanelProps> = ({ featureDoc, defaultExpanded = false }) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    if (!featureDoc) return null;

    return (
        <div className="mb-6 border border-blue-100 rounded-lg bg-blue-50 overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-blue-100 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                        <path d="M12 17h.01"/>
                    </svg>
                    <span className="text-sm font-medium text-blue-700">
                        {isExpanded ? 'Hide help' : 'Show help & setup guide'}
                    </span>
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`text-blue-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                >
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </button>

            {isExpanded && (
                <div className="px-4 pb-4 space-y-4">
                    {featureDoc.details && (
                        <p className="text-sm text-gray-700">{featureDoc.details}</p>
                    )}

                    {featureDoc.setupSteps && featureDoc.setupSteps.length > 0 && (
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Setup Steps</h4>
                            <ol className="list-decimal list-inside space-y-1">
                                {featureDoc.setupSteps.map((step, i) => (
                                    <li key={i} className="text-sm text-gray-700">{step}</li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {featureDoc.requirements && featureDoc.requirements.length > 0 && (
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Requirements</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {featureDoc.requirements.map((req, i) => (
                                    <li key={i} className="text-sm text-gray-700">{req}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {featureDoc.tips && featureDoc.tips.length > 0 && (
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tips</h4>
                            <ul className="space-y-1">
                                {featureDoc.tips.map((tip, i) => (
                                    <li key={i} className="text-sm text-gray-600 flex items-start gap-1.5">
                                        <span className="text-blue-400 mt-0.5">*</span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {featureDoc.docLink && (
                        <a
                            href={featureDoc.docLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                        >
                            Official documentation
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                <polyline points="15 3 21 3 21 9"/>
                                <line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};

export default HelpPanel;

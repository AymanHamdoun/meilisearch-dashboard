// @ts-ignore
import React, { useState } from "react"
import { useDocs } from "../../../../../contexts/DocsContext"

interface DocHeaderProps {
    title: string;
    badge: string;
    description: string;
    link: string;
    settingKey?: string;
}

const DocHeader: React.FC<DocHeaderProps> = ({title, badge, description, link, settingKey}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    let settingDoc = undefined;

    try {
        const { getSettingDoc } = useDocs();
        settingDoc = getSettingDoc(settingKey || badge);
    } catch {
        // DocsProvider not available, fallback gracefully
    }

    return <div className="mb-5 flex flex-col gap-3">
        <div className="flex flex-row gap-3 items-center">
            <h3 className="font-medium text-xl text-gray-800">{title}</h3>
            <a href={settingDoc?.docLink || link} target="_blank" rel="noopener noreferrer">
                <span className="bg-primary-midfaint rounded-2xl border border-gray-300 px-5 text-gray-700">{badge}</span>
            </a>
        </div>
        <p className="text-gray-700">{settingDoc?.summary || description}</p>

        {settingDoc && (settingDoc.details || settingDoc.tips || settingDoc.examples) && (
            <div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                    {isExpanded ? 'Hide details' : 'Learn more'}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    >
                        <polyline points="6 9 12 15 18 9"/>
                    </svg>
                </button>

                {isExpanded && (
                    <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                        {settingDoc.details && (
                            <p className="text-sm text-gray-600">{settingDoc.details}</p>
                        )}

                        {settingDoc.defaultValue && (
                            <div className="text-sm">
                                <span className="font-medium text-gray-500">Default: </span>
                                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-gray-700">
                                    {settingDoc.defaultValue}
                                </code>
                            </div>
                        )}

                        {settingDoc.tips && settingDoc.tips.length > 0 && (
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tips</h4>
                                <ul className="space-y-1">
                                    {settingDoc.tips.map((tip, i) => (
                                        <li key={i} className="text-sm text-gray-600 flex items-start gap-1.5">
                                            <span className="text-primary mt-0.5">*</span>
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {settingDoc.examples && settingDoc.examples.length > 0 && (
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Examples</h4>
                                {settingDoc.examples.map((example, i) => (
                                    <code key={i} className="block bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-700 mb-1">
                                        {example}
                                    </code>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        )}
    </div>
}

export default DocHeader

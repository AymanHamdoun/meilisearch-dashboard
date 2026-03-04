// @ts-ignore
import React, { useEffect, useState } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"
import { json } from "@codemirror/lang-json"
import DocHeader from "./DocHeader"

import useIndexSettings from "../../../../../hooks/useIndexSettings"
import { IndexSettingsActions } from "../../../../../reducers/indexSettingsReducer"

const TEMPLATES: Record<string, any> = {
    openAi: {
        source: "openAi",
        model: "text-embedding-3-small",
        apiKey: "<your-api-key>",
        dimensions: 1536,
        documentTemplate: "A document titled '{{doc.title}}' whose description starts with {{doc.overview|truncatewords: 20}}"
    },
    huggingFace: {
        source: "huggingFace",
        model: "BAAI/bge-base-en-v1.5",
        documentTemplate: "A document titled '{{doc.title}}'"
    },
    ollama: {
        source: "ollama",
        url: "http://localhost:11434/api/embeddings",
        model: "nomic-embed-text",
        dimensions: 768,
        documentTemplate: "A document titled '{{doc.title}}'"
    },
    rest: {
        source: "rest",
        url: "https://your-embedding-api.example.com",
        dimensions: 512,
        documentTemplate: "A document titled '{{doc.title}}'"
    },
    userProvided: {
        source: "userProvided",
        dimensions: 384
    }
}

const EmbeddersSettings = () => {
    const { settings, dispatch } = useIndexSettings()
    const [code, setCode] = useState("")
    const [parseError, setParseError] = useState<string | null>(null)

    useEffect(() => {
        setCode(JSON.stringify(settings.embedders || {}, null, 2))
    }, [settings.embedders])

    const handleApply = () => {
        try {
            const parsed = JSON.parse(code)
            if (typeof parsed !== "object" || Array.isArray(parsed)) {
                setParseError("Embedders must be a JSON object (not an array)")
                return
            }
            setParseError(null)
            dispatch({
                type: IndexSettingsActions.Update,
                payload: { embedders: Object.keys(parsed).length > 0 ? parsed : null }
            })
        } catch (e: any) {
            setParseError(e.message)
        }
    }

    const handleTemplateSelect = (templateKey: string) => {
        if (!templateKey) return
        try {
            const current = JSON.parse(code) || {}
            current[templateKey] = TEMPLATES[templateKey]
            const newCode = JSON.stringify(current, null, 2)
            setCode(newCode)
            setParseError(null)
        } catch {
            const newObj = { [templateKey]: TEMPLATES[templateKey] }
            setCode(JSON.stringify(newObj, null, 2))
            setParseError(null)
        }
    }

    return <div>
        <DocHeader
            title={"Embedders"}
            badge={"embedders"}
            description={"Configure vector embedders for semantic and hybrid search. Default value: null"}
            link={"https://www.meilisearch.com/docs/learn/ai_powered_search/getting_started_with_ai_search"}
        />
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Add template:</label>
                <select
                    onChange={(e) => {
                        handleTemplateSelect(e.target.value)
                        e.target.value = ""
                    }}
                    defaultValue=""
                    className="p-1.5 border border-gray-200 rounded text-sm"
                >
                    <option value="" disabled>Select embedder template...</option>
                    <option value="openAi">OpenAI</option>
                    <option value="huggingFace">Hugging Face</option>
                    <option value="ollama">Ollama</option>
                    <option value="rest">REST API</option>
                    <option value="userProvided">User Provided</option>
                </select>
            </div>
            <CodeMirror
                value={code}
                extensions={[json()]}
                basicSetup={{
                    lineNumbers: true,
                    highlightActiveLine: true,
                }}
                onChange={(newCode) => {
                    setCode(newCode)
                    setParseError(null)
                }}
                style={{
                    fontSize: "14px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    overflow: "hidden",
                }}
                theme={vscodeDark}
            />
            {parseError && (
                <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                    {parseError}
                </div>
            )}
            <button
                onClick={handleApply}
                className="border border-gray-300 rounded-sm py-2 px-3 hover:bg-primary hover:text-white transition-all ease-in-out w-full"
            >
                Apply Embedders Configuration
            </button>
        </div>
    </div>
}

export default EmbeddersSettings

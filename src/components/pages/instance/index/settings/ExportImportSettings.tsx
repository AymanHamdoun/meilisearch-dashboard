// @ts-ignore
import React, { useRef } from "react"
import DocHeader from "./DocHeader"
import useIndexSettings from "../../../../../hooks/useIndexSettings"
import { IndexSettingsActions } from "../../../../../reducers/indexSettingsReducer"

const ExportImportSettings = () => {
    const { settings, dispatch } = useIndexSettings()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleExport = () => {
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'index-settings.json'
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target?.result as string)
                dispatch({
                    type: IndexSettingsActions.Set,
                    payload: parsed
                })
            } catch (err) {
                alert('Invalid JSON file')
            }
        }
        reader.readAsText(file)

        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return <div>
        <DocHeader
            title={"Export / Import Settings"}
            badge={"settings"}
            description={"Export current settings as JSON or import settings from a file. Imported settings are loaded for preview — use Save to apply."}
            link={"https://www.meilisearch.com/docs/reference/api/settings"}
        />
        <div className="flex gap-3">
            <button
                onClick={handleExport}
                className="flex-1 border border-gray-300 rounded-sm py-2 px-3 hover:bg-primary hover:text-white transition-all ease-in-out"
            >
                Export Settings (JSON)
            </button>
            <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 border border-gray-300 rounded-sm py-2 px-3 hover:bg-primary hover:text-white transition-all ease-in-out"
            >
                Import Settings (JSON)
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
            />
        </div>
    </div>
}

export default ExportImportSettings

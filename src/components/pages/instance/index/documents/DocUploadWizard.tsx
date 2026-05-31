import React, { useState, useRef, useCallback } from 'react';
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { json } from "@codemirror/lang-json";
import { uploadDocuments } from "../../../../../services/meilisearch/indexes";
import useMeiliInstance from "../../../../../hooks/useMeiliInstance";
import { BaseModal, ModalError, ModalButton } from "../../../../commons/modal/ModalComponents";

interface DocUploadWizardProps {
    isVisible: boolean;
    onClose: () => void;
    indexName: string;
}

type Step = 'input' | 'preview' | 'done';
type InputTab = 'file' | 'paste';

// ── parsers ────────────────────────────────────────────────────────────────

const parseJSON = (text: string): Record<string, any>[] => {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === 'object' && parsed !== null) return [parsed];
    throw new Error('Must be a JSON object or array of objects');
};

const parseNDJSON = (text: string): Record<string, any>[] =>
    text.split('\n')
        .map(l => l.trim())
        .filter(Boolean)
        .map(l => JSON.parse(l));

const parseCSV = (text: string): Record<string, any>[] => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) throw new Error('CSV must have a header row and at least one data row');
    const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
    return lines.slice(1).map(line => {
        const vals = line.split(',').map(v => v.replace(/^"|"$/g, '').trim());
        const obj: Record<string, any> = {};
        headers.forEach((h, i) => {
            const v = vals[i] ?? '';
            obj[h] = v === '' ? null : isNaN(Number(v)) ? v : Number(v);
        });
        return obj;
    });
};

const guessFormat = (filename: string): 'json' | 'ndjson' | 'csv' => {
    if (filename.endsWith('.ndjson') || filename.endsWith('.jsonl')) return 'ndjson';
    if (filename.endsWith('.csv')) return 'csv';
    return 'json';
};

const parseFile = (text: string, filename: string): Record<string, any>[] => {
    const fmt = guessFormat(filename);
    if (fmt === 'ndjson') return parseNDJSON(text);
    if (fmt === 'csv') return parseCSV(text);
    return parseJSON(text);
};

const detectPrimaryKey = (docs: Record<string, any>[]): string | null => {
    if (!docs.length) return null;
    const keys = Object.keys(docs[0]);
    const candidates = ['id', 'uid', '_id', 'ID', 'uuid', 'pk'];
    return candidates.find(c => keys.includes(c)) ?? null;
};

// ── sub-components ─────────────────────────────────────────────────────────

const Stepper = ({ step }: { step: Step }) => {
    const steps = ['Input', 'Preview', 'Done'];
    const idx = step === 'input' ? 0 : step === 'preview' ? 1 : 2;
    return (
        <div className="flex items-center gap-0 mb-6">
            {steps.map((label, i) => (
                <React.Fragment key={label}>
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${i <= idx ? 'text-primary' : 'text-gray-400'}`}>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border ${i < idx ? 'bg-primary border-primary text-white' : i === idx ? 'border-primary text-primary' : 'border-gray-300 text-gray-400'}`}>
                            {i < idx ? '✓' : i + 1}
                        </span>
                        {label}
                    </div>
                    {i < steps.length - 1 && <div className={`flex-1 mx-2 h-px ${i < idx ? 'bg-primary' : 'bg-gray-200'}`} />}
                </React.Fragment>
            ))}
        </div>
    );
};

const DropZone = ({ onParsed, onError }: { onParsed: (docs: Record<string, any>[], filename: string) => void; onError: (e: string) => void }) => {
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const docs = parseFile(text, file.name);
                onParsed(docs, file.name);
            } catch (err: any) {
                onError(err.message ?? 'Failed to parse file');
            }
        };
        reader.readAsText(file);
    }, [onParsed, onError]);

    return (
        <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) handleFile(file);
            }}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center gap-3 cursor-pointer transition-colors ${dragging ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
        >
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div className="text-center">
                <p className="text-sm text-gray-600 font-medium">Drop a file here or click to browse</p>
                <p className="text-xs text-gray-400 mt-1">Supports .json, .ndjson, .jsonl, .csv</p>
            </div>
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".json,.ndjson,.jsonl,.csv"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
        </div>
    );
};

const PreviewCard = ({ doc, index }: { doc: Record<string, any>; index: number }) => (
    <div className="border border-gray-100 rounded p-3 bg-gray-50 text-xs">
        <div className="text-gray-400 mb-1.5 font-medium">Record {index + 1}</div>
        {Object.entries(doc).slice(0, 6).map(([k, v]) => (
            <div key={k} className="flex gap-2 py-0.5">
                <span className="text-gray-500 font-medium shrink-0 w-24 truncate">{k}</span>
                <span className="text-gray-700 truncate">{typeof v === 'object' ? JSON.stringify(v) : String(v ?? '')}</span>
            </div>
        ))}
        {Object.keys(doc).length > 6 && (
            <div className="text-gray-400 mt-1">+{Object.keys(doc).length - 6} more fields</div>
        )}
    </div>
);

// ── main wizard ────────────────────────────────────────────────────────────

const DocUploadWizard: React.FC<DocUploadWizardProps> = ({ isVisible, onClose, indexName }) => {
    const { instanceState } = useMeiliInstance();

    const [step, setStep] = useState<Step>('input');
    const [inputTab, setInputTab] = useState<InputTab>('file');
    const [docs, setDocs] = useState<Record<string, any>[]>([]);
    const [filename, setFilename] = useState('');
    const [pasteCode, setPasteCode] = useState('[\n  \n]');
    const [parseError, setParseError] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [taskUid, setTaskUid] = useState<number | null>(null);

    const reset = () => {
        setStep('input');
        setInputTab('file');
        setDocs([]);
        setFilename('');
        setPasteCode('[\n  \n]');
        setParseError(null);
        setUploadError(null);
        setIsUploading(false);
        setTaskUid(null);
    };

    const handleClose = () => { if (!isUploading) { reset(); onClose(); } };

    const handleFileParsed = (parsed: Record<string, any>[], name: string) => {
        setParseError(null);
        setDocs(parsed);
        setFilename(name);
        setStep('preview');
    };

    const handlePasteContinue = () => {
        try {
            setParseError(null);
            const parsed = parseJSON(pasteCode);
            setDocs(parsed);
            setFilename('pasted-data.json');
            setStep('preview');
        } catch (e: any) {
            setParseError(e.message);
        }
    };

    const handleUpload = async () => {
        setIsUploading(true);
        setUploadError(null);
        try {
            const resp = await uploadDocuments({ instance: instanceState, indexName, documents: docs });
            if (resp?.message && resp?.code) throw new Error(resp.message);
            setTaskUid(resp?.taskUid ?? null);
            setStep('done');
        } catch (e: any) {
            setUploadError(e.message ?? 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const detectedPK = docs.length ? detectPrimaryKey(docs) : null;

    const title = step === 'input' ? 'Add Documents' : step === 'preview' ? 'Preview' : 'Upload complete';

    return (
        <BaseModal isVisible={isVisible} onClose={handleClose} title={title} isLoading={isUploading} width="xl">
            <Stepper step={step} />

            {/* ── Step 1: Input ── */}
            {step === 'input' && (
                <div className="flex flex-col gap-4">
                    {/* tab switcher */}
                    <div className="flex rounded border border-gray-200 overflow-hidden text-sm w-fit">
                        {(['file', 'paste'] as InputTab[]).map(t => (
                            <button
                                key={t}
                                onClick={() => setInputTab(t)}
                                className={`px-4 py-1.5 capitalize transition-colors ${inputTab === t ? 'bg-primary text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                            >
                                {t === 'file' ? 'Upload File' : 'Paste JSON'}
                            </button>
                        ))}
                    </div>

                    {inputTab === 'file' ? (
                        <>
                            <DropZone onParsed={handleFileParsed} onError={setParseError} />
                            {parseError && <p className="text-sm text-red-600">{parseError}</p>}
                        </>
                    ) : (
                        <>
                            <CodeMirror
                                value={pasteCode}
                                extensions={[json()]}
                                basicSetup={{ lineNumbers: true, highlightActiveLine: true }}
                                onChange={setPasteCode}
                                maxHeight="300px"
                                style={{ fontSize: '13px', border: '1px solid #ccc', borderRadius: '5px', overflow: 'hidden' }}
                                theme={vscodeDark}
                            />
                            {parseError && <p className="text-sm text-red-600">{parseError}</p>}
                            <ModalButton onClick={handlePasteContinue} disabled={!pasteCode.trim()} isLoading={false} success={false}>
                                Preview →
                            </ModalButton>
                        </>
                    )}
                </div>
            )}

            {/* ── Step 2: Preview ── */}
            {step === 'preview' && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>
                            <span className="font-semibold text-gray-800">{docs.length.toLocaleString()}</span> documents from <span className="font-mono text-xs bg-gray-100 px-1 rounded">{filename}</span>
                        </span>
                        {detectedPK && (
                            <span className="text-xs text-gray-400">
                                detected primary key: <span className="font-mono bg-gray-100 px-1 rounded text-gray-600">{detectedPK}</span>
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {docs.slice(0, 3).map((doc, i) => <PreviewCard key={i} doc={doc} index={i} />)}
                    </div>
                    {docs.length > 3 && (
                        <p className="text-xs text-gray-400 text-center">…and {(docs.length - 3).toLocaleString()} more</p>
                    )}

                    {uploadError && <ModalError error={uploadError} />}

                    <div className="flex gap-2">
                        <button
                            onClick={() => { setStep('input'); setUploadError(null); }}
                            className="flex-1 py-2.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50"
                        >
                            ← Back
                        </button>
                        <ModalButton onClick={handleUpload} isLoading={isUploading} success={false} loadingText={`Uploading ${docs.length.toLocaleString()} docs…`}>
                            Upload {docs.length.toLocaleString()} documents →
                        </ModalButton>
                    </div>
                </div>
            )}

            {/* ── Step 3: Done ── */}
            {step === 'done' && (
                <div className="flex flex-col items-center gap-4 py-6">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <p className="font-semibold text-gray-800">{docs.length.toLocaleString()} documents queued</p>
                        <p className="text-sm text-gray-500 mt-1">
                            {taskUid ? <>Task <span className="font-mono text-xs">#{taskUid}</span> is processing in the background.</> : 'Upload task submitted.'}
                        </p>
                    </div>
                    <button onClick={handleClose} className="px-6 py-2 bg-primary text-white rounded text-sm hover:bg-opacity-90">
                        Done
                    </button>
                </div>
            )}
        </BaseModal>
    );
};

export default DocUploadWizard;

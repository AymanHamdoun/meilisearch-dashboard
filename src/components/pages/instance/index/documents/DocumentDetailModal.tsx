import React, { useState, useEffect } from 'react';
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { json } from "@codemirror/lang-json";
import { uploadDocuments } from "../../../../../services/meilisearch/indexes";
import useMeiliInstance from "../../../../../hooks/useMeiliInstance";
import { BaseModal, ModalError, ModalSuccess, ModalButton } from "../../../../commons/modal/ModalComponents";
import useModalState from "../../../../../hooks/useModalState";

interface DocumentDetailModalProps {
    isVisible: boolean;
    onClose: () => void;
    document: Record<string, any> | null;
    indexName: string;
    onDocumentUpdated?: () => void;
}

const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
    isVisible,
    onClose,
    document,
    indexName,
    onDocumentUpdated
}) => {
    const { instanceState } = useMeiliInstance();
    const [code, setCode] = useState("");
    const { isLoading, error, success, resetState, handleAsyncOperation } = useModalState();

    useEffect(() => {
        if (document) {
            setCode(JSON.stringify(document, null, 2));
        }
    }, [document]);

    const handleClose = () => {
        if (!isLoading) {
            resetState();
            onClose();
        }
    };

    const handleSave = async () => {
        await handleAsyncOperation(
            async () => {
                const parsed = JSON.parse(code);
                const docs = Array.isArray(parsed) ? parsed : [parsed];
                await uploadDocuments({
                    instance: instanceState,
                    indexName,
                    documents: docs
                });
            },
            () => {
                onDocumentUpdated?.();
            },
            handleClose,
            1000
        );
    };

    return (
        <BaseModal
            isVisible={isVisible}
            onClose={handleClose}
            title="Edit Document"
            isLoading={isLoading}
            width="lg"
        >
            <div className="flex flex-col gap-3">
                <CodeMirror
                    value={code}
                    extensions={[json()]}
                    basicSetup={{
                        lineNumbers: true,
                        highlightActiveLine: true,
                    }}
                    onChange={(newCode) => setCode(newCode)}
                    maxHeight="65vh"
                    style={{
                        fontSize: "14px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        overflow: "hidden",
                    }}
                    theme={vscodeDark}
                    editable={true}
                />

                <ModalError error={error} />
                <ModalSuccess success={success} message="Document updated successfully!" />

                <ModalButton
                    onClick={handleSave}
                    disabled={!code.trim()}
                    isLoading={isLoading}
                    success={success}
                    loadingText="Saving..."
                >
                    Save Changes
                </ModalButton>
            </div>
        </BaseModal>
    );
};

export default DocumentDetailModal;

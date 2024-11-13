import React, { useState } from 'react';
import CodeMirror from "@uiw/react-codemirror";
import { vscodeLight, vscodeDark } from "@uiw/codemirror-theme-vscode";
import { json } from "@codemirror/lang-json";

const DocIndexingModal = ({ isVisible, onClose, onConfirm }) => {
  if (!isVisible) return null;

  const [code, setCode] = useState(JSON.stringify([{ name: "John Doe", bio: "A very searchable person" }, { name: "Jane Doe", bio: "Another very searchable person" }], null, 2))

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full md:w-1/3 max-w-md shadow-lg">
        <div className="flex items-center justify-between py-2 border-b rounded-t border-gray-200 mb-2">
          <h3 className="text-lg font-semibold text-gray-700">
            Add Record(s)
          </h3>
          <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" onClick={onClose}>
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <p className='mb-4 text-gray-800'>
          Add records in JSON format. JSON should contain either a single object or an array of objects. For example:
        </p>
        <div className="flex flex-col gap-2">
          <div>
            <CodeMirror
              value={code}
              extensions={[json()]}
              basicSetup={{
                lineNumbers: true,
                highlightActiveLine: true,
              }}
              onChange={(newCode) => {
                setCode(newCode)
              }}
              style={{
                fontSize: "14px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                overflow: "hidden",
              }}
              theme={vscodeDark}
            />
          </div>
          <button
            onClick={() => {
              onConfirm(code)
            }}
            className="w-full py-3 border border-primary rounded text-primary font-semibold transition-all ease-in-out hover:bg-primary hover:text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocIndexingModal;
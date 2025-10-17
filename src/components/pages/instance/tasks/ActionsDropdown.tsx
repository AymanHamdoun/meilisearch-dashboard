import React, { useState, useRef, useEffect } from 'react';
import CreateSnapshotAction from './actions/CreateSnapshotAction';

interface ActionsDropdownProps {
    onError?: (error: Error) => void;
}

const ActionsDropdown: React.FC<ActionsDropdownProps> = ({ onError }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleActionComplete = () => {
        setIsOpen(false);
    };

    const handleError = (error: Error) => {
        setIsOpen(false);
        onError?.(error);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent flex items-center gap-1"
                aria-label="Actions menu"
                aria-expanded={isOpen}
            >
                Actions
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <div className="py-1">
                        <CreateSnapshotAction
                            onActionComplete={handleActionComplete}
                            onError={handleError}
                        />

                        {/* Add more action components here as needed */}
                        {/* Example:
                        <CreateDumpAction
                            onActionComplete={handleActionComplete}
                            onError={handleError}
                        />
                        <CancelTasksAction
                            onActionComplete={handleActionComplete}
                            onError={handleError}
                        />
                        */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActionsDropdown;
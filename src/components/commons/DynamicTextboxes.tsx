import React, { useEffect, useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DynamicTextBoxesProps {
    buttonText: string;
    initialTextboxValues: string[];
    onChange?: (values: string[]) => void;
    reorderable?: boolean;
}

interface SortableItemProps {
    id: string;
    value: string;
    index: number;
    reorderable: boolean;
    onTextChange: (index: number, value: string) => void;
    onDelete: (index: number) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, value, index, reorderable, onTextChange, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id, disabled: !reorderable });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center mb-3 ${isDragging ? 'z-50' : ''}`}
        >
            {reorderable && (
                <div
                    className="mr-2 text-gray-400 hover:text-gray-600 cursor-move touch-none"
                    {...attributes}
                    {...listeners}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 6.5C8 7.32843 7.32843 8 6.5 8C5.67157 8 5 7.32843 5 6.5C5 5.67157 5.67157 5 6.5 5C7.32843 5 8 5.67157 8 6.5Z" fill="currentColor"/>
                        <path d="M8 12C8 12.8284 7.32843 13.5 6.5 13.5C5.67157 13.5 5 12.8284 5 12C5 11.1716 5.67157 10.5 6.5 10.5C7.32843 10.5 8 11.1716 8 12Z" fill="currentColor"/>
                        <path d="M6.5 19C7.32843 19 8 18.3284 8 17.5C8 16.6716 7.32843 16 6.5 16C5.67157 16 5 16.6716 5 17.5C5 18.3284 5.67157 19 6.5 19Z" fill="currentColor"/>
                        <path d="M13.5 6.5C13.5 7.32843 12.8284 8 12 8C11.1716 8 10.5 7.32843 10.5 6.5C10.5 5.67157 11.1716 5 12 5C12.8284 5 13.5 5.67157 13.5 6.5Z" fill="currentColor"/>
                        <path d="M12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z" fill="currentColor"/>
                        <path d="M13.5 17.5C13.5 18.3284 12.8284 19 12 19C11.1716 19 10.5 18.3284 10.5 17.5C10.5 16.6716 11.1716 16 12 16C12.8284 16 13.5 16.6716 13.5 17.5Z" fill="currentColor"/>
                        <path d="M17.5 8C18.3284 8 19 7.32843 19 6.5C19 5.67157 18.3284 5 17.5 5C16.6716 5 16 5.67157 16 6.5C16 7.32843 16.6716 8 17.5 8Z" fill="currentColor"/>
                        <path d="M19 12C19 12.8284 18.3284 13.5 17.5 13.5C16.6716 13.5 16 12.8284 16 12C16 11.1716 16.6716 10.5 17.5 10.5C18.3284 10.5 19 11.1716 19 12Z" fill="currentColor"/>
                        <path d="M17.5 19C18.3284 19 19 18.3284 19 17.5C19 16.6716 18.3284 16 17.5 16C16.6716 16 16 16.6716 16 17.5C16 18.3284 16.6716 19 17.5 19Z" fill="currentColor"/>
                    </svg>
                </div>
            )}
            <input
                type="text"
                value={value}
                onChange={(e) => onTextChange(index, e.target.value)}
                className="flex-1 mr-3 border-b bg-gray-50 border-gray-200 py-1.5 px-3 focus:outline-none focus:border-b focus:border-b-primary text-gray-600"
            />
            <button onClick={() => onDelete(index)}
                className="p-2 text-gray-300 hover:text-red-400 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
        </div>
    );
};

const DynamicTextBoxes: React.FC<DynamicTextBoxesProps> = ({buttonText, initialTextboxValues, onChange, reorderable = false }) => {
    initialTextboxValues = !Array.isArray(initialTextboxValues) ? [] : initialTextboxValues;

    const [textboxes, setTextboxes] = useState<string[]>(initialTextboxValues);
    const [items, setItems] = useState<string[]>([]);

    useEffect(() => {
        setTextboxes(initialTextboxValues);
        setItems(initialTextboxValues.map((_, index) => `item-${index}`));
    }, [initialTextboxValues]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleAddTextbox = () => {
        const newTextboxes = [...textboxes, ""];
        const newItems = [...items, `item-${items.length}`];
        setTextboxes(newTextboxes);
        setItems(newItems);
        onChange?.(newTextboxes);
    };

    const handleTextboxChange = (index: number, value: string) => {
        const updatedTextboxes = [...textboxes];
        updatedTextboxes[index] = value;
        setTextboxes(updatedTextboxes);
        onChange?.(updatedTextboxes);
    };

    const handleDeleteTextbox = (index: number) => {
        const updatedTextboxes = textboxes.filter((_, i) => i !== index);
        const updatedItems = items.filter((_, i) => i !== index);
        setTextboxes(updatedTextboxes);
        setItems(updatedItems);
        onChange?.(updatedTextboxes);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.indexOf(active.id as string);
            const newIndex = items.indexOf(over.id as string);

            const newItems = arrayMove(items, oldIndex, newIndex);
            const newTextboxes = arrayMove(textboxes, oldIndex, newIndex);

            setItems(newItems);
            setTextboxes(newTextboxes);
            onChange?.(newTextboxes);
        }
    };

    if (reorderable) {
        return (
            <div className="flex flex-col gap-3">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={items}
                        strategy={verticalListSortingStrategy}
                    >
                        <div>
                            {textboxes.map((textbox, index) => (
                                <SortableItem
                                    key={items[index]}
                                    id={items[index]}
                                    value={textbox}
                                    index={index}
                                    reorderable={reorderable}
                                    onTextChange={handleTextboxChange}
                                    onDelete={handleDeleteTextbox}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                <button className="border border-gray-300 rounded-sm py-2 px-3 hover:bg-primary hover:text-white transition-all ease-in-out w-full" onClick={handleAddTextbox}>{buttonText}</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <div>
                {textboxes.map((textbox, index) => (
                    <div key={index} className="flex items-center mb-3">
                        <input
                            type="text"
                            value={textbox}
                            onChange={(e) => handleTextboxChange(index, e.target.value)}
                            className="flex-1 mr-3 border-b bg-gray-50 border-gray-200 py-1.5 px-3 focus:outline-none focus:border-b focus:border-b-primary text-gray-600"
                        />
                        <button onClick={() => handleDeleteTextbox(index)}
                            className="border border-gray-200 rounded-sm p-3 hover:border-red-400">
                            <svg fill="#000000" height="10px" width="10px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460.775 460.775"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path> </g></svg>
                        </button>
                    </div>
                ))}
            </div>

            <button className="border border-gray-300 rounded-sm py-2 px-3 hover:bg-primary hover:text-white transition-all ease-in-out w-full" onClick={handleAddTextbox}>{buttonText}</button>
        </div>
    );
};

export default DynamicTextBoxes;
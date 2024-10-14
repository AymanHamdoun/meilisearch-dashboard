import React, { useEffect, useState } from "react";

interface DynamicTextBoxesProps {
    buttonText: string;
    initialTextboxValues: string[]
}

const DynamicTextBoxes: React.FC<DynamicTextBoxesProps> = ({buttonText, initialTextboxValues }) => {
    initialTextboxValues = !Array.isArray(initialTextboxValues) ? [] : initialTextboxValues;

    const [textboxes, setTextboxes] = useState<string[]>(initialTextboxValues);

    useEffect(() => {
        setTextboxes(initialTextboxValues); 
    }, [initialTextboxValues]); 

    const handleAddTextbox = () => {
        setTextboxes([...textboxes, ""]); // Add a new empty textbox
    };

    const handleTextboxChange = (index: number, value: string) => {
        const updatedTextboxes = [...textboxes];
        updatedTextboxes[index] = value;
        setTextboxes(updatedTextboxes); // Update the state with the changed value
    };

    const handleDeleteTextbox = (index: number) => {
        const updatedTextboxes = textboxes.filter((_, i) => i !== index);
        setTextboxes(updatedTextboxes); // Remove the textbox at the specified index
    };

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
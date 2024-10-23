import React, { useEffect } from "react";

interface InputFormProps {
    prompt: string;
    onPromptChange: (newPrompt: string) => void;
    onSubmit: () => void;
    loading: boolean;
    numImages: number;
    onNumImagesChange: (num: number) => void;
}

const charactersLimit = 200;

const buttons = [
    { num: 1, disabled: false },
    { num: 2, disabled: false },
    { num: 3, disabled: true },
    { num: 4, disabled: true },
];

const InputForm: React.FC<InputFormProps> = ({
    prompt,
    onPromptChange,
    onSubmit,
    loading,
    numImages,
    onNumImagesChange,
}) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'Enter') {
                onSubmit();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onSubmit]);

    return (
        <div>
            <div className="flex flex-col items-center w-full p-4 bg-white rounded-lg">
                <textarea
                    value={prompt}
                    onChange={(e) => onPromptChange(e.target.value)}
                    placeholder="Enter your prompt..."
                    className="w-full h-32 md:h-64 p-4 mb-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                    maxLength={charactersLimit}
                />
                <div className="self-end mb-2 text-sm text-gray-500">
                    {`${charactersLimit - prompt.length} characters remaining`}
                </div>
                <label className="mb-2 text-sm text-gray-700">Select Number of Images:</label>
                <div className="flex mb-4">
                    {buttons.map(({ num, disabled }) => (
                        <button
                            key={num}
                            onClick={() => onNumImagesChange(num)}
                            disabled={loading || disabled}
                            className={`mr-4 px-4 py-2 rounded-lg ${numImages === num ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} ${loading || disabled ? "cursor-not-allowed opacity-50" : "hover:bg-blue-600 hover:text-white transition"}`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
                <button
                    onClick={onSubmit}
                    className={`w-full py-3 text-lg font-semibold text-white rounded-lg ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 transition"
                        }`}
                    disabled={loading}
                >
                    {loading ? "Generating..." : "Generate"}
                </button>
            </div>
        </div>
    );
};

export default InputForm;
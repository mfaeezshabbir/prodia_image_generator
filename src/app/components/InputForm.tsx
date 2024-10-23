import React from "react";

interface InputFormProps {
    prompt: string;
    onPromptChange: (newPrompt: string) => void;
    onSubmit: () => void;
    loading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ prompt, onPromptChange, onSubmit, loading }) => {
    return (
        <div className="flex items-center w-full">
            <input
                type="text"
                value={prompt}
                onChange={(e) => onPromptChange(e.target.value)}
                placeholder="Enter your prompt..."
                className="flex-grow px-4 py-2 text-lg border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
            />
            <button
                onClick={onSubmit}
                className={`px-6 py-2 rounded-r-lg text-lg ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 transition"
                    }`}
                disabled={loading}
            >
                {loading ? "Generating..." : "Generate"}
            </button>
        </div>
    );
};

export default InputForm;

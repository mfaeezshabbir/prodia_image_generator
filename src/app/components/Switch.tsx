import React from "react";

interface SwitchProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ label, checked, onChange }) => {
    return (
        <div className="flex items-center mb-6">
            <span className="mr-3 text-gray-700">{label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-300 rounded-full peer-focus:outline-none dark:bg-gray-700 peer-checked:bg-blue-500 transition relative">
                    <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'transform translate-x-6' : ''}`}></div>
                </div>
                <span className="ml-3 text-gray-700">{checked ? "Yes" : "No"}</span>
            </label>
        </div>
    );
};

export default Switch;

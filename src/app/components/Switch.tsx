import React from "react";

interface SwitchProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description?: string;
}

const Switch: React.FC<SwitchProps> = ({ label, checked, onChange, description }) => {
    return (
        <div className="flex flex-col mb-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    {description && (
                        <span className="text-xs text-gray-500 mt-0.5">{description}</span>
                    )}
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => onChange(e.target.checked)}
                        className="sr-only peer"
                        aria-label={label}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 peer-checked:bg-indigo-600 transition-colors relative">
                        <div className={`absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${checked ? 'translate-x-5' : ''}`}></div>
                    </div>
                </label>
            </div>
        </div>
    );
};

export default Switch;

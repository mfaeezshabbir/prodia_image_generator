import React, { useEffect, useState } from "react";
import { LuWand2, LuImagePlus, LuInfo, LuSparkles, LuSettings } from "react-icons/lu";

interface InputFormProps {
  prompt: string;
  onPromptChange: (newPrompt: string) => void;
  onSubmit: () => void;
  loading: boolean;
  numImages: number;
  onNumImagesChange: (num: number) => void;
  selectedModel?: string;
  onModelChange?: (model: string) => void;
}

const charactersLimit = 200;

const buttons = [
  { num: 1, disabled: false },
  { num: 2, disabled: false },
  { num: 3, disabled: true },
  { num: 4, disabled: true },
];

// Available AI models based on the latest Prodia API documentation
const aiModels = [
  { id: "sdxl", name: "Stable Diffusion XL", description: "High-quality images with excellent detail" },
  { id: "sd3", name: "Stable Diffusion 3", description: "Latest generation with photorealistic results" },
  { id: "dalle3", name: "DALL-E 3", description: "Advanced text-to-image with exceptional detail" },
  { id: "realistic_vision", name: "Realistic Vision", description: "Photorealistic images with high fidelity" },
  { id: "anime_pastel", name: "Anime Pastel", description: "Anime-style images with vibrant colors" },
  { id: "dreamshaper", name: "DreamShaper", description: "Dream-like artistic images" },
  { id: "juggernaut", name: "Juggernaut", description: "Highly detailed imaginative scenes" },
  { id: "midjourney", name: "Midjourney Style", description: "Stylistic images similar to Midjourney" },
]

const InputForm: React.FC<InputFormProps> = ({
  prompt,
  onPromptChange,
  onSubmit,
  loading,
  numImages,
  onNumImagesChange,
  selectedModel = "sdxl",
  onModelChange = () => {},
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "Enter") {
        onSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSubmit]);

  return (
    <div className="w-full">
      <div className="mb-6">
        <p className="text-gray-600">Describe what you want to see in rich detail for best results</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="prompt" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <LuSparkles className="mr-1.5 text-indigo-500" /> Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="A serene mountain landscape with a lake reflecting the sky, dramatic lighting, photorealistic style..."
            className="w-full h-36 p-4 text-gray-800 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all resize-none shadow-sm"
            disabled={loading}
            maxLength={charactersLimit}
          />
          <div className="flex justify-end mt-2 text-xs text-gray-500">
            {`${prompt.length}/${charactersLimit} characters`}
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <LuImagePlus className="mr-1.5 text-indigo-500" /> Number of Images
          </label>
          <div className="flex gap-2">
            {buttons.map(({ num, disabled }) => (
              <button
                key={num}
                onClick={() => onNumImagesChange(num)}
                disabled={loading || disabled}
                className={`w-12 h-12 rounded-lg border ${
                  numImages === num
                    ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-medium"
                    : "bg-white border-gray-200 text-gray-700"
                } ${
                  loading || disabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          {(buttons[2].disabled || buttons[3].disabled) && (
            <div className="mt-2 flex items-start gap-1.5 text-xs text-amber-600">
              <LuInfo className="mt-0.5 flex-shrink-0" />
              <span>Some options are disabled in the current version</span>
            </div>
          )}
        </div>

        {/* Advanced Settings Toggle */}
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 font-medium"
          type="button"
          disabled={loading}
        >
          <LuSettings size={15} />
          {showAdvanced ? "Hide Advanced Settings" : "Show Advanced Settings"}
        </button>

        {showAdvanced && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <LuSparkles className="mr-1.5 text-indigo-500" /> Choose AI Model
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {aiModels.map(model => (
                <button
                  key={model.id}
                  onClick={() => onModelChange(model.id)}
                  disabled={loading}
                  className={`p-3 rounded-lg border text-left ${
                    selectedModel === model.id
                      ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                      : "bg-white border-gray-200 text-gray-700"
                  } ${loading ? "cursor-not-allowed opacity-50" : "hover:border-indigo-300 transition-colors"}`}
                >
                  <div className="font-medium">{model.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{model.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        <button
          onClick={onSubmit}
          disabled={loading}
          className={`w-full mt-4 py-3.5 px-4 flex items-center justify-center gap-2 rounded-lg font-medium transition-all ${
            loading
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "gradient-bg text-white hover:shadow-md hover:scale-[1.01] transform"
          }`}
        >
          <LuWand2 className={loading ? "animate-spin" : ""} size={18} />
          {loading ? "Creating Your Image..." : "Generate Image"}
        </button>
        
        <div className="mt-3 text-xs text-center text-gray-500">
          Press Ctrl+Enter as a shortcut to generate
        </div>
      </div>
    </div>
  );
};

export default InputForm;

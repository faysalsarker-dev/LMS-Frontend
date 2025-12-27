import  { useState } from "react";
import { Copy, Check, Info } from "lucide-react";

const DemoAccess = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-2xl border border-blue-100 dark:border-gray-700 w-72 animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-2 mb-3 border-b pb-2 dark:border-gray-700">
        <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-300" />
        </div>
        <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-100">Demo Access</h3>
      </div>

      <div className="space-y-3">
        {/* Email Field */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Admin Email</p>
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg border dark:border-gray-700">
            <span className="text-xs font-medium truncate max-w-[180px]">faysalsarker.dev@gmail.com</span>
            <button 
              onClick={() => handleCopy("faysalsarker.dev@gmail.com", "email")}
              className="hover:text-blue-600 transition-colors"
            >
              {copiedField === "email" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Password</p>
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg border dark:border-gray-700">
            <span className="text-xs font-mono">11111111</span>
            <button 
              onClick={() => handleCopy("11111111", "pass")}
              className="hover:text-blue-600 transition-colors"
            >
              {copiedField === "pass" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
      
      <p className="mt-3 text-[10px] text-center text-gray-400 italic">Click copy icons to use credentials</p>
    </div>
  );
};

export default DemoAccess;
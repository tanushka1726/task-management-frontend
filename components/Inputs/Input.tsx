import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder: string;
  type: string;
}

const Input = ({ value, onChange, label, placeholder, type }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-700">{label}</label>

      <div
        className={`flex items-center gap-2 rounded-xl border bg-slate-50 px-3.5 py-2.5 transition-all duration-200
          border-slate-200 focus-within:border-violet-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-500/10`}
      >
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="shrink-0 text-slate-400 hover:text-violet-500 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <FaRegEye size={16} /> : <FaRegEyeSlash size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
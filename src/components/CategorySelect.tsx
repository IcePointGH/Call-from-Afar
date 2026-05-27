import { categories } from "../data/messages";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const CategorySelect = ({ value, onChange }: CategorySelectProps) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field appearance-none cursor-pointer pr-10"
      >
        <option value="" disabled className="bg-deep-space">
          选择对方身份
        </option>
        {categories.map((cat) => (
          <option
            key={cat.value}
            value={cat.value}
            className="bg-deep-space"
          >
            {cat.label}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="#f5f5f7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

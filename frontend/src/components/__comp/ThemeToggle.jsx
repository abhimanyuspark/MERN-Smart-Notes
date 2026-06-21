import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../../redux/features/theme";
const themes = ["dark", "light", "dracula", "cyberpunk", "forest"];

const ThemeToggle = () => {
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();

  return (
    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
      {themes.map((d, i) => (
        <li
          data-theme={d}
          className="border border-primary p-2 rounded flex gap-2 flex-col"
          key={i}
          onClick={() => {
            dispatch(setTheme(d));
          }}
        >
          <span className="text-sm block font-bold first-letter:uppercase">
            {d}
          </span>

          <div className="flex gap-2 flex-wrap">
            <span className="py-1 text-primary-content px-3 rounded bg-primary">
              A
            </span>
            <span className="py-1 text-secondary-content px-3 rounded bg-secondary">
              A
            </span>
            <span className="py-1 text-accent-content px-3 rounded bg-accent">
              A
            </span>
            <span className="py-1 text-neutral-content px-3 rounded bg-neutral">
              A
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ThemeToggle;

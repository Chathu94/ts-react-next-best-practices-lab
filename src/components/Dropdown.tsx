import React from "react";

type DropdownProps = {
  status: string;
  setStatus: (status: string) => void;
  statusOptions: string[];
};

const Dropdown = ({ status, setStatus, statusOptions }: DropdownProps) => {
  return (
    <select
      className="rounded-md border border-slate-200 px-2 py-2 text-sm"
      value={status}
      onChange={(event) => setStatus(event.target.value)}
    >
      {statusOptions.map((statusOption) => (
        <option key={statusOption} value={statusOption}>
          {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;

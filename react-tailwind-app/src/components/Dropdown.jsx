import React from 'react';

const Dropdown = ({ name, label, options, onChange, isObject = false, value }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="font-medium text-gray-700 mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <select
      id={name}
      name={name}
      onChange={onChange}
      value={value}
      required
      className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={isObject ? opt.id : opt} value={isObject ? opt.id : opt}>
          {isObject ? opt.name : opt}
        </option>
      ))}
    </select>
  </div>
);


export default Dropdown;

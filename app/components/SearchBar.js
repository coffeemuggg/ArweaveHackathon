import React from 'react';
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ onSearch }) => {
    const handleSearch = (e) => {
        const query = e.target.value;
        onSearch(query);
    };

    return (
        <div className="flex items-center border rounded-lg p-2 shadow-md w-1/2">
            <FaSearch className="text-gray-400 mr-2" />
            <input
                type="text"
                placeholder="Search..."
                className="bg-primary text-white border-none focus:outline-none w-full"
                onChange={handleSearch}
            />
        </div>
    );
};

export default SearchBar;

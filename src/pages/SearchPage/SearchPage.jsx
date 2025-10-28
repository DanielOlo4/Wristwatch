import React from "react";
import { Link } from "react-router-dom";

function SearchPage() {
  return (
    <div className="p-5 text-center">
      <h1 className="text-2xl font-bold">🔍 Search Page</h1>
      <p className="text-gray-700 mt-2">
        Click below to search for wristwatches.
      </p>

      {/* 🔗 Link with query param that triggers search in Accessories */}
      <Link
        to="/accessories?openSearch=true"
        className="inline-block mt-4 px-5 py-2 bg-blue-600 text-white rounded-md font-bold no-underline cursor-pointer hover:bg-blue-700 transition"
      >
        Go to Accessories to Search for Wristwatches
      </Link>
    </div>
  );
}

export default SearchPage;

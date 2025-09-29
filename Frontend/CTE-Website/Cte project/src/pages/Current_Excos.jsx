import React, { useContext, useEffect } from "react";
import { DeptContext } from "../context/DeptContext";

const Current_Excos = () => {
  const { excos, fetchExcos } = useContext(DeptContext);

  useEffect(() => {
    fetchExcos();
  }, [excos]);

  // 🔹 Sorting function: President first, then Vice President, then others
  const sortedExcos = [...excos].sort((a, b) => {
    if (a.post === "President") return -1;
    if (b.post === "President") return 1;
    if (a.post === "Vice President") return -1;
    if (b.post === "Vice President") return 1;
    return 0; // keep others in their original order
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
        Department of Computer Engineering EXCOS
      </h1>

      {sortedExcos.length === 0 ? (
        <p className="text-center text-gray-500">No Excos found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedExcos.map((exco) => (
            <div
              key={exco._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border flex flex-col justify-between"
            >
              {/* Image container */}
              <div className="w-full h-64 overflow-hidden">
                <img
                  src={exco.photo}
                  alt={exco.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="p-4 text-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  {exco.name}
                </h2>
                <p className="text-sm text-blue-600 font-medium mt-1">
                  {exco.post}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Current_Excos;

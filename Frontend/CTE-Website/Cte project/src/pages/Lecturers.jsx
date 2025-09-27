import React, { useContext, useEffect } from "react";
import { DeptContext } from "../context/DeptContext";

const LecturalPage = () => {
  const { lecturers, fetchLecturers } = useContext(DeptContext);

  // Fetch lecturers when component mounts
  useEffect(() => {
    fetchLecturers();
  }, []);

  // Sort lecturers: HODs first
  const sortedLecturers = [...lecturers].sort((a, b) => b.hod - a.hod);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-blue-800">
        Meet Our Lecturers
      </h1>

      {/* Lecturer Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {sortedLecturers.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">
            No lecturers available.
          </p>
        ) : (
          sortedLecturers.map((lecturer) => (
            <div
              key={lecturer._id} // use backend _id
              className="bg-white shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-2"
            >
              {/* Photo */}
              <div className="w-full h-64 overflow-hidden">
                <img
                  src={lecturer.photo}
                  alt={lecturer.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="p-6 text-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  {lecturer.name}
                </h2>
                {lecturer.hod && (
                  <span className="mt-2 inline-block bg-blue-100 text-blue-700 px-3 py-1 text-xs font-semibold rounded-full">
                    Head of Department
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LecturalPage;

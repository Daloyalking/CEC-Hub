import React, { useContext } from 'react';
import { DeptContext } from '../context/DeptContext';
import { Link } from 'react-router-dom';

const HomeNotification = () => {
  
  const { notification,handleDownload } = useContext(DeptContext);
  const firstTen = notification.slice(0, 10); // Show latest 10 notifications

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Latest Notifications</h2>
      <ul className="space-y-4">
        {firstTen.map((note) => (
          <li key={note._id} className="border-b pb-3">
            <h3 className="font-semibold text-gray-800">{note.title}</h3>
            <p className="text-sm text-gray-600">{note.details}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(note.timestamp).toLocaleString()}
            </p>

            {/* Show first image if available */}
            {note.images && note.images.length > 0 && (
              <img
                src={note.images[0].url}
                alt={note.images[0].description || 'Notification image'}
                className="mt-2 rounded-md w-full max-h-48 object-cover"
              />
            )}

            {/* Show all documents if available */}
            {note.documents && note.documents.map((doc, i) => (
              <div key={i}>
               <li >
                        <button
                          onClick={() => handleDownload(note._id, doc.public_id, doc.name)}
                          className="text-blue-500 hover:underline"
                        >
                          {doc.name} ({doc.description || "No description"})
                        </button>
                      </li>
              </div>
            ))}

            {/* Optional: Badge for type */}
            {note.type && (
              <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-700">
                {note.type.toUpperCase()}
              </span>
            )}

            {/* Optional: Show postedBy */}
            {note.postedBy && (
              <p className="text-xs text-gray-500 mt-1">
                Posted by: {note.postedBy.name}
              </p>
            )}
          </li>
        ))}
      </ul>

      {/* Read More button */}
      <div className="mt-6 text-center">
        <Link
          to="/notifications"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
};

export default HomeNotification;

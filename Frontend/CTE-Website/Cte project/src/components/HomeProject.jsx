import React, { useContext } from 'react';
import { DeptContext } from '../context/DeptContext';
import { Link } from 'react-router-dom';

const HomeProject = () => {
  const { projects } = useContext(DeptContext);
  const latestProjects = projects.slice(0, 5);

  return (
    <div className="p-6 mt-5">
      <h1 className="text-2xl font-bold mb-4">Latest Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {latestProjects.map((project) => (
          <div key={project._id} className="border rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold">{project.topic}</h2>
            <p className="text-sm text-gray-600">
              {project.details.substring(0, 100)}...
            </p>
            {project.conductedBy && project.conductedBy.image && (
              <div className="flex items-center mt-2">
                <img
                  src={`http://localhost:4000/${project.conductedBy.image}`}
                  alt={project.conductedBy.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-sm">{project.conductedBy.name}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Link
          to="/past_projects"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          View All Past Projects
        </Link>
      </div>
    </div>
  );
};

export default HomeProject;

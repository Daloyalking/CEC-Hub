import React from "react";

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-purple-700 text-white py-16 px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Department of Computer Engineering
        </h1>
        <p className="text-lg max-w-2xl mx-auto">
          Moshood Abiola Polytechnic — Inspiring Innovation, Excellence, and
          Professionalism in the Field of Computer Engineering.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* About Department */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold text-purple-700 mb-3">
            About the Department
          </h2>
          <p className="text-gray-600 leading-relaxed">
            The Department of Computer Engineering at{" "}
            <span className="font-medium">Moshood Abiola Polytechnic</span> is
            committed to producing highly skilled graduates. Our programs blend
            hands-on training with deep theoretical knowledge to prepare students
            for leadership in technology-driven industries.
          </p>
          <img
            src="https://images.unsplash.com/photo-1581090700227-4c4f50b3c6c1"
            alt="Computer Engineering Lab"
            className="mt-4 rounded-xl w-full h-48 object-cover"
          />
        </div>

        {/* About Computer Engineering */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <h2 className="text-2xl font-semibold text-purple-700 mb-3">
            About Computer Engineering
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Computer Engineering integrates hardware and software principles,
            bridging computer science and electrical engineering. At MAPOLY, we
            emphasize areas like embedded systems, AI, IoT, digital electronics,
            and networking — ensuring graduates thrive in the modern tech
            landscape.
          </p>
          <img
            src="https://images.unsplash.com/photo-1581092334651-ddf4f8d45f92"
            alt="Computer Hardware"
            className="mt-4 rounded-xl w-full h-48 object-cover"
          />
        </div>

        {/* Vision & Mission */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition md:col-span-2">
          <h2 className="text-2xl font-semibold text-purple-700 mb-3">
            Vision & Mission
          </h2>
          <p className="text-gray-600 leading-relaxed mb-2">
            <span className="font-medium">Vision:</span> To become a leading hub
            for computer engineering education and innovation in Nigeria,
            producing graduates who significantly contribute to technology and
            national development.
          </p>
          <p className="text-gray-600 leading-relaxed">
            <span className="font-medium">Mission:</span> To provide quality
            teaching, hands-on learning experiences, and cutting-edge research
            that shape students into professionals ready to solve real-world
            engineering problems.
          </p>
        </div>

        {/* Core Values */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition md:col-span-2">
          <h2 className="text-2xl font-semibold text-purple-700 mb-3">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Excellence in Teaching & Learning",
              "Innovation & Creativity",
              "Integrity & Professionalism",
              "Collaboration & Teamwork",
              "Commitment to Society",
              "Leadership in Technology",
            ].map((value, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg text-center text-gray-700 hover:bg-purple-50 transition"
              >
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

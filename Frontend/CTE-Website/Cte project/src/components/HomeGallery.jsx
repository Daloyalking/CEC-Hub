import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { DeptContext } from '../context/DeptContext';

const HomeGallery = () => {
    const {gallery}=useContext(DeptContext)
    console.log(gallery)

    const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    setCurrent((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-10">
      {/* Carousel container */}
      <div className="overflow-hidden relative rounded-lg shadow-lg">
        {/* Image */}
        <img
          src={gallery[current]?.photos[0].url}
          alt={gallery[current]?.description}
          className="w-full h-80 object-cover transition-all duration-500"
        />

        {/* Overlay text */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
          <h2 className="text-lg font-bold">{gallery[current]?.title}</h2>
          <p className="text-sm line-clamp-2">{gallery[current]?.description}</p>
        </div>

        {/* Controls */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/70 text-black px-3 py-1 rounded-full hover:bg-white"
        >
          ◀
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/70 text-black px-3 py-1 rounded-full hover:bg-white"
        >
          ▶
        </button>
      </div>

      {/* See More Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate("/gallery")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-md transition"
        >
          See Full Gallery
        </button>
      </div>
    </div>
  )
}

export default HomeGallery
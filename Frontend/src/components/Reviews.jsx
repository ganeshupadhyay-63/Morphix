import React from 'react';

const reviewsData = [
  {
    name: 'Donald Jackman',
    role: 'Content Creator',
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
    text: "I've been using Imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.",
    rating: 5,
  },
  {
    name: 'Richard Nelson',
    role: 'Instagram Influencer',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    text: "I've been using Imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.",
    rating: 4,
  },
  {
    name: 'James Washington',
    role: 'Marketing Manager',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop',
    text: "I've been using Imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.",
    rating: 4,
  },
];

const StarRating = ({ count = 5 }) => (
  <div className="flex gap-1">
    {Array.from({ length: count }).map((_, i) => (
      <svg
        key={i}
        width="20"
        height="20"
        viewBox="0 0 22 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z"
          fill="#FF532E"
        />
      </svg>
    ))}
  </div>
);

const ReviewCard = ({ name, role, image, text, rating }) => (
  <div className="w-80 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center text-center relative">
    <img
      className="h-24 w-24 rounded-full border-4 border-white -mt-12 mb-4 object-cover"
      src={image}
      alt={name}
    />
    <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
    <p className="text-gray-500 text-sm mb-4">{role}</p>
    <p className="text-gray-600 text-sm">{text}</p>
    <div className="mt-4">
      <StarRating count={rating} />
    </div>
  </div>
);

const Reviews = () => {
  return (
    <div className=" mb-15 py-20 px-4 sm:px-12 lg:px-24 bg-[url(/bg.png)] bg-cover bg-no-repeat min-h-screen">
      {/* Title */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Loved by Creators</h2>
        <p className="text-gray-700 mt-2 text-lg font-semibold">
          See why creators around the world trust Imagify for their social media and content creation needs.
        </p>
      </div>

      {/* Reviews Grid */}
      <div className="flex flex-wrap justify-center gap-8">
        {reviewsData.map((review, idx) => (
          <ReviewCard key={idx} {...review} />
        ))}
      </div>
    </div>
  );
};

export default Reviews;

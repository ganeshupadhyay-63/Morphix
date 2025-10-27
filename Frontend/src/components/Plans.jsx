import React from 'react';
import { PricingTable } from '@clerk/clerk-react';

const Plans = () => {
  return (
    <div className="mt-15 mb-15 flex flex-col items-center py-20 px-4 bg-gradient-to-b from-indigo-50 to-white min-h-[80vh] relative bg-[url(/bg.png)] bg-cover bg-no-repeat min-h-screen">
      
      {/* Optional Background Image (if needed) */}
      <div className="absolute inset-0 bg-[url(/bg.png)] bg-cover bg-no-repeat opacity-20 -z-10"></div>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-3xl font-semibold mb-4">
          Choose Your Plan
        </h2>
        <p className="text-gray-800 text-lg md:text-xl max-w-lg mx-auto font-semibold">
          Start free and scale up as you grow. Find the perfect plan for your content creation needs.
        </p>
      </div>

      {/* Pricing Table */}
      <div className="mt-16 w-full max-w-4xl bg-white shadow-lg rounded-2xl p-8 md:p-12">
        <PricingTable />
      </div>

      {/* Optional Footer Note */}
      <p className="mt-8 text-center text-gray-500 text-sm">
        No credit card required. Cancel anytime.
      </p>
    </div>
  );
};

export default Plans;

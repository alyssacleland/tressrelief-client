'use client';

import React, { useEffect, useState } from 'react';
// import { useAuth } from '../utils/context/authContext';
import { getCategories } from '../api/categoriesData';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  // const { user } = useAuth();

  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 sm:py-16">
          <h2 className="text-2xl font-bold text-gray-900">Collections</h2>

          {/* 1 → 2 → 3 → 4 columns */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="group rounded-xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-md transition">
                <div className="overflow-hidden rounded-t-xl">
                  <img alt={category.name} src={category.image_url} className="h- w-full object-cover group-hover:scale-[1.02] transition" />
                </div>

                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-900">{category.name}</h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{category.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

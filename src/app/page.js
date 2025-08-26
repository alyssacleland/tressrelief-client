'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { useAuth } from '../utils/context/authContext';
import { getCategories } from '../api/categoriesData';
import { isAdmin } from '../utils/authorization';

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 sm:py-16">
          <h2 className="text-2xl font-bold text-gray-900">Services</h2>
          {isAdmin(user) && (
            <Button onClick={() => router.push('/service/new')} variant="primary">
              Add a service
            </Button>
          )}

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="
                  group flex flex-col rounded-xl bg-white 
                  ring-1 ring-gray-200
                  transition
                  !no-underline [&_*]:!no-underline
                  !text-gray-900 visited:!text-gray-900
                  cursor-pointer

                  hover:!shadow-[0_0_20px_rgba(236,72,153,0.6)]  /* pink glow */
                  hover:!ring-2 hover:!ring-pink-400             /* pink outline */
                "
              >
                <div className="overflow-hidden rounded-t-xl">
                  <img alt={category.name} src={category.image_url} className="h-90 w-full object-cover group-hover:scale-[1.02] transition" />
                </div>

                <div className="p-4">
                  <p className="text-base font-semibold">{category.name}</p>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

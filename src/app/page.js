'use client';

import React from 'react';
import { useAuth } from '../utils/context/authContext';

export default function CategoriesPage() {
  const { user } = useAuth();
  console.log('user: ', user);
  return (
    <div>
      wassup this is categories page Admin can add a new or edit/delete existing loop thru existing categories and display on category card component. click on it should take you to services pg for that category
      <div>!your role is: {user?.role}</div>
      <div className="p-4 rounded-xl shadow  bg-yellow-200 text-slate-700">Tailwind is working 🎉</div>
    </div>
  );
}

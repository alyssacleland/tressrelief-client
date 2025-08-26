'use client';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { getServicesByCategory } from '../../../api/servicesData';
import { getCategoryById } from '../../../api/categoriesData';
import { isAdmin } from '../../../utils/authorization';
import { useAuth } from '../../../utils/context/authContext';

export default function CategoryDetailsPage({ params }) {
  const { id } = params;
  const [category, setCategory] = useState(null);
  const [services, setServices] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    getCategoryById(id).then(setCategory);
  }, [id]);
  console.log(category);

  useEffect(() => {
    getServicesByCategory(id).then(setServices);
  }, [id]);

  return (
    // <div>
    //   {services.map((service) => (
    //     <div key={service.id}>{service.name}</div>
    //   ))}
    // </div>
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">{category?.name || 'Loading...'}</h2>
        {isAdmin(user) && (
          <Button onClick={() => router.push('/service/new')} variant="primary">
            Add a service
          </Button>
        )}

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {services.map((service) => (
            <div key={service.id} className="group relative">
              <img alt={service.imageAlt} src={service.image_url} className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80" />
              <div className="mt-4 flex justify-between">
                <div>
                  <h6 className="text-sm text-gray-700">
                    <a href={`/service/${service.id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {service.name}
                    </a>
                  </h6>
                  <p className="mt-1 text-sm text-gray-500">{service.description}</p>
                </div>
                <p className="text-sm font-medium text-gray-600">${service.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
CategoryDetailsPage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

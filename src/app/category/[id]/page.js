'use client';

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable import/no-extraneous-dependencies */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, OverlayTrigger } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import Tooltip from 'react-bootstrap/Tooltip';
import { getServicesByCategory, deleteService } from '../../../api/servicesData';
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

  useEffect(() => {
    getServicesByCategory(id).then(setServices);
  }, [id]);

  const handleDelete = (serviceId, serviceName) => {
    if (!window.confirm(`Delete ${serviceName}?`)) return;
    deleteService(serviceId)
      .then(() => getServicesByCategory(id))
      .then(setServices);
  };

  return (
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
                      <span aria-hidden="true" className="absolute inset-0 z-0" />
                      {service.name}
                    </a>
                  </h6>

                  <p className="mt-1 text-sm text-gray-500">{service.description}</p>

                  {isAdmin(user) && (
                    <div className="relative z-20 mt-2 flex items-center gap-3">
                      {/* EDIT */}
                      <OverlayTrigger placement="bottom" overlay={<Tooltip id={`tooltip-edit-${service.id}`}>Edit Service</Tooltip>}>
                        <span
                          role="button"
                          tabIndex={0}
                          className="inline-flex items-center p-1 rounded hover:bg-pink-100 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation(); // prevents the big overlay from firing
                            router.push(`/service/edit/${service.id}`);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              e.stopPropagation();
                              router.push(`/service/edit/${service.id}`);
                            }
                          }}
                        >
                          <FontAwesomeIcon style={{ marginRight: 10 }} icon={faPen} />
                        </span>
                      </OverlayTrigger>

                      {/* DELETE */}
                      <OverlayTrigger placement="bottom" overlay={<Tooltip id={`tooltip-del-${service.id}`}>Delete Service</Tooltip>}>
                        <span
                          role="button"
                          tabIndex={0}
                          className="inline-flex items-center p-1 rounded hover:bg-pink-100 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // TODO: call delete handler here
                            handleDelete(service.id, service.name);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </span>
                      </OverlayTrigger>
                    </div>
                  )}
                </div>

                <p className="relative z-20 text-sm font-medium text-gray-600">${service.price}</p>
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

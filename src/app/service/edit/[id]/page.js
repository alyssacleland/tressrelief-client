'use client';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ServiceForm from '../../../../components/forms/ServiceForm';
import { getServiceById } from '../../../../api/servicesData';

export default function EditServicePage({ params }) {
  const { id } = params;
  const [editService, setEditService] = useState();

  useEffect(() => {
    getServiceById(id).then(setEditService);
  });

  return <ServiceForm serviceObj={editService} />;
}

EditServicePage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

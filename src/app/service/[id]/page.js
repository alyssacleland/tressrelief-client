'use client';

// stretch goal but service details page or maybe we will call it ServiceSchedulingPage (we route here from service card "book" btn on the category details page. will show details of the service and the stylists that offer it (drop down menu stretch). and it will show the time slots of available appointmenet, client can click btn to "select time" on each wihch should route to login and then to booking form
import React from 'react';
import PropTypes from 'prop-types';

export default function ServiceSchedulingpage({ params }) {
  const { id } = params;

  return (
    <div>
      <h1>Service Scheduling Page</h1>
      <p>Service ID: {id}</p>
    </div>
  );
}
ServiceSchedulingpage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

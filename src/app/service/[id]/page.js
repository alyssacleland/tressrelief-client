/* eslint-disable no-nested-ternary */

'use client';

/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-extraneous-dependencies */

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getServiceById, getStylistsByService } from '../../../api/servicesData';
import getAvailability from '../../../api/appointmentData';
import SlotButton from '../../../components/SlotButton';

export default function ServiceSchedulingpage({ params }) {
  const { id } = params;
  const [serviceDetails, setServiceDetails] = useState(null);

  const [selectedStylist, setSelectedStylist] = useState(null);
  const [serviceStylists, setServiceStylists] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // initial state is today's date (stripped of time)
  const [availability, setAvailability] = useState([]);

  // Format incoming UTC time to Central time
  const formatTime = (utc) =>
    new Date(utc).toLocaleTimeString('en-US', {
      // en-US: am/pm, not 24 hour
      timeZone: 'America/Chicago', // forces to central time
      hour: 'numeric',
      minute: '2-digit', // e.g., 9:15 AM
    });

  // fetch availability
  useEffect(() => {
    getAvailability(id, date, selectedStylist?.id).then((data) => {
      setAvailability(data);
    });
  }, [id, date, selectedStylist]);

  // fetch service details
  useEffect(() => {
    getServiceById(id).then((data) => {
      setServiceDetails(data);
    });
  }, [id]);

  // fetch stylists for the service
  useEffect(() => {
    getStylistsByService(id).then((data) => {
      setServiceStylists(data);
    });
  }, [id]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* 2-col layout */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* LEFT: Details */}
          <div className="lg:col-span-6">
            <div className="space-y-6">
              <div>
                <h1 className="!text-3xl sm:!text-4xl !font-bold !tracking-tight !text-gray-900">{serviceDetails?.name}</h1>
                <p className="!mt-2 !text-pink-600 !font-semibold">${serviceDetails?.price}</p>
              </div>

              <div className="prose !prose-p:mt-0 !text-gray-600">
                <p>{serviceDetails?.description}</p>
              </div>

              {/* Image */}
              <div className="rounded-2xl ring-1 ring-gray-200/70 shadow-sm overflow-hidden">
                <div className="aspect-[4/3] bg-gray-100">
                  <img alt={serviceDetails?.name} src={serviceDetails?.image_url} className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Scheduling */}
          <aside className="mt-10 lg:mt-0 lg:col-span-6 lg:pl-8">
            <div className="sticky top-24 space-y-6">
              {/* instruction text */}
              <p className="text-sm font-medium text-gray-700">Select a date and stylist:</p>

              <div className="flex gap-4 items-center">
                {/* Date Picker */}
                <div className="flex-1">
                  <input
                    type="date"
                    // default is today
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm bg-white shadow-sm"
                  />
                </div>

                {/* Select  stylist dropdown */}
                <Menu as="div" className="relative flex-1">
                  <MenuButton className="w-full inline-flex items-center justify-between rounded-lg border px-3 py-2 text-sm font-medium text-gray-900 bg-white hover:bg-gray-50 shadow-sm">
                    {selectedStylist?.display_name || 'All Stylists'}
                    <ChevronDownIcon aria-hidden="true" className="size-4 text-gray-400" />
                  </MenuButton>

                  <MenuItems transition className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-white ring-1 ring-black/5 shadow-lg outline-none data-closed:scale-95 data-closed:opacity-0 transition data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
                    <div className="py-1">
                      {/* Option to reset to all stylists (set stylist back to null) */}
                      <MenuItem>
                        <button type="button" onClick={() => setSelectedStylist(null)} className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100">
                          All Stylists
                        </button>
                      </MenuItem>

                      {/* Each Stylist that offers the service */}
                      {serviceStylists.map((s) => (
                        <MenuItem key={s.id}>
                          <button type="button" onClick={() => setSelectedStylist(s)} className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-gray-100">
                            {s.display_name}
                          </button>
                        </MenuItem>
                      ))}
                    </div>
                  </MenuItems>
                </Menu>
              </div>

              {/* Availability */}
              <div className="rounded-2xl bg-gray-50 ring-1 ring-gray-200 shadow-sm p-4 sm:p-6 h-[32rem] flex flex-col">
                {/* Note about time zone */}
                <p className="text-xs text-gray-500 mb-2">Note: All times are shown in Central Time (CT).</p>

                <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">{selectedStylist?.display_name || 'All Stylists'} - Available Times</h3>

                {/* every() is an array method, will return true only if the callback returns true for every single element in the array */}
                {availability.length === 0 || availability.every((avail) => avail.slots.length === 0) ? (
                  <p className="text-sm text-gray-500"> No slots available. Please select another date. </p>
                ) : selectedStylist ? (
                  // ONE stylist chosen: render only their slots.
                  <div className="flex-grow overflow-y-auto pr-1">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {availability[0]?.slots.map((slot) => (
                        <SlotButton
                          key={slot[0]}
                          start={slot[0]} // slot[0] = start time
                          stylistName={selectedStylist.display_name}
                          serviceName={serviceDetails.name}
                          duration={serviceDetails.duration}
                          formatTime={formatTime}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  // ALL stylists selected: merge into single timeline
                  <div className="flex-grow overflow-y-auto pr-1">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {availability
                        // flatMap flattens one level so i get a single flat array instead of array in array
                        .flatMap((avail) =>
                          avail.slots.map((slot) => ({
                            start: slot[0], // slot[0] is the start time because the slots are like [starttime, endtime]... 0 index is start time
                            stylistName: avail.stylist_name,
                          })),
                        )
                        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
                        // make the start time into a data object . if you subtract 2 dates in js, you get the difference in milliseconds. so it will be either positive or negative.
                        // Below, if a.start is earlier, the result is negative and a goes before b
                        // (a, b) => a - b sorts numbers in ascending order.
                        .sort((a, b) => new Date(a.start) - new Date(b.start))
                        .map((slot) => (
                          <SlotButton key={slot.start + slot.stylistName} start={slot.start} stylistName={slot.stylistName} serviceName={serviceDetails.name} duration={serviceDetails.duration} formatTime={formatTime} />
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

ServiceSchedulingpage.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

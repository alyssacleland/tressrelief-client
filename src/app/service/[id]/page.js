'use client';

/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-extraneous-dependencies */

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getServiceById, getStylistsByService } from '../../../api/servicesData';

export default function ServiceSchedulingpage({ params }) {
  const { id } = params;
  const [serviceDetails, setServiceDetails] = useState(null);

  // placeholder (you’ll fill with “stylists who offer this service” later)
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [serviceStylists, setServiceStylists] = useState([]);

  // placeholder slots (replace with real availability later)
  const timeSlots = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'];

  useEffect(() => {
    getServiceById(id).then((data) => {
      setServiceDetails(data);
    });
  }, [id]);

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
          <div className="lg:col-span-7">
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

          {/* RIGHT: Stylist select + calendar */}
          <aside className="mt-10 lg:mt-0 lg:col-span-5 lg:pl-8">
            <div className="sticky top-24 space-y-6">
              {/* Select */}
              <div className="flex justify-end">
                <Menu as="div" className="relative inline-block text-left">
                  <MenuButton className="inline-flex items-center gap-x-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50 focus:outline-none">
                    {selectedStylist?.display_name || 'Choose stylist'}
                    <ChevronDownIcon aria-hidden="true" className="size-5 text-gray-400" />
                  </MenuButton>
                  <MenuItems transition className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-white ring-1 ring-black/5 shadow-lg outline-none data-closed:scale-95 data-closed:opacity-0 transition data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
                    <div className="py-1">
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

              {/* Calendar Card */}
              <div className="rounded-2xl ring-1 ring-gray-200 shadow-sm p-4 sm:p-6">
                {/* Placeholder calendar header (weekdays) */}
                <div className="mb-4">
                  <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500">
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div className="!text-pink-600">Sat</div>
                    <div className="!text-pink-600">Sun</div>
                  </div>
                  <div className="mt-2 grid grid-cols-7 gap-2 text-sm">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <button key={i} type="button" className="aspect-square rounded-lg border border-gray-200 hover:border-pink-400 hover:ring-1 hover:ring-pink-300" aria-label={`Day ${i + 1}`} />
                    ))}
                  </div>
                </div>

                {/* Available time slots */}
                <h3 className="text-sm font-semibold text-gray-900 mb-3">{selectedStylist?.display_name || 'All stylists'} — Available times</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {timeSlots.map((t) => (
                    <button key={t} type="button" className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:border-pink-400 hover:ring-1 hover:ring-pink-300 hover:shadow-sm transition">
                      {t}
                    </button>
                  ))}
                </div>

                {/* Book CTA (disabled until login in MVP flow) */}
                <div className="mt-4 flex justify-end">
                  <button type="button" className="rounded-xl bg-pink-500 px-4 py-2 text-white font-medium shadow hover:bg-pink-600 focus:outline-none">
                    Select time…
                  </button>
                </div>
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

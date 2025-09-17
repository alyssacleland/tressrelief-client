'use client';

// loop thru to display the stylists on stylist card components. should be more like sections than cards... not clickable within. they should just show the services each offers and their contact info.
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../utils/context/authContext';
import { getStylists } from '../../api/userData';
import { getServicesByStylist } from '../../api/servicesData';
import StylistOAuthTile from '../../components/StylistOAuthTile';

export default function PublicStylistsPage() {
  const { user } = useAuth();

  const [stylists, setStylists] = useState([]);
  const [servicesByStylist, setServicesByStylist] = useState({});

  useEffect(() => {
    getStylists().then(setStylists);
  }, []);

  useEffect(() => {
    getStylists().then((list) => {
      setStylists(list);
      list.forEach((stylist) => {
        getServicesByStylist(stylist.id).then((services) => {
          setServicesByStylist((prev) => ({ ...prev, [stylist.id]: services }));
        });
      });
    });
  }, []);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Stylists</h1>

        {/* Show tile only if logged-in user is a stylist */}
        {user?.role === 'stylist' && <StylistOAuthTile />}

        {stylists.map((stylist) => {
          const services = servicesByStylist[stylist.id];
          return (
            <div key={stylist.id} className="grid grid-cols-[64px_1fr] items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm mb-6">
              <img src={stylist.photo_url} alt={stylist.display_name} referrerPolicy="no-referrer" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} className="ring-1 ring-gray-200 shadow" />

              <div>
                <h2 className="text-lg font-semibold text-gray-900">{stylist.display_name}</h2>
                <p className="text-sm text-gray-700">Contact: {stylist.google_email}</p>

                <p className="mt-3 text-sm font-medium text-gray-900">Services Offered</p>
                {services ? (
                  <ul className="mt-1 flex flex-wrap gap-2 max-w-prose">
                    {services.map((service) => (
                      <li key={service.id}>
                        <Link
                          href={`/service/${service.id}`}
                          className="inline-block cursor-pointer rounded-full border border-gray-300 px-3 py-1 text-xs !text-gray-800 !no-underline
                          hover:border-pink-400 hover:bg-pink-50 hover:shadow-sm
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300
                          active:scale-95 transition"
                        >
                          {service.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">(loading…)</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useRouter } from 'next/navigation';
import { Dropdown, InputGroup } from 'react-bootstrap';
import { getServiceStylistOptions } from '../../api/userData';
import { getCategories } from '../../api/categoriesData';
import { createService, updateService } from '../../api/servicesData';

const initialState = {
  // id: '',
  name: '',
  description: '',
  duration: '',
  price: '',
  category: '',
  image_url: '',
  active: true,
  stylist_ids: [], // array for multi-select
};

// eslint-disable-next-line react/prop-types
export default function ServiceForm({ serviceObj = initialState }) {
  const [currentService, setCurrentService] = useState(initialState);
  const [stylistOptions, setStylistOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getCategories().then(setCategoryOptions);
  }, []);

  // if editing, seed state from serviceObj, otherwise start from initialState
  useEffect(() => {
    // EDIT
    if (serviceObj?.id) {
      setCurrentService(() => ({
        id: serviceObj.id,
        name: serviceObj.name,
        description: serviceObj.description,
        duration: serviceObj.duration,
        price: serviceObj.price,
        category: serviceObj.category,
        image_url: serviceObj.image_url,
        active: serviceObj.active,
        stylist_ids: [],
      }));

      // get all stylists (including joined field, true or false depending on if they offer this service)
      getServiceStylistOptions(serviceObj.id).then((options) => {
        const allStylists = options;
        // update stylist options in state
        setStylistOptions(allStylists);
        // isolate the stylists with joined=True so they can be added to stylist_ids on the service, and get their ids because stylist_ids expects an array of numbers, not objects
        const preselected = allStylists.filter((stylist) => stylist.joined === true).map((stylist) => Number(stylist.id));
        setCurrentService((prevState) => ({ ...prevState, stylist_ids: preselected }));
      });
      // CREATE
    } else {
      // load initial state and load stylistOptions state with joined=false
      // API Note: getServiceStylistOptions without passing a service id: returns all stylists with joined property = false for each. I should really learn how to do the documentation hmm
      setCurrentService(initialState);
      getServiceStylistOptions().then(setStylistOptions);
    }
  }, [serviceObj?.id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'price' || name === 'duration') {
      const digits = String(value).replace(/[^\d]/g, ''); // strip non-digits
      setCurrentService((prev) => ({ ...prev, [name]: digits }));
      return;
    }
    setCurrentService((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStylistToggle = (event) => {
    const id = Number(event.target.value);
    const next = [...currentService.stylist_ids];
    const index = next.indexOf(id);
    if (index !== -1) {
      next.splice(index, 1);
    } else {
      next.push(id);
    }
    setCurrentService((prev) => ({ ...prev, stylist_ids: next }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      id: currentService.id,
      name: currentService.name,
      description: currentService.description,
      duration: Number(currentService.duration),
      price: Number(currentService.price),
      category: Number(currentService.category),
      image_url: currentService.image_url,
      active: Boolean(currentService.active),
      stylist_ids: currentService.stylist_ids.map(Number),
    };

    if (serviceObj?.id) {
      updateService(payload).then(() => router.push('/'));
    } else {
      createService(payload).then(() => router.push('/'));
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: 640, margin: '0 auto' }}>
      <div>
        <h1>{serviceObj?.id ? 'Edit ' : 'Add New '} Service</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Service Name</Form.Label>
            <Form.Control required name="name" value={currentService.name} onChange={handleChange} placeholder="Enter Service Name" />
            {/* <Form.Text className="text-muted">
            Well never share your email with anyone else.
          </Form.Text> */}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select name="category" required value={currentService.category} onChange={handleChange}>
              <option value="">Select a category</option>
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stylists</Form.Label>

            <Dropdown autoClose="outside">
              <Dropdown.Toggle type="button" variant="secondary">
                {currentService.stylist_ids.length ? `Selected (${currentService.stylist_ids.length})` : 'Select stylists'}
              </Dropdown.Toggle>

              <Dropdown.Menu style={{ maxHeight: 260, overflowY: 'auto' }}>
                <div onClick={(e) => e.stopPropagation()}>
                  {stylistOptions.map((stylist) => (
                    <Form.Check key={stylist.id} type="checkbox" className="mb-2" label={stylist.display_name || stylist.google_email} value={stylist.id} checked={currentService.stylist_ids.includes(Number(stylist.id))} onChange={handleStylistToggle} />
                  ))}
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control required value={currentService.description} onChange={handleChange} name="description" placeholder="Enter Description" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Duration (minutes)</Form.Label>
            <Form.Control required value={currentService.duration} onChange={handleChange} type="number" placeholder="Enter Duration in Minutes" name="duration" step="1" min="1" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control required value={currentService.price} onChange={handleChange} type="number" placeholder="Enter Price" name="price" min="0" step="1" />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control required value={currentService.image_url} onChange={handleChange} placeholder="Enter Image URL" name="image_url" />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}

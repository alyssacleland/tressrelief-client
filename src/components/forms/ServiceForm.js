'use client';

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useRouter } from 'next/navigation';
import { InputGroup } from 'react-bootstrap';
import { getServiceStylistOptions } from '../../api/userData';
import { getCategories } from '../../api/categoriesData';

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
    // console.log(event)
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

  // TODO:
  const handleStylistToggle = (event) => {};

  // TODO:
  const handleSubmit = (event) => {};

  return (
    <div>
      <h1>Add New Service</h1>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Service Name</Form.Label>
          <Form.Control required name="name" value={currentService.name} onChange={handleChange} placeholder="Enter Service Name" />
          {/* <Form.Text className="text-muted">
          Well never share your email with anyone else.
        </Form.Text> */}
        </Form.Group>

        <Form.Group>
          <Form.Label>Category</Form.Label>
          <Form.Select type="category" required value={currentService.category} onChange={handleChange} placeholder="Select Category" name="category">
            <option>Default select</option>
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Stylists</Form.Label>
          <Form.Select required value="" onChange="" placeholder="Stylists (Check all that apply)" name="stylists">
            <option>Default select</option>
          </Form.Select>
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
  );
}

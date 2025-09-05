'use client';

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { getStylists } from '../../api/userData';
import { getCategories } from '../../api/categoriesData';

const initialState = {
  name: '',
  description: '',
  duration: '',
  price: '',
  category: '',
  stylistIds: [], // array for multi-select
};

export default function ServiceForm({ serviceObj = {} }) {
  const [currentService, setCurrentService] = useState(initialState);
  const [stylists, setStylists] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
    getStylists().then(setStylists);
  }, []);

  // TODO: Prefill basic fields for edit

  // TODO: Prefill stylistIds for edit

  return (
    <div>
      <h1>Add New Service</h1>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Service Name</Form.Label>
          <Form.Control required name="serviceName" value="" onChange="" placeholder="Enter Service Name" />
          {/* <Form.Text className="text-muted">
          Well never share your email with anyone else.
        </Form.Text> */}
        </Form.Group>

        <Form.Group>
          <Form.Label>Category</Form.Label>
          <Form.Select type="category" required value="" onChange="" placeholder="Select Category" name="category">
            <option>Default select</option>
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Stylists</Form.Label>
          <Form.Select required value="" onChange="" placeholder="Enter Service Name" name="stylists">
            <option>Default select</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control required value="" onChange="" name="description" placeholder="Enter Description" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Duration (minutes)</Form.Label>
          <Form.Control required value="" onChange="" type="number" placeholder="Enter Duration in Minutes" name="duration" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control required value="" onChange="" type="number" placeholder="Enter Price" name="price" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image URL</Form.Label>
          <Form.Control required value="" onChange="" type="link" placeholder="Enter Image URL" name="imageurl" />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

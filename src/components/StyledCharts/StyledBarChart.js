import React from 'react';
import { Bar } from 'react-chartjs-2';

export const defaultOptions = {
  reponsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
};

export default function StyledBarChart({ data, options }) {
  return <Bar options={{ ...defaultOptions, ...(options || {}) }} data={data} />;
}

import React from 'react';
import { useParams } from 'react-router-dom';

export const User = () => {
  const { id = '' } = useParams();

  return <div>{`User ID: ${id}`}</div>;
};

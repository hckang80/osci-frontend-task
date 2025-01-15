import React from 'react';
import { useParams } from 'react-router-dom';

export const TodosPage = () => {
  const { id = '' } = useParams();

  return <span>{id}</span>;
};

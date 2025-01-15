import { fetcher } from 'lib/utils';
import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

export const TodosPage = () => {
  const { id = '' } = useParams();

  const { data: todos } = useQuery('todos', () => fetcher(`/todos/user/${id}`), {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
    }
  });

  return <pre>{JSON.stringify(todos, null, 2)}</pre>;
};

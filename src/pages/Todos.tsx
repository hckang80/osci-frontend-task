import { Todo } from 'lib/types';
import { fetcher } from 'lib/utils';
import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

export const TodosPage = () => {
  const { id = '' } = useParams();

  const {
    data: todos,
    isError,
    error
  } = useQuery('todos', () => fetcher<Todo[]>(`/todos/user/${id}`), {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
    }
  });

  if (isError || !todos) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  return <pre>{JSON.stringify(todos, null, 2)}</pre>;
};

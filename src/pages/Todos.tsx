import { Todo } from 'lib/types';
import { fetcher } from 'lib/utils';
import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import Spinner from '@atlaskit/spinner';

export const TodosPage = () => {
  const { id = '' } = useParams();

  const {
    data: todos = [],
    isLoading,
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

  if (isError) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  if (isLoading) return <Spinner />;

  return <pre>{JSON.stringify(todos, null, 2)}</pre>;
};

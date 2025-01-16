import { Todo } from 'lib/types';
import { fetcher } from 'lib/utils';
import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { Stack } from '@atlaskit/primitives';
import DynamicTable from '@atlaskit/dynamic-table';
import { t } from 'i18next';
import TaskIcon from '@atlaskit/icon/glyph/task';
import Heading from '@atlaskit/heading';

export const TodosPage = () => {
  const { id = '' } = useParams();

  const {
    data: todos = [],
    isLoading,
    isError,
    error
  } = useQuery('todos', () => fetcher<Todo[]>(`/todos/user/${id}`));

  if (isError) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  const head = {
    cells: [
      {
        key: 'title',
        content: t('label.title')
      },
      {
        key: 'done',
        content: ''
      }
    ]
  };

  const rows = todos.map((todo) => {
    return {
      key: todo.id + '',
      cells: [
        {
          key: 'title',
          content: todo.completed ? <s>{todo.title}</s> : todo.title
        },
        {
          key: 'done',
          content: todo.completed ? <TaskIcon label="completed" /> : ''
        }
      ]
    };
  });

  return (
    <Stack space="space.300">
      <Heading size="large">{t('label.todo')}</Heading>

      <DynamicTable head={head} rows={rows} isFixedSize isLoading={isLoading} />
    </Stack>
  );
};

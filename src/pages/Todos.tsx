import { Todo } from 'lib/types';
import { fetcher } from 'lib/utils';
import React from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { Stack, Flex } from '@atlaskit/primitives';
import { t } from 'i18next';
import TaskIcon from '@atlaskit/icon/glyph/task';
import ImageBorderIcon from '@atlaskit/icon/glyph/image-border';
import Heading from '@atlaskit/heading';
import Spinner from '@atlaskit/spinner';

export const TodosPage = () => {
  const { id = '' } = useParams();

  const {
    data: todos = [],
    isLoading,
    isError,
    error
  } = useQuery('todos', () => fetcher<Todo[]>(`/todos/user/${id}`));

  if (isError) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  return (
    <Stack space="space.300">
      <Heading size="large">{t('label.todo')}</Heading>

      <Heading size="small">{`User ID: ${id}`} </Heading>

      {isLoading ? (
        <Spinner />
      ) : (
        <Stack space="space.100">
          {todos.map(({ id, title, completed }) => (
            <Flex key={id} alignItems="center" gap="space.050">
              {completed ? <TaskIcon label="completed" /> : <ImageBorderIcon label="incomplete" />}
              {title}
            </Flex>
          ))}
        </Stack>
      )}
    </Stack>
  );
};

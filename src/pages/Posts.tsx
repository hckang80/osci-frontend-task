/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment, useMemo, useState } from 'react';

import { jsx } from '@emotion/react';

import Form, { Field } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import DynamicTable from '@atlaskit/dynamic-table';
import SearchIcon from '@atlaskit/icon/core/migration/search';
import { useQuery } from 'react-query';
import { fetcher } from 'lib/utils';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Post {
  userId: number;
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export const Posts = () => {
  const { t } = useTranslation();

  const head = {
    cells: [
      {
        key: 'id',
        content: 'No.',
        width: 4
      },
      {
        key: 'title',
        content: t('label.title')
      }
    ]
  };

  const [posts, setUsers] = useState<Post[]>([]);

  const fetchUserList = () => {
    return fetcher<Post[]>('/posts');
  };

  const { isLoading, isError, data, error } = useQuery<Post[]>('posts', fetchUserList, {
    refetchOnWindowFocus: false,
    retry: 0,
    onSuccess: (data) => {
      setUsers(data);
    },
    onError: (error) => {
      if (!(error instanceof Error)) return;
      console.log(error.message);
    }
  });

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const currentPage = Number(queryParams.get('offset')) || 1;

  const navigate = useNavigate();

  const changePage = (offset: number) => {
    const timeout = setTimeout(() => {
      navigate(`?offset=${offset}`);
      clearTimeout(timeout);
    }, 0);
  };

  const [fieldValue, setFieldValue] = useState('');
  const [searchedValue, setSearchedValue] = useState('');

  const autocompleteList = useMemo(() => [...new Set(posts.map(({ title }) => title))], [posts]);

  const filteredAutocompleteList = useMemo(
    () =>
      autocompleteList.filter((item) =>
        item.toLocaleLowerCase().includes(fieldValue.toLocaleLowerCase())
      ),
    [autocompleteList, fieldValue]
  );

  const rows = useMemo(
    () =>
      posts
        .filter((post) =>
          post.title.toLocaleLowerCase().includes(searchedValue.toLocaleLowerCase())
        )
        .map((post) => ({
          key: post.id + '',
          isHighlighted: false,
          cells: [
            {
              key: 'id',
              content: post.id
            },
            {
              key: 'title',
              content: <Link to={`/posts/${post.id}`}>{post.title}</Link>
            }
          ]
        })),
    [posts, searchedValue]
  );

  if ((isError || !data) && error instanceof Error) {
    return <span>Error: {error.message}</span>;
  }

  const validate = (value = '') => {
    setFieldValue(value);
  };

  const handleSubmit = (formState: { userName: string }) => {
    setSearchedValue(formState.userName);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const selectedAutocompleteList = e.key === 'Unidentified';
    selectedAutocompleteList && handleSubmit({ userName: e.currentTarget.value });
  };

  return (
    <Fragment>
      <Form onSubmit={handleSubmit}>
        {({ formProps }) => (
          <form {...formProps} name="validation-example">
            <Field name="userName" validate={validate} defaultValue="">
              {({ fieldProps }) => (
                <Fragment>
                  <Textfield
                    list="user-list"
                    placeholder="Search"
                    {...fieldProps}
                    elemBeforeInput={<SearchIcon label="search" />}
                    onKeyUp={handleKeyUp}
                  />
                  {fieldValue && (
                    <datalist id="user-list">
                      {filteredAutocompleteList.map((item) => (
                        <option key={item} value={item} />
                      ))}
                    </datalist>
                  )}
                </Fragment>
              )}
            </Field>
          </form>
        )}
      </Form>

      <DynamicTable
        head={head}
        rows={rows}
        rowsPerPage={10}
        defaultPage={currentPage}
        isFixedSize
        isLoading={isLoading}
        onSetPage={(page) => changePage(page)}
      />
    </Fragment>
  );
};

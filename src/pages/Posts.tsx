/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment, useMemo, useState } from 'react';

import { jsx } from '@emotion/react';

import Form, { Field, Label } from '@atlaskit/form';
import { DatePicker } from '@atlaskit/datetime-picker';
import { parseISO } from 'date-fns';
import Textfield from '@atlaskit/textfield';
import DynamicTable from '@atlaskit/dynamic-table';
import SearchIcon from '@atlaskit/icon/core/migration/search';
import { useQuery } from 'react-query';
import { fetcher, toReadableDate } from 'lib/utils';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import { Post } from 'lib/types';

const ROWS_PER_PAGE = 10;

export const PostsPage = () => {
  const head = {
    cells: [
      {
        key: 'id',
        content: t('label.number'),
        width: 4
      },
      {
        key: 'title',
        content: t('label.title')
      },
      {
        key: 'createdAt',
        content: t('label.posted')
      }
    ]
  };

  const {
    isLoading,
    isError,
    data: posts = [],
    error
  } = useQuery<Post[]>('posts', () => fetcher<Post[]>('/posts'), {
    onSuccess: (data) => {
      console.log('success', data);
    },
    onError: (error) => {
      console.error(error);
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
            },
            {
              key: 'createdAt',
              content: toReadableDate(post.createdAt)
            }
          ]
        })),
    [posts, searchedValue]
  );

  if (isError && error instanceof Error) {
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
      <Label id="custom" htmlFor="datepicker-format">
        Custom Date Format
      </Label>
      <DatePicker
        dateFormat="YYYY-MM-DD"
        placeholder="2021-06-10"
        parseInputValue={(date: string) => parseISO(date)}
        id="datepicker-format"
        clearControlLabel="Clear Custom Date Format"
        shouldShowCalendarButton
        inputLabelId="custom"
        openCalendarLabel="open calendar"
      />

      <Form onSubmit={handleSubmit}>
        {({ formProps }) => (
          <form {...formProps} name="validation-example">
            <Field name="userName" validate={validate} defaultValue="">
              {({ fieldProps }) => (
                <Fragment>
                  <Textfield
                    list="user-list"
                    placeholder={t('paragraph.searchByTitle')}
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
        rowsPerPage={ROWS_PER_PAGE}
        defaultPage={currentPage}
        isFixedSize
        isLoading={isLoading}
        onSetPage={(page) => changePage(page)}
      />
    </Fragment>
  );
};

import React, { useMemo, useState } from 'react';
import { Flex, Stack } from '@atlaskit/primitives';
import Form, { Field } from '@atlaskit/form';
import { DatePicker } from '@atlaskit/datetime-picker';
import { parseISO } from 'date-fns';
import Textfield from '@atlaskit/textfield';
import DynamicTable from '@atlaskit/dynamic-table';
import SearchIcon from '@atlaskit/icon/glyph/search';
import EmptyState from '@atlaskit/empty-state';
import { useQuery } from 'react-query';
import { fetcher, toReadableDate } from 'lib/utils';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import { Post } from 'lib/types';
import Heading from '@atlaskit/heading';
import { useDebounce } from 'hooks/use-debounce';

const ROWS_PER_PAGE = 10;

export const PostsPage = () => {
  const {
    isLoading,
    isError,
    data: posts = [],
    error
  } = useQuery<Post[]>('posts', () => fetcher<Post[]>('/posts'));

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
  const searchedValue = useDebounce(fieldValue);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  const autocompleteList = useMemo(() => [...new Set(posts.map(({ title }) => title))], [posts]);

  const filteredAutocompleteList = useMemo(
    () =>
      autocompleteList.filter((item) =>
        item.toLocaleLowerCase().includes(fieldValue.toLocaleLowerCase())
      ),
    [autocompleteList, fieldValue]
  );

  const head = {
    cells: [
      {
        key: 'id',
        content: t('label.number'),
        width: 10
      },
      {
        key: 'title',
        content: t('label.title')
      },
      {
        key: 'createdAt',
        content: t('label.posted'),
        width: 25
      }
    ]
  };

  const rows = useMemo(
    () =>
      posts
        .filter((post) => {
          const { start: searchedStartDate, end: searchedEndDate } = dateRange;

          const validations = {
            title: post.title.toLocaleLowerCase().includes(searchedValue.toLocaleLowerCase()),
            startDate: !searchedStartDate || searchedStartDate <= post.createdAt,
            endDate: !searchedEndDate || searchedEndDate >= post.createdAt
          };

          return Object.values(validations).every(Boolean);
        })
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
    [posts, searchedValue, dateRange]
  );

  if (isError) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  const validate = (value = '') => {
    setFieldValue(value);
  };

  const handleSubmit = (formState: { userName: string }) => {
    console.log('handleSubmit', formState);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const selectedAutocompleteList = e.key === 'Unidentified';
    selectedAutocompleteList && handleSubmit({ userName: e.currentTarget.value });
  };

  return (
    <Stack space="space.300">
      <Heading size="large">{t('label.post')}</Heading>

      <Stack>
        <Flex gap="space.050" justifyContent="end">
          <DatePicker
            dateFormat="YYYY-MM-DD"
            placeholder="Start day"
            maxDate={dateRange.end}
            parseInputValue={(date: string) => parseISO(date)}
            clearControlLabel="Clear Custom Date Format"
            shouldShowCalendarButton
            openCalendarLabel="open calendar"
            onChange={(date) =>
              setDateRange((oldValues) => ({
                ...oldValues,
                start: date
              }))
            }
          />
          <DatePicker
            dateFormat="YYYY-MM-DD"
            placeholder="End day"
            minDate={dateRange.start}
            parseInputValue={(date: string) => parseISO(date)}
            clearControlLabel="Clear Custom Date Format"
            shouldShowCalendarButton
            openCalendarLabel="open calendar"
            onChange={(date) =>
              setDateRange((oldValues) => ({
                ...oldValues,
                end: date
              }))
            }
          />
        </Flex>

        <Flex gap="space.050" justifyContent="end">
          <Form onSubmit={handleSubmit}>
            {({ formProps }) => (
              <form {...formProps} name="validation-example">
                <Field name="userName" validate={validate} defaultValue="">
                  {({ fieldProps }) => (
                    <>
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
                    </>
                  )}
                </Field>
              </form>
            )}
          </Form>
        </Flex>
      </Stack>

      <Stack>
        <DynamicTable
          head={head}
          rows={rows}
          rowsPerPage={ROWS_PER_PAGE}
          defaultPage={currentPage}
          isFixedSize
          isLoading={isLoading}
          onSetPage={(page) => changePage(page)}
        />

        {!isLoading && !rows.length && <EmptyState header="No data" />}
      </Stack>
    </Stack>
  );
};

/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { FC, Fragment, ReactNode, useMemo, useState } from 'react';
import Avatar from '@atlaskit/avatar';
import { css, jsx } from '@emotion/react';
import { Box, xcss, Flex, Stack } from '@atlaskit/primitives';
import Heading from '@atlaskit/heading';
import Form, { Field } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import DynamicTable from '@atlaskit/dynamic-table';
import SearchIcon from '@atlaskit/icon/core/migration/search';
import { IconButton } from '@atlaskit/button/new';
import EditIcon from '@atlaskit/icon/glyph/edit';
import { useQuery } from 'react-query';
import { fetcher } from 'lib/utils';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User } from 'lib/types';
import { t } from 'i18next';

const nameWrapperStyles = css({
  display: 'flex',
  alignItems: 'center'
});

const NameWrapper: FC<{ children: ReactNode }> = ({ children }) => (
  <span css={nameWrapperStyles}>{children}</span>
);

const avatarWrapperStyles = xcss({
  marginInlineEnd: 'space.100'
});

const AvatarWrapper: FC<{ children: ReactNode }> = ({ children }) => (
  <Box xcss={avatarWrapperStyles}>{children}</Box>
);

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);

  const { isLoading, isError, data, error } = useQuery<User[]>(
    'users',
    () => fetcher<User[]>('/users'),
    {
      onSuccess: (data) => {
        setUsers(data);
      },
      onError: (error) => {
        if (!(error instanceof Error)) return;
        console.log(error.message);
      }
    }
  );

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

  const autocompleteList = useMemo(
    () => [...new Set([...users.map(({ name }) => name), ...users.map(({ email }) => email)])],
    [users]
  );

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
        key: 'name',
        content: t('label.name'),
        width: 25
      },
      {
        key: 'email',
        content: t('label.email')
      },
      {
        key: 'action',
        content: '',
        width: 10
      }
    ]
  };

  const rows = useMemo(
    () =>
      users
        .filter(
          (user) =>
            user.name.toLocaleLowerCase().includes(searchedValue.toLocaleLowerCase()) ||
            user.email.toLocaleLowerCase().includes(searchedValue.toLocaleLowerCase())
        )
        .map((user) => ({
          key: user.id + '',
          isHighlighted: false,
          cells: [
            {
              key: 'name',
              content: (
                <NameWrapper>
                  <AvatarWrapper>
                    <Avatar name={user.name} size="medium" />
                  </AvatarWrapper>
                  <Link to={`/todos/${user.id}`}>{user.name}</Link>
                </NameWrapper>
              )
            },
            {
              key: 'email',
              content: user.email
            },
            {
              key: 'action',
              content: (
                <IconButton
                  icon={EditIcon}
                  label="Edit"
                  onClick={() => navigate(`/users/${user.id}`)}
                />
              )
            }
          ]
        })),
    [users, searchedValue]
  );

  if (isError) return <pre>{JSON.stringify(error, null, 2)}</pre>;

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
    <Stack space="space.300">
      <Heading size="large">{t('label.user')}</Heading>

      <Stack>
        <Flex justifyContent="end">
          <Form onSubmit={handleSubmit}>
            {({ formProps }) => (
              <form {...formProps} name="validation-example">
                <Field name="userName" validate={validate} defaultValue="">
                  {({ fieldProps }) => (
                    <Fragment>
                      <Textfield
                        list="data-list"
                        placeholder={t('paragraph.searchByNameOrEmail')}
                        {...fieldProps}
                        elemBeforeInput={<SearchIcon label="search" />}
                        onKeyUp={handleKeyUp}
                      />
                      {fieldValue && (
                        <datalist id="data-list">
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
        </Flex>
      </Stack>

      <Stack>
        <DynamicTable
          head={head}
          rows={rows}
          rowsPerPage={5}
          defaultPage={currentPage}
          isFixedSize
          isLoading={isLoading}
          onSetPage={(page) => changePage(page)}
        />
      </Stack>
    </Stack>
  );
};

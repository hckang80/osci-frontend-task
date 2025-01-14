/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { FC, Fragment, ReactNode, useState } from 'react';
import Avatar from '@atlaskit/avatar';
import Link from '@atlaskit/link';

import { css, jsx } from '@emotion/react';
import { Box, xcss } from '@atlaskit/primitives';

import Form, { Field } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import DynamicTable from '@atlaskit/dynamic-table';
import SearchIcon from '@atlaskit/icon/core/migration/search';
import { useQuery } from 'react-query';
import { fetcher } from 'lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  email: string;
}

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

const head = {
  cells: [
    {
      key: 'name',
      content: 'Name',
      width: 25
    },
    {
      key: 'email',
      content: 'Email'
    }
  ]
};

export const Users = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUserList = () => {
    return fetcher<User[]>('/users');
  };

  const { isLoading, isError, data, error } = useQuery<User[]>('users', fetchUserList, {
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

  if ((isError || !data) && error instanceof Error) {
    return <span>Error: {error.message}</span>;
  }

  const rows = users
    .filter(
      (user) =>
        user.name.toLocaleLowerCase().includes(fieldValue.toLocaleLowerCase()) ||
        user.email.toLocaleLowerCase().includes(fieldValue.toLocaleLowerCase())
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
              <Link href="https://atlassian.design">{user.name}</Link>
            </NameWrapper>
          )
        },
        {
          key: 'email',
          content: user.email
        }
      ]
    }));

  const validate = (value = '') => {
    setFieldValue(value);
  };

  const handleSubmit = (formState: { userName: string }) => {
    console.log({ formState });
  };

  return (
    <Fragment>
      <Form onSubmit={handleSubmit}>
        {({ formProps }) => (
          <form {...formProps} name="validation-example">
            <Field name="userName" validate={validate} defaultValue="">
              {({ fieldProps, meta: { valid } }: any) => (
                <Textfield
                  placeholder="Search"
                  testId="formValidationTest"
                  {...fieldProps}
                  elemBeforeInput={<SearchIcon label="search" />}
                />
              )}
            </Field>
          </form>
        )}
      </Form>

      <DynamicTable
        caption="List of US Presidents"
        head={head}
        rows={rows}
        rowsPerPage={5}
        defaultPage={currentPage}
        isFixedSize
        isLoading={isLoading}
        defaultSortKey="term"
        defaultSortOrder="ASC"
        onSort={() => console.log('onSort')}
        onSetPage={(page) => changePage(page)}
      />
    </Fragment>
  );
};

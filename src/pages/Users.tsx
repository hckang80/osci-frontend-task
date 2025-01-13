/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { FC, ReactNode, useEffect, useState } from 'react';
import Avatar from '@atlaskit/avatar';
import Link from '@atlaskit/link';

import { css, jsx } from '@emotion/react';
import { Box, xcss } from '@atlaskit/primitives';

import DynamicTable from '@atlaskit/dynamic-table';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
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
      key: 'party',
      content: 'Party',
      shouldTruncate: true,
      width: 15
    },
    {
      key: 'term',
      content: 'Term',
      shouldTruncate: true
    }
  ]
};

export const Users = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/users`)
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  const rows = users.map((user) => ({
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
      },
      {
        key: 'phone',
        content: user.phone
      }
    ]
  }));

  return (
    <DynamicTable
      caption="List of US Presidents"
      head={head}
      rows={rows}
      rowsPerPage={5}
      defaultPage={1}
      isFixedSize
      defaultSortKey="term"
      defaultSortOrder="ASC"
      onSort={() => console.log('onSort')}
      onSetPage={() => console.log('onSetPage')}
    />
  );
};

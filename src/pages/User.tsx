import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { InlineEditableTextfield } from '@atlaskit/inline-edit';
import { fetcher } from 'lib/utils';
import { useQuery } from 'react-query';

interface User {
  id: number;
  name: string;
  email: string;
}

export const UserPage = () => {
  const { id = '' } = useParams();

  const [user, setUser] = useState<User | null>(null);

  const fetchUser = () => fetcher<User>(`/users/${id}`);

  const { isLoading, isError, data, error } = useQuery<User>('users', fetchUser, {
    refetchOnWindowFocus: false,
    retry: 0,
    onSuccess: (data) => {
      setUser(data);
    },
    onError: (error) => {
      if (!(error instanceof Error)) return;
      console.log(error.message);
    }
  });

  const placeholderLabel = 'Initial description value';
  const [editValue, setEditValue] = useState('Default description value');

  if ((isError || !data) && error instanceof Error) {
    return <span>Error: {error.message}</span>;
  }

  console.log({ user });

  const validate = (value: string) => {
    if (value.length <= 6) {
      return 'Please enter a description longer than 6 characters';
    }
    return undefined;
  };

  return (
    <>
      <div>{`User ID: ${id}`}</div>
      <InlineEditableTextfield
        defaultValue={editValue}
        label="Description"
        editButtonLabel={editValue || placeholderLabel}
        onConfirm={(value) => setEditValue(value)}
        placeholder={placeholderLabel}
        validate={validate}
      />
    </>
  );
};

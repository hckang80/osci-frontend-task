import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { InlineEditableTextfield } from '@atlaskit/inline-edit';
import Spinner from '@atlaskit/spinner';
import { fetcher } from 'lib/utils';
import { useQuery } from 'react-query';
import { t } from 'i18next';

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
      setEditValue(data.name);
    },
    onError: (error) => {
      if (!(error instanceof Error)) return;
      console.log(error.message);
    }
  });

  const placeholderLabel = 'Initial description value';
  const [editValue, setEditValue] = useState('');

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
      {!user ? (
        <Spinner />
      ) : (
        <>
          <div>{`User ID: ${id}`}</div>
          <InlineEditableTextfield
            defaultValue={editValue}
            label={t('label.name')}
            editButtonLabel={editValue || placeholderLabel}
            onConfirm={(value) => setEditValue(value)}
            placeholder={placeholderLabel}
            validate={validate}
          />
        </>
      )}
    </>
  );
};

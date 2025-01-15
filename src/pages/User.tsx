import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { InlineEditableTextfield } from '@atlaskit/inline-edit';
import Spinner from '@atlaskit/spinner';
import { fetcher } from 'lib/utils';
import { useQuery } from 'react-query';
import { t } from 'i18next';
import { User } from 'lib/types';

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

  const validate = (value: string) => {
    return !value.length ? 'Please enter your name' : undefined;
  };

  return (
    <>
      {!user ? (
        <Spinner />
      ) : (
        <>
          <InlineEditableTextfield
            defaultValue={editValue}
            label={t('label.name')}
            onConfirm={(value) => setEditValue(value)}
            placeholder={placeholderLabel}
            validate={validate}
          />
        </>
      )}
    </>
  );
};

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form, { ErrorMessage, Field, FormFooter, useFormState } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import Spinner from '@atlaskit/spinner';
import { fetcher } from 'lib/utils';
import { useMutation, useQuery } from 'react-query';
import { t } from 'i18next';
import { User } from 'lib/types';
import Heading from '@atlaskit/heading';
import { Stack } from '@atlaskit/primitives';
import toast from 'react-hot-toast';

type UserForm = Omit<User, 'id'>;

export const UserPage = ({ title }: { title: string }) => {
  const { id = '' } = useParams();

  const {
    isLoading,
    isError,
    data: user,
    error
  } = useQuery<User>('user', () => fetcher<User>(`/users/${id}`));

  const updateUser = (formState: UserForm) => {
    return fetcher<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formState)
    });
  };

  const updateUserMutation = useMutation(updateUser, {
    onSuccess: () => {
      toast('Update successful');
    }
  });

  const { isLoading: isUpdating } = updateUserMutation;

  const handleSubmit = (formState: UserForm) => {
    const errors = {
      email: !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formState.email)
        ? t('paragraph.validate.email')
        : undefined
    };

    const isInvalid = Object.values(errors).some((value) => value !== undefined);
    !isInvalid && updateUserMutation.mutate(formState);

    return errors;
  };

  const navigate = useNavigate();

  if (isError) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  return (
    <Stack space="space.300">
      <Heading size="large">{title}</Heading>

      {isLoading || !user ? (
        <Spinner />
      ) : (
        <Form onSubmit={handleSubmit}>
          {({ formProps }) => (
            <form {...formProps}>
              <Field name="name" label={t('label.name')} defaultValue={user.name} isRequired>
                {({ fieldProps }) => <Textfield {...fieldProps} isReadOnly={isUpdating} />}
              </Field>
              <Field name="email" label={t('label.email')} defaultValue={user.email} isRequired>
                {({ fieldProps, error }) => (
                  <>
                    <Textfield {...fieldProps} isReadOnly={isUpdating} />
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                  </>
                )}
              </Field>
              <FormFooter>
                <ButtonGroup>
                  <Button appearance="subtle" onClick={() => navigate(-1)}>
                    {t('label.cancel')}
                  </Button>
                  <FormSubmitButton isUpdating={isUpdating} />
                </ButtonGroup>
              </FormFooter>
            </form>
          )}
        </Form>
      )}
    </Stack>
  );
};

const FormSubmitButton = ({ isUpdating }: { isUpdating: boolean }) => {
  const formContext = useFormState<UserForm>({
    values: true,
    pristine: true,
    dirty: true
  });

  return (
    <>
      <Button
        type="submit"
        appearance="primary"
        isLoading={isUpdating}
        isDisabled={formContext?.pristine}
      >
        {t('label.edit')}
      </Button>
    </>
  );
};

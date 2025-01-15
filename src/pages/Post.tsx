import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '@atlaskit/spinner';
import { fetcher } from 'lib/utils';
import { useQuery } from 'react-query';
import { Post } from 'lib/types';

export const PostPage = () => {
  const { id = '' } = useParams();

  const fetchPost = () => fetcher<Post>(`/posts/${id}`);

  const {
    isLoading,
    isError,
    data: post,
    error
  } = useQuery<Post>('users', fetchPost, {
    refetchOnWindowFocus: false,
    retry: 0,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
    }
  });

  const navigate = useNavigate();

  if (isError && error instanceof Error) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <>
      {isLoading || !post ? (
        <Spinner />
      ) : (
        <>
          <pre>{JSON.stringify(post, null, 2)}</pre>
        </>
      )}
    </>
  );
};

import React from 'react';
import { render } from 'react-dom';
import './index.css';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';
// import { ReactQueryDevtools } from 'react-query/devtools';
import { Box } from '@atlaskit/primitives';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      cacheTime: 0,
      refetchOnWindowFocus: false,
      retry: 0
    }
  }
});

const rootElement = document.getElementById('root');
render(
  <QueryClientProvider client={queryClient}>
    {/* <ReactQueryDevtools initialIsOpen={true} /> */}
    <Box padding="space.200">
      <App />
    </Box>
  </QueryClientProvider>,
  rootElement
);

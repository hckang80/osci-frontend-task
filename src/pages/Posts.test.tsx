import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { PostsPage } from './';

const queryClient = new QueryClient();

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};

test('제목이 올바르게 렌더링 되는지 확인', () => {
  renderWithProviders(<PostsPage title="Test Title" />);
  expect(screen.getByText('Test Title')).toBeInTheDocument();
});

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './app';

describe('App routing regression', () => {
  it('Router provider 외부(main.tsx)에서 감싸졌을 때 정상 렌더링된다', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Health Clock' })).toBeInTheDocument();
  });

  it('알 수 없는 경로는 홈으로 리다이렉트된다', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-route']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Health Clock' })).toBeInTheDocument();
  });
});

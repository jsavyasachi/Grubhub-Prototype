import React from 'react';
import { render } from '@testing-library/react';
import Main from './Main';

it('renders without crashing', () => {
  render(<Main />);
});

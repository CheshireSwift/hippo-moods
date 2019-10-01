import React from 'react';
import { render } from 'enzyme';
import App from './App';

describe('the App component', () => {
  it('matches the snapshot', () => {
    expect(render(<App />)).toMatchSnapshot();
  });
});

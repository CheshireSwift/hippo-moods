import { css } from 'emotion';
import React from 'react';
import allData from './data.json';
import RadialChart from './drawing/RadialChart';

export const App = () => (
  <div className={css({ width: '100%', maxWidth: '98vh', margin: '0 auto' })}>
    <RadialChart data={allData} />
  </div>
);

export default App;

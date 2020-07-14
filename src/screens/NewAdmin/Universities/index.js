import React from 'react';
import { CTFragment } from 'layout';
import { connectWithRedux } from '../controllers';
import './index.scss';

function UniversitiesWithRedux() {
  return (
    <CTFragment padding={[0, 30]}>
      <div>
        Here is Universities page
      </div>
    </CTFragment>
  );
}

export const Universities = connectWithRedux(
    UniversitiesWithRedux,
    []
);
import React from 'react';
import { CTFragment, CTHeading } from 'layout';
import { connectWithRedux } from '../controllers';
import './index.scss';

function CoursesWithRedux() {
  const headingProps = CTHeading.createProps({
    heading: 'Course Templates',
    sticky: true,
    gradient: true,
    offsetTop: 30
  });

  return (
    <CTFragment>
      <CTHeading {...headingProps} />
      <CTFragment padding={[0, 30]}>
        Here is Courses page
      </CTFragment>
    </CTFragment>
  );
}

export const Courses = connectWithRedux(
    CoursesWithRedux,
    []
);
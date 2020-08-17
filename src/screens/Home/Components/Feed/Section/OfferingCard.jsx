import React from 'react';
import { Link } from 'react-router-dom';
import { isBrowser } from 'react-device-detect';
import { Card } from 'react-bootstrap';
import { links, user } from 'utils';
import { offeringPosterImg } from 'assets/images';
import './index.css';

import { StarredButton } from './Overlays';

export default function OfferingCard({
  offering = {},
  starredOfferings = [],
  // depart = {},
  termSelected = [],
  image = false,
  ...functions
}) {
  // if the full offering data has not yet loaded
  if (offering.isTestCourse) return null;
  const { id, fullNumber, termName, termId, sectionName, courseName, description } = offering;

  if (termSelected.length && !termSelected.includes(termId)) return null;

  const isLoggedIn = user.isLoggedIn;

  return !fullNumber ? null : (
    <div className="offering-card-container" role="listitem">
      {isLoggedIn && (
        <StarredButton
          {...functions}
          position={image ? 'middle' : 'top'}
          offeringId={id}
          starredOfferings={starredOfferings}
        />
      )}
      <Card
        className={`offeringCard ${image ? 'image-card' : 'basic-card'}`}
        data-mobile={!isBrowser}
        as={Link}
        to={{
          pathname: links.offeringDetail(id),
          state: { from: 'home', offering },
        }}
        aria-label={`${fullNumber} of section ${sectionName} in ${termName}`}
      >
        {image && (
          <Card.Img
            className="img"
            variant="top"
            src={offeringPosterImg}
            style={{ pointerEvents: 'none' }}
            alt=""
          />
        )}
        <Card.Body>
          <Card.Title className="title">
            <p>{fullNumber} </p>
            {courseName}
          </Card.Title>
          <Card.Text className="info">
            {termName} - {sectionName}
          </Card.Text>
          <Card.Text className="description">{description}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

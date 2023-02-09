/* eslint-disable react/destructuring-assignment */
import PropTypes from 'prop-types';
import React from 'react';

function LiVerticalTimeline(props) {
  return (
    <li className="event-list">
      <div className="event-timeline-dot">
        <i className={props.status.id === 3 ? 'bx bx-right-arrow-circle bx-fade-right' : 'bx bx-right-arrow-circle'} />
      </div>
      <div className="media">
        <div className="me-3">
          <i className={`bx ${props.status.iconClass} h2 text-primary`} />
        </div>
        <div className="media-body">
          <div>
            <h5>{props.status.stausTitle}</h5>
            <p className="text-muted">{props.status.description}</p>
          </div>
        </div>
      </div>
    </li>
  );
}

LiVerticalTimeline.propTypes = {
  status: PropTypes.object,
};

export default LiVerticalTimeline;

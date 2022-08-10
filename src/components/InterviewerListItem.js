import React from 'react';
import "components/InterviewerListItem.scss";
import classNames from 'classnames';

export default function InterviewListItem(props) {
  const interviewerClasses = classNames('interviewers__item', {'interviewers__item--selected': props.selected});

  return (
    <li onClick={props.setInterviewer} className={interviewerClasses}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
};
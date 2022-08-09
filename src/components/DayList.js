import React from 'react';
import DayListItem from './DayListItem';

export default function DayList(props) {
  const dayListArray = props.days.map((days) => {
    return (
      <DayListItem
        key={days.id}
        name={days.name}
        spots={days.spots}
        selected={days.name === props.day}
        setDay={props.setDay}
      />
    );
  });

  return (
    <ul>
      {dayListArray}
    </ul>
  );
};
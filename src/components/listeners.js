import React from 'react';

export default ({listeners}) => {
  const label = listeners === 1 ? 'listener' : 'listeners';
  return (
    <span>{listeners} {label}</span>
  )
}

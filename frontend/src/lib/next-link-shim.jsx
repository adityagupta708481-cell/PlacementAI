import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export default function Link({ href = '#', children, className, ...props }) {
  return (
    <RouterLink to={href} className={className} {...props}>
      {children}
    </RouterLink>
  );
}

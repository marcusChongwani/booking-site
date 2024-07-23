
import React, { useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useLocation } from 'react-router-dom';
import './Components.css';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const nodeRef = useRef(null);

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        nodeRef={nodeRef}
        classNames="page"
        timeout={100}
      >
        <div ref={nodeRef}>{children}</div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default PageTransition;

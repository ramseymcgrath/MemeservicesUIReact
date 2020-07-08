import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="main-nav">
      <ul>
        <li><NavLink to="/unforgivable">Unforgivable</NavLink></li>
        <li><NavLink to="/bait">Bait</NavLink></li>
        <li><NavLink to="/sadcat">Sadcat</NavLink></li>
        <li><NavLink to="/random">Random</NavLink></li>
      </ul>
    </nav>
  );
}

export default Navigation;

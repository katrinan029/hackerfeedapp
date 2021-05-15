import React from 'react'
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <div>
      <h1 className="main-header">HackerFeed</h1>
      <div className="nav-link">
        <NavLink to="/new" activeClassName="active">
          New Posts
        </NavLink> &nbsp; &nbsp; &nbsp;
        <NavLink to="/seen" activeClassName="active">
          Seen Posts
        </NavLink>
      </div>
    </div>
  )
}

export default Header

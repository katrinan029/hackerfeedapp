import React from 'react'
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <div>
      <h1 className="main-header">Hacker Feed</h1>
      <div className="nav-link-container">
        <NavLink className="nav-link" to="/" activeClassName="active">
          New Posts
        </NavLink> &nbsp; &nbsp; &nbsp;
      </div>
    </div>
  )
}

export default Header

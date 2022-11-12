import classNames from 'classnames';
import "./Sidebar.scss";
import React, { useState } from 'react';
import Hamburger from './Hamburger';

type SidebarProps = React.HTMLAttributes<HTMLDivElement>

const Sidebar: React.FC<SidebarProps> = ({ className = '', children, ...props }) => {

  return (
    <div className={classNames("sidebar", className)} {...props}>
      <div className="sidebar-contents">

      </div>
    </div>
  )
};

export default Sidebar
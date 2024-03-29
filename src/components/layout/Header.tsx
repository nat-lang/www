import classNames from 'classnames';
import "./Header.scss";
import React from 'react';

type HeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  left?: React.ReactNode
  right?: React.ReactNode
}

const Header: React.FC<HeaderProps> = ({ className = '', left, right, children: center, ...props }) => {
  return (
    <div className={classNames("header", className)} {...props}>
        <span className="header-left">{left}</span>
        <div className="header-center">{center}</div>
        <div className="header-right">{right}</div>
    </div>
  )
};

export default Header
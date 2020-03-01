/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';

import '../tailwind.css';

const Layout = ({ className, children }) => {
  return (
    <div className={className}>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
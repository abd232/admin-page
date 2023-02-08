
import classes from "./Header.module.css";
import React from 'react';
const Header = (props) => {

  /**
   * to show the navigation bar when its button clicked
   */

  const navBarHandler=()=>{
   
  }
  let userName="";
  return (
    <div className={classes.headerContainer}>
      <div className={classes.title}>
        MDW Admin Page
      </div>
      <div>
        <button className={classes.logoutButton}>تسجيل الخروج</button>
      </div>
    </div>
  );
};

export default Header;

/* eslint-disable react/no-array-index-key */
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

// //Import Scrollbar
import SimpleBar from 'simplebar-react';

// MetisMenu
import MetisMenu from 'metismenujs';
import { Link, withRouter } from 'react-router-dom';

function SidebarContent({ location, list }) {
  const ref = useRef();
  const { account_type, shopType } = useSelector((store) => store.Login.admin);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }
  function activateParentDropdown(item) {
    item.classList.add('active');
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== 'side-menu') {
      parent2El.classList.add('mm-show');
    }

    if (parent) {
      parent.classList.add('mm-active');
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add('mm-show'); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add('mm-active'); // li
          parent3.childNodes[0].classList.add('mm-active'); // a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add('mm-show'); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add('mm-show'); // li
              parent5.childNodes[0].classList.add('mm-active'); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }
  // Use ComponentDidMount and ComponentDidUpdate method symultaniously

  useEffect(() => {
    const pathName = location.pathname;

    const initMenu = () => {
      // eslint-disable-next-line no-new
      new MetisMenu('#side-menu');
      let matchingMenuItem = null;
      const ul = document.getElementById('side-menu');
      const items = ul.getElementsByTagName('a');
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    initMenu();
  }, [location.pathname]);

  useEffect(() => {
    ref.current.recalculate();
  });

  return (
    <SimpleBar style={{ maxHeight: '100%' }} ref={ref}>
      <div id="sidebar-menu">
        <ul className="metismenu list-unstyled" id="side-menu">
          {list?.map((item, index) => (
            <li key={index}>
              <Link to={item.link} className={`waves-effect ${item.isSubmenu && 'has-arrow'}`}>
                <i className={item.icon} />
                <p className="d-inline">
                  {item?.badgeId && <span className="cs-badge" id={item.badgeId}></span>}
                  <span>
                    {item.name === 'Products' &&
                    (account_type === 'shop' || account_type === 'seller') &&
                    shopType === 'food'
                      ? 'Menu'
                      : item.name}
                  </span>
                </p>
              </Link>
              {item.isSubmenu && (
                <ul className="sub-menu">
                  {item?.submenu?.map((sub, index) => (
                    <li key={index}>
                      <Link to={sub.link}>
                        <i className={sub.icon} />
                        <span>{sub.name} </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </SimpleBar>
  );
}

SidebarContent.propTypes = {
  location: PropTypes.object,
};

export default withRouter(SidebarContent);

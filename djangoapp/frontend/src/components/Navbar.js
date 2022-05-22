import React, {useState, useEffect, useContext} from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faBars } from '@fortawesome/free-solid-svg-icons';
import { Button } from './Button';
import '../../static/css/Navbar.css';
import AuthContext from './../context/AuthContext';

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  let {user, logoutUser} = useContext(AuthContext);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            ADP
            <i className='fab fa-typo3' />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Inicio
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/about-us' className='nav-links' onClick={closeMobileMenu}>
                Nosotros
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/contact' className='nav-links' onClick={closeMobileMenu}>
                Contacto
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/bookings' className='nav-links' onClick={closeMobileMenu}>
                Reservas
              </Link>
            </li>

            {/* TODO: Eliminar en la vista del administrador las páginas que ve el usuario normal */}

            {user && <li className='nav-item'>
              <Link to='/admin-profile' className='nav-links' onClick={closeMobileMenu}>
                Admin
              </Link>
            </li>}
            
          </ul>

          {user && <li className='nav-item'>
            <p className='nav-links' onClick={logoutUser}>
              Cerrar sesión
            </p>
          </li>}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
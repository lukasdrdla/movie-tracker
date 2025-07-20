import React, { useState, useEffect, useRef } from 'react'
import './NetflixNavigation.css'
import { useWishlist } from '../hooks/useWishlist'

interface NetflixNavigationProps {
  onWishlistClick?: () => void;
}

const NetflixNavigation: React.FC<NetflixNavigationProps> = ({ onWishlistClick }) => {

    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const { wishlistCount } = useWishlist()

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    // Zavření dropdown při kliknutí mimo
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

  return (
<nav className="nav">
      <div className="nav-left">
        <h1 className="logo">FAKETLIX</h1>
        <ul className="nav-links">
          <li>Domů</li>
          <li>TV pořady</li>
          <li>Filmy</li>
          <li>Novinky</li>
          <li 
            className="nav-link-clickable" 
            onClick={onWishlistClick}
          >
            Můj seznam {wishlistCount > 0 && <span className="wishlist-count">({wishlistCount})</span>}
          </li>
        </ul>
      </div>
      <div className="nav-right">
        <span className="nav-icon">🔍</span>
        <span className="nav-icon">🔔</span>
        <button 
          className="wishlist-button-nav" 
          onClick={onWishlistClick}
          title="Můj seznam přání"
        >
          ❤️
          {wishlistCount > 0 && <span className="wishlist-badge">{wishlistCount}</span>}
        </button>
        <div className="profile-dropdown" ref={dropdownRef}>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" 
            alt="Profil" 
            className="avatar"
            onClick={toggleDropdown}
          />
          {isOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" 
                  alt="Profil" 
                  className="dropdown-avatar"
                />
                <span>Uživatel</span>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item">Správa profilů</div>
              <div className="dropdown-item">Účet</div>
              <div className="dropdown-item">Centrum nápovědy</div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item">Odhlásit se z Netflix</div>
            </div>
          )}
        </div>
        </div>

        
        
    </nav>
  )
}

export default NetflixNavigation


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <nav className="header-nav">
      <Link to="/abnormal-processing">Abnormal Processing</Link>
      
      {/* 더보기 메뉴 컨테이너 */}
      <div 
        className="dropdown-container"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        <button className="more-btn">{t("MainDropdown_more")} ▾</button>
        
        {/* 드롭다운 메뉴 */}
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <Link to="/news">{t("MainDropdown_news")}</Link>
            <Link to="/glossary">{t("MainDropdown_glossary")}</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
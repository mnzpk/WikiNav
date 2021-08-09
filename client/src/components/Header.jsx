import React from 'react';
import WMFIcon from '../assets/images/Wikimedia-Foundation-logo.svg';

const Header = () => (
  <header className="wmf-header">
    <section>
      <a href="https://research.wikimedia.org/">
        <img src={WMFIcon} alt="Wikimedia Foundation logo" />
        Wikimedia Research
      </a>
    </section>
  </header>
);

export default Header;

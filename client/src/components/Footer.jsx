import React from 'react';
import { GiPlainCircle } from 'react-icons/gi';

const Footer = () => {
  const attributions = [
    ['Muniza', 'https://www.github.com/mnzpk'],
    ['Martin (WMF)', 'https://meta.wikimedia.org/wiki/User:MGerlach_(WMF)'],
    ['Isaac (WMF)', 'https://meta.wikimedia.org/wiki/User:Isaac_(WMF)'],
  ];
  return (
    <footer className="wmf-footer">
      <section>
        <div>
          Developed by{' '}
          {attributions
            .map(([name, link]) => (
              <a key={name} href={link}>
                {name}
              </a>
            ))
            .reduce((prev, curr, index) => [
              prev,
              index === attributions.length - 1 ? ' and ' : ', ',
              curr,
            ])}
          .
        </div>
        <a href="https://www.github.com/mnzpk/wikinav">Source code</a>
        <GiPlainCircle size="4px" className="footer-separator" />
        <a href="https://www.github.com/mnzpk/wikinav/blob/main/README.md#license">
          License
        </a>
        <GiPlainCircle size="4px" className="footer-separator" />
        <a href="https://wikitech.wikimedia.org/wiki/Portal:Toolforge">
          Toolforge
        </a>
        <div className="disclaimer">
          No guarantees are made that this tool will be maintained.
          <br />
          No additional personal data is collected by this tool per the Cloud
          Services{' '}
          <a href="https://wikitech.wikimedia.org/wiki/Wikitech:Cloud_Services_Terms_of_use">
            Terms of Use
          </a>
          .
        </div>
      </section>
    </footer>
  );
};

export default Footer;

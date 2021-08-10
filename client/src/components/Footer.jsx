import React from 'react';

const Footer = () => {
  const attributions = [
    ['Muniza', 'https://www.github.com/mnzpk'],
    ['Martin (WMF)', 'https://meta.wikimedia.org/wiki/User:MGerlach_(WMF)'],
    ['Isaac (WMF)', 'https://meta.wikimedia.org/wiki/User:Isaac_(WMF)'],
  ];
  return (
    <footer className="wmf-footer">
      <section>
        <span className="footer-attributions">
          Developed by{' '}
          {attributions
            .map(([name, link]) => (
              <a key={name} href={link}>
                <strong>{name}</strong>
              </a>
            ))
            .reduce((prev, curr, index) => [
              prev,
              index === attributions.length - 1 ? ' and ' : ', ',
              curr,
            ])}
          .
        </span>
        <br />
        <a href="https://www.github.com/mnzpk/wikinav">View Source</a>
      </section>
    </footer>
  );
};

export default Footer;

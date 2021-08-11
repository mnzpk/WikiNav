import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BiRedo } from 'react-icons/bi';
import { useSearchState } from '../searchStateContext';
import { normalize, denormalize } from '../utils';

const RedirectNotice = ({ name }) => {
  const [{ language, title }, setSearchState] = useSearchState();
  const [redirected, setRedirected] = useState(false);
  const [redirectSource, setRedirectSource] = useState(null);

  const handleRedirect = async (language, title) => {
    const url = `https://${language}.wikipedia.org/w/api.php?action=query&titles=${title}&redirects&format=json&formatversion=2&origin=*`;
    const response = await axios.get(url);
    const redirectTarget = response.data.query?.redirects?.[0]?.to;
    if (redirectTarget) {
      setRedirected(true);
      setRedirectSource(denormalize(title));
      setSearchState(name, normalize(redirectTarget));
    } else {
      setRedirectSource(null);
    }
  };

  useEffect(() => {
    if (redirected) {
      setRedirected(!redirected);
    } else {
      handleRedirect(language, title);
    }
  }, [language, title]);

  return redirectSource ? (
    <div className="redirect">
      <span className="redirect-icon">
        <BiRedo size="24px" />
      </span>
      The title <strong>{redirectSource}</strong> redirects here. Learn more
      about{' '}
      <a
        href="https://en.wikipedia.org/wiki/Wikipedia:Redirect"
        target="_blank"
        rel="noreferrer"
      >
        Wikipedia redirects
      </a>
      .
    </div>
  ) : null;
};

export default RedirectNotice;

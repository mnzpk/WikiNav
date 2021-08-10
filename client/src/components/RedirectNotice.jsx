import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchState } from '../searchStateContext';
import { normalize } from '../utils';

const RedirectNotice = ({ name }) => {
  const [{ language, title }, onClick] = useSearchState();
  const [redirectTarget, setRedirectTarget] = useState();

  const fetchRedirectTarget = async (language, title) => {
    const url = `https://${language}.wikipedia.org/w/api.php?action=query&titles=${title}&redirects&format=json&formatversion=2&origin=*`;
    const response = await axios.get(url);
    setRedirectTarget(response.data.query?.redirects?.[0]?.to);
  };

  useEffect(() => {
    fetchRedirectTarget(language, title);
  }, [language, title]);

  return redirectTarget ? (
    <div className="redirect margin-top-3">
      <em>
        This article redirects to{' '}
        <a
          href={`?language=${language}&title=${normalize(redirectTarget)}`}
          onClick={(e) => {
            e.preventDefault();
            onClick(name, normalize(redirectTarget));
          }}
        >
          {redirectTarget}
        </a>
        .
      </em>
    </div>
  ) : null;
};

export default RedirectNotice;

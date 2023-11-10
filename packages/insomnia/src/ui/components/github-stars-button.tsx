import React, { useEffect, useState } from 'react';
import { Link } from 'react-aria-components';
import { useMount, useMountedState } from 'react-use';

import { Icon } from './icon';

const LOCALSTORAGE_GITHUB_STARS_KEY = 'insomnia:github-stars';

export const GitHubStarsButton = () => {
  const isMounted = useMountedState();
  const localStorageStars = localStorage.getItem(LOCALSTORAGE_GITHUB_STARS_KEY);
  const initialState = parseInt(localStorageStars || '30000', 10);
  const [starCount, setStarCount] = useState(initialState);

  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_GITHUB_STARS_KEY, String(starCount));
  }, [starCount]);

  const [error, setError] = useState<Error | null>(null);

  useMount(() => {
    if (!isMounted()) {
      return;
    }

    fetch('https://api.github.com/repos/stefancruz/insomnia')
      .then(data => data.json())
      .then(info => {
        if (!('watchers' in info)) {
          throw new Error('unable to get stars from GitHub API');
        }

        if (!isMounted()) {
          return;
        }

        setStarCount(info.watchers);
        setError(null);
      })
      .catch(error => {
        if (!isMounted()) {
          return;
        }

        console.error('error fetching GitHub stars', error);
        setError(error);
      });
  });

  const shouldShowCount = !Boolean(error);

  return (
    <div className="flex select-none rounded-lg divide-x divide-[--hl-md] divide-solid border border-solid border-[--hl-md]">
      <Link>
        <a
          href="https://github.com/stefancruz/insomnia"
          className="px-4 py-1 rounded-l-lg last-of-type:rounded-r-lg outline-none flex items-center justify-center gap-2 aria-pressed:bg-[--hl-sm] text-[--color-font] hover:bg-[--hl-xs] focus:ring-1 ring-transparent focus:ring-[--hl-md] transition-all text-sm"
        >
          <Icon icon={['fab', 'github']} />
          Star
        </a>
      </Link>
      {shouldShowCount && (
        <Link>
          <a
            href="https://github.com/stefancruz/insomnia/stargazers"
            className="px-4 py-1 rounded-r-lg outline-none flex items-center justify-center gap-2 aria-pressed:bg-[--hl-sm] text-[--color-font] hover:bg-[--hl-xs] focus:ring-1 ring-transparent focus:ring-[--hl-md] transition-all text-sm"
          >
            {starCount.toLocaleString()}
          </a>
        </Link>
      )}
    </div>
  );
};

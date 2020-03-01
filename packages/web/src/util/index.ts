import { config } from 'mardi-shared';

export const getServerPort = () => {
  const { defaultServerPort } = config;
  if (typeof window !== undefined && typeof window.location !== undefined) {
    const params = new URLSearchParams(window.location.search);
    return params.get('server-port') || defaultServerPort;
  } else {
    return defaultServerPort;
  }
};

export const getAniimoImageUrl = (path: string | undefined): string => {
  if (!path || typeof path === 'undefined') {
    return '/img/aniimo/default.png';
  }
  return '/img/aniimo/' + path.split('/').pop();
};

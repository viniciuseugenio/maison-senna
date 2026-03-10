export function buildApiUrl(urlTemplate: string, params: object) {
  return Object.entries(params).reduce((url, [key, value]) => {
    return url.replace(`:${key}`, value);
  }, urlTemplate);
}

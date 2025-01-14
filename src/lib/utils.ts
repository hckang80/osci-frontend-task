export function fetcher<T>(
  url: string | URL | Request,
  init: RequestInit = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
): Promise<T> {
  return fetch(`${process.env.REACT_APP_BASE_URL}${url}`, init).then((res) => res.json());
}

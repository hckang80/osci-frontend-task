export function fetcher<T>(url: string | URL | Request, init?: RequestInit): Promise<T> {
  return fetch(`${process.env.REACT_APP_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...init
  }).then((res) => res.json());
}

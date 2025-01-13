export function fetcher<T>(url: string | URL | Request, init?: RequestInit): Promise<T> {
  return fetch(`${process.env.REACT_APP_BASE_URL}${url}`).then((res) => res.json());
}

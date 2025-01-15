export function fetcher<T>(url: string | URL | Request, init?: RequestInit): Promise<T> {
  return fetch(`${process.env.REACT_APP_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...init
  }).then((res) => res.json());
}

export function toReadableDate(
  date: Date | string | undefined = new Date(),
  options?: Intl.DateTimeFormatOptions
) {
  return new Intl.DateTimeFormat('en-CA', options).format(new Date(date));
}

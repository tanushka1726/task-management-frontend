export const getToken = () => {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
  return match ? match[1] : null;
};

export const setToken = (token: string, days: number = 7) => {
  if (typeof window === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `token=${token}; ${expires}; path=/`;
};

export const getRefreshToken = () => {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )refreshToken=([^;]*)/);
  return match ? match[1] : null;
};

export const setRefreshToken = (token: string, days: number = 30) => {
  if (typeof window === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `refreshToken=${token}; ${expires}; path=/`;
};

export const clearToken = () => {
  if (typeof window === "undefined") return;
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

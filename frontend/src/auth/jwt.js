export const decodeJwt = (token) => {
  if (!token || typeof token !== "string") return null;

  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const getRoleFromToken = (token) => {
  const payload = decodeJwt(token);
  if (!payload) return null;

  return (
    payload.role ||
    payload.roles?.[0] ||
    payload.authorities?.[0] ||
    payload.authority ||
    null
  );
};

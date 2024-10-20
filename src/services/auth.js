import Cookies from 'js-cookie';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const ROL_KEY = 'rol'

export const saveToken = (token) => {
  Cookies.set(TOKEN_KEY, token, { expires: 7, secure: true, sameSite: 'strict' });
};

export const getToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const saveUser = (user) => {
  Cookies.set(USER_KEY, JSON.stringify(user), { expires: 7, secure: true, sameSite: 'strict' });
};

export const getUser = () => {
  const user = Cookies.get(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const saveRol = () => {
    Cookies.set(ROL_KEY, JSON.stringify(user.rol), {expires: 7, secure: true, sameSite: 'strict'})
}

export const getRol = () => {
    const rol = Cookies.get(ROL_KEY);
    return rol ? JSON.parse(user.rol) : null;
}

export const logout = () => {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(USER_KEY);
  Cookies.remove(ROL_KEY)
};

import Cookie from 'js-cookie';

// TODO need depend on backend expired time
// save the token and user into the cookies and expired in 7 days
export const setUserSession = (token, user, permission) => {
  Cookie.set('token', JSON.stringify(token), { expires: 7 });
  Cookie.set('user', JSON.stringify(user), { expires: 7 });

};

export const getUser = () => {
  const userStr = Cookie.get('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export const getToken = () => { 
  return JSON.parse(Cookie.get('token')|| null)
};

export const removeUserSession = () => {
  const cookies = Cookie.get();
  const cookieKeys = Object.keys(cookies);
  cookieKeys.forEach((val) => {
    Cookie.remove(val);
  })
};

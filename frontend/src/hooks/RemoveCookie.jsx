import Cookie from 'js-cookie';

const RemoveCookie = (cookieName, value) => {
  return Cookie.remove(cookieName);
};

export default RemoveCookie;
  
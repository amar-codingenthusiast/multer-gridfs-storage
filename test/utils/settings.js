import url from 'url';

const hostname = process.env.MONGO_HOST || '127.0.0.1';
const port = process.env.MONGO_PORT || 27017;
const database = 'grid_storage';

export const generateChar = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return chars[Math.floor(Math.random() * chars.length)];
};

export const connection = {
  host: hostname,
  port,
  database,
};

export const mongoUrl = url.format({
  protocol: 'mongodb',
  slashes: true,
  hostname,
  port,
  pathname: database,
});

export const generateUrl = function () {
  let name = '';
  for (let i = 0; i <= 10; i++) {
    name = name + generateChar(i === 0);
  }
  return url.format({
    protocol: 'mongodb',
    slashes: true,
    hostname,
    port,
    pathname: database + '_' + name,
  })
};

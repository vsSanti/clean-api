module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '4.4.7',
      skipMD5: true,
    },
    autoStart: false,
    instance: {
      dbName: 'jest',
    },
  },
};

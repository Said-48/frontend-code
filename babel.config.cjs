module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins: [
    ['babel-plugin-transform-vite-meta-env', {
      env: {
        VITE_API_URL: 'http://127.0.0.1:5000',
      },
    }],
  ],
};

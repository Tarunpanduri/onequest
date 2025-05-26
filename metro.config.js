// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add necessary source extensions (in case others are missing)
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs', 'jsx', 'js', 'ts', 'tsx'];

// THIS IS CRUCIAL for Firebase v10+ compatibility with Hermes
config.resolver.unstable_enablePackageExports = false;

module.exports = config;

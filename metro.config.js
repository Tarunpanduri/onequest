// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure source extensions are properly included
config.resolver.sourceExts = [...config.resolver.sourceExts, "jsx", "js", "ts", "tsx"];

module.exports = config;
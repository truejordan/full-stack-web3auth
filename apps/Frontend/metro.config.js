// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");
// const { withStorybook } = require("@storybook/react-native/metro");


/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
    ...(config.resolver.extraNodeModules || {}),
    assert: require.resolve("empty-module"),
    http: require.resolve("empty-module"),
    https: require.resolve("empty-module"),
    os: require.resolve("empty-module"),
    url: require.resolve("empty-module"),
    zlib: require.resolve("empty-module"),
    path: require.resolve("empty-module"),
    crypto: require.resolve("react-native-quick-crypto"),
    stream: require.resolve("readable-stream"),
    buffer: require.resolve('buffer'),
};

// Move assetExts and sourceExts to config.resolver (NOT inside extraNodeModules)
config.resolver.assetExts = [...(config.resolver.assetExts || []), "svg", "png", "json"];
config.resolver.sourceExts = [...(config.resolver.sourceExts || []), "js", "mjs", "cjs", "jsx", "ts", "tsx", "css"];
  
  config.transformer.getTransformOptions = async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  });

  // Apply Storybook config first, then Uniwind
  let configWithStorybook = config;
  if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true') {
    try {
      const { withStorybook } = require("@storybook/react-native/metro");
      configWithStorybook = withStorybook(config, {
        configPath: './.rnstorybook',
      });
    } catch (error) {
      console.warn('Storybook metro config failed to load:', error.message);
    }
  }

module.exports = withUniwindConfig( configWithStorybook,{
  cssEntryFile: "./global.css",
  dtsFile: "./uniwind-types.d.ts",
  extraThemes: [
    'alpha-light',
    'alpha-dark',
  ]
});

module.exports = {
  locales: ['en', 'el'],
  defaultLocale: 'en',
  output: 'public/locales/$LOCALE/$NAMESPACE.json',
  input: ['src/**/*.{ts,tsx}'],
  namespaceSeparator: ':',
  keySeparator: '.',
  defaultNamespace: 'common',
  createOldCatalogs: false,
  keepRemoved: false,
  lexers: {
    ts: ['JavascriptLexer'],
    tsx: ['JsxLexer'],
  },
  lineEnding: 'lf',
  sort: true,
};

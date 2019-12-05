module.exports = {
  "env": {
    "browser": true,
    "es6": true,
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly",
  },
  "parserOptions": {
    "ecmaVersion": 2020,
    "project": "./tsconfig.json",
  },
  "plugins": [
    "@typescript-eslint",
  ],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "off",
    "no-dupe-class-members": "off",
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        "singleline": {"delimiter": "semi", "requireLast": false},
        "multiline": {"delimiter": "semi", "requireLast": true},
        "overrides": {
          "typeLiteral": {
            "singleline": {"delimiter": "comma", "requireLast": false},
            "multiline": {"delimiter": "comma", "requireLast": true},
          },
        },
      },
    ],
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/no-namespace": "off",
    "no-inner-declarations": "off",
    "no-case-declarations": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
};

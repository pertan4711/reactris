module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  globals: {
    "ts-jest": { tsconfig: "tsconfig.test.json" },
  },
};

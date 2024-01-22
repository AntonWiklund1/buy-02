console.log("Karma configuration started");
module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage"),
      require("karma-junit-reporter"), // Add this line
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },
    reporters: ["progress", "kjhtml", "coverage", "junit"], // Add 'junit' to the list of reporters
    junitReporter: {
      outputDir: "tests", // The directory where the output file will be saved
      outputFile: "test-results.xml", // Name of the output file
      useBrowserName: false, // Do not append browser name to the report
    },
    coverageReporter: {
      dir: require("path").join(__dirname, "coverage"),
      reporters: [
        { type: "html" },
        { type: "lcovonly", subdir: ".", file: "lcov.info" },
      ],
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_WARN,
    autoWatch: true,
    concurrency: 1,
    browsers: ["ChromeHeadless"],
    singleRun: false, // Set to true if you want Karma to exit after running the tests
  });
};

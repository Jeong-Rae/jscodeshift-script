const { defineTest } = require("jscodeshift/src/testUtils");

defineTest(__dirname, "../transform.js", null, "default-arrow", {
    parser: "js",
});

var assertAST = require("./lib/chai.assert.ast").equalAstToFn;
var assert = require('chai').assert;
var escodegen = require("escodegen");
var sinon = require("sinon");
var path = require("path");
describe("power-doctest", function () {
    var docPower;
    beforeEach(function () {
        docPower = require("../lib/power-doctest");
    });
    afterEach(function () {
        delete(require.cache[path.resolve("../lib/power-doctest")]);
    });
    describe("#convertFromCodeToTree", function () {
        it("can transform expression// => comment", function () {
            var code = "var a = 1;\n" +
                "a;// => 1";
            var resultAST = docPower.convertFromCodeToTree(code);
            assertAST(resultAST, function () {
                var a = 1;
                assert(a === 1);
            });
        });
        it("is very simple case", function () {
            var code = "1; // => 1"
            var resultAST = docPower.convertFromCodeToTree(code);
            assertAST(resultAST, function () {
                assert(1 === 1);
            });
        });
        it("can transform multiple doctest", function () {
            var code = "1; // => 1\n" +
                "2; // => 2\n"
            var resultAST = docPower.convertFromCodeToTree(code);
            assertAST(resultAST, function () {
                assert(1 === 1);
                assert(2 === 2);
            });
        });
        it("can transform CallExpression", function () {
            var code = "var a = function(){return 1;};" +
                "a(); // => 1";
            var resultAST = docPower.convertFromCodeToTree(code);
            assertAST(resultAST, function () {
                var a = function () {
                    return 1;
                };
                assert(a() === 1);
            });
        });
        it("can transform + BinaryExpression", function () {
            var code = "var a = function(){return 1;};\n" +
                "a + 1; // => 2";
            var resultAST = docPower.convertFromCodeToTree(code);
            assertAST(resultAST, function () {
                var a = function () {
                    return 1;
                };
                assert(a + 1 === 2);
            });
        });
        it("can transform CallExpression", function () {
            var code = "function add(x,y){ return x + y}\n" +
                "add(1,2);// => 3"
            var resultAST = docPower.convertFromCodeToTree(code);
            assertAST(resultAST, function () {
                function add(x, y) {
                    return x + y
                }

                assert(add(1, 2) === 3);
            });
        });
        it("should get expected data form BlockComment", function () {
            var code = "1; /* => 1 */";
            var resultAST = docPower.convertFromCodeToTree(code);
            assertAST(resultAST, function () {
                assert(1 === 1);
            });
        });
    });
    describe("option.astGenerator", function () {
        context("when set simple-deepEqual", function () {
            it("should transform code to deepEqual", function () {
                var code = "var a = 1;" +
                    "a; // => 1";
                var resultAST = docPower.convertFromCodeToTree(code, {
                    astGenerator: require("../lib/ast-generator/simple-deepEqual")
                });
                assertAST(resultAST, function () {
                    var a = 1;
                    assert.deepEqual(a, 1);
                });
            });
        });
    });
    describe("option.regexpExecuted", function () {
        it("accept regexp comment ", function () {
            var code = "var a = 1;" +
                "a; // === 1";
            var resultAST = docPower.convertFromCodeToTree(code, {
                regexpExecuted: /\s+===\s(.*?)$/
            });
            assertAST(resultAST, function () {
                var a = 1;
                assert(a === 1);
            });
        });
    });
    describe("#runDocTest", function () {
        context("when success test", function () {
            it("should not result message", function () {
                var code = "var a = 1;\n" +
                    "a; // => 1";
                var resultMessage = docPower.runDocTest(code);
                assert.isUndefined(resultMessage);
            });
        });
        context("when fail test", function () {
            it("should output message", function () {
                var code = "var a = 'test';\n" +
                    "a; // => 'not match'\n";
                var resultMessage = docPower.runDocTest(code);
                assert.isNotNull(resultMessage);
            });
        });
    });
});

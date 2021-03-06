var esprima = require("esprima");
var escodegen = require("escodegen");
var fs = require("fs");

function mixinGenerator(node, commentExpression) {
    var loc = node.loc;
    var actualExpression = node.expression;
    var expectedExpression = commentExpression;
    return  {
        "type": "TryStatement",
        "block": {
            "type": "BlockStatement",
            "body": [
                {
                    "type": "VariableDeclaration",
                    "declarations": [
                        {
                            "type": "VariableDeclarator",
                            "id": {
                                "type": "Identifier",
                                "name": "actual"
                            },
                            "init": actualExpression
                        }
                    ],
                    "kind": "var"
                },
                {
                    "type": "VariableDeclaration",
                    "declarations": [
                        {
                            "type": "VariableDeclarator",
                            "id": {
                                "type": "Identifier",
                                "name": "expected"
                            },
                            "init": expectedExpression
                        }
                    ],
                    "kind": "var"
                },
                {
                    "type": "IfStatement",
                    "test": {
                        "type": "LogicalExpression",
                        "operator": "||",
                        "left": {
                            "type": "BinaryExpression",
                            "operator": "===",
                            "left": {
                                "type": "UnaryExpression",
                                "operator": "typeof",
                                "argument": { // actual
                                    "type": "Identifier",
                                    "name": "actual"
                                },
                                "prefix": true
                            },
                            "right": {
                                "type": "Literal",
                                "value": "object",
                                "raw": "\"object\""
                            }
                        },
                        "right": {
                            "type": "BinaryExpression",
                            "operator": "===",
                            "left": {
                                "type": "UnaryExpression",
                                "operator": "typeof",
                                "argument": { // expected
                                    "type": "Identifier",
                                    "name": "expected"
                                },
                                "prefix": true
                            },
                            "right": {
                                "type": "Literal",
                                "value": "object",
                                "raw": "\"object\""
                            }
                        }
                    },
                    "consequent": {
                        "type": "BlockStatement",
                        "body": [
                            {
                                "type": "ExpressionStatement",
                                "expression": {
                                    "type": "CallExpression",
                                    "callee": {
                                        "type": "MemberExpression",
                                        "computed": false,
                                        "object": {
                                            "type": "Identifier",
                                            "name": "assert"
                                        },
                                        "property": {
                                            "type": "Identifier",
                                            "name": "deepEqual"
                                        }
                                    },
                                    "arguments": [
                                        { // actual
                                            "type": "Identifier",
                                            "name": "actual"
                                        },
                                        {
                                            "type": "Identifier",
                                            "name": "expected"
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    "alternate": {
                        "type": "BlockStatement",
                        "body": [
                            {
                                "type": "ExpressionStatement",
                                "expression": {
                                    "type": "CallExpression",
                                    "callee": {
                                        "type": "MemberExpression",
                                        "computed": false,
                                        "object": {
                                            "type": "Identifier",
                                            "name": "assert"
                                        },
                                        "property": {
                                            "type": "Identifier",
                                            "name": "ok"
                                        }
                                    },
                                    "arguments": [
                                        {
                                            "type": "BinaryExpression",
                                            "operator": "===",
                                            "left": { // actual
                                                "type": "Identifier",
                                                "name": "actual"
                                            },
                                            "right": { // expected
                                                "type": "Identifier",
                                                "name": "expected"
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        },
        "guardedHandlers": [],
        "handlers": [
            {
                "type": "CatchClause",
                "param": {
                    "type": "Identifier",
                    "name": "error"
                },
                "body": {
                    "type": "BlockStatement",
                    "body": [
                        {
                            "type": "VariableDeclaration",
                            "declarations": [
                                {
                                    "type": "VariableDeclarator",
                                    "id": {
                                        "type": "Identifier",
                                        "name": "newError"
                                    },
                                    "init": {
                                        "type": "Identifier",
                                        "name": "error"
                                    }
                                }
                            ],
                            "kind": "var"
                        },
                        {
                            "type": "ExpressionStatement",
                            "expression": {
                                "type": "AssignmentExpression",
                                "operator": "=",
                                "left": {
                                    "type": "MemberExpression",
                                    "computed": false,
                                    "object": {
                                        "type": "Identifier",
                                        "name": "newError"
                                    },
                                    "property": {
                                        "type": "Identifier",
                                        "name": "loc"
                                    }
                                },
                                "right": {
                                    "type": "ObjectExpression",
                                    "properties": [
                                        {
                                            "type": "Property",
                                            "key": {
                                                "type": "Identifier",
                                                "name": "start"
                                            },
                                            "value": {
                                                "type": "ObjectExpression",
                                                "properties": [
                                                    {
                                                        "type": "Property",
                                                        "key": {
                                                            "type": "Identifier",
                                                            "name": "column"
                                                        },
                                                        "value": {
                                                            "type": "Literal",
                                                            "value": loc.start.column,
                                                            "raw": String(loc.start.column)
                                                        },
                                                        "kind": "init"
                                                    },
                                                    {
                                                        "type": "Property",
                                                        "key": {
                                                            "type": "Identifier",
                                                            "name": "line"
                                                        },
                                                        "value": {
                                                            "type": "Literal",
                                                            "value": loc.start.line,
                                                            "raw": String(loc.start.line)
                                                        },
                                                        "kind": "init"
                                                    }
                                                ]
                                            },
                                            "kind": "init"
                                        },
                                        {
                                            "type": "Property",
                                            "key": {
                                                "type": "Identifier",
                                                "name": "end"
                                            },
                                            "value": {
                                                "type": "ObjectExpression",
                                                "properties": [
                                                    {
                                                        "type": "Property",
                                                        "key": {
                                                            "type": "Identifier",
                                                            "name": "column"
                                                        },
                                                        "value": {
                                                            "type": "Literal",
                                                            "value": loc.end.column,
                                                            "raw": String(loc.end.column)
                                                        },
                                                        "kind": "init"
                                                    },
                                                    {
                                                        "type": "Property",
                                                        "key": {
                                                            "type": "Identifier",
                                                            "name": "line"
                                                        },
                                                        "value": {
                                                            "type": "Literal",
                                                            "value": loc.end.line,
                                                            "raw": String(loc.end.line)
                                                        },
                                                        "kind": "init"
                                                    }
                                                ]
                                            },
                                            "kind": "init"
                                        }
                                    ]}
                            }
                        },
                        {
                            "type": "ThrowStatement",
                            "argument": {
                                "type": "Identifier",
                                "name": "newError"
                            }
                        }
                    ]
                }
            }
        ],
        "finalizer": null
    }
}


module.exports = mixinGenerator;
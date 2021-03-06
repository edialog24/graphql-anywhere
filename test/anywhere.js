"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var src_1 = require("../src");
var graphql_tag_1 = require("graphql-tag");
describe('graphql anywhere', function () {
    it('does basic things', function () {
        var resolver = function (_, root) { return root + 'fake'; };
        var query = (_a = ["\n      {\n        a {\n          b\n          ...frag\n        }\n      }\n\n      fragment frag on X {\n        c\n      }\n    "], _a.raw = ["\n      {\n        a {\n          b\n          ...frag\n        }\n      }\n\n      fragment frag on X {\n        c\n      }\n    "], graphql_tag_1.default(_a));
        var result = src_1.default(resolver, query, '', null, null);
        chai_1.assert.deepEqual(result, {
            a: {
                b: 'fakefake',
                c: 'fakefake',
            },
        });
        var _a;
    });
    it('works with enum args', function () {
        var resolver = function (fieldName, root, args) { return args.value; };
        var query = (_a = ["\n      {\n        a(value: ENUM_VALUE)\n      }\n    "], _a.raw = ["\n      {\n        a(value: ENUM_VALUE)\n      }\n    "], graphql_tag_1.default(_a));
        var result = src_1.default(resolver, query);
        chai_1.assert.deepEqual(result, {
            a: 'ENUM_VALUE',
        });
        var _a;
    });
    it('traverses arrays returned from the resolver', function () {
        var resolver = function () { return [1, 2]; };
        var query = (_a = ["\n      {\n        a {\n          b\n        }\n      }\n    "], _a.raw = ["\n      {\n        a {\n          b\n        }\n      }\n    "], graphql_tag_1.default(_a));
        var result = src_1.default(resolver, query);
        chai_1.assert.deepEqual(result, {
            a: [
                {
                    b: [1, 2],
                },
                {
                    b: [1, 2],
                },
            ],
        });
        var _a;
    });
    it('can traverse an object', function () {
        var obj = {
            a: {
                b: 'fun',
                c: ['also fun', 'also fun 2'],
                d: 'not fun',
            },
        };
        var resolver = function (fieldName, root) { return root[fieldName]; };
        var query = (_a = ["\n      {\n        a {\n          b\n          c\n        }\n      }\n    "], _a.raw = ["\n      {\n        a {\n          b\n          c\n        }\n      }\n    "], graphql_tag_1.default(_a));
        var result = src_1.default(resolver, query, obj, null, null);
        chai_1.assert.deepEqual(result, {
            a: {
                b: 'fun',
                c: ['also fun', 'also fun 2'],
            },
        });
        var _a;
    });
    it('can traverse nested arrays', function () {
        var obj = {
            a: [{
                    b: [
                        [{ c: 1 }, { c: 2 }],
                        [{ c: 3 }, { c: 4 }],
                    ],
                }],
        };
        var resolver = function (fieldName, root) { return root[fieldName]; };
        var query = (_a = ["\n      {\n        a {\n          b {\n            c\n          }\n        }\n      }\n    "], _a.raw = ["\n      {\n        a {\n          b {\n            c\n          }\n        }\n      }\n    "], graphql_tag_1.default(_a));
        var result = src_1.default(resolver, query, obj, null, null);
        chai_1.assert.deepEqual(result, {
            a: [{
                    b: [
                        [{ c: 1 }, { c: 2 }],
                        [{ c: 3 }, { c: 4 }],
                    ],
                }],
        });
        var _a;
    });
    it('can use arguments, both inline and variables', function () {
        var resolver = function (fieldName, _, args) { return args; };
        var query = (_a = ["\n      {\n        inline(int: 5, float: 3.14, string: \"string\")\n        variables(int: $int, float: $float, string: $string)\n      }\n    "], _a.raw = ["\n      {\n        inline(int: 5, float: 3.14, string: \"string\")\n        variables(int: $int, float: $float, string: $string)\n      }\n    "], graphql_tag_1.default(_a));
        var variables = {
            int: 6,
            float: 6.28,
            string: 'varString',
        };
        var result = src_1.default(resolver, query, null, null, variables);
        chai_1.assert.deepEqual(result, {
            inline: {
                int: 5,
                float: 3.14,
                string: 'string',
            },
            variables: {
                int: 6,
                float: 6.28,
                string: 'varString',
            },
        });
        var _a;
    });
    it('will tolerate missing variables', function () {
        var resolver = function (fieldName, _, args) { return args; };
        var query = (_a = ["\n      {\n        variables(int: $int, float: $float, string: $string, missing: $missing)\n      }\n    "], _a.raw = ["\n      {\n        variables(int: $int, float: $float, string: $string, missing: $missing)\n      }\n    "], graphql_tag_1.default(_a));
        var variables = {
            int: 6,
            float: 6.28,
            string: 'varString',
        };
        var result = src_1.default(resolver, query, null, null, variables);
        chai_1.assert.deepEqual(result, {
            variables: {
                int: 6,
                float: 6.28,
                string: 'varString',
                missing: undefined,
            },
        });
        var _a;
    });
    it('can use skip and include', function () {
        var resolver = function (fieldName) { return fieldName; };
        var query = (_a = ["\n      {\n        a {\n          b @skip(if: true)\n          c @include(if: true)\n          d @skip(if: false)\n          e @include(if: false)\n        }\n      }\n    "], _a.raw = ["\n      {\n        a {\n          b @skip(if: true)\n          c @include(if: true)\n          d @skip(if: false)\n          e @include(if: false)\n        }\n      }\n    "], graphql_tag_1.default(_a));
        var result = src_1.default(resolver, query, null, null, null);
        chai_1.assert.deepEqual(result, {
            a: {
                c: 'c',
                d: 'd',
            },
        });
        var _a;
    });
    it('can use inline and named fragments', function () {
        var resolver = function (fieldName) { return fieldName; };
        var query = (_a = ["\n      {\n        a {\n          ... on Type {\n            b\n            c\n          }\n          ...deFrag\n        }\n      }\n\n      fragment deFrag on Type {\n        d\n        e\n      }\n    "], _a.raw = ["\n      {\n        a {\n          ... on Type {\n            b\n            c\n          }\n          ...deFrag\n        }\n      }\n\n      fragment deFrag on Type {\n        d\n        e\n      }\n    "], graphql_tag_1.default(_a));
        var result = src_1.default(resolver, query, null, null, null);
        chai_1.assert.deepEqual(result, {
            a: {
                b: 'b',
                c: 'c',
                d: 'd',
                e: 'e',
            },
        });
        var _a;
    });
    it('can resolve deeply nested fragments', function () {
        var resolver = function (fieldName, root) {
            return root[fieldName];
        };
        var query = (_a = ["\n      {\n        stringField,\n        numberField,\n        nullField,\n        ... on Item {\n          nestedObj {\n            stringField\n            nullField\n            deepNestedObj {\n              stringField\n              nullField\n            }\n          }\n        }\n        ... on Item {\n          nestedObj {\n            numberField\n            nullField\n            deepNestedObj {\n              numberField\n              nullField\n            }\n          }\n        }\n        ... on Item {\n          nullObject\n        }\n        nestedObj {\n          inlinedObjectStringField\n        }\n      }\n    "], _a.raw = ["\n      {\n        stringField,\n        numberField,\n        nullField,\n        ... on Item {\n          nestedObj {\n            stringField\n            nullField\n            deepNestedObj {\n              stringField\n              nullField\n            }\n          }\n        }\n        ... on Item {\n          nestedObj {\n            numberField\n            nullField\n            deepNestedObj {\n              numberField\n              nullField\n            }\n          }\n        }\n        ... on Item {\n          nullObject\n        }\n        nestedObj {\n          inlinedObjectStringField\n        }\n      }\n    "], graphql_tag_1.default(_a));
        var result = {
            id: 'abcd',
            stringField: 'This is a string!',
            numberField: 5,
            nullField: null,
            nestedObj: {
                id: 'abcde',
                stringField: 'This is a string too!',
                numberField: 6,
                nullField: null,
                deepNestedObj: {
                    stringField: 'This is a deep string',
                    numberField: 7,
                    nullField: null,
                },
                inlinedObjectStringField: 'This is a string of an inlined object',
            },
            nullObject: null,
        };
        var queryResult = src_1.default(resolver, query, result);
        chai_1.assert.deepEqual(queryResult, {
            stringField: 'This is a string!',
            numberField: 5,
            nullField: null,
            nestedObj: {
                stringField: 'This is a string too!',
                numberField: 6,
                nullField: null,
                deepNestedObj: {
                    stringField: 'This is a deep string',
                    numberField: 7,
                    nullField: null,
                },
                inlinedObjectStringField: 'This is a string of an inlined object',
            },
            nullObject: null,
        });
        var _a;
    });
    it('can resolve deeply nested fragments with arrays', function () {
        var resolver = function (fieldName, root) {
            return root[fieldName];
        };
        var query = (_a = ["\n      {\n        ...on Item {\n          array { id field1 }\n        }\n        ...on Item {\n          array { id field2 }\n        }\n        ...on Item {\n          array { id field3 }\n        }\n      }\n    "], _a.raw = ["\n      {\n        ...on Item {\n          array { id field1 }\n        }\n        ...on Item {\n          array { id field2 }\n        }\n        ...on Item {\n          array { id field3 }\n        }\n      }\n    "], graphql_tag_1.default(_a));
        var result = {
            array: [{
                    id: 'abcde',
                    field1: 1,
                    field2: 2,
                    field3: 3,
                }],
        };
        var queryResult = src_1.default(resolver, query, result);
        chai_1.assert.deepEqual(queryResult, {
            array: [{
                    id: 'abcde',
                    field1: 1,
                    field2: 2,
                    field3: 3,
                }],
        });
        var _a;
    });
    it('readme example', function () {
        var gitHubAPIResponse = {
            'url': 'https://api.github.com/repos/octocat/Hello-World/issues/1347',
            'title': 'Found a bug',
            'body': 'I\'m having a problem with this.',
            'user': {
                'login': 'octocat',
                'avatar_url': 'https://github.com/images/error/octocat_happy.gif',
                'url': 'https://api.github.com/users/octocat',
            },
            'labels': [
                {
                    'url': 'https://api.github.com/repos/octocat/Hello-World/labels/bug',
                    'name': 'bug',
                    'color': 'f29513',
                },
            ],
        };
        var query = (_a = ["\n      {\n        title\n        user {\n          login\n        }\n        labels {\n          name\n        }\n      }\n    "], _a.raw = ["\n      {\n        title\n        user {\n          login\n        }\n        labels {\n          name\n        }\n      }\n    "], graphql_tag_1.default(_a));
        var resolver = function (fieldName, root) { return root[fieldName]; };
        var result = src_1.default(resolver, query, gitHubAPIResponse);
        chai_1.assert.deepEqual(result, {
            'title': 'Found a bug',
            'user': {
                'login': 'octocat',
            },
            'labels': [
                {
                    'name': 'bug',
                },
            ],
        });
        var _a;
    });
    it('readme example 2', function () {
        var query = (_a = ["\n      {\n        author {\n          name: string\n          age: int\n          address {\n            state: string\n          }\n        }\n      }\n    "], _a.raw = ["\n      {\n        author {\n          name: string\n          age: int\n          address {\n            state: string\n          }\n        }\n      }\n    "], graphql_tag_1.default(_a));
        var resolver = function (fieldName) { return ({
            string: 'This is a string',
            int: 5,
        }[fieldName] || 'continue'); };
        var result = src_1.default(resolver, query);
        chai_1.assert.deepEqual(result, {
            author: {
                name: 'This is a string',
                age: 5,
                address: {
                    state: 'This is a string',
                },
            },
        });
        var _a;
    });
    it('read from Redux normalized store', function () {
        var data = {
            result: [1, 2],
            entities: {
                articles: {
                    1: { id: 1, title: 'Some Article', author: 1 },
                    2: { id: 2, title: 'Other Article', author: 1 },
                },
                users: {
                    1: { id: 1, name: 'Dan' },
                },
            },
        };
        var query = (_a = ["\n      {\n        result {\n          title\n          author {\n            name\n          }\n        }\n      }\n    "], _a.raw = ["\n      {\n        result {\n          title\n          author {\n            name\n          }\n        }\n      }\n    "], graphql_tag_1.default(_a));
        var schema = {
            articles: {
                author: 'users',
            },
        };
        var resolver = function (fieldName, rootValue, args, context) {
            if (!rootValue) {
                return context.result.map(function (id) {
                    return __assign({}, context.entities.articles[id], { __typename: 'articles' });
                });
            }
            var typename = rootValue.__typename;
            if (typename && schema[typename] && schema[typename][fieldName]) {
                var targetType = schema[typename][fieldName];
                return __assign({}, context.entities[targetType][rootValue[fieldName]], { __typename: targetType });
            }
            return rootValue[fieldName];
        };
        var result = src_1.default(resolver, query, null, data);
        chai_1.assert.deepEqual(result, {
            result: [
                {
                    title: 'Some Article',
                    author: {
                        name: 'Dan',
                    },
                },
                {
                    title: 'Other Article',
                    author: {
                        name: 'Dan',
                    },
                },
            ],
        });
        var _a;
    });
    it('passes info including isLeaf, resultKey and directives', function () {
        var leafMap = {};
        var resolver = function (fieldName, root, args, context, info) {
            leafMap[fieldName] = info;
            return 'continue';
        };
        var query = (_a = ["\n      {\n        alias: a {\n          b\n          hasDirective @skip(if: false) @otherDirective(arg: $x)\n        }\n      }\n    "], _a.raw = ["\n      {\n        alias: a {\n          b\n          hasDirective @skip(if: false) @otherDirective(arg: $x)\n        }\n      }\n    "], graphql_tag_1.default(_a));
        src_1.default(resolver, query, null, null, { x: 'argument' });
        chai_1.assert.deepEqual(leafMap, {
            a: {
                directives: null,
                isLeaf: false,
                resultKey: 'alias',
            },
            b: {
                directives: null,
                isLeaf: true,
                resultKey: 'b',
            },
            hasDirective: {
                directives: {
                    skip: { if: false },
                    otherDirective: { arg: 'argument' },
                },
                isLeaf: true,
                resultKey: 'hasDirective',
            },
        });
        var _a;
    });
    it('can filter GraphQL results', function () {
        var data = {
            alias: 'Bob',
            name: 'Wrong',
            height: 1.89,
            avatar: {
                square: 'abc',
                circle: 'def',
                triangle: 'qwe',
            },
        };
        var fragment = (_a = ["\n      fragment PersonDetails on Person {\n        alias: name\n        height(unit: METERS)\n        avatar {\n          square\n          ... on Avatar {\n            circle\n          }\n        }\n      }\n    "], _a.raw = ["\n      fragment PersonDetails on Person {\n        alias: name\n        height(unit: METERS)\n        avatar {\n          square\n          ... on Avatar {\n            circle\n          }\n        }\n      }\n    "], graphql_tag_1.default(_a));
        var resolver = function (fieldName, root, args, context, info) {
            return root[info.resultKey];
        };
        var filtered = src_1.default(resolver, fragment, data);
        chai_1.assert.deepEqual(filtered, {
            alias: 'Bob',
            height: 1.89,
            avatar: {
                square: 'abc',
                circle: 'def',
            },
        });
        var _a;
    });
    it('can handle mutations', function () {
        var resolver = function (fieldName, root, args) {
            if (fieldName === 'operateOnNumbers') {
                return args;
            }
            else if (fieldName === 'add') {
                return root.a + root.b;
            }
            else if (fieldName === 'subtract') {
                return root.a - root.b;
            }
            else if (fieldName === 'multiply') {
                return root.a * root.b;
            }
            else if (fieldName === 'divide') {
                return root.a / root.b;
            }
        };
        var query = (_a = ["\n      mutation {\n        operateOnNumbers(a: 10, b: 2) {\n          add\n          subtract\n          multiply\n          divide\n        }\n      }\n    "], _a.raw = ["\n      mutation {\n        operateOnNumbers(a: 10, b: 2) {\n          add\n          subtract\n          multiply\n          divide\n        }\n      }\n    "], graphql_tag_1.default(_a));
        var result = src_1.default(resolver, query, '', null, null);
        chai_1.assert.deepEqual(result, {
            operateOnNumbers: {
                add: 12,
                subtract: 8,
                multiply: 20,
                divide: 5,
            },
        });
        var _a;
    });
    it('can handle subscriptions', function () {
        var data = {
            user: {
                id: 1,
                name: 'Some User',
                height: 1.89,
            },
        };
        var resolver = function (fieldName, root) { return root[fieldName]; };
        var query = (_a = ["\n      subscription {\n        user {\n          id\n          name\n          height\n        }\n      }\n    "], _a.raw = ["\n      subscription {\n        user {\n          id\n          name\n          height\n        }\n      }\n    "], graphql_tag_1.default(_a));
        var result = src_1.default(resolver, query, data);
        chai_1.assert.deepEqual(result, {
            user: {
                id: 1,
                name: 'Some User',
                height: 1.89,
            },
        });
        var _a;
    });
    it('can handle documents with multiple fragments', function () {
        var data = {
            user: {
                id: 1,
                name: 'Some User',
                height: 1.89,
            },
        };
        var resolver = function (fieldName, root) { return root[fieldName]; };
        var query = (_a = ["\n      fragment A on User {\n        name\n      }\n\n      fragment B on User {\n        height\n      }\n\n      query {\n        user {\n          id\n          ...A\n          ...B\n        }\n      }\n    "], _a.raw = ["\n      fragment A on User {\n        name\n      }\n\n      fragment B on User {\n        height\n      }\n\n      query {\n        user {\n          id\n          ...A\n          ...B\n        }\n      }\n    "], graphql_tag_1.default(_a));
        var result = src_1.default(resolver, query, data);
        chai_1.assert.deepEqual(result, {
            user: {
                id: 1,
                name: 'Some User',
                height: 1.89,
            },
        });
        var _a;
    });
});
//# sourceMappingURL=anywhere.js.map
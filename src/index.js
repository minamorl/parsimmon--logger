const P = require("parsimmon")

const prettify = (parsers, name, f) => {
  return function (...args) {
    const original = f.call(this, ...args)
    return original.node(name)
  }
}

const _createLanguage = P.createLanguage
P.createLanguage = (parsers) => {
  for (let x of Object.keys(parsers)) {
    parsers[x] = prettify(parsers, x, parsers[x])
  }
  return _createLanguage(parsers)
}

const _logger = (x, indentLevel) => {
  if (x === undefined)
    return
  if (x instanceof Array)
    return x.map(v => _logger(v, indentLevel)).join("\n")
  if (typeof x.value !== "object")
    return "  ".repeat(indentLevel + 1) + x.value  
  return ("  ".repeat(indentLevel) + "+ Ok(" + x.name + ") " + "\n" + _logger(x.value, indentLevel + 1))
}

const logger = (ast) => {
  console.log(_logger(ast, 0))
}

let util = require('util');

/////////////////////////////////////////////////


let Lisp = P.createLanguage({

  // An expression is just any of the other values we make in the language. Note
  // that because we're using `.createLanguage` here we can reference other
  // parsers off of the argument to our function. `r` is short for `rules` here.
  Expression: function(r) {
    return P.alt(
      r.Symbol,
      r.Number,
      r.List
    );
  },

  // The basic parsers (usually the ones described via regexp) should have a
  // description for error message purposes.
  Symbol: function() {
    return P.regexp(/[a-zA-Z_-][a-zA-Z0-9_-]*/)
      .desc('symbol');
  },

  // Note that Number("10") === 10, Number("9") === 9, etc in JavaScript.
  // This is not a recursive parser. Number(x) is similar to parseInt(x, 10).
  Number: function() {
    return P.regexp(/[0-9]+/)
      .map(Number)
      .desc('number');
  },

  // `.trim(P.optWhitespace)` removes whitespace from both sides, then `.many()`
  // repeats the expression zero or more times. Finally, `.wrap(...)` removes
  // the '(' and ')' from both sides of the list.
  List: function(r) {
    return r.Expression
      .trim(P.optWhitespace)
      .many()
      .wrap(P.string('('), P.string(')'));
  },

  // A file in Lisp is generally just zero or more expressions.
  File: function(r) {
    return r.Expression.trim(P.optWhitespace).many();
  }
});

///////////////////////////////////////////////////////////////////////

let text = `\
(list 1 2 (cons 1 (list)))
(print 5 golden rings)
`;



let ast = Lisp.File.tryParse(text);

logger(ast);
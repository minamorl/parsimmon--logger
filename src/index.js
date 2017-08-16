const P = require("parsimmon")

const prettify = (name, f) => {
  return function (...args) {
    const original = f.call(this, ...args)
    const func = original._
    // wraps result
    original._ = (str, i) => {

      const result = func(str, i)

      if (result.status) {
        console.log("%" + ("0000" + i).slice(-5) + "  " + name + " " + result.value)
      }
      return result
    }
    
    return original
  }
}

for (let x of Object.keys(P)) {
  if(P[x] instanceof Function)
    P[x] = prettify(x, P[x])
}
for (let x of Object.keys(P.prototype)) {
  if(P[x] instanceof Function)  
    P.prototype[x] = prettify(x, P.prototype[x])
}



// let util = require('util');

// /////////////////////////////////////////////////


// let Lisp = P.createLanguage({

//   // An expression is just any of the other values we make in the language. Note
//   // that because we're using `.createLanguage` here we can reference other
//   // parsers off of the argument to our function. `r` is short for `rules` here.
//   Expression: function(r) {
//     return P.alt(
//       r.Symbol,
//       r.Number,
//       r.List
//     );
//   },

//   // The basic parsers (usually the ones described via regexp) should have a
//   // description for error message purposes.
//   Symbol: function() {
//     return P.regexp(/[a-zA-Z_-][a-zA-Z0-9_-]*/)
//       .desc('symbol');
//   },

//   // Note that Number("10") === 10, Number("9") === 9, etc in JavaScript.
//   // This is not a recursive parser. Number(x) is similar to parseInt(x, 10).
//   Number: function() {
//     return P.regexp(/[0-9]+/)
//       .map(Number)
//       .desc('number');
//   },

//   // `.trim(P.optWhitespace)` removes whitespace from both sides, then `.many()`
//   // repeats the expression zero or more times. Finally, `.wrap(...)` removes
//   // the '(' and ')' from both sides of the list.
//   List: function(r) {
//     return r.Expression
//       .trim(P.optWhitespace)
//       .many()
//       .wrap(P.string('('), P.string(')'));
//   },

//   // A file in Lisp is generally just zero or more expressions.
//   File: function(r) {
//     return r.Expression.trim(P.optWhitespace).many();
//   }
// });

// ///////////////////////////////////////////////////////////////////////

// let text = `\
// (list 1 2 (cons 1 (list)))
// (print 5 golden rings)
// `;

// function prettyPrint(x) {
//   let opts = {depth: null, colors: 'auto'};
//   let s = util.inspect(x, opts);
//   console.log(s);
// }

// let ast = Lisp.File.tryParse(text);
// prettyPrint(ast);
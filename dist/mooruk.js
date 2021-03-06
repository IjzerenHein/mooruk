/**
* This Source Code is licensed under the MIT license. If a copy of the
* MIT-license was not distributed with this file, You can obtain one at:
* http://opensource.org/licenses/mit-license.html.
*
* @author: Hein Rutjes (IjzerenHein)
* @license MIT
* @copyright Gloey Apps, 2015
*
* @library mooruk
* @version 0.0.1
* @generated 02-07-2015
*/
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Mooruk = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Term = (function () {

    /**
     * @class Term
     */

    function Term(variable, coefficient) {
        _classCallCheck(this, Term);

        this.variable = variable;
        this.coefficient = coefficient || 1;
    }

    _createClass(Term, [{
        key: "value",
        get: function get() {
            return this.coefficient * this.variable.value;
        }
    }]);

    return Term;
})();

var Expression = (function () {

    /**
     * @class Expression
     *
     * @param {Number} [constant] Initial constant (default: 0)
     * @param {Array.Term} [terms] Initial terms (default: 0)
     */

    function Expression(constant, terms) {
        _classCallCheck(this, Expression);

        this.constant = constant || 0;
        this.terms = terms ? terms : [];
    }

    _createClass(Expression, [{
        key: "add",

        /**
         * Adds an expression to this expression. The expression on which
         * `.add` is called is modified in the process.
         *
         * @param {Expression} expression Expression to append
         * @return {Expression} this
         */
        value: function add(expression) {
            this.constant += expression.constant;
            this.terms.push.apply(this.terms, expression.terms);
            return this;
        }
    }, {
        key: "multiply",

        /**
         * Multiplies a coefficient with this expression. The expression on which
         * `.multiply` is called is modified in the process.
         *
         * @param {Number} coefficient Coefficient to multiply with
         * @return {Expression} this
         */
        value: function multiply(coefficient) {
            this.constant *= coefficient;
            for (var i = 0, l = this.terms.length; i < l; i++) {
                this.terms[i].coefficient *= coefficient;
            }
            return this;
        }
    }, {
        key: "value",
        get: function get() {
            var result = this.constant;
            for (var i = 0; i < this.terms.length; i++) {
                result += this.terms[i].value;
            }
            return result;
        }
    }], [{
        key: "fromVariable",

        /**
         * Creates an expression from a variable.
         *
         * @param {Object} variable Variable created through `solver.createVariable`.
         * @return {Expression} expression
         */
        value: function fromVariable(variable) {
            return new Expression(0, [new Term(variable)]);
        }
    }, {
        key: "fromConstant",

        /**
         * Creates an expression from a constant value.
         *
         * @param {Number} constant Constant value
         * @return {Expression} expression
         */
        value: function fromConstant(constant) {
            return new Expression(constant);
        }
    }]);

    return Expression;
})();

exports.Term = Term;
exports.Expression = Expression;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function nearZero(value) {
    return value < 0.0 ? -value < 1.0e-8 : value < 1.0e-8;
}

var Row = (function () {
    function Row(constant, row) {
        _classCallCheck(this, Row);

        this.cells = {}; // Symbol -> Number
        this.constant = constant || 0;
        if (row) {
            this.constant = row.constant;
            for (var symbol in row.cells) {
                this.cells[symbol] = row.cells[symbol];
            }
        }
    }

    _createClass(Row, [{
        key: "add",
        value: function add(value) {
            this.constant += value;
            return this.constant;
        }
    }, {
        key: "insertSymbol",
        value: function insertSymbol(symbol, coefficient) {
            coefficient = coefficient || 1;
            if (nearZero(this.cells[symbol] = (this.cells[symbol] || 0) + coefficient)) {
                delete this.cells[symbol];
            }
        }
    }, {
        key: "insertRow",
        value: function insertRow(row, coefficient) {
            coefficient = coefficient || 1;
            this.constant += row.constant * coefficient;
            for (var symbol in row.cells) {
                var val = this.cells[symbol] || 0;
                if (nearZero(this.cells[symbol] = val + row.cells[symbol] * coefficient)) {
                    delete this.cells[symbol];
                }
            }
        }
    }, {
        key: "remove",
        value: function remove(symbol) {
            delete this.cells[symbol];
        }
    }, {
        key: "reverseSign",
        value: function reverseSign() {
            this.constant = -this.constant;
            for (var symbol in this.cells) {
                this.cells[symbol] = -this.cells[symbol];
            }
        }
    }, {
        key: "solveFor",
        value: function solveFor(symbol, rhs) {
            if (rhs) {
                this.insertSymbol(symbol, -1.0);
                symbol = rhs;
            }
            var coeff = -1.0 / this.cells[symbol];
            delete this.cells[symbol];
            this.constant *= coeff;
            for (var key in this.cells) {
                this.cells[key] *= coeff;
            }
        }
    }, {
        key: "coefficientFor",
        value: function coefficientFor(symbol) {
            return this.cells[symbol] || 0;
        }
    }, {
        key: "substitute",
        value: function substitute(symbol, row) {
            var coefficient = this.cells[symbol];
            if (coefficient !== undefined) {
                delete this.cells[symbol];
                this.insertRow(row, coefficient);
            }
        }
    }, {
        key: "empty",
        get: function get() {
            for (var symbol in this.cells) {
                //eslint-disable-line no-unused-vars
                return false;
            }
            return true;
        }
    }]);

    return Row;
})();

exports["default"] = Row;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
/**
 * Mooruk is a lightweight and fast cassowary constraint solver based on the [Kiwi C++ implementation](https://github.com/nucleic/kiwi).
 * A mooruk is a small(er) species of Cassowary noted for its agility in running and leaping.
 * Mooruk is about 3x faster and 4x smaller compared to Cassowary.js. It is built for speed and low
 * memory consumption. It contains no syntaxtical sugar whatsoever and intends to be as lean and mean
 * as possible.
 *
 * ### Index
 *
 * |Entity|Type|Description|
 * |---|---|---|
 * |[Solver](#mooruksolver)|`class`|Constraint solver class.|
 * |[SolverError](#mooruksolver)|`class`|Error object thrown by the Solver class.|
 * |[Term](#moorukterm)|`class`|Term inside an expression.|
 * |[Expression](#moorukexpression)|`class`|Expression class.|
 * |[Operator](#moorukoperator--enum)|`enum`|Relational constraint operators.|
 * |[Strength](#moorukstrength--object)|`namespace`|Default strengths + strength creation.|
 *
 * ### API Reference
 *
 * @module Mooruk
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _RowEs6 = require('./Row.es6');

var _RowEs62 = _interopRequireDefault(_RowEs6);

var _ExpressionEs6 = require('./Expression.es6');

var Symbol = {
    SLACK: 'S',
    ERROR: 'R',
    DUMMY: 'D',
    EXTERNAL: 'E',
    CONSTRAINT: 'C'
};

/**
 * @namespace
 */
var Operator = {

    /** Less or equal */
    LEQ: 1,

    /** Equal */
    EQU: 0,

    /** Greater or equal */
    GEQ: -1
};

function createStrength(a, b, c) {
    return c + b * 1000 + a * 1000000;
}

/**
 * @namespace
 */
var Strength = {

    /**
     * Creates a strength from a strong, medium and weak component.
     *
     * ```strength = c + (b * 1000) + (a * 1000000)```
     *
     * @function
     * @param {Number} a Strong component
     * @param {Number} b Medium component
     * @param {Number} c Weak component
     * @return {Number} strength
     */
    create: createStrength,

    /**
     * Required strength.
     */
    REQUIRED: createStrength(1000, 1000, 1000),

    /**
     * Strong strength.
     */
    STRONG: createStrength(1, 0, 0),

    /**
     * Medium strength.
     */
    MEDIUM: createStrength(0, 1, 0),

    /**
     * Weak strength.
     */
    WEAK: createStrength(0, 0, 1)
};

function nearZero(value) {
    return value < 0.0 ? -value < 1.0e-8 : value < 1.0e-8;
}

var Solver = (function () {

    /**
     * @class Solver
     */

    function Solver() {
        _classCallCheck(this, Solver);

        this._nextId = 1;
        this._constraints = {}; // Constraint.symbol -> Tag
        this._rows = {}; // Symbol -> Row
        this._vars = {}; // Symbol -> Variable
        this._edits = {}; // Symbol -> EditInfo
        this._infeasibleRows = []; // Symbol
        this._objective = new _RowEs62['default']();
        //this._artificial = undefined;
    }

    _createClass(Solver, [{
        key: 'createVariable',

        /**
         * Creates new variabl to be used with the solver.
         *
         * @param {Number} [value] Initial value.
         * @return {Object} Variable object contaning a .value property.
         */
        value: function createVariable(value) {
            return {
                value: value || 0,
                symbol: this._createSymbol(Symbol.EXTERNAL)
            };
        }
    }, {
        key: 'createConstraint',

        /**
         * Creates a constraint which can be added to the solver.
         *
         * @param {Expression} expr1 Expression 1.
         * @param {Operator} operator Equality operator.
         * @param {Expression} expr2 Expression 2.
         * @param {Number} [strength] Constraint strength.
         * @return {Object} Created constraint
         */
        value: function createConstraint(expr1, operator, expr2, strength) {
            if (!operator) {
                // EQU
                return this._createConstraint(expr1.add(expr2.multiply(-1)), operator, strength);
            } else {
                throw new SolverError({ name: 'InternalSolverError', message: 'Not yet implemented' });
            }
        }
    }, {
        key: 'addConstraint',

        /**
         * Adds a constraint to the solver.
         *
         * @param {Constraint} constraint
         * @return {Solver} this
         */
        value: function addConstraint(constraint) {
            if (this._constraints[constraint.symbol]) {
                throw new SolverError({ name: 'DuplicateConstraintError', message: 'The constraint has not been added to the solver.', constraint: constraint });
            }

            //
            // Create row
            //
            var tag = {
                constraint: constraint
                //,marker: undefined,
                //other: undefined
            };
            var row = this._createRow(constraint, tag);

            //
            // Choose subject
            //
            var subject = undefined;
            for (var symbol in row.cells) {
                if (symbol.charAt(0) === Symbol.EXTERNAL) {
                    subject = symbol;
                    break;
                }
            }
            if (!subject) {
                if ((tag.marker.charAt(0) === Symbol.SLACK || tag.marker.charAt(0) === Symbol.ERROR) && row.coefficientFor(tag.marker) < 0) {
                    subject = tag.marker;
                } else if ((tag.other.charAt(0) === Symbol.SLACK || tag.other.charAt(0) === Symbol.ERROR) && row.coefficientFor(tag.other) < 0) {
                    subject = tag.other;
                }
            }

            // If chooseSubject could find a valid entering symbol, one
            // last option is available if the entire row is composed of
            // dummy variables. If the constant of the row is zero, then
            // this represents redundant constraints and the new dummy
            // marker can enter the basis. If the constant is non-zero,
            // then it represents an unsatisfiable constraint.
            if (!subject) {
                var allDumies = true;
                for (var symbol in row.cells) {
                    if (symbol.charAt(0) !== Symbol.DUMMY) {
                        allDumies = false;
                        break;
                    }
                }
                if (allDumies) {
                    if (!nearZero(row.constant)) {
                        throw new SolverError({ name: 'UnsatisfiableConstraintError', message: 'The constraint can not be satisfied.', constraint: constraint });
                    }
                    subject = tag.marker;
                }
            }

            // If an entering symbol still isn't found, then the row must
            // be added using an artificial variable. If that fails, then
            // the row represents an unsatisfiable constraint.
            if (!subject) {
                if (!this._addWithArtificialVariable(row)) {
                    throw new SolverError({ name: 'UnsatisfiableConstraintError', message: 'The constraint can not be satisfied.', constraint: constraint });
                }
            } else {
                row.solveFor(subject);
                this._substitute(subject, row);
                this._rows[subject] = row;
            }
            this._constraints[constraint.symbol] = tag;

            //
            // Optimize
            //
            this._optimize(this._objective);
            return this;
        }
    }, {
        key: 'removeConstraint',

        /**
         * Removes a constraint from the solver.
         *
         * @param {Constraint} constraint
         * @return {Solver} this
         */
        value: function removeConstraint(constraint) {
            var tag = this._constraints[constraint.symbol];
            if (!tag) {
                throw new SolverError({ name: 'UnknownConstraintError', message: 'The constraint has not been added to the solver.', constraint: constraint });
            }
            delete this._constraints[constraint.symbol];

            // Remove the error effects from the objective function
            // *before* pivoting, or substitutions into the objective
            // will lead to incorrect solver results.
            if (tag.marker.charAt(0) === Symbol.ERROR) {
                this._removeMarkerEffects(tag.marker, constraint.strength);
            }
            if (tag.other.charAt(0) === Symbol.ERROR) {
                this._removeMarkerEffects(tag.other, constraint.strength);
            }

            // If the marker is basic, simply drop the row. Otherwise,
            // pivot the marker into the basis and then drop the row.
            var row = this._rows[tag.marker];
            if (row) {
                delete this._rows[tag.marker];
            } else {
                var leaving = this._getMarkerLeavingRow(tag.marker);
                if (!leaving) {
                    throw new SolverError({ name: 'InternalSolverError', message: 'Failed to find leaving row' });
                }
                row = this._rows[leaving];
                delete this._rows[leaving];
                row.solveFor(leaving, tag.marker);
                this._substitute(tag.marker, row);
            }

            // Optimizing after each constraint is removed ensures that the
            // solver remains consistent. It makes the solver api easier to
            // use at a small tradeoff for speed.
            this._optimize(this._objective);
            return this;
        }
    }, {
        key: 'hasConstraint',

        /**
         * Checks whether the solver has the given constraint.
         *
         * @param {Object} constraint
         * @return {Bool} true/false
         */
        value: function hasConstraint(constraint) {
            return this._constraints[constraint.symbol] !== undefined;
        }
    }, {
        key: 'addEditVariable',

        /**
         * Add an edit variable to the solver.
         *
         * @param {Variable} variable
         * @param {Number} strength
         * @return {Solver} this
         */
        value: function addEditVariable(variable, strength) {
            strength = strength || Strength.STRONG;
            if (this._edits[variable.symbol]) {
                throw new SolverError({ name: 'DuplicateEditVariableError', message: 'The edit variable has already been added to the solver.', variable: variable });
            }
            if (strength === Strength.REQUIRED) {
                throw new SolverError({ name: 'BadRequiredStrengthError', message: 'A required strength cannot be used in this context.' });
            }
            var editInfo = {
                constraint: this._createConstraint(new _ExpressionEs6.Expression(0, [new _ExpressionEs6.Term(variable)]), 0, strength),
                constant: 0
            };
            this.addConstraint(editInfo.constraint);
            editInfo.tag = this._constraints[editInfo.constraint.symbol];
            this._edits[variable.symbol] = editInfo;
            return this;
        }
    }, {
        key: 'removeEditVariable',

        /**
         * Removes an edit variable from the solver.
         *
         * @param {Variable} variable
         * @return {Solver} this
         */
        value: function removeEditVariable(variable) {
            var editInfo = this._edits[variable.symbol];
            if (!editInfo) {
                throw new SolverError({ name: 'UnknownEditVariableError', message: 'The edit variable has not been added to the solver.', variable: variable });
            }
            this.removeConstraint(editInfo.constraint);
            delete this._edits[variable.symbol];
            return this;
        }
    }, {
        key: 'hasEditVariable',

        /**
         * Checks whether the solver has the given edit variable.
         *
         * @param {Object} variable Variable created with `createVariable`
         * @return {Bool} true/false
         */
        value: function hasEditVariable(variable) {
            return this._edits[variable.symbol] !== undefined;
        }
    }, {
        key: 'suggestValue',

        /**
         * Suggest a value for the given edit variable.
         *
         * @param {Object} variable Variable created with `createVariable`
         * @param {Number} value
         * @return {Solver} this
         */
        value: function suggestValue(variable, value) {
            var editInfo = this._edits[variable.symbol];
            if (!editInfo) {
                throw new SolverError({ name: 'UnknownEditVariableError', message: 'The edit variable has not been added to the solver.', variable: variable });
            }

            var delta = value - editInfo.constant;
            editInfo.constant = value;

            // Check first if the positive error variable is basic.
            var row = this._rows[editInfo.tag.marker];
            if (row) {
                if (row.add(-delta) < 0) {
                    this._infeasibleRows.push(editInfo.tag.marker);
                }
                this._dualOptimize();
                return this;
            }

            // Check next if the negative error variable is basic.
            row = this._rows[editInfo.tag.other];
            if (row) {
                if (row.add(delta) < 0) {
                    this._infeasibleRows.push(editInfo.tag.other);
                }
                this._dualOptimize();
                return this;
            }

            // Otherwise update each row where the error variables exist.
            for (var symbol in this._rows) {
                row = this._rows[symbol];
                var coeff = row.coefficientFor(editInfo.tag.marker);
                if (coeff !== 0 && row.add(delta * coeff) < 0 && symbol.charAt(0) !== Symbol.EXTERNAL) {
                    this._infeasibleRows.push(symbol);
                }
            }
            this._dualOptimize();
            return this;
        }
    }, {
        key: 'updateVariables',

        /**
         * Updates the external variables.
         *
         * @return {Solver} this
         */
        value: function updateVariables() {
            for (var symbol in this._vars) {
                var row = this._rows[symbol];
                this._vars[symbol].value = row ? row.constant : 0;
            }
            return this;
        }
    }, {
        key: '_createConstraint',

        /******************* PRIVATE *****************/

        value: function _createConstraint(expression, operator, strength) {
            return {
                expression: expression,
                operator: operator,
                strength: strength || Strength.REQUIRED,
                symbol: this._createSymbol(Symbol.CONSTRAINT)
            };
        }
    }, {
        key: '_createSymbol',
        value: function _createSymbol(type) {
            return type + this._nextId++;
        }
    }, {
        key: '_createRow',
        value: function _createRow(constraint, tag) {
            var expr = constraint.expression;
            var row = new _RowEs62['default'](expr.constant);

            // Substitute the current basic variables into the row.
            for (var i = 0, l = expr.terms.length; i < l; i++) {
                var term = expr.terms[i];
                if (!nearZero(term.coefficient)) {
                    this._vars[term.variable.symbol] = term.variable;
                    var findRow = this._rows[term.variable.symbol];
                    if (findRow) {
                        row.insertRow(findRow, term.coefficient);
                    } else {
                        row.insertSymbol(term.variable.symbol, term.coefficient);
                    }
                }
            }

            // Add the necessary slack, error, and dummy variables.
            if (constraint.operator) {
                tag.marker = this._createSymbol(Symbol.SLACK);
                row.insertSymbol(tag.marker, constraint.operator);
                if (constraint.strength < Strength.REQUIRED) {
                    tag.other = this._createSymbol(Symbol.ERROR);
                    row.insertSymbol(tag.other, -constraint.operator);
                    this._objective.insertSymbol(tag.other, constraint.strength);
                }
            } else {
                // Operator.EQU
                if (constraint.strength < Strength.REQUIRED) {
                    tag.marker = this._createSymbol(Symbol.ERROR); // errplus
                    tag.other = this._createSymbol(Symbol.ERROR); // errminus;
                    row.insertSymbol(tag.marker, -1.0); // v = eplus - eminus
                    row.insertSymbol(tag.other, 1.0); // v - eplus + eminus = 0
                    this._objective.insertSymbol(tag.marker, constraint.strength);
                    this._objective.insertSymbol(tag.other, constraint.strength);
                } else {
                    tag.marker = this._createSymbol(Symbol.DUMMY);
                    row.insertSymbol(tag.marker);
                }
            }

            // Ensure the row as a positive constant.
            if (row.constant < 0) {
                row.reverseSign();
            }

            return row;
        }
    }, {
        key: '_removeMarkerEffects',
        value: function _removeMarkerEffects(marker, strength) {
            var row = this._rows[marker];
            if (row) {
                this._objective.insertRow(row, -strength);
            } else {
                this._objective.insertSymbol(marker, -strength);
            }
        }
    }, {
        key: '_getDualEnteringSymbol',
        value: function _getDualEnteringSymbol(row) {
            var entering = undefined;
            var ratio = Number.MAX_VALUE;
            for (var symbol in row.cells) {
                if (symbol.charAt(0) !== Symbol.DUMMY && row.cells[symbol] > 0) {
                    var r = this._objective.coefficientFor(symbol) / row.cells[symbol];
                    if (r < ratio) {
                        ratio = r;
                        entering = symbol;
                    }
                }
            }
            return entering;
        }
    }, {
        key: '_getMarkerLeavingRow',
        value: function _getMarkerLeavingRow(marker) {
            var dmax = Number.MAX_VALUE;
            var r1 = dmax;
            var r2 = dmax;
            var first = undefined;
            var second = undefined;
            var third = undefined;
            for (var symbol in this._rows) {
                var row = this._rows[symbol];
                var c = row.coefficientFor(marker);
                if (!c) {
                    continue;
                }
                if (symbol.charAt(0) === Symbol.EXTERNAL) {
                    third = symbol;
                } else if (c < 0) {
                    var r = row.constant / c;
                    if (r < r1) {
                        r1 = r;
                        first = symbol;
                    }
                } else {
                    var r = row.constant / c;
                    if (r < r2) {
                        r2 = r;
                        second = symbol;
                    }
                }
            }
            return first || second || third;
        }
    }, {
        key: '_optimize',
        value: function _optimize(objectiveRow) {
            for (;;) {
                var entering = undefined;
                for (var symbol in objectiveRow.cells) {
                    if (symbol.charAt(0) !== Symbol.DUMMY && objectiveRow.cells[symbol] < 0) {
                        entering = symbol;
                        break;
                    }
                }
                if (!entering) {
                    return;
                }
                var ratio = Number.MAX_VALUE;
                var leaving = undefined;
                for (var symbol in this._rows) {
                    if (symbol.charAt(0) !== Symbol.EXTERNAL) {
                        var temp = this._rows[symbol].coefficientFor(entering);
                        if (temp < 0) {
                            var tempRatio = -this._rows[symbol].constant / temp;
                            if (tempRatio < ratio) {
                                ratio = tempRatio;
                                leaving = symbol;
                            }
                        }
                    }
                }
                if (!leaving) {
                    throw new SolverError({ name: 'InternalSolverError', message: 'The objective is unbounded.' });
                }
                // pivot the entering symbol into the basis
                var row = this._rows[leaving];
                delete this._rows[leaving];
                row.solveFor(leaving, entering);
                this._substitute(entering, row);
                this._rows[entering] = row;
            }
        }
    }, {
        key: '_dualOptimize',
        value: function _dualOptimize() {
            while (this._infeasibleRows.length) {
                var leaving = this._infeasibleRows.pop();
                var row = this._rows[leaving];
                if (row && row.constant < 0) {
                    var entering = this._getDualEnteringSymbol(row);
                    if (!entering) {
                        throw new SolverError({ name: 'InternalSolverError', message: 'Dual optimize failed.' });
                    }
                    // pivot the entering symbol into the basis
                    delete this._rows[leaving];
                    row.solveFor(leaving, entering);
                    this._substitute(entering, row);
                    this._rows[entering] = row;
                }
            }
        }
    }, {
        key: '_substitute',
        value: function _substitute(symbol, row) {
            for (var key in this._rows) {
                var findRow = this._rows[key];
                findRow.substitute(symbol, row);
                if (key.charAt(0) !== Symbol.EXTERNAL && findRow.constant < 0) {
                    this._infeasibleRows.push(key);
                }
            }
            this._objective.substitute(symbol, row);
            if (this._artificial) {
                this._artificial.substitute(symbol, row);
            }
        }
    }, {
        key: '_anyPivotableSymbol',
        value: function _anyPivotableSymbol(row) {
            for (var symbol in row.cells) {
                if (symbol.charAt(0) === Symbol.SLACK || symbol.charAt(0) === Symbol.ERROR) {
                    return symbol;
                }
            }
        }
    }, {
        key: '_addWithArtificialVariable',
        value: function _addWithArtificialVariable(row) {

            // Create and add the artificial variable to the tableau
            var art = this._createSymbol(Symbol.SLACK);
            this._rows[art] = new _RowEs62['default'](row);
            this._artificial = new _RowEs62['default'](row);

            // Optimize the artificial objective. This is successful
            // only if the artificial objective is optimized to zero.
            this._optimize(this._artificial);
            var success = nearZero(this._artificial.constant);
            this._artificial = undefined;

            // If the artificial variable is basic, pivot the row so that
            // it becomes basic. If the row is constant, exit early.
            var findRow = this._rows[art];
            if (findRow) {
                delete this._rows[art];
                if (findRow.empty) {
                    return success;
                }
                var entering = this._anyPivotableSymbol(findRow);
                if (!entering) {
                    return false; // unsatisfiable (will this ever happen?)
                }
                findRow.solveFor(art, entering);
                this._substitute(entering, findRow);
                this._rows[entering] = findRow;
            }

            // Remove the artificial variable from the tableau.
            for (var key in this._rows) {
                this._rows[key].remove(art);
            }
            this._objective.remove(art);
            return success;
        }
    }]);

    return Solver;
})();

/**
 * @class SolverError
 *
 * Error object thrown by the Solver.
 */
function SolverError(properties) {
    for (var key in properties) {
        this[key] = properties[key];
    }
}
SolverError.prototype = Object.create(Error.prototype);
SolverError.prototype.constructor = SolverError;

var Mooruk = {
    Solver: Solver,
    Expression: _ExpressionEs6.Expression,
    Term: _ExpressionEs6.Term,
    SolverError: SolverError,
    Operator: Operator,
    Strength: Strength
};

exports['default'] = Mooruk;
module.exports = exports['default'];

},{"./Expression.es6":1,"./Row.es6":2}]},{},[3])(3)
});
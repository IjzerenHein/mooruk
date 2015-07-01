import Errors from './Errors.es6';
import Row from './Row.es6';
import {Term, Expression} from './Expression.es6';

const Symbol = {
    INVALID: 'I',
    SLACK: 'S',
    ERROR: 'R',
    DUMMY: 'D',
    EXTERNAL: 'E',
    CONSTRAINT: 'C'
};

const Operator = {
    LEQ: 1,
    EQU: 0,
    GEQ: -1
};

function createStrength(a, b, c) {
    return c + (b * 1000) + (a * 1000000);
}

const Strength = {
    create: createStrength,
    REQUIRED: createStrength(1000, 1000, 1000),
    STRONG: createStrength(1, 0, 0),
    MEDIUM: createStrength(0, 1, 0),
    WEAK: createStrength(0, 0, 1)
};

function nearZero(value) {
    return value < 0.0 ? -value < 1.0e-8 : value < 1.0e-8;
}

class Solver {

    /**
     * @class Solver
     */
    constructor() {
        this._nextId = 1;
        this._constraints = {}; // Constraint.symbol -> Tag
        this._rows = {}; // Symbol -> Row
        this._vars = {}; // Symbol -> Variable
        this._edits = {}; // Symbol -> EditInfo
        this._infeasibleRows = []; // Symbol
        this._objective = new Row();
        //this._artificial = undefined;
    }

    /**
     * Creates new variabl to be used with the solver.
     *
     * @param {Number} [value] Initial value.
     * @return {Object} Variable object contaning a .value property.
     */
    createVariable(value) {
        return {
            value: value || 0,
            symbol: this._createSymbol(Symbol.EXTERNAL)
        };
    }

    /**
     * Creates a constraint which can be added to the solver.
     *
     * @param {Expression} expr1 Expression 1.
     * @param {Operator} operator Equality operator.
     * @param {Expression} expr2 Expression 2.
     * @param {Number} [strength] Constraint strength.
     * @return {Object} Created constraint
     */
    createConstraint(expr1, operator, expr2, strength) {
        if (!operator) { // EQU
            return this._createConstraint(expr1.add(expr2.multiply(-1)), operator, strength);
        }
        else {
            throw new Errors.InternalSolverError('Not yet implemented');
        }
    }

    /**
     * Adds a constraint to the solver.
     *
     * @param {Constraint} constraint
     * @return {Solver} this
     */
    addConstraint(constraint) {
        if (this._constraints[constraint.symbol]) {
            throw new Errors.DuplicateConstraintError(constraint);
        }

        const tag = {
            constraint: constraint,
            marker: Symbol.INVALID,
            other: Symbol.INVALID
        };
        const row = this._createRow(constraint, tag);

        let subject = this._chooseSubject(row, tag);
        if ((subject === Symbol.INVALID) && this._allDummies(row)){
            if (!nearZero(row.constant)) {
                throw new Errors.UnsatisfiableConstraintError(constraint);
            }
            subject = tag.marker;
        }

        if (subject === Symbol.INVALID) {
            if (!this._addWithArtificialVariable(row)) {
                throw new Errors.UnsatisfiableConstraintError(constraint);
            }
        }
        else {
            row.solveFor(subject);
            this._substitute(subject, row);
            this._rows[subject] = row;
        }
        this._constraints[constraint.symbol] = tag;

        this._optimize(this._objective);

        return this;
    }

    /**
     * Removes a constraint from the solver.
     *
     * @param {Constraint} constraint
     * @return {Solver} this
     */
    removeConstraint(constraint) {
        const tag = this._constraints[constraint.symbol];
        if (!tag) {
            throw new Errors.UnknownConstraintError(constraint);
        }
        delete this._constraints[constraint.symbol];

        // Remove the error effects from the objective function
        // *before* pivoting, or substitutions into the objective
        // will lead to incorrect solver results.
        this._removeConstraintEffects(constraint, tag); // TODO

        // If the marker is basic, simply drop the row. Otherwise,
        // pivot the marker into the basis and then drop the row.
        let row = this._rows[tag.marker];
        if (row) {
            delete this._rows[tag.marker];
        }
        else {
            const leaving = this._getMarkerLeavingRow(tag.marker);
            if (leaving === Symbol.INVALID) {
                throw new Errors.InternalSolverError('Failed to find leaving row');
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

    /**
     * Checks whether the solver has the given constraint.
     *
     * @param {Object} constraint
     * @return {Bool} true/false
     */
    hasConstraint(constraint) {
        return this._constraints[constraint.symbol] !== undefined;
    }

    /**
     * Add an edit variable to the solver.
     *
     * @param {Variable} variable
     * @param {Number} strength
     * @return {Solver} this
     */
    addEditVariable(variable, strength) {
        strength = strength || Strength.STRONG;
        if (this._edits[variable.symbol]) {
            throw new Errors.DuplicateEditVariable(variable);
        }
        if (strength === Strength.REQUIRED) {
            throw new Errors.BadRequiredStrengthError();
        }
        const editInfo = {
            constraint: this._createConstraint(new Expression(0, [new Term(variable)]), 0, strength),
            constant: 0
        };
        this.addConstraint(editInfo.constraint);
        editInfo.tag = this._constraints[editInfo.constraint.symbol];
        this._edits[variable.symbol] = editInfo;
        return this;
    }

    /**
     * Removes an edit variable from the solver.
     *
     * @param {Variable} variable
     * @return {Solver} this
     */
    removeEditVariable(variable) {
        const editInfo = this._edits[variable.symbol];
        if (!editInfo) {
            throw new Errors.UnknownEditVariableError(variable);
        }
        this.removeConstraint(editInfo.constraint);
        delete this._edits[variable.symbol];
        return this;
    }

    /**
     * Checks whether the solver has the given edit variable.
     *
     * @param {Object} variable Variable created with `createVariable`
     * @return {Bool} true/false
     */
    hasEditVariable(variable) {
        return this._edits[variable.symbol] !== undefined;
    }

    /**
     * Suggest a value for the given edit variable.
     *
     * @param {Object} variable Variable created with `createVariable`
     * @param {Number} value
     * @return {Solver} this
     */
    suggestValue(variable, value) {
        const editInfo = this._edits[variable.symbol];
        if (!editInfo) {
            throw new Errors.UnknownEditVariableError(variable);
        }

        const delta = value - editInfo.constant;
        editInfo.constant = value;

        // Check first if the positive error variable is basic.
        let row = this._rows[editInfo.tag.marker];
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
        for (let symbol in this._rows) {
            row = this._rows[symbol];
            const coeff = row.coefficientFor(editInfo.tag.marker);
            if ((coeff !== 0) &&
                (row.add(delta * coeff) < 0) &&
                (symbol.charAt(0) !== Symbol.EXTERNAL)) {
                this._infeasibleRows.push(symbol);
            }
        }
        this._dualOptimize();
        return this;
    }

    /**
     * Updates the external variables.
     *
     * @return {Solver} this
     */
    updateVariables() {
        for (let symbol in this._vars) {
            let row = this._rows[symbol];
            this._vars[symbol].value = row ? row.constant : 0;
        }
        return this;
    }

    /******************* PRIVATE *****************/

    _createConstraint(expression, operator, strength) {
        return {
            expression: expression,
            operator: operator,
            strength: strength || Strength.REQUIRED,
            symbol: this._createSymbol(Symbol.CONSTRAINT)
        };
    }

    _createSymbol(type) {
        return type + this._nextId++;
    }

    _chooseSubject(row, tag) {
        for (let symbol in row.cells) {
            if (symbol.charAt(0) === Symbol.EXTERNAL) {
                return symbol;
            }
        }
        if ((tag.marker.charAt(0) === Symbol.SLACK) || (tag.marker.charAt(0) === Symbol.ERROR)) {
            if (row.coefficientFor(tag.marker) < 0){
                return tag.marker;
            }
        }
        if ((tag.other.charAt(0) === Symbol.SLACK) || (tag.other.charAt(0) === Symbol.ERROR)) {
            if (row.coefficientFor(tag.other) < 0){
                return tag.other;
            }
        }
        return Symbol.INVALID;
    }

    _allDummies(row) {
        for (let symbol in row.cells) {
            if (symbol.charAt(0) !== Symbol.DUMMY) {
                return false;
            }
        }
        return true;
    }

    _createRow(constraint, tag) {
        const expr = constraint.expression;
        const row = new Row(expr.constant);

        // Substitute the current basic variables into the row.
        for (let i = 0, l = expr.terms.length; i < l; i++) {
            const term = expr.terms[i];
            if (!nearZero(term.coefficient)){
                this._vars[term.variable.symbol] = term.variable;
                const findRow = this._rows[term.variable.symbol];
                if (findRow) {
                    row.insertRow(findRow, term.coefficient);
                }
                else {
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
        }
        else { // Operator.EQU
            if (constraint.strength < Strength.REQUIRED) {
                tag.marker = this._createSymbol(Symbol.ERROR); // errplus
                tag.other = this._createSymbol(Symbol.ERROR); // errminus;
                row.insertSymbol(tag.marker, -1.0); // v = eplus - eminus
                row.insertSymbol(tag.other, 1.0); // v - eplus + eminus = 0
                this._objective.insertSymbol(tag.marker, constraint.strength);
                this._objective.insertSymbol(tag.other, constraint.strength);
            }
            else {
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

    _removeConstraintEffects(constraint, tag) {
        if (tag.marker.charAt(0) === Symbol.ERROR) {
            this._removeMarkerEffects(tag.marker, constraint.strength);
        }
        if (tag.other.charAt(0) === Symbol.ERROR) {
            this._removeMarkerEffects(tag.other, constraint.strength);
        }
    }

    _removeMarkerEffects(marker, strength) {
        const row = this._rows[marker];
        if (row) {
            this._objective.insertRow(row, -strength);
        }
        else {
            this._objective.insertSymbol(marker, -strength);
        }
    }

    _getDualEnteringSymbol(row) {
        let entering = Symbol.INVALID;
        let ratio = Number.MAX_VALUE;
        for (let symbol in row.cells) {
            if ((symbol.charAt(0) !== Symbol.DUMMY) && (row.cells[symbol] > 0)) {
                const r = this._objective.coefficientFor(symbol) / row.cells[symbol];
                if (r < ratio) {
                    ratio = r;
                    entering = symbol;
                }
            }
        }
        return entering;
    }

    _getEnteringSymbol(row) {
        for (let symbol in row.cells) {
            if ((symbol.charAt(0) !== Symbol.DUMMY) && (row.cells[symbol] < 0)) {
                return symbol;
            }
        }
        return Symbol.INVALID;
    }

    _getLeavingSymbol(entering) {
        let ratio = Number.MAX_VALUE;
        let found = Symbol.INVALID;
        for (let symbol in this._rows) {
            if (symbol.charAt(0) !== Symbol.EXTERNAL) {
                const temp = this._rows[symbol].coefficientFor(entering);
                if (temp < 0) {
                    const tempRatio = -this._rows[symbol].constant / temp;
                    if (tempRatio < ratio) {
                        ratio = tempRatio;
                        found = symbol;
                    }
                }
            }
        }
        return found;
    }

    _getMarkerLeavingRow(marker) {
        const dmax = Number.MAX_VALUE;
        let r1 = dmax;
        let r2 = dmax;
        let first;
        let second;
        let third;
        for (var symbol in this._rows) {
            const row = this._rows[symbol];
            const c = row.coefficientFor(marker);
            if (!c) {
                continue;
            }
            if (symbol.charAt(0) === Symbol.EXTERNAL) {
                third = symbol;
            }
            else if (c < 0) {
                const r = row.constant / c;
                if (r < r1) {
                    r1 = r;
                    first = symbol;
                }
            }
            else {
                const r = row.constant / c;
                if (r < r2) {
                    r2 = r;
                    second = symbol;
                }
            }
        }
        return first || second || third || Symbol.INVALID;
    }

    _optimize(objectiveRow) {
        for (;;) {
            const entering = this._getEnteringSymbol(objectiveRow);
            if (entering === Symbol.INVALID) {
                return;
            }
            const leaving = this._getLeavingSymbol(entering);
            if (leaving === Symbol.INVALID) {
                throw new Errors.InternalSolverError('The objective is unbounded.');
            }
            // pivot the entering symbol into the basis
            const row = this._rows[leaving];
            delete this._rows[leaving];
            row.solveFor(leaving, entering);
            this._substitute(entering, row);
            this._rows[entering] = row;
        }
    }

    _dualOptimize() {
        while (this._infeasibleRows.length){
            const leaving = this._infeasibleRows.pop();
            const row = this._rows[leaving];
            if (row && (row.constant < 0)) {
                const entering = this._getDualEnteringSymbol(row);
                if (entering === Symbol.INVALID) {
                    throw new Errors.InternalSolverError('Dual optimize failed.');
                }
                // pivot the entering symbol into the basis
                delete this._rows[leaving];
                row.solveFor(leaving, entering);
                this._substitute(entering, row);
                this._rows[entering] = row;
            }
        }
    }

    _substitute(symbol, row) {
        for (let key in this._rows) {
            let findRow = this._rows[key];
            findRow.substitute(symbol, row);
            if ((key.charAt(0) !== Symbol.EXTERNAL) && (findRow.constant < 0)) {
                this._infeasibleRows.push(key);
            }
        }
        this._objective.substitute(symbol, row);
        if (this._artificial) {
            this._artificial.substitute(symbol, row);
        }
    }

    _anyPivotableSymbol(row) {
        for (let symbol in row.cells) {
            if ((symbol.charAt(0) === Symbol.SLACK) || (symbol.charAt(0) === Symbol.ERROR)) {
                return symbol;
            }
        }
        return Symbol.INVALID;
    }

    _addWithArtificialVariable(row) {

        // Create and add the artificial variable to the tableau
        const art = this._createSymbol(Symbol.SLACK);
        this._rows[art] = new Row(row);
        this._artificial = new Row(row);

        // Optimize the artificial objective. This is successful
        // only if the artificial objective is optimized to zero.
        this._optimize(this._artificial);
        const success = nearZero(this._artificial.constant);
        this._artificial = undefined;

        // If the artificial variable is basic, pivot the row so that
        // it becomes basic. If the row is constant, exit early.
        const findRow = this._rows[art];
        if (findRow) {
            delete this._rows[art];
            if (findRow.empty) { // TODO
                return success;
            }
            const entering = this._anyPivotableSymbol(findRow);
            if (entering === Symbol.INVALID) {
                return false;  // unsatisfiable (will this ever happen?)
            }
            findRow.solveFor(art, entering);
            this._substitute(entering, findRow);
            this._rows[entering] = findRow;
        }

        // Remove the artificial variable from the tableau.
        for (let key in this._rows) {
            this._rows[key].remove(art);
        }
        this._objective.remove(art);
        return success;
    }
}

/**
 * Mooruk.
 *
 * A cassowary constraint solver built for speed and speed only...
 *
 * @namespace Mooruk
 * @property {Solver} Solver
 * @property {Expression} Expression
 * @property {Term} Term
 * @property {Errors} Errors
 * @property {Operator} Operator
 * @property {Strength} Strength
 */
var Mooruk = {
    Solver: Solver,
    Expression: Expression,
    Term: Term,
    Errors: Errors,
    Operator: Operator,
    Strength: Strength
};

export {Mooruk as default};

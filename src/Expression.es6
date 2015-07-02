class Term {

    /**
     * @class Term
     */
    constructor(variable, coefficient) {
        this.variable = variable;
        this.coefficient = coefficient || 1;
    }
    get value() {
        return this.coefficient * this.variable.value;
    }
}

class Expression {

    /**
     * @class Expression
     *
     * @param {Number} [constant] Initial constant (default: 0)
     * @param {Array.Term} [terms] Initial terms (default: 0)
     */
    constructor(constant, terms) {
        this.constant = constant || 0;
        this.terms = terms ? terms : [];
    }

    /**
     * Creates an expression from a variable.
     *
     * @param {Object} variable Variable created through `solver.createVariable`.
     * @return {Expression} expression
     */
    static fromVariable(variable) {
        return new Expression(0, [new Term(variable)]);
    }

    /**
     * Creates an expression from a constant value.
     *
     * @param {Number} constant Constant value
     * @return {Expression} expression
     */
    static fromConstant(constant) {
        return new Expression(constant);
    }

    get value() {
        let result = this.constant;
        for (var i = 0; i < this.terms.length; i++) {
            result += this.terms[i].value;
        }
        return result;
    }

    /**
     * Adds an expression to this expression. The expression on which
     * `.add` is called is modified in the process.
     *
     * @param {Expression} expression Expression to append
     * @return {Expression} this
     */
    add(expression) {
        this.constant += expression.constant;
        this.terms.push.apply(this.terms, expression.terms);
        return this;
    }

    /**
     * Multiplies a coefficient with this expression. The expression on which
     * `.multiply` is called is modified in the process.
     *
     * @param {Number} coefficient Coefficient to multiply with
     * @return {Expression} this
     */
    multiply(coefficient) {
        this.constant *= coefficient;
        for (var i = 0, l = this.terms.length; i < l; i++) {
            this.terms[i].coefficient *= coefficient;
        }
        return this;
    }
}

export {Term as Term};
export {Expression as Expression};

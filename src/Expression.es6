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
     */
    constructor(constant, terms) {
        this.constant = constant || 0;
        this.terms = terms ? terms : [];
    }
    static fromVariable(variable) {
        return new Expression(0, [new Term(variable)]);
    }
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
    add(expression) {
        this.constant += expression.constant;
        this.terms.push.apply(this.terms, expression.terms);
        return this;
    }
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

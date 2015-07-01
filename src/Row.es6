function nearZero(value) {
    return value < 0.0 ? -value < 1.0e-8 : value < 1.0e-8;
}

class Row {
    constructor(constant, row) {
        this.cells = {}; // Symbol -> Number
        this.constant = constant || 0;
        if (row) {
            this.constant = row.constant;
            for (let symbol in row.cells) {
                this.cells[symbol] = row.cells[symbol];
            }
        }
    }

    get empty() {
        for (let symbol in this.cells) { //eslint-disable-line no-unused-vars
            return false;
        }
        return true;
    }

    add(value) {
        this.constant += value;
        return this.constant;
    }

    insertSymbol(symbol, coefficient) {
        coefficient = coefficient || 1;
        if (nearZero(this.cells[symbol] = (this.cells[symbol] || 0) + coefficient)) {
            delete this.cells[symbol];
        }
    }

    insertRow(row, coefficient) {
        coefficient = coefficient || 1;
        this.constant += row.constant * coefficient;
        for (let symbol in row.cells) {
            let val = this.cells[symbol] || 0;
            if (nearZero(this.cells[symbol] = val + (row.cells[symbol] * coefficient))) {
                delete this.cells[symbol];
            }
        }
    }

    remove(symbol) {
        delete this.cells[symbol];
    }

    reverseSign() {
        this.constant = -this.constant;
        for (let symbol in this.cells) {
            this.cells[symbol] = -this.cells[symbol];
        }
    }

    solveFor(symbol, rhs) {
        if (rhs) {
            this.insertSymbol(symbol, -1.0);
            symbol = rhs;
        }
        const coeff = -1.0 / this.cells[symbol];
        delete this.cells[symbol];
        this.constant *= coeff;
        for (let key in this.cells) {
            this.cells[key] *= coeff;
        }
    }

    coefficientFor(symbol) {
        return this.cells[symbol] || 0;
    }

    substitute(symbol, row) {
        const coefficient = this.cells[symbol];
        if (coefficient !== undefined) {
            delete this.cells[symbol];
            this.insertRow(row, coefficient);
        }
    }
}
export {Row as default};

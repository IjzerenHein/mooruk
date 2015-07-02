/*global describe, it*/
var assert = (typeof window === 'undefined') ? require('assert') : window.chai.assert;
var Mooruk = (typeof window === 'undefined') ? require('../src/Solver.es6').default : window.Mooruk;
var Solver = Mooruk.Solver;
var Expression = Mooruk.Expression;
var Operator = Mooruk.Operator;
var SolverError = Mooruk.SolverError;

describe('Mooruk', function() {
    it('create Solver', function() {
        var solver = new Solver();
        assert(solver);
    });

    describe('Variable', function() {
        var solver = new Solver();
        var variable;
        it('create', function() {
            variable = solver.createVariable(100);
            assert(variable);
            assert.equal(100, variable.value);
        });
        it('addEditVariable', function() {
            solver.addEditVariable(variable);
            assert(solver.hasEditVariable(variable));
        });
        it('suggestValue', function() {
            solver.suggestValue(variable, 200);
            solver.updateVariables();
            assert.equal(200, variable.value);
        });
        it('removeEditVariable', function() {
            solver.removeEditVariable(variable);
            assert(!solver.hasEditVariable(variable));
        });
        it('Exception:DuplicateEditVariableError', function() {
            assert(!solver.hasEditVariable(variable));
            solver.addEditVariable(variable);
            assert(solver.hasEditVariable(variable));
            try {
                solver.addEditVariable(variable);
                assert(false);
            }
            catch (err) {
                assert(err instanceof SolverError);
                assert.equal(err.name, 'DuplicateEditVariableError');
            }
        });
        it('Exception:UnknownEditVariableError', function() {
            assert(solver.hasEditVariable(variable));
            solver.removeEditVariable(variable);
            assert(!solver.hasEditVariable(variable));
            try {
                solver.removeEditVariable(variable);
                assert(false);
            }
            catch (err) {
                assert(err instanceof SolverError);
                assert.equal(err.name, 'UnknownEditVariableError');
            }
        });
    });

    describe('Constraint', function() {
        var solver = new Solver();
        var vars = {};
        it('create Expression', function() {
            var expr = new Expression();
            assert(expr);
        });
        it('Constant left constraint (10)', function() {
            vars.left = solver.createVariable(0);
            var left = solver.createConstraint(Expression.fromVariable(vars.left), Operator.EQU, Expression.fromConstant(10));
            solver.addConstraint(left);
            solver.updateVariables();
            assert.equal(vars.left.value, 10);
        });
        it('Width edit variable (200)', function() {
            vars.width = solver.createVariable();
            solver.addEditVariable(vars.width);
            solver.suggestValue(vars.width, 200);
            solver.updateVariables();
            assert.equal(vars.width.value, 200);
        });
        it('Right === left + width (210)', function() {
            vars.right = solver.createVariable();
            var right = solver.createConstraint(Expression.fromVariable(vars.right), Operator.EQU, Expression.fromVariable(vars.left).add(Expression.fromVariable(vars.width)));
            solver.addConstraint(right);
            solver.updateVariables();
            assert.equal(vars.right.value, 210);
        });
        it('centerX === left + (width / 2) (110)', function() {
            vars.centerX = solver.createVariable();
            var centerX = solver.createConstraint(Expression.fromVariable(vars.centerX), Operator.EQU, Expression.fromVariable(vars.width).multiply(0.5).add(Expression.fromVariable(vars.left)));
            solver.addConstraint(centerX);
            solver.updateVariables();
            assert.equal(vars.centerX.value, 110);
        });
    });
});

var assert = (typeof window === 'undefined') ? require('assert') : window.chai.assert;
var _ = (typeof window === 'undefined') ? require('lodash') : window._;
var Platform = (typeof window === 'undefined') ? require('platform') : window.Platform;
var Benchmark = (typeof window === 'undefined') ? require('benchmark') : window.Benchmark;
var c = (typeof window === 'undefined') ? require('cassowary') : window.c; // cassowary
var Mooruk = (typeof window === 'undefined') ? require('mooruk') : window.Mooruk;
var Solver = Mooruk.Solver;
var Expression = Mooruk.Expression;
var Operator = Mooruk.Operator;
var Strength = Mooruk.Strength;

// add tests
var suite = new Benchmark.Suite;
suite.add('Cassowary.js', function() {
    var solver = new c.SimplexSolver();
    var strength = new c.Strength('priority', 0, 900, 1000);

    // super-view
    var superView = {
        left: new c.Variable({value: 0}),
        top: new c.Variable({value: 0}),
        width: new c.Variable(),
        height: new c.Variable(),
        right: new c.Variable(),
        bottom: new c.Variable()
    };
    solver.addConstraint(new c.StayConstraint(superView.left, c.Strength.required));
    solver.addConstraint(new c.StayConstraint(superView.top, c.Strength.required));
    solver.addConstraint(new c.Equation(superView.right, c.plus(superView.left, superView.width)));
    solver.addConstraint(new c.Equation(superView.bottom, c.plus(superView.top, superView.height)));
    solver.addEditVar(superView.width, new c.Strength('required', 999, 1000, 1000));
    solver.addEditVar(superView.height, new c.Strength('required', 999, 1000, 1000));
    solver.suggestValue(superView.width, 300);
    solver.suggestValue(superView.height, 200);

    // subView1
    var subView1 = {
        left: new c.Variable(),
        top: new c.Variable(),
        width: new c.Variable(),
        height: new c.Variable(),
        right: new c.Variable(),
        bottom: new c.Variable()
    };
    solver.addConstraint(new c.Equation(subView1.right, c.plus(subView1.left, subView1.width)));
    solver.addConstraint(new c.Equation(subView1.bottom, c.plus(subView1.top, subView1.height)));

    // subView2
    var subView2 = {
        left: new c.Variable(),
        top: new c.Variable(),
        width: new c.Variable(),
        height: new c.Variable(),
        right: new c.Variable(),
        bottom: new c.Variable()
    };
    solver.addConstraint(new c.Equation(subView2.right, c.plus(subView2.left, subView2.width)));
    solver.addConstraint(new c.Equation(subView2.bottom, c.plus(subView2.top, subView2.height)));

    // Position sub-views in super-view
    solver.addConstraint(new c.Equation(subView1.left, superView.left, strength));
    solver.addConstraint(new c.Equation(subView1.top, superView.top, strength));
    solver.addConstraint(new c.Equation(subView1.bottom, superView.bottom, strength));
    solver.addConstraint(new c.Equation(subView1.right, subView2.left, strength));
    solver.addConstraint(new c.Equation(subView1.width, subView2.width, strength));
    solver.addConstraint(new c.Equation(subView2.right, superView.right, strength));
    solver.addConstraint(new c.Equation(subView2.top, superView.top, strength));
    solver.addConstraint(new c.Equation(subView2.bottom, superView.bottom, strength));

    // Calculate
    solver.resolve();

    // Uncomment to verify results
    //assert.equal(subView1.width.value, 150);
    //assert.equal(subView2.left.value, 150);
})
.add('Mooruk', function() {
    var solver = new Solver();
    var strength = new Strength.create(0, 900, 1000);

    // super-view
    var superView = {
        left: solver.createVariable(0),
        top: solver.createVariable(0),
        width: solver.createVariable(),
        height: solver.createVariable(),
        right: solver.createVariable(),
        bottom: solver.createVariable()
    };
    solver.addConstraint(solver.createConstraint(Expression.fromVariable(superView.left), Operator.EQU, Expression.fromConstant(0)));
    solver.addConstraint(solver.createConstraint(Expression.fromVariable(superView.top), Operator.EQU, Expression.fromConstant(0)));
    solver.addConstraint(solver.createConstraint(Expression.fromVariable(superView.right), Operator.EQU, Expression.fromVariable(superView.left).add(Expression.fromVariable(superView.width))));
    solver.addConstraint(solver.createConstraint(Expression.fromVariable(superView.bottom), Operator.EQU, Expression.fromVariable(superView.top).add(Expression.fromVariable(superView.height))));
    solver.addEditVariable(superView.width, Strength.create(999, 1000, 1000));
    solver.addEditVariable(superView.height, Strength.create(999, 1000, 1000));
    solver.suggestValue(superView.width, 300);
    solver.suggestValue(superView.height, 200);

    // subView1
    var subView1 = {
        left: solver.createVariable(),
        top: solver.createVariable(),
        width: solver.createVariable(),
        height: solver.createVariable(),
        right: solver.createVariable(),
        bottom: solver.createVariable()
    };
    solver.addConstraint(solver.createConstraint(Expression.fromVariable(subView1.right), Operator.EQU, Expression.fromVariable(subView1.left).add(Expression.fromVariable(subView1.width))));
    solver.addConstraint(solver.createConstraint(Expression.fromVariable(subView1.bottom), Operator.EQU, Expression.fromVariable(subView1.top).add(Expression.fromVariable(subView1.height))));

    // subView2
    var subView2 = {
        left: solver.createVariable(),
        top: solver.createVariable(),
        width: solver.createVariable(),
        height: solver.createVariable(),
        right: solver.createVariable(),
        bottom: solver.createVariable()
    };
    solver.addConstraint(solver.createConstraint(Expression.fromVariable(subView2.right), Operator.EQU, Expression.fromVariable(subView2.left).add(Expression.fromVariable(subView2.width))));
    solver.addConstraint(solver.createConstraint(Expression.fromVariable(subView2.bottom), Operator.EQU, Expression.fromVariable(subView2.top).add(Expression.fromVariable(subView2.height))));

    // Position sub-views in super-view
    solver.addConstraint(solver.createConstraint(Expression.fromVariable(subView1.left), Operator.EQU, Expression.fromVariable(superView.left), strength));
    solver.addConstraint(solver.createConstraint(Expression.fromVariable(subView1.top), Operator.EQU, Expression.fromVariable(superView.top), strength));
    solver.addConstraint(solver.createConstraint(Expression.fromVariable(subView1.bottom), Operator.EQU, Expression.fromVariable(superView.bottom), strength));
    solver.addConstraint(solver.createConstraint(Expression.fromVariable(subView1.width), Operator.EQU, Expression.fromVariable(subView2.width), strength));
    solver.addConstraint(solver.createConstraint(Expression.fromVariable(subView1.right), Operator.EQU, Expression.fromVariable(subView2.left), strength));
    solver.addConstraint(solver.createConstraint(Expression.fromVariable(subView2.right), Operator.EQU, Expression.fromVariable(superView.right), strength));
    solver.addConstraint(solver.createConstraint(Expression.fromVariable(subView2.top), Operator.EQU, Expression.fromVariable(superView.top), strength));
    solver.addConstraint(solver.createConstraint(Expression.fromVariable(subView2.bottom), Operator.EQU, Expression.fromVariable(superView.bottom), strength));

    // Calculate
    solver.updateVariables();

    // Uncomment to verify results
    //assert.equal(subView1.width.value, 150);
    //assert.equal(subView2.left.value, 150);
})

// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': true });

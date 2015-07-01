function DuplicateConstraintError(constraint) {
  this.name = 'DuplicateConstraintError';
  this.message = 'The constraint has not been added to the solver.';
  this.constraint = constraint;
}
DuplicateConstraintError.prototype = Object.create(Error.prototype);
DuplicateConstraintError.prototype.constructor = DuplicateConstraintError;

function UnknownConstraintError(constraint) {
  this.name = 'UnknownConstraintError';
  this.message = 'The constraint has not been added to the solver.';
  this.constraint = constraint;
}
UnknownConstraintError.prototype = Object.create(Error.prototype);
UnknownConstraintError.prototype.constructor = UnknownConstraintError;

function UnsatisfiableConstraintError(constraint) {
  this.name = 'UnsatisfiableConstraintError';
  this.message = 'The constraint can not be satisfied.';
  this.constraint = constraint;
}
UnsatisfiableConstraintError.prototype = Object.create(Error.prototype);
UnsatisfiableConstraintError.prototype.constructor = UnsatisfiableConstraintError;

function UnknownEditVariableError(variable) {
  this.name = 'UnknownEditVariableError';
  this.message = 'The edit variable has not been added to the solver.';
  this.variable = variable;
}
UnknownEditVariableError.prototype = Object.create(Error.prototype);
UnknownEditVariableError.prototype.constructor = UnknownEditVariableError;

function DuplicateEditVariableError(variable) {
  this.name = 'DuplicateEditVariableError';
  this.message = 'The edit variable has already been added to the solver.';
  this.variable = variable;
}
DuplicateEditVariableError.prototype = Object.create(Error.prototype);
DuplicateEditVariableError.prototype.constructor = DuplicateEditVariableError;

function BadRequiredStrengthError() {
  this.name = 'BadRequiredStrengthError';
  this.message = 'A required strength cannot be used in this context.';
}
BadRequiredStrengthError.prototype = Object.create(Error.prototype);
BadRequiredStrengthError.prototype.constructor = BadRequiredStrengthError;

function InternalSolverError(message) {
  this.name = 'InternalSolverError';
  this.message = message;
}
InternalSolverError.prototype = Object.create(Error.prototype);
InternalSolverError.prototype.constructor = InternalSolverError;

var Errors = {
    DuplicateConstraintError: DuplicateConstraintError,
    UnknownConstraintError: UnknownConstraintError,
    UnsatisfiableConstraintError: UnsatisfiableConstraintError,
    UnknownEditVariableError: UnknownEditVariableError,
    DuplicateEditVariableError: DuplicateEditVariableError,
    BadRequiredStrengthError: BadRequiredStrengthError,
    InternalSolverError: InternalSolverError
};

export {Errors as default};

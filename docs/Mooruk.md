<a name="module_Mooruk"></a>
## Mooruk
Mooruk is a lightweight and fast cassowary constraint solver based on the [Kiwi C++ implementation](https://github.com/nucleic/kiwi).
A mooruk is a small(er) species of Cassowary noted for its agility in running and leaping.
Mooruk is about 3x faster and 4x smaller compared to Cassowary.js. It is built for speed and low
memory consumption. It contains no syntaxtical sugar whatsoever and intends to be as lean and mean
as possible.

### Index

|Entity|Type|Description|
|---|---|---|
|[Solver](#mooruksolver)|`class`|Constraint solver class.|
|[SolverError](#mooruksolver)|`class`|Error object thrown by the Solver class.|
|[Term](#moorukterm)|`class`|Term inside an expression.|
|[Expression](#moorukexpression)|`class`|Expression class.|
|[Operator](#moorukoperator--enum)|`enum`|Relational constraint operators.|
|[Strength](#moorukstrength--object)|`namespace`|Default strengths + strength creation.|

### API Reference


* [Mooruk](#module_Mooruk)
  * [~Solver](#module_Mooruk..Solver)
    * [.createVariable([value])](#module_Mooruk..Solver+createVariable) ⇒ <code>Object</code>
    * [.createConstraint(expr1, operator, expr2, [strength])](#module_Mooruk..Solver+createConstraint) ⇒ <code>Object</code>
    * [.addConstraint(constraint)](#module_Mooruk..Solver+addConstraint) ⇒ <code>Solver</code>
    * [.removeConstraint(constraint)](#module_Mooruk..Solver+removeConstraint) ⇒ <code>Solver</code>
    * [.hasConstraint(constraint)](#module_Mooruk..Solver+hasConstraint) ⇒ <code>Bool</code>
    * [.addEditVariable(variable, strength)](#module_Mooruk..Solver+addEditVariable) ⇒ <code>Solver</code>
    * [.removeEditVariable(variable)](#module_Mooruk..Solver+removeEditVariable) ⇒ <code>Solver</code>
    * [.hasEditVariable(variable)](#module_Mooruk..Solver+hasEditVariable) ⇒ <code>Bool</code>
    * [.suggestValue(variable, value)](#module_Mooruk..Solver+suggestValue) ⇒ <code>Solver</code>
    * [.updateVariables()](#module_Mooruk..Solver+updateVariables) ⇒ <code>Solver</code>
  * [~SolverError](#module_Mooruk..SolverError)
  * [~Term](#module_Mooruk..Term)
  * [~Expression](#module_Mooruk..Expression)
    * [new Expression([constant], [terms])](#new_module_Mooruk..Expression_new)
    * _instance_
      * [.add(expression)](#module_Mooruk..Expression+add) ⇒ <code>Expression</code>
      * [.multiply(coefficient)](#module_Mooruk..Expression+multiply) ⇒ <code>Expression</code>
    * _static_
      * [.fromVariable(variable)](#module_Mooruk..Expression.fromVariable) ⇒ <code>Expression</code>
      * [.fromConstant(constant)](#module_Mooruk..Expression.fromConstant) ⇒ <code>Expression</code>
  * [~Operator](#module_Mooruk..Operator) : <code>object</code>
    * [.LEQ](#module_Mooruk..Operator.LEQ)
    * [.EQU](#module_Mooruk..Operator.EQU)
    * [.GEQ](#module_Mooruk..Operator.GEQ)
  * [~Strength](#module_Mooruk..Strength) : <code>object</code>
    * [.REQUIRED](#module_Mooruk..Strength.REQUIRED)
    * [.STRONG](#module_Mooruk..Strength.STRONG)
    * [.MEDIUM](#module_Mooruk..Strength.MEDIUM)
    * [.WEAK](#module_Mooruk..Strength.WEAK)
    * [.create(a, b, c)](#module_Mooruk..Strength.create) ⇒ <code>Number</code>

<a name="module_Mooruk..Solver"></a>
### Mooruk~Solver
**Kind**: inner class of <code>[Mooruk](#module_Mooruk)</code>  

* [~Solver](#module_Mooruk..Solver)
  * [.createVariable([value])](#module_Mooruk..Solver+createVariable) ⇒ <code>Object</code>
  * [.createConstraint(expr1, operator, expr2, [strength])](#module_Mooruk..Solver+createConstraint) ⇒ <code>Object</code>
  * [.addConstraint(constraint)](#module_Mooruk..Solver+addConstraint) ⇒ <code>Solver</code>
  * [.removeConstraint(constraint)](#module_Mooruk..Solver+removeConstraint) ⇒ <code>Solver</code>
  * [.hasConstraint(constraint)](#module_Mooruk..Solver+hasConstraint) ⇒ <code>Bool</code>
  * [.addEditVariable(variable, strength)](#module_Mooruk..Solver+addEditVariable) ⇒ <code>Solver</code>
  * [.removeEditVariable(variable)](#module_Mooruk..Solver+removeEditVariable) ⇒ <code>Solver</code>
  * [.hasEditVariable(variable)](#module_Mooruk..Solver+hasEditVariable) ⇒ <code>Bool</code>
  * [.suggestValue(variable, value)](#module_Mooruk..Solver+suggestValue) ⇒ <code>Solver</code>
  * [.updateVariables()](#module_Mooruk..Solver+updateVariables) ⇒ <code>Solver</code>

<a name="module_Mooruk..Solver+createVariable"></a>
#### solver.createVariable([value]) ⇒ <code>Object</code>
Creates new variabl to be used with the solver.

**Kind**: instance method of <code>[Solver](#module_Mooruk..Solver)</code>  
**Returns**: <code>Object</code> - Variable object contaning a .value property.  

| Param | Type | Description |
| --- | --- | --- |
| [value] | <code>Number</code> | Initial value. |

<a name="module_Mooruk..Solver+createConstraint"></a>
#### solver.createConstraint(expr1, operator, expr2, [strength]) ⇒ <code>Object</code>
Creates a constraint which can be added to the solver.

**Kind**: instance method of <code>[Solver](#module_Mooruk..Solver)</code>  
**Returns**: <code>Object</code> - Created constraint  

| Param | Type | Description |
| --- | --- | --- |
| expr1 | <code>Expression</code> | Expression 1. |
| operator | <code>Operator</code> | Equality operator. |
| expr2 | <code>Expression</code> | Expression 2. |
| [strength] | <code>Number</code> | Constraint strength. |

<a name="module_Mooruk..Solver+addConstraint"></a>
#### solver.addConstraint(constraint) ⇒ <code>Solver</code>
Adds a constraint to the solver.

**Kind**: instance method of <code>[Solver](#module_Mooruk..Solver)</code>  
**Returns**: <code>Solver</code> - this  

| Param | Type |
| --- | --- |
| constraint | <code>Constraint</code> | 

<a name="module_Mooruk..Solver+removeConstraint"></a>
#### solver.removeConstraint(constraint) ⇒ <code>Solver</code>
Removes a constraint from the solver.

**Kind**: instance method of <code>[Solver](#module_Mooruk..Solver)</code>  
**Returns**: <code>Solver</code> - this  

| Param | Type |
| --- | --- |
| constraint | <code>Constraint</code> | 

<a name="module_Mooruk..Solver+hasConstraint"></a>
#### solver.hasConstraint(constraint) ⇒ <code>Bool</code>
Checks whether the solver has the given constraint.

**Kind**: instance method of <code>[Solver](#module_Mooruk..Solver)</code>  
**Returns**: <code>Bool</code> - true/false  

| Param | Type |
| --- | --- |
| constraint | <code>Object</code> | 

<a name="module_Mooruk..Solver+addEditVariable"></a>
#### solver.addEditVariable(variable, strength) ⇒ <code>Solver</code>
Add an edit variable to the solver.

**Kind**: instance method of <code>[Solver](#module_Mooruk..Solver)</code>  
**Returns**: <code>Solver</code> - this  

| Param | Type |
| --- | --- |
| variable | <code>Variable</code> | 
| strength | <code>Number</code> | 

<a name="module_Mooruk..Solver+removeEditVariable"></a>
#### solver.removeEditVariable(variable) ⇒ <code>Solver</code>
Removes an edit variable from the solver.

**Kind**: instance method of <code>[Solver](#module_Mooruk..Solver)</code>  
**Returns**: <code>Solver</code> - this  

| Param | Type |
| --- | --- |
| variable | <code>Variable</code> | 

<a name="module_Mooruk..Solver+hasEditVariable"></a>
#### solver.hasEditVariable(variable) ⇒ <code>Bool</code>
Checks whether the solver has the given edit variable.

**Kind**: instance method of <code>[Solver](#module_Mooruk..Solver)</code>  
**Returns**: <code>Bool</code> - true/false  

| Param | Type | Description |
| --- | --- | --- |
| variable | <code>Object</code> | Variable created with `createVariable` |

<a name="module_Mooruk..Solver+suggestValue"></a>
#### solver.suggestValue(variable, value) ⇒ <code>Solver</code>
Suggest a value for the given edit variable.

**Kind**: instance method of <code>[Solver](#module_Mooruk..Solver)</code>  
**Returns**: <code>Solver</code> - this  

| Param | Type | Description |
| --- | --- | --- |
| variable | <code>Object</code> | Variable created with `createVariable` |
| value | <code>Number</code> |  |

<a name="module_Mooruk..Solver+updateVariables"></a>
#### solver.updateVariables() ⇒ <code>Solver</code>
Updates the external variables.

**Kind**: instance method of <code>[Solver](#module_Mooruk..Solver)</code>  
**Returns**: <code>Solver</code> - this  
<a name="module_Mooruk..SolverError"></a>
### Mooruk~SolverError
SolverError

Error object thrown by the Solver.

**Kind**: inner class of <code>[Mooruk](#module_Mooruk)</code>  
<a name="module_Mooruk..Term"></a>
### Mooruk~Term
**Kind**: inner class of <code>[Mooruk](#module_Mooruk)</code>  
<a name="module_Mooruk..Expression"></a>
### Mooruk~Expression
**Kind**: inner class of <code>[Mooruk](#module_Mooruk)</code>  

* [~Expression](#module_Mooruk..Expression)
  * [new Expression([constant], [terms])](#new_module_Mooruk..Expression_new)
  * _instance_
    * [.add(expression)](#module_Mooruk..Expression+add) ⇒ <code>Expression</code>
    * [.multiply(coefficient)](#module_Mooruk..Expression+multiply) ⇒ <code>Expression</code>
  * _static_
    * [.fromVariable(variable)](#module_Mooruk..Expression.fromVariable) ⇒ <code>Expression</code>
    * [.fromConstant(constant)](#module_Mooruk..Expression.fromConstant) ⇒ <code>Expression</code>

<a name="new_module_Mooruk..Expression_new"></a>
#### new Expression([constant], [terms])

| Param | Type | Description |
| --- | --- | --- |
| [constant] | <code>Number</code> | Initial constant (default: 0) |
| [terms] | <code>Array.Term</code> | Initial terms (default: 0) |

<a name="module_Mooruk..Expression+add"></a>
#### expression.add(expression) ⇒ <code>Expression</code>
Adds an expression to this expression. The expression on which
`.add` is called is modified in the process.

**Kind**: instance method of <code>[Expression](#module_Mooruk..Expression)</code>  
**Returns**: <code>Expression</code> - this  

| Param | Type | Description |
| --- | --- | --- |
| expression | <code>Expression</code> | Expression to append |

<a name="module_Mooruk..Expression+multiply"></a>
#### expression.multiply(coefficient) ⇒ <code>Expression</code>
Multiplies a coefficient with this expression. The expression on which
`.multiply` is called is modified in the process.

**Kind**: instance method of <code>[Expression](#module_Mooruk..Expression)</code>  
**Returns**: <code>Expression</code> - this  

| Param | Type | Description |
| --- | --- | --- |
| coefficient | <code>Number</code> | Coefficient to multiply with |

<a name="module_Mooruk..Expression.fromVariable"></a>
#### Expression.fromVariable(variable) ⇒ <code>Expression</code>
Creates an expression from a variable.

**Kind**: static method of <code>[Expression](#module_Mooruk..Expression)</code>  
**Returns**: <code>Expression</code> - expression  

| Param | Type | Description |
| --- | --- | --- |
| variable | <code>Object</code> | Variable created through `solver.createVariable`. |

<a name="module_Mooruk..Expression.fromConstant"></a>
#### Expression.fromConstant(constant) ⇒ <code>Expression</code>
Creates an expression from a constant value.

**Kind**: static method of <code>[Expression](#module_Mooruk..Expression)</code>  
**Returns**: <code>Expression</code> - expression  

| Param | Type | Description |
| --- | --- | --- |
| constant | <code>Number</code> | Constant value |

<a name="module_Mooruk..Operator"></a>
### Mooruk~Operator : <code>object</code>
**Kind**: inner namespace of <code>[Mooruk](#module_Mooruk)</code>  

* [~Operator](#module_Mooruk..Operator) : <code>object</code>
  * [.LEQ](#module_Mooruk..Operator.LEQ)
  * [.EQU](#module_Mooruk..Operator.EQU)
  * [.GEQ](#module_Mooruk..Operator.GEQ)

<a name="module_Mooruk..Operator.LEQ"></a>
#### Operator.LEQ
Less or equal

**Kind**: static property of <code>[Operator](#module_Mooruk..Operator)</code>  
<a name="module_Mooruk..Operator.EQU"></a>
#### Operator.EQU
Equal

**Kind**: static property of <code>[Operator](#module_Mooruk..Operator)</code>  
<a name="module_Mooruk..Operator.GEQ"></a>
#### Operator.GEQ
Greater or equal

**Kind**: static property of <code>[Operator](#module_Mooruk..Operator)</code>  
<a name="module_Mooruk..Strength"></a>
### Mooruk~Strength : <code>object</code>
**Kind**: inner namespace of <code>[Mooruk](#module_Mooruk)</code>  

* [~Strength](#module_Mooruk..Strength) : <code>object</code>
  * [.REQUIRED](#module_Mooruk..Strength.REQUIRED)
  * [.STRONG](#module_Mooruk..Strength.STRONG)
  * [.MEDIUM](#module_Mooruk..Strength.MEDIUM)
  * [.WEAK](#module_Mooruk..Strength.WEAK)
  * [.create(a, b, c)](#module_Mooruk..Strength.create) ⇒ <code>Number</code>

<a name="module_Mooruk..Strength.REQUIRED"></a>
#### Strength.REQUIRED
Required strength.

**Kind**: static property of <code>[Strength](#module_Mooruk..Strength)</code>  
<a name="module_Mooruk..Strength.STRONG"></a>
#### Strength.STRONG
Strong strength.

**Kind**: static property of <code>[Strength](#module_Mooruk..Strength)</code>  
<a name="module_Mooruk..Strength.MEDIUM"></a>
#### Strength.MEDIUM
Medium strength.

**Kind**: static property of <code>[Strength](#module_Mooruk..Strength)</code>  
<a name="module_Mooruk..Strength.WEAK"></a>
#### Strength.WEAK
Weak strength.

**Kind**: static property of <code>[Strength](#module_Mooruk..Strength)</code>  
<a name="module_Mooruk..Strength.create"></a>
#### Strength.create(a, b, c) ⇒ <code>Number</code>
Creates a strength from a strong, medium and weak component.

```strength = c + (b * 1000) + (a * 1000000)```

**Kind**: static method of <code>[Strength](#module_Mooruk..Strength)</code>  
**Returns**: <code>Number</code> - strength  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Number</code> | Strong component |
| b | <code>Number</code> | Medium component |
| c | <code>Number</code> | Weak component |


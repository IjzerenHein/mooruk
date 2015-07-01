<a name="Solver"></a>
## Solver
**Kind**: global class  

* [Solver](#Solver)
  * [.createVariable([value])](#Solver+createVariable) ⇒ <code>Object</code>
  * [.createConstraint(expr1, operator, expr2, [strength])](#Solver+createConstraint) ⇒ <code>Object</code>
  * [.addConstraint(constraint)](#Solver+addConstraint) ⇒ <code>[Solver](#Solver)</code>
  * [.removeConstraint(constraint)](#Solver+removeConstraint) ⇒ <code>[Solver](#Solver)</code>
  * [.hasConstraint(constraint)](#Solver+hasConstraint) ⇒ <code>Bool</code>
  * [.addEditVariable(variable, strength)](#Solver+addEditVariable) ⇒ <code>[Solver](#Solver)</code>
  * [.removeEditVariable(variable)](#Solver+removeEditVariable) ⇒ <code>[Solver](#Solver)</code>
  * [.hasEditVariable(variable)](#Solver+hasEditVariable) ⇒ <code>Bool</code>
  * [.suggestValue(variable, value)](#Solver+suggestValue) ⇒ <code>[Solver](#Solver)</code>
  * [.updateVariables()](#Solver+updateVariables) ⇒ <code>[Solver](#Solver)</code>

<a name="Solver+createVariable"></a>
### solver.createVariable([value]) ⇒ <code>Object</code>
Creates new variabl to be used with the solver.

**Kind**: instance method of <code>[Solver](#Solver)</code>  
**Returns**: <code>Object</code> - Variable object contaning a .value property.  

| Param | Type | Description |
| --- | --- | --- |
| [value] | <code>Number</code> | Initial value. |

<a name="Solver+createConstraint"></a>
### solver.createConstraint(expr1, operator, expr2, [strength]) ⇒ <code>Object</code>
Creates a constraint which can be added to the solver.

**Kind**: instance method of <code>[Solver](#Solver)</code>  
**Returns**: <code>Object</code> - Created constraint  

| Param | Type | Description |
| --- | --- | --- |
| expr1 | <code>[Expression](#Expression)</code> | Expression 1. |
| operator | <code>Operator</code> | Equality operator. |
| expr2 | <code>[Expression](#Expression)</code> | Expression 2. |
| [strength] | <code>Number</code> | Constraint strength. |

<a name="Solver+addConstraint"></a>
### solver.addConstraint(constraint) ⇒ <code>[Solver](#Solver)</code>
Adds a constraint to the solver.

**Kind**: instance method of <code>[Solver](#Solver)</code>  
**Returns**: <code>[Solver](#Solver)</code> - this  

| Param | Type |
| --- | --- |
| constraint | <code>Constraint</code> | 

<a name="Solver+removeConstraint"></a>
### solver.removeConstraint(constraint) ⇒ <code>[Solver](#Solver)</code>
Removes a constraint from the solver.

**Kind**: instance method of <code>[Solver](#Solver)</code>  
**Returns**: <code>[Solver](#Solver)</code> - this  

| Param | Type |
| --- | --- |
| constraint | <code>Constraint</code> | 

<a name="Solver+hasConstraint"></a>
### solver.hasConstraint(constraint) ⇒ <code>Bool</code>
Checks whether the solver has the given constraint.

**Kind**: instance method of <code>[Solver](#Solver)</code>  
**Returns**: <code>Bool</code> - true/false  

| Param | Type |
| --- | --- |
| constraint | <code>Object</code> | 

<a name="Solver+addEditVariable"></a>
### solver.addEditVariable(variable, strength) ⇒ <code>[Solver](#Solver)</code>
Add an edit variable to the solver.

**Kind**: instance method of <code>[Solver](#Solver)</code>  
**Returns**: <code>[Solver](#Solver)</code> - this  

| Param | Type |
| --- | --- |
| variable | <code>Variable</code> | 
| strength | <code>Number</code> | 

<a name="Solver+removeEditVariable"></a>
### solver.removeEditVariable(variable) ⇒ <code>[Solver](#Solver)</code>
Removes an edit variable from the solver.

**Kind**: instance method of <code>[Solver](#Solver)</code>  
**Returns**: <code>[Solver](#Solver)</code> - this  

| Param | Type |
| --- | --- |
| variable | <code>Variable</code> | 

<a name="Solver+hasEditVariable"></a>
### solver.hasEditVariable(variable) ⇒ <code>Bool</code>
Checks whether the solver has the given edit variable.

**Kind**: instance method of <code>[Solver](#Solver)</code>  
**Returns**: <code>Bool</code> - true/false  

| Param | Type | Description |
| --- | --- | --- |
| variable | <code>Object</code> | Variable created with `createVariable` |

<a name="Solver+suggestValue"></a>
### solver.suggestValue(variable, value) ⇒ <code>[Solver](#Solver)</code>
Suggest a value for the given edit variable.

**Kind**: instance method of <code>[Solver](#Solver)</code>  
**Returns**: <code>[Solver](#Solver)</code> - this  

| Param | Type | Description |
| --- | --- | --- |
| variable | <code>Object</code> | Variable created with `createVariable` |
| value | <code>Number</code> |  |

<a name="Solver+updateVariables"></a>
### solver.updateVariables() ⇒ <code>[Solver](#Solver)</code>
Updates the external variables.

**Kind**: instance method of <code>[Solver](#Solver)</code>  
**Returns**: <code>[Solver](#Solver)</code> - this  
<a name="Term"></a>
## Term
**Kind**: global class  
<a name="Expression"></a>
## Expression
**Kind**: global class  
<a name="Mooruk"></a>
## Mooruk : <code>object</code>
Mooruk.

A cassowary constraint solver built for speed and speed only...

**Kind**: global namespace  
**Properties**

| Name | Type |
| --- | --- |
| Solver | <code>[Solver](#Solver)</code> | 
| Expression | <code>[Expression](#Expression)</code> | 
| Term | <code>[Term](#Term)</code> | 
| Errors | <code>Errors</code> | 
| Operator | <code>Operator</code> | 
| Strength | <code>Strength</code> | 


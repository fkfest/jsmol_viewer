Clazz.declarePackage("JS");
(function(){
var c$ = Clazz.decorateAsClass(function(){
this.processName = null;
this.context = null;
Clazz.instantialize(this, arguments);}, JS, "ScriptProcess", null);
Clazz.makeConstructor(c$, 
function(name, context){
this.processName = name;
this.context = context;
}, "~S,JS.ScriptContext");
})();
;//5.0.1-v4 Thu Feb 20 12:29:54 CST 2025

Clazz.declarePackage("JM");
Clazz.load(["JM.BioPolymer"], "JM.PhosphorusPolymer", null, function(){
var c$ = Clazz.declareType(JM, "PhosphorusPolymer", JM.BioPolymer);
Clazz.makeConstructor(c$, 
function(monomers){
Clazz.superConstructor(this, JM.PhosphorusPolymer, [monomers, true]);
}, "~A");
});
;//5.0.1-v4 Thu Feb 20 12:29:54 CST 2025

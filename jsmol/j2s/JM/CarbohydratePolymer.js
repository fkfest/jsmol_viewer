Clazz.declarePackage("JM");
Clazz.load(["JM.BioPolymer"], "JM.CarbohydratePolymer", null, function(){
var c$ = Clazz.declareType(JM, "CarbohydratePolymer", JM.BioPolymer);
Clazz.makeConstructor(c$, 
function(monomers){
Clazz.superConstructor(this, JM.CarbohydratePolymer, [monomers, false]);
this.type = 3;
}, "~A");
});
;//5.0.1-v4 Thu Feb 20 12:29:54 CST 2025

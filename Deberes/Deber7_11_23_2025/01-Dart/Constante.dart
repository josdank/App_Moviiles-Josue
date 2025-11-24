void main() {
  var myInt = 7;
  myInt = myInt + 4;
  final myFinal = "Mi propiedad final";
  print(myFinal);
  final myFinalInt = myInt;
  print(myFinalInt);
  // myFinal = "No se puede cambiar"; // Esto daría error

  const myConst = "Mi propiedad constante";
  print(myConst);
  // const myConstInt = myInt; Error
  // myConst = "Mi propiedad constantes"; Error 

}

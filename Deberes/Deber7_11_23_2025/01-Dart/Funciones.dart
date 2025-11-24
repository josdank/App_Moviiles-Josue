// Función simple
void myFunction() {
  print("Esto es una función");
}
  
// Función con retorno
String myFunctionWithReturn() {
  return "Esto es una función con retorno";
}

// Función con parámetros
void funcionConParametros(String nombre) {
  print("Hola, $nombre");
}

void main() {
  myFunction();
  var result = myFunctionWithReturn();
  print(result);
  funcionConParametros("Josué Eduard");
}

void main() {
  String? myOptionalString;
   // Puede ser nulo
  myOptionalString = "Ahora tiene  un valor";
  print(myOptionalString);
  
  myOptionalString = null; 
  // Vuelve a ser nulo sin error
  print(myOptionalString);
}


void main() {
  int myInt = 5;

  // If - Else
  if (myInt == 11) {
    print("El valor es 11");
  } else if (myInt == 12) {
    print("El valor es 12");
  } else {
    print("El valor no es ni 11 ni 12");
  }
  // Bucles (Listas se ven más abajo)
  var myDetailList = ["Brais", "Moure", "MoureDev"];
  // For Loop
  for (var element in myDetailList) {
    print(element);
  }
  // While Loop
  var myCounter = 0;
  while (myCounter <= myInt) {
    print(myCounter);
    myCounter++; 
    // Incrementación para evitar bucle
  }
}

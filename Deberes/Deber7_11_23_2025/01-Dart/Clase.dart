//Enum
enum MyEnum { dart, python, swift, java }

// Definición de Clase
class MyClass {
  String name;
  int age;

  // Constructor
  MyClass(this.name, this.age);
}

var myClassInstance = MyClass("Josué", 21);

void main() {
  // Uso de la clase
  print(myClassInstance.name);
  print(myClassInstance.age);
}

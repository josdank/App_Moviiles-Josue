import 'dart:io';

void main() {
  stdout.write('Ingrese un número: ');
  int numero = int.parse(stdin.readLineSync()!);

  int sumaDivisores = 0;
  List<int> divisores = [];
  for (int i = 1; i < numero; i++) {
    if (numero % i == 0) {
      sumaDivisores += i;
      divisores.add(i); 
    }
  }
  if (sumaDivisores == numero) {
    print('$numero es perfecto porque $numero = ${divisores.join("+")}');
  } else {
    print('$numero NO es un número perfecto.');
  }
}

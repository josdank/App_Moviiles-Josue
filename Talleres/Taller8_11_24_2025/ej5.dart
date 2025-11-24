import 'dart:io';

void main() {
  stdout.write('Ingrese un número: ');
  int numero = int.parse(stdin.readLineSync()!);

  int asteriscos = 0;
  List<int> numeros = [];
  for (int i = 1; i < numero; i++) {
    if (numero % i == 0) {
      asteriscos += i;
      numeros.add(i); 
    }
  }

}

import 'dart:io';

void main() {
print('Serie de elementos númericos');
  stdout.write('Ingrese el número de elementos: ');
  int n = int.parse(stdin.readLineSync()!);

  int suma = 0;
  for (int i = 1; i <= n; i++) {
    suma += i; 
    stdout.write('$suma   '); 
  }
}

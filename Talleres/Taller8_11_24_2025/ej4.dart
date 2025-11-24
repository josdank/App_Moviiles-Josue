import 'dart:io';
import 'dart:math';

void main() {
  print('Número de Armstrong');
  stdout.write('Ingrese un número: ');
  int numero = int.parse(stdin.readLineSync()!);
  int temp = numero;
  int digitos = numero.toString().length;
  int suma = 0;

  while (temp > 0) {
    int digito = temp % 10;              
    suma += pow(digito, digitos).toInt(); 
    temp ~/= 10;                         
  }
  if (suma == numero) {
    print('$numero Es un número de Armstrong.');
  } else {
    print('$numero NO es un número de Armstrong.');
  }
}

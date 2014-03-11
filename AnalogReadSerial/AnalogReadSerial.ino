/*
  AnalogReadSerial
 Reads an analog input on pin 0, prints the result to the serial monitor 
 
 This example code is in the public domain.
 */

void setup() {
  Serial.begin(9600);
}

void loop() {
  int sensorValue = analogRead(A0);
  unsigned int b1 = (sensorValue & 0x03F);
  unsigned int b2 = 0x80 | ((sensorValue>>6) & 0x3F);
  Serial.write(b1);
  Serial.write(b2);
}

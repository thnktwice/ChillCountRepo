/*
  Tilt
 
Send log if button is pressed
 
 
 The circuit:
 * pushbutton attached to pin 2 from +5V
 
 created 2014
 by Tom Baz
 
 */

int car;            // car reported on the Serial Port
const int buttonPin = 5;     // the number of the pushbutton pin
int buttonState = 1;         // variable for reading the pushbutton status

void setup() {
  // initialize Serial connection
  Serial.begin(57600);     
  // initialize the pushbutton pin as an input:
  pinMode(buttonPin, INPUT);     
}

void loop(){
  
  bool notify = false;
   
  // read the state of the pushbutton value:
  buttonState = digitalRead(buttonPin);

  //check if the pushbutton is pressed (buttonState is HIGH):
  
  if (buttonState == HIGH) {
    
    notify = true;
    
  } 
  
  if ( notify ) {
    
    //Bean.setLed(0,0,255);  //debug, light turn blue
    
    // Serial.println Pour envoye via serial
    //while(Serial.available()<=0)          // wait that the user release the button
    
    
    // Pour envoyer via scratchData
    uint8_t buffer[2];
    uint16_t an0 = analogRead(8);
  
    buffer[0] = an0 & 0xFF;
    buffer[1] = an0 >> 8;
  
    Bean.setScratchData(1, buffer, 2);
    
    //Bean.setLed(0,0,0);   // debug
    Bean.sleep(1500);
  }
}

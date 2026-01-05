#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "DHT.h"
#include <SPI.h>
#include <MFRC522.h>
#include <Adafruit_INA219.h>

#define SS_PIN 10
#define RST_PIN 9


#define DHTPIN 2          
#define DHTTYPE DHT22
#define RAIN_SENSOR 8     
#define BUZZER 7    

#define IR_1 3 
#define IR_2 4
#define IR_3 5

#define CURRENT_THRESHOLD_MA 1.5

DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);
MFRC522 mfrc522(SS_PIN, RST_PIN);
Adafruit_INA219 ina219;

String uid;

int ir1;
int ir2;
int ir3;

unsigned long previousUpdate;
int currentDisplayedValue;

bool isPort1Charging;

void checkCharger(){
  float current_mA = ina219.getCurrent_mA();

  //Serial.print("Current: ");
  //Serial.print(current_mA);
  //Serial.print(" mA -> ");

  if (current_mA >= CURRENT_THRESHOLD_MA) {
    Serial.print("1");
    isPort1Charging = true;
  } else {
    Serial.print("0");
    isPort1Charging =false;
  }
}

void setup() {
  Serial.begin(9600);
  pinMode(RAIN_SENSOR, INPUT);
  pinMode(BUZZER, OUTPUT);
  pinMode(IR_1, INPUT);
  pinMode(IR_2, INPUT);
  pinMode(IR_3, INPUT);

  lcd.init();
  lcd.backlight();
  dht.begin();
  SPI.begin();         
  mfrc522.PCD_Init();
  
  if (! ina219.begin()) {
    Serial.println("Failed to find INA219 chip. Check wiring.");
    while (1) { delay(10); }
  }

  uid="";

  ir1=HIGH;
  ir2=HIGH;
  ir3=HIGH;

  previousUpdate = 0;
  currentDisplayedValue=0;
  isPort1Charging = false;
}

void loop() {
  // --- Read Sensors ---
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  int rainState = digitalRead(RAIN_SENSOR);

  // --- Check DHT22 Reading ---
  if (!isnan(humidity) && !isnan(temperature)) {
    lcd.setCursor(0, 0);
    lcd.print("T:");
    lcd.print(temperature, 1);
    lcd.print("C H:");
    lcd.print(humidity, 0);
    lcd.print("%     ");
    Serial.print(temperature);
    Serial.print(",");
    Serial.print(humidity);
    Serial.print(",");
  }

  if (rainState == LOW) { // LOW = wet / raining
    Serial.print("1,");
    for(int i=0;i<3;i++){
      tone(BUZZER, 1000);
      delay(400);
      noTone(BUZZER);
      delay(200);
    }
  } else {
    Serial.print("0,");
  }

  delay(100);
  ir1=digitalRead(IR_1);
  delay(60);
  ir2=digitalRead(IR_2);
  delay(60);
  ir3=digitalRead(IR_3);
  delay(60);

  if(ir1 == LOW){
    Serial.print("1,");
  }else{
    Serial.print("0,");
  }

  if(ir2 == LOW){
    Serial.print("1,");
  }else{
    Serial.print("0,");
  }

  if(ir3 == LOW){
    Serial.print("1,");
  }else{
    Serial.print("0,");
  }


  delay(60);

  if(millis() - previousUpdate >= 5000){
    if(currentDisplayedValue == 0){
      lcd.setCursor(0, 1);
      if (rainState == LOW) { // LOW = wet / raining
        lcd.print("Weather: Raining");
      } else {
        lcd.print("Weather: Sunny  ");
      }
    }else if(currentDisplayedValue ==1){
        lcd.setCursor(0, 1);
        if(ir1 == LOW){
          lcd.print("Umbrl 1 occupd  ");
        }else{
          lcd.print("Umbrl 1 unoccupd");
        }
    }else if(currentDisplayedValue == 2){
      lcd.setCursor(0, 1);
        if(ir2 == LOW){
          lcd.print("Umbrl 2 occupd  ");
        }else{
          lcd.print("Umbrl 2 unoccupd");
        }
    }else if(currentDisplayedValue == 3){
      lcd.setCursor(0, 1);
        if(ir3 == LOW){
          lcd.print("Umbrl 3 occupd  ");
        }else{
          lcd.print("Umbrl 3 unoccupd");
        }
    }else{
      lcd.setCursor(0, 1);
      if(isPort1Charging){
        lcd.print("Port 1: Charging");
      }else{
        lcd.print("Port 1:Available");
      }
    }

    currentDisplayedValue++;
    previousUpdate = millis();

    if(currentDisplayedValue > 4){
      currentDisplayedValue = 0;
    }
  }
  checkCharger();
  Serial.println();
//-----------------------RFID part ----------------------------------------
  if (!mfrc522.PICC_IsNewCardPresent()) return;
  if (!mfrc522.PICC_ReadCardSerial()) return;

  Serial.print("UID Tag: ");
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
    Serial.print(mfrc522.uid.uidByte[i], HEX);

    if (mfrc522.uid.uidByte[i] < 0x10) uid += "0"; // Add leading zero if needed
    uid += String(mfrc522.uid.uidByte[i], HEX);

  }

  uid.toUpperCase();
  Serial.println();
  
  lcd.setCursor(0, 0);
  lcd.print("id:             ");
  lcd.setCursor(3, 0);
  lcd.print(uid);
  tone(BUZZER, 1000);
  delay(1000);
  noTone(BUZZER);
  delay(3000);
  lcd.setCursor(0, 0);
  lcd.print("                ");
  uid = "";
  delay(3000);
}

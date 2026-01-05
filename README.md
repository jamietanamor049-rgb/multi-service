# multi-service

Project multi-service: is an IoT-based smart monitoring and service platform designed to support efficient, automated, and sustainable agricultural and public utility management.

The system integrates real-time weather monitoring, rain detection, coin-based smart phone charging, and an RFID-enabled umbrella dock system, all managed through Android and web applications.

Using low-cost sensors and microcontroller technology, the platform collects environmental and system data such as temperature, humidity, rainfall intensity, charging status, and umbrella availability, which are transmitted to a centralized server for processing and visualization.

## Arduino Code additional Info

The system is controlled by an Arduino-based microcontroller that handles sensor data acquisition, device control, and server communication. It reads inputs from temperature and humidity sensors, a rain sensor, an RFID reader for umbrella borrowing and returning, and a coin acceptor module for the coin-based smart charging system.

When a ₱5 coin is inserted, the Arduino activates the charging port for a predefined time and automatically updates the remaining charging duration. Phone detection ensures that charging only occurs when a device is connected.

All sensor readings and system states are transmitted to the backend server via Wi-Fi, where data is stored and displayed in the Android and web applications for real-time monitoring and management.
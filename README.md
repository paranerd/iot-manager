# IoT Manager
The IoT Manager is a tool to manage your IoT devices, to see their status, have quick links to their UIs and even update them through a unified interface.

## Start the server
```
docker run -d --network=host -v /path/to/config:/app/config --name iot-manager paranerd/iot-manager
```

## Discover devices
1. Go to `http://<server-ip>:8234/api/devices/discover`
1. Wait for the process to finish
1. Go to `http://<server-ip>:8234`
1. See your devices.

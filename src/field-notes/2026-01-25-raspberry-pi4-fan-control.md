---
title: "Dynamic fan control for Raspberry Pi4"
date: 2026-01-25
link: "https://peterbabic.dev/blog/setup-fan-control-on-rpi4-poe-hat/"
---
The key to setting up fans on the rpi.

`sudo vi /boot/firmware/config.txt`

```
dtoverlay=rpi-poe
dtparam=poe_fan_temp0=65000,poe_fan_temp0_hyst=5000
dtparam=poe_fan_temp1=70000,poe_fan_temp1_hyst=5000
dtparam=poe_fan_temp2=75000,poe_fan_temp2_hyst=5000
dtparam=poe_fan_temp3=80000,poe_fan_temp3_hyst=5000
```

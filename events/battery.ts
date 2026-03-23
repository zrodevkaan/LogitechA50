import * as buffer from "node:buffer";

export function getBattery(data: Buffer) {
    return {
        battery: Math.round((data[6] / 100) * 100),
        charging: data[8] === 0x01
    }
}
export function isBatteryPayload(data: buffer)
{
    return data[2] == 0x06
}

export function isCharging(data: Buffer) {
    return getBattery(data).charging
}
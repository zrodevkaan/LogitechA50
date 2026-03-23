import HID from "node-hid";
import {getVolume, isVolume} from "./events/volume.ts";
import {getGameMix, isGameMix} from "./events/gamemix.ts";
import {getBattery, isBatteryPayload, isCharging} from "./events/battery.ts";
import {getMicState, isMic} from "./events/mic.ts";
import {isHeadsetOff, isHeadsetOn} from "./events/headset.ts";

const devices = HID.devices();
const a50 = devices.find(d => d.vendorId === 0x046d && d.productId === 0x0b1c);
const device = new HID.HID(a50!.path!);

function parseBytes(buf: Buffer | number[]): number[] {
    return Array.from(buf);
}

function parseFirmwareBuildDate(buf: Buffer | number[]): Date {
    const b = parseBytes(buf);
    const year = b[7] | (b[8] << 8);
    const month = b[9];
    const day = b[10];
    const hour = b[11];
    const min = b[12];
    const sec = b[13];
    return new Date(year, month - 1, day, hour, min, sec); // this can somehow return shit from the 90s ???
}

function parseVersion(buf: Buffer | number[]): string {
    const b = parseBytes(buf);
    return `4.${b[3]}.${b[4]}`;
}

function sendCommand(device: HID.HID, cmd: number, sub: number): number[] {
    device.write([0x00, cmd, sub]);
    return device.readSync() as number[];
}

//     const fwBuf = sendCommand(device, 0x02, 0x03);
//     const date = parseFirmwareBuildDate(fwBuf);
//     console.log(date.toString());

function readAsciiString(buf: number[], offset: number): string {
    const bytes: number[] = [];
    for (let i = offset; i < buf.length; i++) {
        if (buf[i] === 0) break;
        bytes.push(buf[i]);
    }
    return String.fromCharCode(...bytes);
}

function isError(buf: number[]): boolean {
    // Device sends back "HID_ERROR_UNHANDLED_PACKET" as ASCII at offset 7
    return buf[1] === 0x01 && buf[2] === 0x1f && buf[3] === 0x01;
}

// This was isError testing, some return nothing and some return unhandled packet.
// for (const sub of [0x08, 0x0a, 0x0b, 0x05, 0x13, 0x1a]) {
//     const buf = sendCommand(device, 0x02, sub);
//     if (isError(buf)) {
//         const msg = readAsciiString(buf, 7);
//         console.log(`${sub}`, msg);
//     }
// }

//const buf = device.write([0x00, 0x02, 0x0d])
//console.log(buf)

device.on('data', (data: Buffer) => {
    // console.log(data)
    if (isVolume(data)) {
        const volumeBuffer = getVolume(data);
        console.log(`Voice: ${volumeBuffer.voice} | Game: ${volumeBuffer.game}`);
    } else if (isGameMix(data)) {
        console.log(`GameMix: ${getGameMix(data)}`);
    } else if (isBatteryPayload(data)) {
        console.log(`Battery: ${getBattery(data).battery}% | Charging: ${isCharging(data)}`);
    } else if (isMic(data)) {
        console.log(`Mic State: ${Boolean(getMicState(data)) ? "Open" : "Close"}`);
    } else if (isHeadsetOff(data)) {
        console.log("Headset Off");
    } else if (isHeadsetOn(data)) {
        console.log("Headset On");
    }

})
import HID from 'node-hid';
import {getVolume, isVolume} from "./events/volume.ts";
import {getGameMix, isGameMix} from "./events/gamemix.ts";
import {getBattery, isBatteryPayload, isCharging} from "./events/battery.ts";
import {isHeadsetOff, isHeadsetOn} from "./events/headset.ts";
import {isMic, getMicState} from "./events/mic.ts";
import {getIsDocked, isDockedPayload} from "./events/docked.ts";

const devices = HID.devices();
const a50 = devices.find(d => d.vendorId === 0x046d && d.productId === 0x0b1c);
const device = new HID.HID(a50!.path!);

//device.write([0x00,0x02,0x03]);

// sub-commands to map the protocol
// for (let sub = 0x00; sub <= 0x10; sub++) {
//     device.write([0x00, 0x02, sub]);
//     const response = device.readSync();
//     console.log(`Sub 0x${sub.toString(16).padStart(2,'0')}:`, response);
// }

// Sweep top-level commands
// for (let cmd = 0x00; cmd <= 0x10; cmd++) {
//     device.write([0x00, cmd, 0x03]);
//     const response = device.readSync();
//     const nonZero = response.some((b, i) => i > 0 && b !== 0);
//     if (nonZero) console.log(`Cmd 0x${cmd.toString(16)}, Sub 0x03:`, response);
// }

// 0x03 -> 02 02 26 04 b4 04 24 e9  (unknown, maybe EQ?)
// 0x04 -> 02 02 00 00 00 00 00 00
// 0x05 -> 02 02 04 0f 61 68 00 00  (0x61=97, 0x68=104, possible battery range)
// 0x09 -> 02 02 04 03 00 00 00 00
// 0x10 -> 02 02 04 01 03 00 18 00
// 0x13 -> 02 02 0e 00 0c 32 35 34  (bytes 32 35 34 = ASCII "254", firmware version?)
// 0x18 -> 02 02 01 01 00 00 00 00

//device.on('data', (data: Buffer) => {
    // if (isVolume(data)) {
    //     const volumeBuffer = getVolume(data);
    //     console.log(`Voice: ${volumeBuffer.voice} | Game: ${volumeBuffer.game}`);
    // // } else if (isDockedPayload(data)) { // this doesnt work. im too lazy nor would I use it. not even ghub uses it.
    // //     console.log(`Is Docked: ${getIsDocked(data)}`);
    // } else if (isGameMix(data)) {
    //     console.log(`GameMix: ${getGameMix(data)}`);
    // } else if (isBatteryPayload(data)) {
    //     console.log(`Battery: ${getBattery(data).battery}% | Charging: ${isCharging(data)}`);
    // } else if (isMic(data)) {
    //     console.log(`Mic State: ${Boolean(getMicState(data)) ? "Open" : "Close"}`);
    // } else if (isHeadsetOff(data)) {
    //     console.log("Headset Off");
    // } else if (isHeadsetOn(data)) {
    //     console.log("Headset On");
    // }

    //console.log(data)

    // const bufferArray = Buffer.from(data).subarray(0, 12).toString('hex')
    // console.log(bufferArray);
    // if (data[0] === 0x02 && data[1] === 0x0c && data[2] === 0x06 && data[4] === 0x06) {
    //     const HeadsetInfo = {
    //         Battery: `Battery: ${Math.round((data[6] / 100) * 100)}`,
    //         IsCharging: `IsCharging: ${data[7] == 0x01 ? "true" : "false"}`,
    //     }
    //
    //     console.log(`Battery: ${Math.round((data[6] / 100) * 100)}% ${new Date().toTimeString()}%`);
    // }
    // console.log(bufferArray)
//});

// device.write([0x00, 0x02, 0x2d]);
// device.write([0x00, 0x02, 0x2d]);
// device.write([0x00, 0x02, 0x2e]);
// device.write([0x00, 0x02, 0x2f]);
// device.write([0x00, 0x02, 0x30]);
// device.write([0x00, 0x02, 0x31]);
// device.write([0x00, 0x02, 0x32]);
// device.write([0x00, 0x02, 0x33]);
// device.write([0x00, 0x02, 0x34]);
// device.write([0x00, 0x02, 0x35]);
// device.write([0x00, 0x02, 0x36]);

/* Battery Mapping */
// 020c - 06 00 06 00          54       55                              00|01 00 00 00
//        |     |              |        |                               |
//      Write  Battery ID      Charge   Previous HEADSET SENT CHARGE   Is Charging?
//                                      CHARGE AFTER X VALUE OF MIN(S) ?
// Charge value is sent at a random interval
// Charge value is max 60

/* Volume Mapping */
// 020c - 06 00 00 08 00 1f 00 15 00 00 00
//        |        |     |
//      Write     Mic ID Volume

/* Game/Chat Mix */ // another volume I have to account for
// 020c - 04 00 0a 00
//        |     |
//     Unknown  Side Volume ID

// ?? ?? ?? 08 - Mic ID
// 07000c000000000a0000 = Disabled
// 07 00 0c 00 00 00 00 0b 00 00 = Enabled

// ?? ?? ?? 06 - Battery ID
// ?? ?? ?? 0a - Game/Chat Mix

// 07 = Send payload from headset to PC.














// enum Command {
//     0x00,
//     0x01,
//     0x02,
//     0x03, // Query request
//     0x04, // Query response
//     0x05,
//     0x06, // Write response?
//     0x07, // Write payload
//     0x08,
//     0x09,
// }

// recv: 1773304853064 020c06000600585a00000000 -- Battery Change event
// The first 06 is a battery id
// recv: 1773307025766 020c07000c000000000a0000 -- Mic closed
// recv: 1773307028098 020c07000c000000000b0000 -- Mic open
// 07 is possibly the mic state id? idk what 0c is.
// recv: 1773307266860 020c06000600555500000000 -- Battery Change event
// 04000a00060000000000 - turning off.

// 04001200050000000000 - headset off?
// 06000600535500000000 - headset on,

// 07000c000000000a0000 - mic off
// 07000c000000000b0000 - mic on















// how the hell do I figure out device->host for writing settings?
// recv: 1773303284834 020c060006005a5a00000000 - Battery change? 5a = 90 | 5a5a buffer = ??? | 60 = 96 probably
// ????  ????????????? 020c06000600595a00000000 - totally battery charge. 5a -> 59 = 90 -> 89
// 02 0c - Headset Identifier.

// 02 0c (06|04) = 06 = Enabled 04 = Disabled

// bytes[2] == 0x07: bytes[10] == 0a | 0b // Mute Event

// bytes[5] == 0x06: bytes

// 02 0c 06 00 00 06 58 5a 00 00 00 00
// |
// |
// |
// |
// |
// Identifier

// Battery isnt sent until the charge or headset status is sent.
// Possibly if the battery has decreased by x amount. e.g. when the headset drops by divisor of 4
// 25%-20% 5% ??

// nah its sent every random x minutes. ;/

// Send data -> 0x00, 0x02, bytes??

// sounds: none=00, all=01, minimal=02
//device.write([0x02, 0x0c, 0x07, 0x00, 0x09, 0x00, 0x01, 0x01, 0xff, 0x03]);

// import HID from 'node-hid';
//
// const devices = HID.devices();
// const a50 = devices.find(d => d.vendorId === 0x046d && d.productId === 0x0b1c);
// const device = new HID.HID(a50!.path!);
//
// const okCmds = [0x03, 0x04, 0x05, 0x09, 0x10, 0x13, 0x18];
//
// for (const cmd of okCmds) {
//     device.write([0x00, 0x02, cmd]);
//     const resp = device.readSync();
//     console.log(`0x${cmd.toString(16).padStart(2,'0')}: ${Buffer.from(resp).subarray(0, 16).toString('hex')}`);
// }
//
// device.close();

// import HID from 'node-hid';
//
// const devices = HID.devices();
// const a50 = devices.find(d => d.vendorId === 0x046d && d.productId === 0x0b1c);
// const device = new HID.HID(a50!.path!);
//
// const unique = new Map<string, number>();
//
//for (let cmd = 0x00; cmd <= 0xff; cmd++) {
    // const resp = device.readSync();
    // const hex = Buffer.from(resp).subarray(0, 8).toString('hex');
    //device.write([0x00, 0x02, cmd]);
    //const resp = device.readSync();
    //const hex = Buffer.from(resp).subarray(0, 8).toString('hex');
    //console.log(`0x${cmd.toString(16).padStart(2,'0')}`);

    //
    // if (!unique.has(hex)) {
    //     unique.set(hex, cmd);
    //     console.log(`0x${cmd.toString(16).padStart(2,'0')}: ${hex}`);
    // }
//}
//
// device.close();

// import HID from 'node-hid';
//
// function openDevice() {
//     const devices = HID.devices();
//     const a50 = devices.find(d => d.vendorId === 0x046d && d.productId === 0x0b1c);
//     if (!a50 || !a50.path) throw new Error('A50 not found');
//     return new HID.HID(a50.path);
// }
//
// const device = openDevice();
//
// device.on('data', (data: Buffer) => {
//     console.log(data)
//     if (data[0] === 0x02 && data[1] === 0x0c && data[2] === 0x06 && data[4] === 0x06) {
//         console.log(`Battery: ${Math.round((data[6] / data[7]) * 100)}%`);
//     }
// });
//
// device.write([0x00, 0x02, 0x7C]);
//
// const resp = device.readSync();
// console.log(Buffer.from(resp));
//
// device.on('error', (err: Error) => {
//     console.error(err);
//     // reopen on error
//     setTimeout(() => {
//         try {
//             const d = openDevice();
//             d.on('data', device.listeners('data')[0] as any);
//             d.on('error', device.listeners('error')[0] as any);
//         } catch(e) {
//             console.error('reconnect failed:', e);
//         }
//     }, 2000);
// });

// sudo chmod a+rw /dev/hidraw4

// 02 0c 06 - 02 0c 06 00 08 00 1a 00 12
//                              ?? 00 ??
// Changing Volume

// Disabling?
// <Buffer 02 0c 04 00 0a 00 06 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ... 14 more bytes>
// <Buffer 02 0c 04 00 12 00 05 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ... 14 more bytes>

// Enabling
// <Buffer 02 0c 04 00 12 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ... 14 more bytes>
// <Buffer 02 0c 06 00 06 00 64 64 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ... 14 more bytes>

// 02 0c -- Headset Identifer
// 02 0c 04 -- Status? Disabled
// 02 0c 06 -- Enabled
// 02 0c ?? ?? ?? ?? 64 64/5f -- Current/Max Charge or Charge/Status???

// 02 0c 05 00 ff 12 00 04 -- Error?

export function isHeadsetOff(data: Buffer) {
    if (data[2] !== 0x04) return false;
    return data[4] == 0x0a || (data[4] == 0x12 && data[6] == 0x05)
}

export function isHeadsetOn(data: Buffer) {
    return data[4] == 0x04 || (data[4] == 0x12 && data[6] == 0x00)
}
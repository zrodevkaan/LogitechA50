export function isVolume(data: Buffer) {
    return data[4] == 0x08
}

export function getVolume(data: Buffer) {
    return {voice: data[6], game: data[8]}
}

// 02 0c 06 00 08 00 1f 00 15 00 00 00
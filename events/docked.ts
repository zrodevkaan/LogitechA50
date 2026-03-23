export function isDockedPayload(data: Buffer) {
    return data[4] == 0x12 && data[6] == 0x06
}

export function getIsDocked(data: Buffer) {
    return data[8]
}
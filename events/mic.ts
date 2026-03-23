export function isMic(data: Buffer)
{
    return data[2] = 0x0c
}

export function getMicState(data: Buffer)
{
    return data[9] == 10 ? 0 : 1
}
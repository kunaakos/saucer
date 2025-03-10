const pathWithoutParamsRegex = /^\/[^?]*/

export const getPathWithoutParams = (location: string) => {
    const matches = location.match(pathWithoutParamsRegex)
    if (matches && typeof matches[0] === 'string') {
        return matches[0]
    } else {
        throw new Error('Invalid path.')
    }
}

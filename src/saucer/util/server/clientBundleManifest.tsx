import { readFileSync } from 'fs'
import path from 'path'

const clientManifest = JSON.parse(
    readFileSync(path.resolve(__dirname, '../../../../build/client/manifest.json')).toString(),
) as Record<string, string>

export const getHashedName = (file: string): string => {
    if (clientManifest[file]) {
        return clientManifest[file]
    } else {
        throw new Error('Bundle not found in manifest')
    }
}

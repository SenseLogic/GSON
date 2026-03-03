// -- IMPORTS

import { writeFileSync } from 'node:fs';
import { buildGsonText } from './building.js';

// -- FUNCTIONS

export function writeFileText(
    filePath,
    fileText
    )
{
    writeFileSync( filePath, fileText, 'utf8' );
}

// ~~

export function writeGsonValue(
    filePath,
    value,
    writeFileTextFunction = writeFileText
    )
{
    writeFileText( filePath, buildGsonText( value ) );
}

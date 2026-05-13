// -- IMPORTS

import { writeFileSync } from "node:fs";
import { buildGsonText } from "senselogic-gson";

// -- FUNCTIONS

export function writeFileText(
    filePath,
    fileText
    )
{
    writeFileSync( filePath, fileText, "utf8" );
}

// ~~

export function writeGsonValue(
    filePath,
    value
    )
{
    writeFileText( filePath, buildGsonText( value ) );
}

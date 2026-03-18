// -- IMPORTS

import { writeFileSync } from "node:fs";
import { buildGsonText } from "./building.js";

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

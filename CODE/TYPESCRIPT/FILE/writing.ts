// -- IMPORTS

import { buildGsonText } from "senselogic-gson";
import type { JsonValue } from "./types.ts";

// -- FUNCTIONS

export function writeFileText(
    filePath: string,
    fileText: string
    )
    : void
{
    Deno.writeTextFileSync( filePath, fileText );
}

// ~~

export function writeGsonValue(
    filePath: string,
    value: JsonValue
    )
    : void
{
    writeFileText( filePath, buildGsonText( value ) );
}

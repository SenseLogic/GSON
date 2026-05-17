// -- IMPORTS

import { buildGsonText, fetchGsonFileText, fetchGsonFileValue } from "./index.ts";

// -- FUNCTIONS

function readFileText(
    filePath: string
    )
    : string
{
    return Deno.readTextFileSync( filePath );
}

// ~~

function writeFileText(
    filePath: string,
    fileText: string
    )
    : void
{
    Deno.writeTextFileSync( filePath, fileText );
}

// -- STATEMENTS

let jsonText = await fetchGsonFileText( "../../../DATA/test.gson", true, readFileText );
console.log( jsonText );
writeFileText( "OUT/processed_test.json", jsonText );

let jsonValue = await fetchGsonFileValue( "../../../DATA/test.gson", true, readFileText );
console.log( JSON.stringify( jsonValue ) );

let gsonText = buildGsonText( jsonValue );
console.log( gsonText );
writeFileText( "OUT/processed_test.gson", gsonText );

jsonText = await fetchGsonFileText( "../../../DATA/test.gson", false, readFileText );
console.log( jsonText );
writeFileText( "OUT/unprocessed_test.json", jsonText );

gsonText = buildGsonText( jsonValue, false );
console.log( gsonText );
writeFileText( "OUT/unprocessed_test.gson", gsonText );

jsonValue = await fetchGsonFileValue( "../../../DATA/test.gson", false, readFileText );
console.log( JSON.stringify( jsonValue ) );

gsonText = buildGsonText( jsonValue, true, false );
console.log( gsonText );
writeFileText( "OUT/unprocessed_test.gson", gsonText );

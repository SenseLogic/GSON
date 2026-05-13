// -- IMPORTS

import { readFileSync, writeFileSync } from "node:fs";
import { buildGsonText, fetchGsonFileText, fetchGsonFileValue } from "./index.js";

// -- FUNCTIONS

function readFileText(
    filePath
    )
{
    return readFileSync( filePath, "utf8" );
}

// ~~

function writeFileText(
    filePath,
    fileText
    )
{
    writeFileSync( filePath, fileText, "utf8" );
}

// -- STATEMENTS

let jsonText = await fetchGsonFileText( "../../../DATA/test.gson", true, readFileText );
console.log( jsonText );
writeFileText( "OUT/processed_test.json", jsonText );

let jsonValue = await fetchGsonFileValue( "../../../DATA/test.gson", true, readFileText );
console.log( JSON.stringify( jsonValue ) );

let gsonText = buildGsonText( jsonValue );
console.log( gsonText );
writeFileText( "OUT/processed_test.gson", gsonText, 4 );

jsonText = await fetchGsonFileText( "../../../DATA/test.gson", false, readFileText );
console.log( jsonText );
writeFileText( "OUT/unprocessed_test.json", jsonText );

gsonText = buildGsonText( jsonValue, false );
console.log( gsonText );
writeFileText( "OUT/unprocessed_test.gson", gsonText, 4 );

jsonValue = await fetchGsonFileValue( "../../../DATA/test.gson", false, readFileText );
console.log( JSON.stringify( jsonValue ) );

gsonText = buildGsonText( jsonValue, true, false );
console.log( gsonText );
writeFileText( "OUT/unprocessed_test.gson", gsonText, 4 );

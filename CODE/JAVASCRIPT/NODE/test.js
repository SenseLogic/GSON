// -- IMPORTS

import { buildGsonText, readGsonFileText, readGsonFileValue, writeFileText } from './index.js';

// -- STATEMENTS

let jsonText = readGsonFileText( '../../../DATA/test.gson' );
console.log( jsonText );
writeFileText( 'OUT/processed_test.json', jsonText );

let jsonValue = readGsonFileValue( '../../../DATA/test.gson' );
console.log( JSON.stringify( jsonValue ) );

let gsonText = buildGsonText( jsonValue );
console.log( gsonText );
writeFileText( 'OUT/processed_test.gson', gsonText, 4 );

jsonText = readGsonFileText( '../../../DATA/test.gson', false );
console.log( jsonText );
writeFileText( 'OUT/unprocessed_test.json', jsonText );

gsonText = buildGsonText( jsonValue, false );
console.log( gsonText );
writeFileText( 'OUT/unprocessed_test.gson', gsonText, 4 );

jsonValue = readGsonFileValue( '../../../DATA/test.gson', false );
console.log( JSON.stringify( jsonValue ) );

gsonText = buildGsonText( jsonValue, true, false );
console.log( gsonText );
writeFileText( 'OUT/unprocessed_test.gson', gsonText, 4 );

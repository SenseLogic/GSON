// -- IMPORTS

import 'dart:convert';
import 'package:senselogic_gson/senselogic_gson.dart';

// -- STATEMENTS

void main(
    )
{
    var jsonText = readGsonFileText( '../../DATA/test.gson' );
    print( jsonText );
    writeFileText( 'OUT/processed_test.json', jsonText );

    dynamic jsonValue = readGsonFileValue( '../../DATA/test.gson' );
    print( jsonEncode( jsonValue ) );

    var gsonText = buildGsonText( jsonValue );
    print( gsonText );
    writeFileText( 'OUT/processed_test.gson', gsonText, 4 );

    jsonText = readGsonFileText( '../../DATA/test.gson', false );
    print( jsonText );
    writeFileText( 'OUT/unprocessed_test.json', jsonText );

    gsonText = buildGsonText( jsonValue, false );
    print( gsonText );
    writeFileText( 'OUT/unprocessed_test.gson', gsonText, 4 );

    jsonValue = readGsonFileValue( '../../DATA/test.gson', false );
    print( jsonEncode( jsonValue ) );

    gsonText = buildGsonText( jsonValue, true, false );
    print( gsonText );
    writeFileText( 'OUT/unprocessed_test.gson', gsonText, 4 );
}

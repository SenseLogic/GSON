// -- IMPORTS

import 'dart:io';
import 'building.dart';

// -- FUNCTIONS

void writeFileText(
    String filePath,
    String fileText,
    [
        int? _ignored
    ]
    )
{
    File( filePath ).writeAsStringSync( fileText );
}

// ~~

void writeGsonValue(
    String filePath,
    dynamic value,
    [
        void Function( String, String )? writeFileTextFunction = writeFileText
    ]
    )
{
    ( writeFileTextFunction ?? writeFileText )( filePath, buildGsonText( value ) );
}

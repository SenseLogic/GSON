// -- IMPORTS

import "dart:io";
import "building.dart";

// -- FUNCTIONS

void writeFileText(
    String filePath,
    String fileText
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
    writeFileTextFunction?.call( filePath, buildGsonText( value ) );
}

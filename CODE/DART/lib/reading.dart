// -- IMPORTS

import "dart:convert";
import "dart:io";
import "processing.dart";

// -- FUNCTIONS

String readFileText(
    String filePath
    )
{
    return File( filePath ).readAsStringSync();
}

// ~~

String getUnprimedReadText(
    String primedText,
    String folderPath,
    [
        bool primedTextIsProcessed = true,
        String Function( String )? readFileTextFunction = readFileText,
        String Function( String )? processPrimedTextFunction = processPrimedText
    ]
    )
{
    if ( primedTextIsProcessed
         && readFileTextFunction != null
         && primedText.startsWith( "‼@" ) )
    {
        var filePath = folderPath + primedText.substring( 2 );
        var fileText = readFileTextFunction( filePath );

        return getReadJsonText( fileText, filePath, primedTextIsProcessed, readFileTextFunction, processPrimedTextFunction );
    }
    else if ( primedTextIsProcessed
              && processPrimedTextFunction != null
              && primedText.startsWith( "‼" ) )
    {
        return '"' + processPrimedTextFunction( primedText ) + '"';
    }
    else
    {
        var lineArray = primedText.split( "\n" );

        for ( var lineIndex = 0;
              lineIndex < lineArray.length;
              ++lineIndex )
        {
            lineArray[ lineIndex ]
                = lineArray[ lineIndex ].trim().replaceAll( "‗", " " );
        }

        return '"' + lineArray.join( "\\n" ) + '"';
    }
}

// ~~

String getReadJsonText(
    String gsonText,
    String filePath,
    [
        bool primedTextIsProcessed = true,
        String Function( String )? readFileTextFunction,
        String Function( String )? processPrimedTextFunction
    ]
    )
{
    gsonText = gsonText.replaceAll( "\r", "" ).trim();
    filePath = filePath.replaceAll( "\\", "/" );

    var folderPath = filePath.substring( 0, filePath.lastIndexOf( "/" ) + 1 );
    var primedTextArray = gsonText.split( "‴" );

    for ( var primedTextIndex = 1;
          primedTextIndex < primedTextArray.length;
          primedTextIndex += 2 )
    {
        primedTextArray[ primedTextIndex ]
            = getUnprimedReadText( primedTextArray[ primedTextIndex ], folderPath, primedTextIsProcessed, readFileTextFunction, processPrimedTextFunction );
    }

    return primedTextArray.join( "" );
}

// ~~

String readGsonFileText(
    String filePath,
    [
        bool primedTextIsProcessed = true,
        String Function( String )? readFileTextFunction = readFileText,
        String Function( String )? processPrimedTextFunction = processPrimedText
    ]
    )
{
    var gsonText = ( readFileTextFunction ?? readFileText )( filePath );

    return getReadJsonText( gsonText, filePath, primedTextIsProcessed, readFileTextFunction, processPrimedTextFunction );
}

// ~~

dynamic readGsonFileValue(
    String filePath,
    [
        bool primedTextIsProcessed = true,
        String Function( String )? readFileTextFunction = readFileText,
        String Function( String )? processPrimedTextFunction = processPrimedText
    ]
    )
{
    return jsonDecode( readGsonFileText( filePath, primedTextIsProcessed, readFileTextFunction, processPrimedTextFunction ) );
}

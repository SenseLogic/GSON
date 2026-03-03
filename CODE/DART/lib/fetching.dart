// -- IMPORTS

import 'dart:convert';
import 'dart:io';
import 'processing.dart';

// -- FUNCTIONS

Future<String> fetchFileText(
    String filePath
    ) async
{
    var client = HttpClient();

    try
    {
        var request = await client.getUrl( Uri.parse( filePath ) );
        var response = await request.close();
        var fileText = await response.transform( utf8.decoder ).join();

        return fileText;
    }
    finally
    {
        client.close();
    }
}

// ~~

Future<String> getUnprimedFetchedText(
    String primedText,
    String folderPath,
    [
        bool primedTextIsProcessed = true,
        Future<String> Function( String )? fetchFileTextFunction = fetchFileText,
        String Function( String )? processPrimedTextFunction = processPrimedText
    ]
    ) async
{
    if ( primedTextIsProcessed
         && fetchFileTextFunction != null
         && primedText.startsWith( '‼@' ) )
    {
        var filePath = folderPath + primedText.substring( 2 );
        var fileText = await fetchFileTextFunction( filePath );

        return await getFetchedJsonText( fileText, filePath, fetchFileTextFunction, processPrimedTextFunction, primedTextIsProcessed );
    }
    else if ( primedTextIsProcessed
              && processPrimedTextFunction != null
              && primedText.startsWith( '‼' ) )
    {
        return '"' + processPrimedTextFunction( primedText ) + '"';
    }
    else
    {
        var lineArray = primedText.split( '\n' );

        for ( var lineIndex = 0;
              lineIndex < lineArray.length;
              ++lineIndex )
        {
            lineArray[ lineIndex ]
                = lineArray[ lineIndex ].trim().replaceAll( '‗', ' ' );
        }

        return '"' + lineArray.join( '\\n' ) + '"';
    }
}

// ~~

Future<String> getFetchedJsonText(
    String gsonText,
    String filePath,
    [
        Future<String> Function( String )? fetchFileTextFunction,
        String Function( String )? processPrimedTextFunction,
        bool primedTextIsProcessed = true
    ]
    ) async
{
    gsonText = gsonText.replaceAll( '\r', '' ).trim();
    filePath = filePath.replaceAll( '\\', '/' );

    var folderPath = filePath.substring( 0, filePath.lastIndexOf( '/' ) + 1 );
    var primedTextArray = gsonText.split( '‴' );

    for ( var primedTextIndex = 1;
          primedTextIndex < primedTextArray.length;
          primedTextIndex += 2 )
    {
        primedTextArray[ primedTextIndex ]
            = await getUnprimedFetchedText( primedTextArray[ primedTextIndex ], folderPath, primedTextIsProcessed, fetchFileTextFunction, processPrimedTextFunction );
    }

    return primedTextArray.join( '' );
}

// ~~

Future<String> fetchGsonFileText(
    String filePath,
    [
        bool primedTextIsProcessed = true,
        Future<String> Function( String )? fetchFileTextFunction = fetchFileText,
        String Function( String )? processPrimedTextFunction = processPrimedText
    ]
    ) async
{
    var gsonText = await ( fetchFileTextFunction ?? fetchFileText )( filePath );

    return await getFetchedJsonText( gsonText, filePath, fetchFileTextFunction, processPrimedTextFunction, primedTextIsProcessed );
}

// ~~

Future<dynamic> fetchGsonFileValue(
    String filePath,
    [
        bool primedTextIsProcessed = true,
        Future<String> Function( String )? fetchFileTextFunction,
        String Function( String )? processPrimedTextFunction ]
    ) async
{
    return jsonDecode( await fetchGsonFileText( filePath, primedTextIsProcessed, fetchFileTextFunction, processPrimedTextFunction ) );
}

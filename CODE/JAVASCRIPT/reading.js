// -- IMPORTS

import { readFileSync } from "node:fs";
import { processPrimedText } from "./processing.js";

// -- FUNCTIONS

export function readFileText(
    filePath
    )
{
    return readFileSync( filePath, "utf8" );
}

// ~~

function getUnprimedReadText(
    primedText,
    folderPath,
    primedTextIsProcessed = true,
    readFileTextFunction = readFileText,
    processPrimedTextFunction = processPrimedText
    )
{
    if ( primedTextIsProcessed
         && readFileTextFunction !== null
         && primedText.startsWith( "‼@" ) )
    {
        let filePath = folderPath + primedText.slice( 2 );
        let fileText = readFileTextFunction( filePath );

        return getReadJsonText( fileText, filePath, primedTextIsProcessed, readFileTextFunction, processPrimedTextFunction );
    }
    else if ( primedTextIsProcessed
              && processPrimedTextFunction !== null
              && primedText.startsWith( "‼" ) )
    {
        return '"' + processPrimedTextFunction( primedText ) + '"';
    }
    else
    {
        let lineArray = primedText.split( "\n" );

        for ( let lineIndex = 0;
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

export function getReadJsonText(
    gsonText,
    filePath,
    primedTextIsProcessed = true,
    readFileTextFunction = readFileText,
    processPrimedTextFunction = processPrimedText
    )
{
    gsonText = gsonText.replaceAll( "\r", "" ).trim();
    filePath = filePath.replaceAll( "\\", "/" );

    let folderPath = filePath.slice( 0, filePath.lastIndexOf( "/" ) + 1 );
    let primedTextArray = gsonText.split( "‴" );

    for ( let primedTextIndex = 1;
          primedTextIndex < primedTextArray.length;
          primedTextIndex += 2 )
    {
        primedTextArray[ primedTextIndex ]
            = getUnprimedReadText( primedTextArray[ primedTextIndex ], folderPath, primedTextIsProcessed, readFileTextFunction, processPrimedTextFunction );
    }

    return primedTextArray.join( "" );
}

// ~~

export function readGsonFileText(
    filePath,
    primedTextIsProcessed = true,
    readFileTextFunction = readFileText,
    processPrimedTextFunction = processPrimedText
    )
{
    let gsonText = readFileTextFunction( filePath );

    return getReadJsonText( gsonText, filePath, primedTextIsProcessed, readFileTextFunction, processPrimedTextFunction );
}

// ~~

export function readGsonFileValue(
    filePath,
    primedTextIsProcessed = true,
    readFileTextFunction = readFileText,
    processPrimedTextFunction = processPrimedText
    )
{
    return JSON.parse( readGsonFileText( filePath, primedTextIsProcessed, readFileTextFunction, processPrimedTextFunction ) );
}

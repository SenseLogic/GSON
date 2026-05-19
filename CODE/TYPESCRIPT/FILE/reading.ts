// -- IMPORTS

import { processPrimedText } from "senselogic-gson";
import type { JsonValue, ProcessPrimedTextFunction, ReadFileTextFunction } from "./types.ts";

// -- FUNCTIONS

export function readFileText(
    filePath: string
    )
    : string
{
    return Deno.readTextFileSync( filePath );
}

// ~~

function getUnprimedReadText(
    primedText: string,
    folderPath: string,
    primedTextIsProcessed: boolean = true,
    readFileTextFunction: ReadFileTextFunction | null = readFileText,
    processPrimedTextFunction: ProcessPrimedTextFunction | null = processPrimedText
    )
    : string
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
        return processPrimedTextFunction( primedText );
    }
    else
    {
        let lineArray = primedText.split( "\n" );

        for ( let lineIndex = 0;
              lineIndex < lineArray.length;
              ++lineIndex )
        {
            lineArray[ lineIndex ]
                = lineArray[ lineIndex ].trim();
        }

        return '"' + lineArray.join( "\\n" ).replaceAll( "‗", " " ).replaceAll( "\"", "\\\"" ) + '"';
    }
}

// ~~

export function getReadJsonText(
    gsonText: string,
    filePath: string,
    primedTextIsProcessed: boolean = true,
    readFileTextFunction: ReadFileTextFunction = readFileText,
    processPrimedTextFunction: ProcessPrimedTextFunction | null = processPrimedText
    )
    : string
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
    filePath: string,
    primedTextIsProcessed: boolean = true,
    readFileTextFunction: ReadFileTextFunction = readFileText,
    processPrimedTextFunction: ProcessPrimedTextFunction | null = processPrimedText
    )
    : string
{
    let gsonText = readFileTextFunction( filePath );

    return getReadJsonText( gsonText, filePath, primedTextIsProcessed, readFileTextFunction, processPrimedTextFunction );
}

// ~~

export function readGsonFileValue(
    filePath: string,
    primedTextIsProcessed: boolean = true,
    readFileTextFunction: ReadFileTextFunction = readFileText,
    processPrimedTextFunction: ProcessPrimedTextFunction | null = processPrimedText
    )
    : JsonValue
{
    return JSON.parse( readGsonFileText( filePath, primedTextIsProcessed, readFileTextFunction, processPrimedTextFunction ) );
}

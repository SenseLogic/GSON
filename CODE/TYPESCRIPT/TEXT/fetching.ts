// -- IMPORTS

import { processPrimedText } from "./processing.ts";
import type { FetchFileTextFunction, JsonValue, ProcessPrimedTextFunction } from "./types.ts";

// -- FUNCTIONS

export async function fetchFileText(
    filePath: string
    )
    : Promise< string >
{
    let response = await fetch( filePath );
    let fileText = await response.text();

    return fileText;
}

// ~~

async function getUnprimedFetchedText(
    primedText: string,
    folderPath: string,
    primedTextIsProcessed: boolean = true,
    fetchFileTextFunction: FetchFileTextFunction | null = fetchFileText,
    processPrimedTextFunction: ProcessPrimedTextFunction | null = processPrimedText
    )
    : Promise< string >
{
    if ( primedTextIsProcessed
         && fetchFileTextFunction !== null
         && primedText.startsWith( "‼@" ) )
    {
        let filePath = folderPath + primedText.slice( 2 );
        let fileText = await fetchFileTextFunction( filePath );

        return await getFetchedJsonText( fileText, filePath, fetchFileTextFunction, processPrimedTextFunction, primedTextIsProcessed );
    }
    else if ( primedTextIsProcessed
              && processPrimedTextFunction !== null
              && primedText.startsWith( "‼" ) )
    {
        return '"' + processPrimedTextFunction( primedText ).replaceAll( "\"", "\\\"" ) + '"';
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

export async function getFetchedJsonText(
    gsonText: string,
    filePath: string,
    fetchFileTextFunction: FetchFileTextFunction = fetchFileText,
    processPrimedTextFunction: ProcessPrimedTextFunction | null = processPrimedText,
    primedTextIsProcessed: boolean = true
    )
    : Promise< string >
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
            = await getUnprimedFetchedText( primedTextArray[ primedTextIndex ], folderPath, primedTextIsProcessed, fetchFileTextFunction, processPrimedTextFunction );
    }

    return primedTextArray.join( "" );
}

// ~~

export async function fetchGsonFileText(
    filePath: string,
    primedTextIsProcessed: boolean = true,
    fetchFileTextFunction: FetchFileTextFunction = fetchFileText,
    processPrimedTextFunction: ProcessPrimedTextFunction = processPrimedText
    )
    : Promise< string >
{
    let gsonText = await fetchFileTextFunction( filePath );

    return await getFetchedJsonText( gsonText, filePath, fetchFileTextFunction, processPrimedTextFunction, primedTextIsProcessed );
}

// ~~

export async function fetchGsonFileValue(
    filePath: string,
    primedTextIsProcessed: boolean = true,
    fetchFileTextFunction: FetchFileTextFunction = fetchFileText,
    processPrimedTextFunction: ProcessPrimedTextFunction = processPrimedText
    )
    : Promise< JsonValue >
{
    return JSON.parse( await fetchGsonFileText( filePath, primedTextIsProcessed, fetchFileTextFunction, processPrimedTextFunction ) );
}

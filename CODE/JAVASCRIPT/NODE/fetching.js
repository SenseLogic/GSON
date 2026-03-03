// -- FUNCTIONS

export async function fetchFileText(
    filePath
    )
{
    let response = await fetch( filePath );
    let fileText = await response.text();

    return fileText;
}

// ~~

async function getUnprimedFetchedText(
    primedText,
    folderPath,
    primedTextIsProcessed = true,
    fetchFileTextFunction = fetchFileText,
    processPrimedTextFunction = processPrimedText
    )
{
    if ( primedTextIsProcessed
         && fetchFileTextFunction !== null
         && primedText.startsWith( '‼@' ) )
    {
        let filePath = folderPath + primedText.slice( 2 );
        let fileText = fetchFileTextFunction( filePath );

        return await getFetchedJsonText( fileText, filePath, primedTextIsProcessed, fetchFileTextFunction, processPrimedTextFunction );
    }
    else if ( primedTextIsProcessed
              && processPrimedTextFunction !== null
              && primedText.startsWith( '‼' ) )
    {
        return '"' + processPrimedTextFunction( primedText ) + '"';
    }
    else
    {
        let lineArray = primedText.split( '\n' );

        for ( let lineIndex = 0;
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

export async function getFetchedJsonText(
    gsonText,
    filePath,
    fetchFileTextFunction = fetchFileText,
    processPrimedTextFunction = processPrimedText,
    primedTextIsProcessed = true
    )
{
    gsonText = gsonText.replaceAll( '\r', '' ).trim();
    filePath = filePath.replaceAll( '\\', '/' );

    let folderPath = filePath.slice( 0, filePath.lastIndexOf( '/' ) + 1 );
    let primedTextArray = gsonText.split( '‴' );

    for ( let primedTextIndex = 1;
          primedTextIndex < primedTextArray.length;
          primedTextIndex += 2 )
    {
        primedTextArray[ primedTextIndex ]
            = await getUnprimedFetchedText( primedTextArray[ primedTextIndex ], folderPath, primedTextIsProcessed, fetchFileTextFunction, processPrimedTextFunction );
    }

    return primedTextArray.join( '' );
}

// ~~

export async function fetchGsonFileText(
    filePath,
    primedTextIsProcessed = true,
    fetchFileTextFunction = fetchFileText,
    processPrimedTextFunction = processPrimedText
    )
{
    let gsonText = await fetchFileTextFunction( filePath );

    return await getFetchedJsonText( gsonText, filePath, primedTextIsProcessed, fetchFileTextFunction, processPrimedTextFunction );
}

// ~~

export async function fetchGsonFileValue(
    filePath,
    primedTextIsProcessed = true,
    fetchFileTextFunction = fetchFileText,
    processPrimedTextFunction = processPrimedText
    )
{
    return JSON.parse( await fetchGsonFileText( filePath, primedTextIsProcessed, fetchFileTextFunction, processPrimedTextFunction ) );
}

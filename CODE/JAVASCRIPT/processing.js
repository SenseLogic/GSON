// -- IMPORTS

import md5 from "md5";

// -- FUNCTIONS

export function getTextHash(
    text
    )
{
    return md5( text );
}

// ~~

export function getTextUuid(
    text
    )
{
    if ( text === "" )
    {
        return "";
    }
    else
    {
        let hash = md5( text );

        return (
            hash.slice( 0, 8 )
            + "-"
            + hash.slice( 8, 12 )
            + "-"
            + hash.slice( 12, 16 )
            + "-"
            + hash.slice( 16, 20 )
            + "-"
            + hash.slice( 20, 32 )
            );
    }
}

// ~~

export function getTextTuid(
    text
    )
{
    if ( text === "" )
    {
        return "";
    }
    else
    {
        let hash = md5( text );

        let byteArray = new Array( 16 );

        for ( let characterIndex = 0;
              characterIndex < 32;
              characterIndex += 2 )
        {
            byteArray[ characterIndex >> 1 ] = String.fromCharCode( parseInt( hash.slice( characterIndex, characterIndex + 2 ), 16 ) );
        }

        let tuid = btoa( byteArray.join( "" ) );

        return (
            tuid
                .replaceAll( "+", "-" )
                .replaceAll( "/", "_" )
                .replaceAll( "=", "" )
            );
    }
}

// ~~

export function processPrimedText(
    primedText
    )
{
    if ( primedText.startsWith( "‼#" ) )
    {
        return getTextUuid( primedText.slice( 2 ) );
    }
    else if ( primedText.startsWith( "‼%" ) )
    {
        return getTextTuid( primedText.slice( 2 ) );
    }
    else
    {
        return primedText;
    }
}

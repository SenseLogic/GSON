// -- IMPORTS

import md5 from 'md5';

// -- CONSTANTS

const
    isBrowser = ( typeof window !== 'undefined' && typeof window.document !== 'undefined' );

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
    if ( text === '' )
    {
        return '';
    }
    else
    {
        let hash = md5( text );

        return (
            hash.slice( 0, 8 )
            + '-'
            + hash.slice( 8, 12 )
            + '-'
            + hash.slice( 12, 16 )
            + '-'
            + hash.slice( 16, 20 )
            + '-'
            + hash.slice( 20, 32 )
            );
    }
}

// ~~

export function getTextTuid(
    text
    )
{
    if ( text === '' )
    {
        return '';
    }
    else
    {
        let hash = md5( text );
        let tuid = '';

        if ( isBrowser )
        {
            let buffer = '';

            for ( let byteIndex = 0; byteIndex < hash.length; byteIndex += 2 )
            {
                buffer += String.fromCharCode( parseInt( hash.slice( byteIndex, byteIndex + 2 ), 16 ) );
            }

            tuid = btoa( buffer );
        }
        else
        {
            tuid = Buffer.from( hash, 'hex' ).toString( 'base64' );
        }

        return (
            tuid
                .replaceAll( '+', '-' )
                .replaceAll( '/', '_' )
                .replaceAll( '=', '' )
            );
    }
}

// ~~

export function processPrimedText(
    primedText
    )
{
    if ( primedText.startsWith( '‼#' ) )
    {
        return getTextUuid( primedText.slice( 2 ) );
    }
    else if ( primedText.startsWith( '‼%' ) )
    {
        return getTextTuid( primedText.slice( 2 ) );
    }
    else
    {
        return primedText;
    }
}

<?php 
// -- FUNCTIONS

function getTextHash(
    $text
    )
{
    return md5( $text );
}

// ~~

function getTextUuid(
    $text
    )
{
    if ( $text === '' )
    {
        return '';
    }
    else
    {
         $hash = md5( $text );

        return
            substr( $hash, 0, 8 )
            . '-'
            . substr( $hash, 8, 4 )
            . '-'
            . substr( $hash, 12, 4 )
            . '-'
            . substr( $hash, 16, 4 )
            . '-'
            . substr( $hash, 20, 12 );
    }
}

// ~~

function getTextTuid(
    $text
    )
{
    if ( $text === '' )
    {
        return '';
    }
    else
    {
         $hash = md5( $text );

         $byteText = hex2bin( $hash );
         $tuid = base64_encode( $byteText );

        return
            str_replace(
                [ '+', '/', '=' ],
                [ '-', '_', '' ],
                $tuid
                );
    }
}

// ~~

function processPrimedText(
    $primedText
    )
{
    if ( str_starts_with( $primedText, '‼#' ) )
    {
        return getTextUuid( substr( $primedText, 4 ) );    // strlen( '‼#' ) = 4
    }
    else if ( str_starts_with( $primedText, '‼%' ) )
    {
        return getTextTuid( substr( $primedText, 4 ) );    // strlen( '‼%' ) = 4
    }
    else
    {
        return $primedText;
    }
}

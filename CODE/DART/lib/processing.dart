// -- IMPORTS

import 'dart:convert';
import 'package:crypto/crypto.dart';

// -- CONSTANTS

const bool isBrowser = false;

// -- FUNCTIONS

String getTextHash(
    String text
    )
{
    var bytes = utf8.encode( text );
    var digest = md5.convert( bytes );

    return digest.toString();
}

// ~~

String getTextUuid(
    String text
    )
{
    if ( text == '' )
    {
        return '';
    }
    else
    {
        var hash = getTextHash( text );

        return (
            hash.substring( 0, 8 )
            + '-'
            + hash.substring( 8, 12 )
            + '-'
            + hash.substring( 12, 16 )
            + '-'
            + hash.substring( 16, 20 )
            + '-'
            + hash.substring( 20, 32 )
            );
    }
}

// ~~

String getTextTuid(
    String text
    )
{
    if ( text == '' )
    {
        return '';
    }
    else
    {
        var hash = getTextHash( text );
        var tuid = '';

        if ( isBrowser )
        {
            var buffer = '';

            for ( var byteIndex = 0; byteIndex < hash.length; byteIndex += 2 )
            {
                buffer += String.fromCharCode( int.parse( hash.substring( byteIndex, byteIndex + 2 ), radix: 16 ) );
            }

            tuid = base64Encode( utf8.encode( buffer ) );
        }
        else
        {
            var hexBytes = <int>[];
            for ( var i = 0; i < hash.length; i += 2 )
            {
                hexBytes.add( int.parse( hash.substring( i, i + 2 ), radix: 16 ) );
            }
            tuid = base64Encode( hexBytes );
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

String processPrimedText(
    String primedText
    )
{
    if ( primedText.startsWith( '‼#' ) )
    {
        return getTextUuid( primedText.substring( 2 ) );
    }
    else if ( primedText.startsWith( '‼%' ) )
    {
        return getTextTuid( primedText.substring( 2 ) );
    }
    else
    {
        return primedText;
    }
}

// -- IMPORTS

import 'dart:convert';
import 'package:crypto/crypto.dart';

// -- FUNCTIONS

String getTextHash(
    String text
    )
{
    var byteArray = utf8.encode( text );
    var digest = md5.convert( byteArray );

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
        var tuid = base64Encode( md5.convert( utf8.encode( text ) ).bytes );

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

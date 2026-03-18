
# -- IMPORTS

import base64;
import hashlib;

# -- FUNCTIONS


def get_text_hash(
    text
    ):

    return hashlib.md5( text.encode( "utf8" ) ).hexdigest();


# ~~


def get_text_uuid(
    text
    ):

    if ( text == "" ):

        return "";

    else:

        hash = hashlib.md5( text.encode( "utf8" ) ).hexdigest();

        return (
            hash[ 0:8 ]
            + "-"
            + hash[ 8:12 ]
            + "-"
            + hash[ 12:16 ]
            + "-"
            + hash[ 16:20 ]
            + "-"
            + hash[ 20:32 ]
            );


# ~~


def get_text_tuid(
    text
    ):

    if ( text == "" ):

        return "";

    else:

        hash = hashlib.md5( text.encode( "utf8" ) ).hexdigest();
        byte_array = [ None ] * 16;

        character_index = 0;

        while ( character_index < 32 ):

            byte_array[ character_index >> 1 ] = chr( int( hash[ character_index:( character_index + 2 ) ], 16 ) );
            character_index += 2;

        tuid = base64.b64encode( "".join( byte_array ).encode( "latin1" ) ).decode( "ascii" );

        return (
            tuid
                .replace( "+", "-" )
                .replace( "/", "_" )
                .replace( "=", "" )
            );


# ~~


def process_primed_text(
    primed_text
    ):

    if ( primed_text.startswith( "‼#" ) ):

        return get_text_uuid( primed_text[ 2: ] );

    elif ( primed_text.startswith( "‼%" ) ):

        return get_text_tuid( primed_text[ 2: ] );

    else:

        return primed_text;


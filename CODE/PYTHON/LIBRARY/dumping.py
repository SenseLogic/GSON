
# -- IMPORTS

import json as _json;

from .building import get_indentation_text;

# -- FUNCTIONS


def get_dump_text(
    value,
    level = 0,
    level_space_count = 2
    ):

    if ( value is None ):

        return "null";

    elif ( isinstance( value, bool )
           or isinstance( value, int )
           or isinstance( value, float ) ):

        return str( value );

    elif ( isinstance( value, str ) ):

        return _json.dumps( value );

    elif ( isinstance( value, list ) ):

        if ( len( value ) == 0 ):

            return "[]";

        else:

            text = "[\n";
            indent = get_indentation_text( ( level + 1 ) * level_space_count );

            for item in value:

                text \
                    += indent \
                       + get_dump_text( item, level + 1, level_space_count ) \
                       + ",\n";

            text = text[ 0:( len( text ) - 2 ) ] + "\n";
            text += get_indentation_text( level * level_space_count ) + "]";

            return text;

    elif ( isinstance( value, dict ) ):

        if ( len( value ) == 0 ):

            return "{}";

        else:

            text = "{\n";
            indent = get_indentation_text( ( level + 1 ) * level_space_count );

            for key in value:

                text \
                    += indent \
                       + _json.dumps( key ) \
                       + ": " \
                       + get_dump_text( value[ key ], level + 1, level_space_count ) \
                       + ",\n";

            text = text[ 0:( len( text ) - 2 ) ] + "\n";
            text += get_indentation_text( level * level_space_count ) + "}";

            return text;

    else:

        return str( value );


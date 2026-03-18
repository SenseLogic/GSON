
# -- IMPORTS

import json as _json;

# -- VARIABLES

cached_indentation_text = "                                ";

# -- FUNCTIONS


def get_indentation_text(
    indentation_space_count
    ):

    global cached_indentation_text;

    while ( len( cached_indentation_text ) < indentation_space_count ):

        cached_indentation_text += "                                ";

    return cached_indentation_text[ 0:indentation_space_count ];


# ~~


def get_escaped_line(
    line,
    primed_text_is_escaped = True
    ):

    if ( primed_text_is_escaped ):

        escaped_line = _json.dumps( line )[ 1:-1 ].replace( "‴", "\\u2034" );

        return escaped_line.replace( "‼", "\\u203C" ).replace( "‗", "\\u2017" );

    else:

        escaped_line = _json.dumps( line, ensure_ascii = False )[ 1:-1 ].replace( "‴", "\\u2034" );

        return escaped_line;


# ~~


def get_multiline_string(
    value,
    primed_text_is_escaped = True,
    indentation_text = ""
    ):

    value = value.replace( "\r", "" );
    line_array = value.split( "\n" );
    line_count = len( line_array );
    multiline_string = indentation_text + "‴";

    line_index = 0;

    while ( line_index < line_count ):

        line = line_array[ line_index ];
        starting_space_count = 0;

        while ( starting_space_count < len( line )
                and line[ starting_space_count ] == " " ):

            starting_space_count += 1;

        trimmed_line = line.rstrip( " " );
        ending_space_count = len( line ) - len( trimmed_line );
        line_content = trimmed_line[ starting_space_count: ];

        if ( starting_space_count > 0 ):

            line_prefix = "‗" + get_indentation_text( starting_space_count - 1 );

        else:

            line_prefix = "";

        if ( ending_space_count > 0 ):

            line_suffix = get_indentation_text( ending_space_count - 1 ) + "‗";

        else:

            line_suffix = "";

        multiline_string_line = line_prefix + get_escaped_line( line_content, primed_text_is_escaped ) + line_suffix;

        if ( line_index == ( line_count - 1 ) ):

            multiline_string_line = multiline_string_line + "‴";

        if ( line_index == 0 ):

            multiline_string += multiline_string_line;

        else:

            multiline_string += "\n" + indentation_text + multiline_string_line;

        line_index += 1;

    return multiline_string;


# ~~


def build_gson_string(
    value,
    primed_text_is_generated,
    primed_text_is_escaped,
    context,
    level,
    line_suffix = ""
    ):

    indentation_text = get_indentation_text( level * context[ "level_space_count" ] );

    if ( primed_text_is_generated
         and ( value.startswith( "‼" )
               or ( "\n" in value ) ) ):

        if ( value.startswith( "‼" ) ):

            text = "‴" + get_escaped_line( value, primed_text_is_escaped ) + "‴" + line_suffix;
            context[ "line_array" ].append( indentation_text + text );

        else:

            multiline_string = get_multiline_string(
                value,
                primed_text_is_escaped,
                indentation_text
                );
            line_array = multiline_string.split( "\n" );
            last_index = len( line_array ) - 1;

            line_index = 0;

            while ( line_index < len( line_array ) ):

                line = line_array[ line_index ];

                if ( line_index == last_index
                     and line_suffix ):

                    line += line_suffix;

                context[ "line_array" ].append( line );
                line_index += 1;

    else:

        text = '"' + get_escaped_line( value, primed_text_is_escaped ) + '"' + line_suffix;
        context[ "line_array" ].append( indentation_text + text );


# ~~


def build_gson_value(
    value,
    primed_text_is_generated,
    primed_text_is_escaped,
    context,
    level
    ):

    indentation_text = get_indentation_text( level * context[ "level_space_count" ] );

    if ( isinstance( value, str ) ):

        build_gson_string(
            value,
            primed_text_is_generated,
            primed_text_is_escaped,
            context,
            level,
            ""
            );

    elif ( isinstance( value, list ) ):

        context[ "line_array" ].append( indentation_text + "[" );
        element_count = len( value );
        element_index = 0;

        while ( element_index < element_count ):

            element = value[ element_index ];
            line_suffix = "," if ( element_index < ( element_count - 1 ) ) else "";

            build_gson_value(
                element,
                primed_text_is_generated,
                primed_text_is_escaped,
                context,
                level + 1
                );

            if ( line_suffix ):

                last_index = len( context[ "line_array" ] ) - 1;
                context[ "line_array" ][ last_index ] += line_suffix;

            element_index += 1;

        context[ "line_array" ].append( indentation_text + "]" );

    elif ( value is not None
           and isinstance( value, dict ) ):

        context[ "line_array" ].append( indentation_text + "{" );
        key_array = list( value.keys() );
        key_count = len( key_array );
        key_index = 0;

        while ( key_index < key_count ):

            key = key_array[ key_index ];
            key_indentation_text = get_indentation_text(
                ( level + 1 ) * context[ "level_space_count" ]
                );
            value_indent_level = level + 2;
            line_suffix = "," if ( key_index < ( key_count - 1 ) ) else "";

            context[ "line_array" ].append( key_indentation_text + _json.dumps( key ) + ":" );

            build_gson_value(
                value[ key ],
                primed_text_is_generated,
                primed_text_is_escaped,
                context,
                value_indent_level
                );

            if ( line_suffix ):

                last_index = len( context[ "line_array" ] ) - 1;
                context[ "line_array" ][ last_index ] += line_suffix;

            key_index += 1;

        context[ "line_array" ].append( indentation_text + "}" );

    else:

        context[ "line_array" ].append( indentation_text + _json.dumps( value ) );


# ~~


def build_gson_text(
    value,
    primed_text_is_generated = True,
    primed_text_is_escaped = True,
    indentation_space_count = 4
    ):

    context = {
        "level_space_count": indentation_space_count,
        "line_array": []
        };

    build_gson_value(
        value,
        primed_text_is_generated,
        primed_text_is_escaped,
        context,
        0
        );

    return "\n".join( context[ "line_array" ] );


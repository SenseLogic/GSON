
# -- IMPORTS

from pathlib import Path;

from .processing import process_primed_text;

# -- FUNCTIONS


def read_file_text(
    file_path
    ):

    return Path( file_path ).read_text( encoding = "utf8" );


# ~~


def get_unprimed_read_text(
    primed_text,
    folder_path,
    primed_text_is_processed = True,
    read_file_text_function = read_file_text,
    process_primed_text_function = process_primed_text
    ):

    if ( primed_text_is_processed
         and read_file_text_function is not None
         and primed_text.startswith( "‼@" ) ):

        file_path = folder_path + primed_text[ 2: ];
        file_text = read_file_text_function( file_path );

        return get_read_json_text( file_text, file_path, primed_text_is_processed, read_file_text_function, process_primed_text_function );

    elif ( primed_text_is_processed
           and process_primed_text_function is not None
           and primed_text.startswith( "‼" ) ):

        return '"' + process_primed_text_function( primed_text ) + '"';

    else:

        line_array = primed_text.split( "\n" );
        line_index = 0;

        while ( line_index < len( line_array ) ):

            line_array[ line_index ] \
                = line_array[ line_index ].strip().replace( "‗", " " );
            line_index += 1;

        return '"' + "\\n".join( line_array ) + '"';


# ~~


def get_read_json_text(
    gson_text,
    file_path,
    primed_text_is_processed = True,
    read_file_text_function = read_file_text,
    process_primed_text_function = process_primed_text
    ):

    gson_text = gson_text.replace( "\r", "" ).strip();
    file_path = file_path.replace( "\\", "/" );
    folder_path = file_path[ 0:( file_path.rfind( "/" ) + 1 ) ];
    primed_text_array = gson_text.split( "‴" );

    primed_text_index = 1;

    while ( primed_text_index < len( primed_text_array ) ):

        primed_text_array[ primed_text_index ] \
            = get_unprimed_read_text( primed_text_array[ primed_text_index ], folder_path, primed_text_is_processed, read_file_text_function, process_primed_text_function );
        primed_text_index += 2;

    return "".join( primed_text_array );


# ~~


def read_gson_file_text(
    file_path,
    primed_text_is_processed = True,
    read_file_text_function = read_file_text,
    process_primed_text_function = process_primed_text
    ):

    gson_text = read_file_text_function( file_path );

    return get_read_json_text( gson_text, file_path, primed_text_is_processed, read_file_text_function, process_primed_text_function );


# ~~


def read_gson_file_value(
    file_path,
    primed_text_is_processed = True,
    read_file_text_function = read_file_text,
    process_primed_text_function = process_primed_text
    ):

    import json as _json;

    return _json.loads( read_gson_file_text( file_path, primed_text_is_processed, read_file_text_function, process_primed_text_function ) );


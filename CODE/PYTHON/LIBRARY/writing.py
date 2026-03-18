
# -- IMPORTS

from pathlib import Path;

from .building import build_gson_text;

# -- FUNCTIONS


def write_file_text(
    file_path,
    file_text
    ):

    Path( file_path ).write_text( file_text, encoding = "utf8" );


# ~~


def write_gson_value(
    file_path,
    value,
    write_file_text_function = write_file_text
    ):

    write_file_text_function( file_path, build_gson_text( value ) );

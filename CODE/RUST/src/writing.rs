// -- IMPORTS

use crate::building::build_gson_text;
use serde_json::Value;

// -- FUNCTIONS

pub fn write_file_text(
    file_path: &str,
    file_text: &str
    )
{
    std::fs::write( file_path, file_text.as_bytes() ).expect( "write file" );
}

// ~~

pub fn write_gson_value(
    file_path: &str,
    value: &Value,
    write_file_text_function: Option<fn( &str, &str )>,
    )
{
    if let Some( write_file_text_function ) = write_file_text_function
    {
        write_file_text_function( file_path, &build_gson_text( value, true, true, 4 ) );
    }
}

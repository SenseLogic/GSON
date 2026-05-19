// -- IMPORTS

use base64::{engine::general_purpose::STANDARD, Engine as _};

// -- FUNCTIONS

pub fn get_text_hash(
    text: &str
    )
    -> String
{
    let byte_array = text.as_bytes();
    let digest = md5::compute( byte_array );

    hex::encode( digest.as_slice() )
}

// ~~

pub fn get_text_uuid(
    text: &str
    )
    -> String
{
    if text == ""
    {
        return "".to_string();
    }
    else
    {
        let hash = get_text_hash( text );

        return
            hash[ 0..8 ].to_string()
            + "-"
            + &hash[ 8..12 ]
            + "-"
            + &hash[ 12..16 ]
            + "-"
            + &hash[ 16..20 ]
            + "-"
            + &hash[ 20..32 ]
            ;
    }
}

// ~~

pub fn get_text_tuid(
    text: &str
    )
    -> String
{
    if text == ""
    {
        return "".to_string();
    }
    else
    {
        let digest = md5::compute( text.as_bytes() );
        let tuid = STANDARD.encode( digest.as_slice() );

        return
            tuid
                .replace( "+", "-" )
                .replace( "/", "_" )
                .replace( "=", "" )
            ;
    }
}

// ~~

pub fn process_primed_text(
    primed_text: &str
    )
    -> String
{
    if let Some( rest ) = primed_text.strip_prefix( "‼#" )
    {
        return format!( "\"{}\"", get_text_uuid( rest ) );
    }
    else if let Some( rest ) = primed_text.strip_prefix( "‼%" )
    {
        return format!( "\"{}\"", get_text_tuid( rest ) );
    }
    else
    {
        return format!( "\"{}\"", primed_text.replace( "\"", "\\\"" ) );
    }
}

// -- EXPORTS

pub mod building;
pub mod equivalence;
pub mod fetching;
pub mod processing;
pub mod reading;
pub mod writing;

pub use building::*;
pub use equivalence::*;
pub use fetching::*;
pub use processing::*;
pub use reading::*;
pub use writing::*;

// -- TESTS

#[cfg( test )]
mod tests
{
    use super::*;
    use serde_json::json;

    #[test]
    fn get_escaped_line_empty_matches_json_encode_unquoted()
    {
        let s = get_escaped_line( "", true );
        assert_eq!( s, "" );
    }

    #[test]
    fn get_text_uuid_jack_matches_known_md5_uuid()
    {
        assert_eq!(
            get_text_uuid( "jack" ),
            "4ff9fc6e-4e5d-5f59-0c4f-2134a8cc96d1"
        );
    }

    #[test]
    fn get_dump_text_string_key_map()
    {
        let v = json!( { "a": 1 } );
        let t = get_dump_text( &v, 0, 2 );
        assert!( t.contains( "\"a\": 1" ) );
    }
}

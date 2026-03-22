// -- IMPORTS

use senselogic_gson::building::build_gson_text;
use senselogic_gson::processing::process_primed_text;
use senselogic_gson::reading::{ read_file_text, read_gson_file_text, read_gson_file_value };
use senselogic_gson::writing::write_file_text;

// -- STATEMENTS

fn main(
    )
{
    let mut json_text = read_gson_file_text( "../../DATA/test.gson", true, Some( read_file_text ), Some( process_primed_text ) );
    println!( "{}", json_text );
    write_file_text( "OUT/processed_test.json", &json_text );

    let mut json_value = read_gson_file_value( "../../DATA/test.gson", true, Some( read_file_text ), Some( process_primed_text ) );
    println!( "{}", serde_json::to_string( &json_value ).unwrap() );

    let mut gson_text = build_gson_text( &json_value, true, true, 4 );
    println!( "{}", gson_text );
    write_file_text( "OUT/processed_test.gson", &gson_text );

    json_text = read_gson_file_text( "../../DATA/test.gson", false, Some( read_file_text ), Some( process_primed_text ) );
    println!( "{}", json_text );
    write_file_text( "OUT/unprocessed_test.json", &json_text );

    gson_text = build_gson_text( &json_value, false, true, 4 );
    println!( "{}", gson_text );
    write_file_text( "OUT/unprocessed_test.gson", &gson_text );

    json_value = read_gson_file_value( "../../DATA/test.gson", false, Some( read_file_text ), Some( process_primed_text ) );
    println!( "{}", serde_json::to_string( &json_value ).unwrap() );

    gson_text = build_gson_text( &json_value, true, false, 4 );
    println!( "{}", gson_text );
    write_file_text( "OUT/unprocessed_test.gson", &gson_text );
}

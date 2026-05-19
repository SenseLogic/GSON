// -- IMPORTS

// -- FUNCTIONS

pub fn fetch_file_text(
    file_path: &str
    )
    -> String
{
    let client = reqwest::blocking::Client::new();
    let response = client.get( file_path ).send().expect( "http" );

    response.text().expect( "body" )
}

// ~~

pub fn get_unprimed_fetched_text(
    primed_text: &str,
    folder_path: &str,
    primed_text_is_processed: bool,
    fetch_file_text_function: Option<fn( &str ) -> String>,
    process_primed_text_function: Option<fn( &str ) -> String>,
    )
    -> String
{
    if primed_text_is_processed
         && fetch_file_text_function.is_some()
         && primed_text.starts_with( "‼@" )
    {
        let file_path = format!( "{}{}", folder_path, primed_text.strip_prefix( "‼@" ).unwrap() );
        let file_text = fetch_file_text_function.unwrap()( &file_path );

        return get_fetched_json_text( &file_text, &file_path, fetch_file_text_function, process_primed_text_function, primed_text_is_processed );
    }
    else if primed_text_is_processed
              && process_primed_text_function.is_some()
              && primed_text.starts_with( "‼" )
    {
        return process_primed_text_function.unwrap()( primed_text );
    }
    else
    {
        let mut line_array: Vec<String> = primed_text.split( "\n" ).map( |s| s.to_string() ).collect();

        for line_index in 0..line_array.len()
        {
            line_array[ line_index ]
                = line_array[ line_index ].trim().to_string();
        }

        return format!( "\"{}\"", line_array.join( "\\n" ).replace( "‗", " " ).replace( "\"", "\\\"" ) );
    }
}

// ~~

pub fn get_fetched_json_text(
    gson_text: &str,
    file_path: &str,
    fetch_file_text_function: Option<fn( &str ) -> String>,
    process_primed_text_function: Option<fn( &str ) -> String>,
    primed_text_is_processed: bool,
    )
    -> String
{
    let gson_text = gson_text.replace( "\r", "" ).trim().to_string();
    let file_path = file_path.replace( "\\", "/" );
    let folder_path = match file_path.rfind( "/" )
    {
        Some( i ) => file_path[ ..= i ].to_string(),
        None => String::new(),
    };
    let mut primed_text_array: Vec<String> = gson_text.split( "‴" ).map( |s| s.to_string() ).collect();

    let mut primed_text_index = 1usize;
    while primed_text_index < primed_text_array.len()
    {
        primed_text_array[ primed_text_index ]
            = get_unprimed_fetched_text( &primed_text_array[ primed_text_index ], &folder_path, primed_text_is_processed, fetch_file_text_function, process_primed_text_function );
        primed_text_index += 2;
    }

    primed_text_array.join( "" )
}

// ~~

pub fn fetch_gson_file_text(
    file_path: &str,
    primed_text_is_processed: bool,
    fetch_file_text_function: Option<fn( &str ) -> String>,
    process_primed_text_function: Option<fn( &str ) -> String>,
    )
    -> String
{
    let gson_text = fetch_file_text_function.unwrap_or( fetch_file_text )( file_path );

    get_fetched_json_text( &gson_text, file_path, fetch_file_text_function, process_primed_text_function, primed_text_is_processed )
}

// ~~

pub fn fetch_gson_file_value(
    file_path: &str,
    primed_text_is_processed: bool,
    fetch_file_text_function: Option<fn( &str ) -> String>,
    process_primed_text_function: Option<fn( &str ) -> String>,
    )
    -> serde_json::Value
{
    serde_json::from_str( &fetch_gson_file_text( file_path, primed_text_is_processed, fetch_file_text_function, process_primed_text_function ) ).expect( "json decode" )
}

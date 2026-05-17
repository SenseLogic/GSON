// -- IMPORTS

// -- FUNCTIONS

pub fn read_file_text(
    file_path: &str
    )
    -> String
{
    std::fs::read_to_string( file_path ).expect( "read file" )
}

// ~~

pub fn get_unprimed_read_text(
    primed_text: &str,
    folder_path: &str,
    primed_text_is_processed: bool,
    read_file_text_function: Option<fn( &str ) -> String>,
    process_primed_text_function: Option<fn( &str ) -> String>,
    )
    -> String
{
    if primed_text_is_processed
         && read_file_text_function.is_some()
         && primed_text.starts_with( "‼@" )
    {
        let file_path = format!( "{}{}", folder_path, primed_text.strip_prefix( "‼@" ).unwrap() );
        let file_text = read_file_text_function.unwrap()( &file_path );

        return get_read_json_text( &file_text, &file_path, primed_text_is_processed, read_file_text_function, process_primed_text_function );
    }
    else if primed_text_is_processed
              && process_primed_text_function.is_some()
              && primed_text.starts_with( "‼" )
    {
        return format!( "\"{}\"", process_primed_text_function.unwrap()( primed_text ).replace( "\"", "\\\"" ) );
    }
    else
    {
        let mut line_array: Vec<String> = primed_text.split( "\n" ).map( |s| s.to_string() ).collect();

        for line_index in 0..line_array.len()
        {
            line_array[ line_index ]
                = line_array[ line_index ].trim();
        }

        return format!( "\"{}\"", line_array.join( "\\n" ).replace( "‗", " " ).replace( "\"", "\\\"" ) );
    }
}

// ~~

pub fn get_read_json_text(
    gson_text: &str,
    file_path: &str,
    primed_text_is_processed: bool,
    read_file_text_function: Option<fn( &str ) -> String>,
    process_primed_text_function: Option<fn( &str ) -> String>,
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
            = get_unprimed_read_text( &primed_text_array[ primed_text_index ], &folder_path, primed_text_is_processed, read_file_text_function, process_primed_text_function );
        primed_text_index += 2;
    }

    primed_text_array.join( "" )
}

// ~~

pub fn read_gson_file_text(
    file_path: &str,
    primed_text_is_processed: bool,
    read_file_text_function: Option<fn( &str ) -> String>,
    process_primed_text_function: Option<fn( &str ) -> String>,
    )
    -> String
{
    let gson_text = read_file_text_function.unwrap_or( read_file_text )( file_path );

    get_read_json_text( &gson_text, file_path, primed_text_is_processed, read_file_text_function, process_primed_text_function )
}

// ~~

pub fn read_gson_file_value(
    file_path: &str,
    primed_text_is_processed: bool,
    read_file_text_function: Option<fn( &str ) -> String>,
    process_primed_text_function: Option<fn( &str ) -> String>,
    )
    -> serde_json::Value
{
    serde_json::from_str( &read_gson_file_text( file_path, primed_text_is_processed, read_file_text_function, process_primed_text_function ) ).expect( "json decode" )
}

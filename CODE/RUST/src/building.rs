// -- IMPORTS

use once_cell::sync::Lazy;
use serde_json::{Map, Number, Value};
use std::sync::Mutex;

// -- VARIABLES

static CACHED_INDENTATION_TEXT: Lazy<Mutex<String>> =
    Lazy::new( || Mutex::new( "                                ".to_string() ) );

// -- FUNCTIONS

pub fn get_indentation_text(
    indentation_space_count: usize
    )
    -> String
{
    let mut guard = CACHED_INDENTATION_TEXT.lock().unwrap();
    while guard.len() < indentation_space_count
    {
        *guard += "                                ";
    }

    guard.chars().take( indentation_space_count ).collect()
}

// ~~

pub fn get_escaped_line(
    line: &str,
    primed_text_is_escaped: bool
    )
    -> String
{
    let encoded1 = serde_json::to_string( line ).unwrap();
    let encoded2 = serde_json::to_string( line ).unwrap();
    let mut escaped_line = encoded1[ 1..encoded2.len() - 1 ].to_string().replace( "‴", "\\u2034" );

    if primed_text_is_escaped
    {
        escaped_line = escaped_line.replace( "‼", "\\u203C" ).replace( "‗", "\\u2017" );
        escaped_line
    }
    else
    {
        escaped_line
    }
}

// ~~

pub fn get_multiline_string(
    value: &str,
    primed_text_is_escaped: bool,
    indentation_text: &str
    )
    -> String
{
    let line_array: Vec<String> = value.replace( "\r", "" ).split( "\n" ).map( |s| s.to_string() ).collect();
    let line_count = line_array.len();
    let mut multiline_string = format!( "{}{}", indentation_text, "‴" );

    for line_index in 0..line_count
    {
        let line = line_array[ line_index ].as_str();
        let mut starting_space_count = 0usize;

        for &b in line.as_bytes()
        {
            if b == b' '
            {
                starting_space_count += 1;
            }
            else
            {
                break;
            }
        }

        let trimmed_line = line.trim_end();
        let ending_space_count = line.chars().count() - trimmed_line.chars().count();
        let line_content = if starting_space_count <= trimmed_line.chars().count()
        {
            trimmed_line.chars().skip( starting_space_count ).collect::<String>()
        }
        else
        {
            String::new()
        };

        let line_prefix: String;

        if starting_space_count > 0
        {
            line_prefix = format!( "‗{}", get_indentation_text( starting_space_count - 1 ) );
        }
        else
        {
            line_prefix = String::new();
        }

        let line_suffix: String;

        if ending_space_count > 0
        {
            line_suffix = format!( "{}{}", get_indentation_text( ending_space_count - 1 ), "‗" );
        }
        else
        {
            line_suffix = String::new();
        }

        let mut multiline_string_line = line_prefix + &get_escaped_line( &line_content, primed_text_is_escaped ) + &line_suffix;

        if line_index == line_count - 1
        {
            multiline_string_line = multiline_string_line + "‴";
        }

        if line_index == 0
        {
            multiline_string += &multiline_string_line;
        }
        else
        {
            multiline_string += &format!( "\n{}{}", indentation_text, multiline_string_line );
        }
    }

    multiline_string
}

// ~~

pub fn build_gson_string(
    value: &str,
    primed_text_is_generated: bool,
    primed_text_is_escaped: bool,
    context: &mut Map<String, Value>,
    level: usize,
    line_suffix: &str
    )
{
    let level_space_count = context[ "levelSpaceCount" ].as_u64().unwrap() as usize;
    let indentation_text  = get_indentation_text( level * level_space_count );

    if primed_text_is_generated
         && ( value.starts_with( "‼" )
              || value.contains( "\n" ) )
    {
        if value.starts_with( "‼" )
        {
            let text = format!( "{}{}{}{}", "‴", get_escaped_line( value, primed_text_is_escaped ), "‴", line_suffix );
            if let Value::Array( line_array ) = context.get_mut( "lineArray" ).unwrap()
            {
                line_array.push( Value::String( format!( "{}{}", indentation_text, text ) ) );
            }
        }
        else
        {
            let multiline_string = get_multiline_string( value, primed_text_is_escaped, &indentation_text );
            let line_array: Vec<String> = multiline_string.split( "\n" ).map( |s| s.to_string() ).collect();
            let last_index = line_array.len() - 1;

            for line_index in 0..line_array.len()
            {
                let mut line = line_array[ line_index ].clone();

                if line_index == last_index
                     && !line_suffix.is_empty()
                {
                    line += line_suffix;
                }

                if let Value::Array( line_array ) = context.get_mut( "lineArray" ).unwrap()
                {
                    line_array.push( Value::String( line ) );
                }
            }
        }
    }
    else
    {
        let text = format!( "{}{}{}{}", "\"", get_escaped_line( value, primed_text_is_escaped ), "\"", line_suffix );

        if let Value::Array( line_array ) = context.get_mut( "lineArray" ).unwrap()
        {
            line_array.push( Value::String( format!( "{}{}", indentation_text, text ) ) );
        }
    }
}

// ~~

pub fn build_gson_value(
    value: &Value,
    primed_text_is_generated: bool,
    primed_text_is_escaped: bool,
    context: &mut Map<String, Value>,
    level: usize
    )
{
    let level_space_count = context[ "levelSpaceCount" ].as_u64().unwrap() as usize;
    let indentation_text  = get_indentation_text( level * level_space_count );

    if value.is_string()
    {
        build_gson_string( value.as_str().unwrap(), primed_text_is_generated, primed_text_is_escaped, context, level, "" );
    }
    else if value.is_array()
    {
        if let Value::Array( arr ) = value
        {
            if let Value::Array( line_array ) = context.get_mut( "lineArray" ).unwrap()
            {
                line_array.push( Value::String( format!( "{}{}", indentation_text, "[" ) ) );
            }

            let element_count = arr.len();

            for element_index in 0..element_count
            {
                let element = &arr[ element_index ];
                let line_suffix = if element_index < element_count - 1 { "," } else { "" };

                build_gson_value(
                    element,
                    primed_text_is_generated,
                    primed_text_is_escaped,
                    context,
                    level + 1
                    );

                if !line_suffix.is_empty()
                {
                    if let Value::Array( line_array ) = context.get_mut( "lineArray" ).unwrap()
                    {
                        let last_index = line_array.len() - 1;
                        if let Value::String( s ) = &mut line_array[ last_index ]
                        {
                            *s += line_suffix;
                        }
                    }
                }
            }

            if let Value::Array( line_array ) = context.get_mut( "lineArray" ).unwrap()
            {
                line_array.push( Value::String( format!( "{}{}", indentation_text, "]" ) ) );
            }
        }
    }
    else if !value.is_null() && value.is_object()
    {
        if let Value::Object( obj ) = value
        {
            if let Value::Array( line_array ) = context.get_mut( "lineArray" ).unwrap()
            {
                line_array.push( Value::String( format!( "{}{}", indentation_text, "{" ) ) );
            }

            let key_array: Vec<String> = obj.keys().cloned().collect();
            let key_count = key_array.len();

            for key_index in 0..key_count
            {
                let key = &key_array[ key_index ];
                let key_indentation_text = get_indentation_text( ( level + 1 ) * ( context[ "levelSpaceCount" ].as_u64().unwrap() as usize ) );
                let value_indent_level = level + 2;
                let line_suffix = if key_index < key_count - 1 { "," } else { "" };

                if let Value::Array( line_array ) = context.get_mut( "lineArray" ).unwrap()
                {
                    line_array.push( Value::String( format!( "{}{}:", key_indentation_text, serde_json::to_string( key ).unwrap() ) ) );
                }

                build_gson_value(
                    &obj[ key ],
                    primed_text_is_generated,
                    primed_text_is_escaped,
                    context,
                    value_indent_level
                    );

                if !line_suffix.is_empty()
                {
                    if let Value::Array( line_array ) = context.get_mut( "lineArray" ).unwrap()
                    {
                        let last_index = line_array.len() - 1;
                        if let Value::String( s ) = &mut line_array[ last_index ]
                        {
                            *s += line_suffix;
                        }
                    }
                }
            }

            if let Value::Array( line_array ) = context.get_mut( "lineArray" ).unwrap()
            {
                line_array.push( Value::String( format!( "{}{}", indentation_text, "}" ) ) );
            }
        }
    }
    else
    {
        if let Value::Array( line_array ) = context.get_mut( "lineArray" ).unwrap()
        {
            line_array.push( Value::String( format!( "{}{}", indentation_text, serde_json::to_string( value ).unwrap() ) ) );
        }
    }
}

// ~~

pub fn build_gson_text(
    value: &Value,
    primed_text_is_generated: bool,
    primed_text_is_escaped: bool,
    indentation_space_count: usize
    )
    -> String
{
    let mut context =
        Map::new();
    context.insert( "levelSpaceCount".to_string(), Value::Number( Number::from( indentation_space_count as u64 ) ) );
    context.insert( "lineArray".to_string(), Value::Array( vec![] ) );

    build_gson_value(
        value,
        primed_text_is_generated,
        primed_text_is_escaped,
        &mut context,
        0
        );

    let line_array = context[ "lineArray" ].as_array().unwrap();
    line_array.iter().map( |v| v.as_str().unwrap().to_string() ).collect::<Vec<_>>().join( "\n" )
}

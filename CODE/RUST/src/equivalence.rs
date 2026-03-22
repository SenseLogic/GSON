// -- IMPORTS

use serde_json::Value;

// -- CONSTANTS

// -- FUNCTIONS

pub fn have_same_value(
    first_value: &Value,
    second_value: &Value
    )
    -> bool
{
    if let ( Some( f1 ), Some( f2 ) ) = ( first_value.as_f64(), second_value.as_f64() )
    {
        if f1.is_nan() && f2.is_nan()
        {
            return true;
        }
    }

    if first_value == second_value
    {
        return true;
    }

    if first_value.is_null()
              || second_value.is_null()
    {
        return first_value == second_value;
    }

    if first_value.is_object()
              && second_value.is_object()
              && first_value.as_object().unwrap().keys().any( |k| dart_key_is_not_string( k ) )
              && second_value.as_object().unwrap().keys().any( |k| dart_key_is_not_string( k ) )
    {
        let first_map = first_value.as_object().unwrap();
        let second_map = second_value.as_object().unwrap();

        if first_map.len() != second_map.len()
        {
            return false;
        }
        else
        {
            for first_value_entry in first_map
            {
                let mut entry_was_found = false;

                for second_value_entry in second_map
                {
                    if have_same_value( &Value::String( first_value_entry.0.clone() ), &Value::String( second_value_entry.0.clone() ) )
                         && have_same_value( first_value_entry.1, second_value_entry.1 )
                    {
                        entry_was_found = true;

                        break;
                    }
                }

                if !entry_was_found
                {
                    return false;
                }
            }
        }

        return true;
    }
    else if first_value.is_array()
              && second_value.is_array()
    {
        let first_arr = first_value.as_array().unwrap();
        let second_arr = second_value.as_array().unwrap();

        if first_arr.len() != second_arr.len()
        {
            return false;
        }

        for value_index in 0..first_arr.len()
        {
            if !have_same_value( &first_arr[ value_index ], &second_arr[ value_index ] )
            {
                return false;
            }
        }

        return true;
    }
    else if first_value.is_object()
              && second_value.is_object()
    {
        let first_map = first_value.as_object().unwrap();
        let second_map = second_value.as_object().unwrap();

        let first_value_key_array: Vec<String> = first_map.keys().cloned().collect();
        let second_value_key_array: Vec<String> = second_map.keys().cloned().collect();

        if first_value_key_array.len() != second_value_key_array.len()
        {
            return false;
        }

        for key in &first_value_key_array
        {
            if !second_map.contains_key( key )
                 || !have_same_value( &first_map[ key ], &second_map[ key ] )
            {
                return false;
            }
        }

        return true;
    }
    else
    {
        return false;
    }
}

fn dart_key_is_not_string( _k: &String ) -> bool
{
    false
}

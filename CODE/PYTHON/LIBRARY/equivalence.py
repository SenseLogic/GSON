
# -- FUNCTIONS

def have_same_value(
    first_value,
    second_value
    ):

    if ( first_value != first_value
         and second_value != second_value ):    # NaN

        return True;

    elif ( first_value == second_value ):

        return True;

    elif ( first_value is None
           or second_value is None ):

        return ( first_value is second_value );

    elif ( isinstance( first_value, dict )
           and isinstance( second_value, dict ) ):

        if ( len( first_value ) != len( second_value ) ):

            return False;

        else:

            for ( first_value_key, first_value_value ) in first_value.items():

                entry_was_found = False;

                for ( second_value_key, second_value_value ) in second_value.items():

                    if ( have_same_value( first_value_key, second_value_key )
                         and have_same_value( first_value_value, second_value_value ) ):

                        entry_was_found = True;

                        break;

                if ( not entry_was_found ):

                    return False;

        return True;

    elif ( isinstance( first_value, list )
           and isinstance( second_value, list ) ):

        if ( len( first_value ) != len( second_value ) ):

            return False;

        value_index = 0;

        while ( value_index < len( first_value ) ):

            if ( not have_same_value( first_value[ value_index ], second_value[ value_index ] ) ):

                return False;

            value_index += 1;

        return True;

    elif ( isinstance( first_value, set )
           and isinstance( second_value, set ) ):

        if ( len( first_value ) != len( second_value ) ):

            return False;

        for first_value_item in first_value:

            entry_was_found = False;

            for second_value_item in second_value:

                if ( have_same_value( first_value_item, second_value_item ) ):

                    entry_was_found = True;

                    break;

            if ( not entry_was_found ):

                return False;

        return True;

    elif ( isinstance( first_value, object )
           and isinstance( second_value, object ) ):

        if ( isinstance( first_value, ( dict, list, set ) )
             or isinstance( second_value, ( dict, list, set ) ) ):

            return False;

        first_value_dict = first_value.__dict__ if hasattr( first_value, "__dict__" ) else {};
        second_value_dict = second_value.__dict__ if hasattr( second_value, "__dict__" ) else {};

        first_value_key_array = list( first_value_dict.keys() );
        second_value_key_array = list( second_value_dict.keys() );

        if ( len( first_value_key_array ) != len( second_value_key_array ) ):

            return False;

        for key in first_value_key_array:

            if ( key not in second_value_dict
                 or not have_same_value( first_value_dict[ key ], second_value_dict[ key ] ) ):

                return False;

        return True;

    else:

        return False;


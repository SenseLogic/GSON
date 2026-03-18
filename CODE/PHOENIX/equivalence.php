<?php // -- CONSTANTS

function haveSameValue(
    $firstValue,
    $secondValue
    )
{
    if ( is_float( $firstValue )
         && is_float( $secondValue )
         && is_nan( $firstValue )
         && is_nan( $secondValue ) )    // NaN
    {
        return true;
    }
    else if ( $firstValue === $secondValue )
    {
        return true;
    }
    else if ( $firstValue === null
              || $secondValue === null )
    {
        return $firstValue === $secondValue;
    }
    else if ( is_array( $firstValue )
              && is_array( $secondValue ) )
    {
         $firstValueIsList = array_is_list( $firstValue );
         $secondValueIsList = array_is_list( $secondValue );

        if ( $firstValueIsList !== $secondValueIsList )
        {
            return false;
        }
        else if ( $firstValueIsList )
        {
            if ( count( $firstValue ) !== count( $secondValue ) )
            {
                return false;
            }

            for (  $valueIndex = 0;
                  $valueIndex < count( $firstValue );
                  ++$valueIndex )
            {
                if ( !haveSameValue( $firstValue[ $valueIndex ], $secondValue[ $valueIndex ] ) )
                {
                    return false;
                }
            }

            return true;
        }
        else
        {
             $firstValueKeyArray = array_keys( $firstValue );
             $secondValueKeyArray = array_keys( $secondValue );

            if ( count( $firstValueKeyArray ) !== count( $secondValueKeyArray ) )
            {
                return false;
            }

            foreach ( $firstValueKeyArray as  $key )
            {
                if ( !array_key_exists( $key, $secondValue )
                     || !haveSameValue( $firstValue[ $key ], $secondValue[ $key ] ) )
                {
                    return false;
                }
            }

            return true;
        }
    }
    else if ( is_object( $firstValue )
              && is_object( $secondValue ) )
    {
        return haveSameValue( get_object_vars( $firstValue ), get_object_vars( $secondValue ) );
    }
    else
    {
        return false;
    }
}

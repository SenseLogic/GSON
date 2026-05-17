// -- IMPORTS

import type { GsonValue } from "./types.ts";

// -- FUNCTIONS

export function haveSameValue(
    firstValue: GsonValue,
    secondValue: GsonValue
    )
    : boolean
{
    if ( firstValue !== firstValue
         && secondValue !== secondValue )    // NaN
    {
        return true;
    }
    else if ( firstValue === secondValue )
    {
        return true;
    }
    else if ( firstValue == null
              || secondValue == null )
    {
        return firstValue === secondValue;
    }
    else if ( firstValue instanceof Map
              && secondValue instanceof Map )
    {
        if ( firstValue.size !== secondValue.size )
        {
            return false;
        }
        else
        {
            for ( let [ firstValueKey, firstValueValue ] of firstValue.entries() )
            {
                let entryWasFound = false;

                for ( let [ secondValueKey, secondValueValue ] of secondValue.entries() )
                {
                    if ( haveSameValue( firstValueKey as GsonValue, secondValueKey as GsonValue )
                         && haveSameValue( firstValueValue as GsonValue, secondValueValue as GsonValue ) )
                    {
                        entryWasFound = true;

                        break;
                    }
                }

                if ( !entryWasFound )
                {
                    return false;
                }
            }
        }

        return true;
    }
    else if ( Array.isArray( firstValue )
              && Array.isArray( secondValue ) )
    {
        if ( firstValue.length !== secondValue.length )
        {
            return false;
        }

        for ( let valueIndex = 0;
              valueIndex < firstValue.length;
              ++valueIndex )
        {
            if ( !haveSameValue( firstValue[ valueIndex ] as GsonValue, secondValue[ valueIndex ] as GsonValue ) )
            {
                return false;
            }
        }

        return true;
    }
    else if ( typeof firstValue === "object"
              && typeof secondValue === "object" )
    {
        let firstValueKeyArray = Object.keys( firstValue );
        let secondValueKeyArray = Object.keys( secondValue );

        if ( firstValueKeyArray.length !== secondValueKeyArray.length )
        {
            return false;
        }

        for ( let key of firstValueKeyArray )
        {
            if ( !Object.prototype.hasOwnProperty.call( secondValue, key )
                 || !haveSameValue( ( firstValue as Record< string, GsonValue > )[ key ], ( secondValue as Record< string, GsonValue > )[ key ] ) )
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

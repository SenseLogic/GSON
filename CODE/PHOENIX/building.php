<?php 
// -- VARIABLES

 $cachedIndentationText = '                                ';

// -- FUNCTIONS

function getIndentationText(
    $indentationSpaceCount
    )
{
    global $cachedIndentationText;

    while ( strlen( $cachedIndentationText ) < $indentationSpaceCount )
    {
        $cachedIndentationText .= '                                ';
    }

    return substr( $cachedIndentationText, 0, $indentationSpaceCount );
}

// ~~

function getEscapedLine(
    $line,
    $primedTextIsEscaped = true
    )
{
     $escapedLine = json_encode( $line, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
    $escapedLine = substr( $escapedLine, 1, -1 );
    $escapedLine = str_replace( '‴', '\\u2034', $escapedLine );

    if ( $primedTextIsEscaped )
    {
        return
            str_replace(
                [ '‼', '‗' ],
                [ '\\u203C', '\\u2017' ],
                $escapedLine
                );
    }
    else
    {
        return $escapedLine;
    }
}

// ~~

function getMultilineString(
    $value,
    $primedTextIsEscaped = true,
    $indentationText = ''
    )
{
     $lineArray = explode( "\n", str_replace( "\r", '', $value ) );
     $lineCount = count( $lineArray );
     $multilineString = $indentationText . '‴';

    for (  $lineIndex = 0;
          $lineIndex < $lineCount;
          ++$lineIndex )
    {
         $line = $lineArray[ $lineIndex ];
         $startingSpaceCount = 0;

        while ( $startingSpaceCount < strlen( $line )
                && $line[ $startingSpaceCount ] === ' ' )
        {
            ++$startingSpaceCount;
        }

         $trimmedLine = rtrim( $line, " \t\n\r\0\x0B" );
         $endingSpaceCount = strlen( $line ) - strlen( $trimmedLine );
         $lineContent = substr( $trimmedLine, $startingSpaceCount );

        if ( $startingSpaceCount > 0 )
        {
             $linePrefix = '‗' . getIndentationText( $startingSpaceCount - 1 );
        }
        else
        {
            $linePrefix = '';
        }

        if ( $endingSpaceCount > 0 )
        {
             $lineSuffix = getIndentationText( $endingSpaceCount - 1 ) . '‗';
        }
        else
        {
            $lineSuffix = '';
        }

         $multilineStringLine = $linePrefix . getEscapedLine( $lineContent, $primedTextIsEscaped ) . $lineSuffix;

        if ( $lineIndex === $lineCount - 1 )
        {
            $multilineStringLine .= '‴';
        }

        if ( $lineIndex === 0 )
        {
            $multilineString .= $multilineStringLine;
        }
        else
        {
            $multilineString .= "\n" . $indentationText . $multilineStringLine;
        }
    }

    return $multilineString;
}

// ~~

function buildGsonString(
    $value,
    $primedTextIsGenerated = true,
    $primedTextIsEscaped = true,
    &$context = null,
    $level = 0,
    $lineSuffix = ''
    )
{
     $indentationText = getIndentationText( $level * $context[ 'levelSpaceCount' ] );

    if ( $primedTextIsGenerated
         && ( str_starts_with( $value, '‼' )
              || str_contains( $value, "\n" ) ) )
    {
        if ( str_starts_with( $value, '‼' ) )
        {
             $text = '‴' . getEscapedLine( $value, $primedTextIsEscaped ) . '‴' . $lineSuffix;
            $context[ 'lineArray' ][] = $indentationText . $text;
        }
        else
        {
             $multilineString = getMultilineString( $value, $primedTextIsEscaped, $indentationText );
             $lineArray = explode( "\n", $multilineString );
             $lastIndex = count( $lineArray ) - 1;

            for (  $lineIndex = 0;
                  $lineIndex < count( $lineArray );
                  ++$lineIndex )
            {
                 $line = $lineArray[ $lineIndex ];

                if ( $lineIndex === $lastIndex
                     && $lineSuffix )
                {
                    $line .= $lineSuffix;
                }

                $context[ 'lineArray' ][] = $line;
            }
        }
    }
    else
    {
         $text = '"' . getEscapedLine( $value, $primedTextIsEscaped ) . '"' . $lineSuffix;
        $context[ 'lineArray' ][] = $indentationText . $text;
    }
}

// ~~

function buildGsonValue(
    $value,
    $primedTextIsGenerated = true,
    $primedTextIsEscaped = true,
    &$context = null,
    $level = 0
    )
{
     $indentationText = getIndentationText( $level * $context[ 'levelSpaceCount' ] );

    if ( is_string( $value ) )
    {
        buildGsonString( $value, $primedTextIsGenerated, $primedTextIsEscaped, $context, $level, '' );
    }
    else if ( is_array( $value )
              && array_is_list( $value ) )
    {
        $context[ 'lineArray' ][] = $indentationText . '[';

         $elementCount = count( $value );

        for (  $elementIndex = 0;
              $elementIndex < $elementCount;
              ++$elementIndex )
        {
             $element = $value[ $elementIndex ];
             $lineSuffix = ( $elementIndex < $elementCount - 1 ) ? ',' : '';

            buildGsonValue(
                $element,
                $primedTextIsGenerated,
                $primedTextIsEscaped,
                $context,
                $level + 1
                );

            if ( $lineSuffix )
            {
                 $lastIndex = count( $context[ 'lineArray' ] ) - 1;
                $context[ 'lineArray' ][ $lastIndex ] .= $lineSuffix;
            }
        }

        $context[ 'lineArray' ][] = $indentationText . ']';
    }
    else if ( $value !== null
              && ( is_array( $value )
                   || is_object( $value ) ) )
    {
        if ( is_object( $value ) )
        {
            $value = get_object_vars( $value );
        }

        $context[ 'lineArray' ][] = $indentationText . '{';

         $keyArray = array_keys( $value );
         $keyCount = count( $keyArray );

        for (  $keyIndex = 0;
              $keyIndex < $keyCount;
              ++$keyIndex )
        {
             $key = $keyArray[ $keyIndex ];
             $keyIndentationText = getIndentationText( ( $level + 1 ) * $context[ 'levelSpaceCount' ] );
             $valueIndentLevel = $level + 2;
             $lineSuffix = ( $keyIndex < $keyCount - 1 ) ? ',' : '';

            $context[ 'lineArray' ][] = $keyIndentationText . json_encode( $key, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . ':';

            buildGsonValue(
                $value[ $key ],
                $primedTextIsGenerated,
                $primedTextIsEscaped,
                $context,
                $valueIndentLevel
                );

            if ( $lineSuffix )
            {
                 $lastIndex = count( $context[ 'lineArray' ] ) - 1;
                $context[ 'lineArray' ][ $lastIndex ] .= $lineSuffix;
            }
        }

        $context[ 'lineArray' ][] = $indentationText . '}';
    }
    else
    {
        $context[ 'lineArray' ][] = $indentationText . json_encode( $value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
    }
}

// ~~

function buildGsonText(
    $value,
    $primedTextIsGenerated = true,
    $primedTextIsEscaped = true,
    $indentationSpaceCount = 4
    )
{
     $context =
        [
            'levelSpaceCount' => $indentationSpaceCount,
            'lineArray' => []
        ];

    buildGsonValue(
        $value,
        $primedTextIsGenerated,
        $primedTextIsEscaped,
        $context,
        0
        );

    return implode( "\n", $context[ 'lineArray' ] );
}

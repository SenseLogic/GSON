// -- IMPORTS

import "dart:convert";

// -- VARIABLES

var cachedIndentationText = "                                ";

// -- FUNCTIONS

String getIndentationText(
    int indentationSpaceCount
    )
{
    while ( cachedIndentationText.length < indentationSpaceCount )
    {
        cachedIndentationText += "                                ";
    }

    return cachedIndentationText.substring( 0, indentationSpaceCount );
}

// ~~

String getEscapedLine(
    String line,
    [
        bool primedTextIsEscaped = true
    ]
    )
{
    var escapedLine = jsonEncode( line ).substring( 1, jsonEncode( line ).length - 1 ).replaceAll( "‴", "\\u2034" );

    if ( primedTextIsEscaped )
    {
        return escapedLine.replaceAll( "‼", "\\u203C" ).replaceAll( "‗", "\\u2017" );
    }
    else
    {
        return escapedLine;
    }
}

// ~~

String getMultilineString(
    String value,
    bool primedTextIsEscaped,
    String indentationText
    )
{
    var lineArray = value.replaceAll( "\r", "" ).split( "\n" );
    var lineCount = lineArray.length;
    var multilineString = indentationText + "‴";

    for ( var lineIndex = 0;
          lineIndex < lineCount;
          ++lineIndex )
    {
        var line = lineArray[ lineIndex ];
        var startingSpaceCount = 0;

        while ( startingSpaceCount < line.length
                && line[ startingSpaceCount ] == " " )
        {
            ++startingSpaceCount;
        }

        var trimmedLine = line.replaceFirst( RegExp( r"\s+$" ), "" );
        var endingSpaceCount = line.length - trimmedLine.length;
        var lineContent = trimmedLine.substring( startingSpaceCount );

        String linePrefix;

        if ( startingSpaceCount > 0 )
        {
            linePrefix = "‗" + getIndentationText( startingSpaceCount - 1 );
        }
        else
        {
            linePrefix = "";
        }

        String lineSuffix;

        if ( endingSpaceCount > 0 )
        {
            lineSuffix = getIndentationText( endingSpaceCount - 1 ) + "‗";
        }
        else
        {
            lineSuffix = "";
        }

        var multilineStringLine = linePrefix + getEscapedLine( lineContent, primedTextIsEscaped ) + lineSuffix;

        if ( lineIndex == lineCount - 1 )
        {
            multilineStringLine = multilineStringLine + "‴";
        }

        if ( lineIndex == 0 )
        {
            multilineString += multilineStringLine;
        }
        else
        {
            multilineString += "\n" + indentationText + multilineStringLine;
        }
    }

    return multilineString;
}

// ~~

void buildGsonString(
    String value,
    bool primedTextIsGenerated,
    bool primedTextIsEscaped,
    Map<String, dynamic> context,
    int level,
    [
        String lineSuffix = ""
    ]
    )
{
    var indentationText  = getIndentationText( level * ( context[ "levelSpaceCount" ] as int ) );

    if ( primedTextIsGenerated
         && ( value.startsWith( "‼" )
              || value.contains( "\n" ) ) )
    {
        if ( value.startsWith( "‼" ) )
        {
            var text = "‴" + getEscapedLine( value, primedTextIsEscaped ) + "‴" + lineSuffix;
            ( context[ "lineArray" ] as List<String> ).add( indentationText  + text );
        }
        else
        {
            var multilineString = getMultilineString( value, primedTextIsEscaped, indentationText );
            var lineArray = multilineString.split( "\n" );
            var lastIndex = lineArray.length - 1;

            for ( var lineIndex = 0;
                  lineIndex < lineArray.length;
                  ++lineIndex )
            {
                var line = lineArray[ lineIndex ];

                if ( lineIndex == lastIndex
                     && lineSuffix.isNotEmpty )
                {
                    line += lineSuffix;
                }

                ( context[ "lineArray" ] as List<String> ).add( line );
            }
        }
    }
    else
    {
        var text = '"' + getEscapedLine( value, primedTextIsEscaped ) + '"' + lineSuffix;

        ( context[ "lineArray" ] as List<String> ).add( indentationText  + text );
    }
}

// ~~

void buildGsonValue(
    dynamic value,
    bool primedTextIsGenerated,
    bool primedTextIsEscaped,
    Map<String, dynamic> context,
    int level
    )
{
    var indentationText  = getIndentationText( level * ( context[ "levelSpaceCount" ] as int ) );

    if ( value is String )
    {
        buildGsonString( value, primedTextIsGenerated, primedTextIsEscaped, context, level, "" );
    }
    else if ( value is List )
    {
        ( context[ "lineArray" ] as List<String> ).add( indentationText  + "[" );

        var elementCount = value.length;

        for ( var elementIndex = 0;
              elementIndex < elementCount;
              ++elementIndex )
        {
            var element = value[ elementIndex ];
            var lineSuffix = ( elementIndex < elementCount - 1 ) ? "," : "";

            buildGsonValue(
                element,
                primedTextIsGenerated,
                primedTextIsEscaped,
                context,
                level + 1
                );

            if ( lineSuffix.isNotEmpty )
            {
                var lastIndex = ( context[ "lineArray" ] as List<String> ).length - 1;
                ( context[ "lineArray" ] as List<String> )[ lastIndex ]
                    += lineSuffix;
            }
        }

        ( context[ "lineArray" ] as List<String> ).add( indentationText  + "]" );
    }
    else if ( value != null
              && value is Map )
    {
        ( context[ "lineArray" ] as List<String> ).add( indentationText  + "{" );

        var keyArray = value.keys.toList();
        var keyCount = keyArray.length;

        for ( var keyIndex = 0;
              keyIndex < keyCount;
              ++keyIndex )
        {
            var key = keyArray[ keyIndex ];
            var keyIndentationText = getIndentationText( ( level + 1 ) * ( context[ "levelSpaceCount" ] as int ) );
            var valueIndentLevel = level + 2;
            var lineSuffix = ( keyIndex < keyCount - 1 ) ? "," : "";

            ( context[ "lineArray" ] as List<String> ).add( keyIndentationText + jsonEncode( key ) + ":" );

            buildGsonValue(
                value[ key ],
                primedTextIsGenerated,
                primedTextIsEscaped,
                context,
                valueIndentLevel
                );

            if ( lineSuffix.isNotEmpty )
            {
                var lastIndex = ( context[ "lineArray" ] as List<String> ).length - 1;
                ( context[ "lineArray" ] as List<String> )[ lastIndex ]
                    += lineSuffix;
            }
        }

        ( context[ "lineArray" ] as List<String> ).add( indentationText  + "}" );
    }
    else
    {
        ( context[ "lineArray" ] as List<String> ).add( indentationText  + jsonEncode( value ) );
    }
}

// ~~

String buildGsonText(
    dynamic value,
    [
        bool primedTextIsGenerated = true,
        bool primedTextIsEscaped = true,
        int indentationSpaceCount = 4
    ]
    )
{
    var context =
        <String, dynamic>{
            "levelSpaceCount": indentationSpaceCount,
            "lineArray": <String>[]
        };

    buildGsonValue(
        value,
        primedTextIsGenerated,
        primedTextIsEscaped,
        context,
        0
        );

    return ( context[ "lineArray" ] as List<String> ).join( "\n" );
}

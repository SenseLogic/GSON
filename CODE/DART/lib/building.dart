// -- IMPORTS

import 'dart:convert';

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
    String text
    )
{
    return
        text
            .replaceAll( '\\', '\\\\' )
            .replaceAll( '\b', '\\b' )
            .replaceAll( '\f', '\\f' )
            .replaceAll( '\r', '' )
            .replaceAll( '\t', '\\t' )
            .replaceAllMapped(
                RegExp( r'[\x00-\x1F-]' ),
                ( Match match )
                {
                    var character = match.group( 0 )!;
                    var codeUnit = character.codeUnitAt( 0 );

                    return '\\u${ codeUnit.toRadixString( 16 ).padLeft( 4, '0' ) }';
                } 
                )
            .replaceAll( '‴', '\\u2034' );
}

// ~~

String getMultilineString(
    String value,
    String indentationText
    )
{
    var lineArray = value.replaceAll( '\r', '' ).split( '\n' );
    var lineCount = lineArray.length;
    var multilineString = indentationText + '‴';

    for ( var lineIndex = 0; lineIndex < lineCount; ++lineIndex )
    {
        var line = lineArray[ lineIndex ];
        var startingSpaceCount = 0;

        while ( startingSpaceCount < line.length
                && line[ startingSpaceCount ] == ' ' )
        {
            ++startingSpaceCount;
        }

        var trimmedLine = line.replaceFirst( RegExp( r'\s+$' ), '' );
        var endingSpaceCount = line.length - trimmedLine.length;
        var lineContent = trimmedLine.substring( startingSpaceCount );

        String linePrefix;

        if ( startingSpaceCount > 0 )
        {
            linePrefix = '‗' + getIndentationText( startingSpaceCount - 1 );
        }
        else
        {
            linePrefix = '';
        }

        String lineSuffix;

        if ( endingSpaceCount > 0 )
        {
            lineSuffix = getIndentationText( endingSpaceCount - 1 ) + '‗';
        }
        else
        {
            lineSuffix = '';
        }

        var multilineStringLine = linePrefix + getEscapedLine( lineContent ) + lineSuffix;

        if ( lineIndex == lineCount - 1 )
        {
            multilineStringLine = multilineStringLine + '‴';
        }

        if ( lineIndex == 0 )
        {
            multilineString += multilineStringLine;
        }
        else
        {
            multilineString += '\n' + indentationText + multilineStringLine;
        }
    }

    return multilineString;
}

// ~~

void buildGsonString(
    String value,
    Map<String, dynamic> context,
    int level, [
        String lineSuffix = ''
    ]
    )
{
    var indent = getIndentationText( level * ( context[ 'levelSpaceCount' ] as int ) );

    if ( value.startsWith( '‼' )
         || value.contains( '\n' ) )
    {
        if ( value.startsWith( '‼' ) )
        {
            var text = '‴' + getEscapedLine( value ) + '‴' + lineSuffix;
            ( context[ 'lineArray' ] as List<String> ).add( indent + text );
        }
        else
        {
            var multilineString = getMultilineString( value, indent );
            var lineArray = multilineString.split( '\n' );
            var lastIndex = lineArray.length - 1;

            for ( var lineIndex = 0; lineIndex < lineArray.length; ++lineIndex )
            {
                var line = lineArray[ lineIndex ];

                if ( lineIndex == lastIndex
                     && lineSuffix.isNotEmpty )
                {
                    line += lineSuffix;
                }

                ( context[ 'lineArray' ] as List<String> ).add( line );
            }
        }
    }
    else
    {
        var text = jsonEncode( value ) + lineSuffix;
        ( context[ 'lineArray' ] as List<String> ).add( indent + text );
    }
}

// ~~

void buildGsonValue(
    dynamic value,
    Map<String, dynamic> context,
    int level
    )
{
    var indent = getIndentationText( level * ( context[ 'levelSpaceCount' ] as int ) );

    if ( value is String )
    {
        buildGsonString( value, context, level, '' );
    }
    else if ( value is List )
    {
        ( context[ 'lineArray' ] as List<String> ).add( indent + '[' );

        var elementCount = value.length;

        for ( var elementIndex = 0; elementIndex < elementCount; ++elementIndex )
        {
            var element = value[ elementIndex ];
            var lineSuffix = ( elementIndex < elementCount - 1 ) ? ',' : '';

            buildGsonValue(
                element,
                context,
                level + 1
                );

            if ( lineSuffix.isNotEmpty )
            {
                var lastIndex = ( context[ 'lineArray' ] as List<String> ).length - 1;
                ( context[ 'lineArray' ] as List<String> )[ lastIndex ]
                    += lineSuffix;
            }
        }

        ( context[ 'lineArray' ] as List<String> ).add( indent + ']' );
    }
    else if ( value != null
              && value is Map )
    {
        ( context[ 'lineArray' ] as List<String> ).add( indent + '{' );

        var keys = value.keys.toList();
        var keyCount = keys.length;

        for ( var keyIndex = 0; keyIndex < keyCount; ++keyIndex )
        {
            var key = keys[ keyIndex ];
            var keyIndent = getIndentationText( ( level + 1 ) * ( context[ 'levelSpaceCount' ] as int ) );
            var valueIndentLevel = level + 2;
            var lineSuffix = ( keyIndex < keyCount - 1 ) ? ',' : '';

            ( context[ 'lineArray' ] as List<String> ).add( keyIndent + jsonEncode( key ) + ':' );

            buildGsonValue(
                value[ key ],
                context,
                valueIndentLevel
                );

            if ( lineSuffix.isNotEmpty )
            {
                var lastIndex = ( context[ 'lineArray' ] as List<String> ).length - 1;
                ( context[ 'lineArray' ] as List<String> )[ lastIndex ]
                    += lineSuffix;
            }
        }

        ( context[ 'lineArray' ] as List<String> ).add( indent + '}' );
    }
    else
    {
        ( context[ 'lineArray' ] as List<String> ).add( indent + jsonEncode( value ) );
    }
}

// ~~

String buildGsonText(
    dynamic value, {
    int indentationSpaceCount = 4
    }
    )
{
    var context =
        <String, dynamic>{
            'levelSpaceCount': indentationSpaceCount,
            'lineArray': <String>[]
        };

    buildGsonValue(
        value,
        context,
        0
        );

    return ( context[ 'lineArray' ] as List<String> ).join( '\n' );
}

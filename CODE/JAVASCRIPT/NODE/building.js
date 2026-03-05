// -- VARIABLES

let cachedIndentationText = '                                ';

// -- FUNCTIONS

export function getIndentationText(
    indentationSpaceCount
    )
{
    while ( cachedIndentationText.length < indentationSpaceCount )
    {
        cachedIndentationText += '                                ';
    }

    return cachedIndentationText.slice( 0, indentationSpaceCount );
}

// ~~

function getEscapedLine(
    text
    )
{
    return (
        text
            .replaceAll( '\\', '\\\\' )
            .replaceAll( '\b', '\\b' )
            .replaceAll( '\f', '\\f' )
            .replaceAll( '\r', '' )
            .replaceAll( '\t', '\\t' )
            .replaceAll( /[-\u001F]/g, character => `\\u${ character.charCodeAt( 0 ).toString( 16 ).padStart( 4, '0' ) }` )
            .replaceAll( '‴', '\\u2034' )
        );
}

// ~~

function getMultilineString(
    value,
    indentationText
    )
{
    let lineArray = value.replaceAll( '\r', '' ).split( '\n' );
    let lineCount = lineArray.length;
    let multilineString = indentationText + '‴';

    for ( let lineIndex = 0;
          lineIndex < lineCount;
          ++lineIndex )
    {
        let line = lineArray[ lineIndex ];
        let startingSpaceCount = 0;

        while ( startingSpaceCount < line.length
                && line[ startingSpaceCount ] === ' ' )
        {
            ++startingSpaceCount;
        }

        let trimmedLine = line.trimEnd();
        let endingSpaceCount = line.length - trimmedLine.length;
        let lineContent = trimmedLine.slice( startingSpaceCount );

        let linePrefix;

        if ( startingSpaceCount > 0 )
        {
            linePrefix = '‗' + getIndentationText( startingSpaceCount - 1 );
        }
        else
        {
            linePrefix = '';
        }

        let lineSuffix;

        if ( endingSpaceCount > 0 )
        {
            lineSuffix = getIndentationText( endingSpaceCount - 1 ) + '‗';
        }
        else
        {
            lineSuffix = '';
        }

        let multilineStringLine = linePrefix + getEscapedLine( lineContent ) + lineSuffix;

        if ( lineIndex === lineCount - 1 )
        {
            multilineStringLine = multilineStringLine + '‴';
        }

        if ( lineIndex === 0 )
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

function buildGsonString(
    value,
    context,
    level,
    lineSuffix = ''
    )
{
    let indentationText  = getIndentationText( level * context.levelSpaceCount );

    if ( value.startsWith( '‼' )
         || value.includes( '\n' ) )
    {
        if ( value.startsWith( '‼' ) )
        {
            let text = '‴' + getEscapedLine( value ) + '‴' + lineSuffix;
            context.lineArray.push( indentationText  + text );
        }
        else
        {
            let multilineString = getMultilineString( value, indentationText  );
            let lineArray = multilineString.split( '\n' );
            let lastIndex = lineArray.length - 1;

            for ( let lineIndex = 0;
                  lineIndex < lineArray.length;
                  ++lineIndex )
            {
                let line = lineArray[ lineIndex ];

                if ( lineIndex === lastIndex
                     && lineSuffix )
                {
                    line += lineSuffix;
                }

                context.lineArray.push( line );
            }
        }
    }
    else
    {
        let text = JSON.stringify( value ) + lineSuffix;
        context.lineArray.push( indentationText  + text );
    }
}

// ~~

function buildGsonValue(
    value,
    context,
    level
    )
{
    let indentationText  = getIndentationText( level * context.levelSpaceCount );

    if ( typeof value === 'string' )
    {
        buildGsonString( value, context, level, '' );
    }
    else if ( Array.isArray( value ) )
    {
        context.lineArray.push( indentationText  + '[' );

        let elementCount = value.length;

        for ( let elementIndex = 0;
              elementIndex < elementCount;
              ++elementIndex )
        {
            let element = value[ elementIndex ];
            let lineSuffix = ( elementIndex < elementCount - 1 ) ? ',' : '';

            buildGsonValue(
                element,
                context,
                level + 1
                );

            if ( lineSuffix )
            {
                let lastIndex = context.lineArray.length - 1;
                context.lineArray[ lastIndex ] += lineSuffix;
            }
        }

        context.lineArray.push( indentationText  + ']' );
    }
    else if ( value !== null
              && typeof value === 'object' )
    {
        context.lineArray.push( indentationText  + '{' );

        let keyArray = Object.keys( value );
        let keyCount = keyArray.length;

        for ( let keyIndex = 0;
              keyIndex < keyCount;
              ++keyIndex )
        {
            let key = keyArray[ keyIndex ];
            let keyIndentationText = getIndentationText( ( level + 1 ) * context.levelSpaceCount );
            let valueIndentLevel = level + 2;
            let lineSuffix = ( keyIndex < keyCount - 1 ) ? ',' : '';

            context.lineArray.push( keyIndentationText + JSON.stringify( key ) + ':' );

            buildGsonValue(
                value[ key ],
                context,
                valueIndentLevel
                );

            if ( lineSuffix )
            {
                let lastIndex = context.lineArray.length - 1;
                context.lineArray[ lastIndex ] += lineSuffix;
            }
        }

        context.lineArray.push( indentationText  + '}' );
    }
    else
    {
        context.lineArray.push( indentationText  + JSON.stringify( value ) );
    }
}

// ~~

export function buildGsonText(
    value,
    {
        indentationSpaceCount = 4
    } = {}
    )
{
    let context =
        {
            levelSpaceCount: indentationSpaceCount,
            lineArray: []
        };

    buildGsonValue(
        value,
        context,
        0
        );

    return context.lineArray.join( '\n' );
}

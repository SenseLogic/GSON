<?php
// -- IMPORTS

require_once __DIR__ . '/building.php';

// -- FUNCTIONS

function writeFileText(
    $filePath,
    $fileText,
    $ignored = null
    )
{
    file_put_contents( $filePath, $fileText );
}

// ~~

function writeGsonValue(
    $filePath,
    $value
    )
{
    writeFileText( $filePath, buildGsonText( $value ) );
}

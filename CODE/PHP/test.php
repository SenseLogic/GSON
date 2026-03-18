<?php
// -- IMPORTS

require_once __DIR__ . '/index.php';

// -- STATEMENTS

if ( !is_dir( __DIR__ . '/OUT' ) )
{
    mkdir( __DIR__ . '/OUT', 0777, true );
}

$jsonText = readGsonFileText( __DIR__ . '/../../DATA/test.gson' );
echo $jsonText . "\n";
writeFileText( __DIR__ . '/OUT/processed_test.json', $jsonText );

$jsonValue = readGsonFileValue( __DIR__ . '/../../DATA/test.gson' );
echo json_encode( $jsonValue, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . "\n";

$gsonText = buildGsonText( $jsonValue );
echo $gsonText . "\n";
writeFileText( __DIR__ . '/OUT/processed_test.gson', $gsonText, 4 );

$jsonText = readGsonFileText( __DIR__ . '/../../DATA/test.gson', false );
echo $jsonText . "\n";
writeFileText( __DIR__ . '/OUT/unprocessed_test.json', $jsonText );

$gsonText = buildGsonText( $jsonValue, false );
echo $gsonText . "\n";
writeFileText( __DIR__ . '/OUT/unprocessed_test.gson', $gsonText, 4 );

$jsonValue = readGsonFileValue( __DIR__ . '/../../DATA/test.gson', false );
echo json_encode( $jsonValue, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . "\n";

$gsonText = buildGsonText( $jsonValue, true, false );
echo $gsonText . "\n";
writeFileText( __DIR__ . '/OUT/unprocessed_test.gson', $gsonText, 4 );

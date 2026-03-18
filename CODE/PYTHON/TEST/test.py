from senselogic_gson import build_gson_text, read_gson_file_text, read_gson_file_value, write_file_text;

import json as _json;


json_text = read_gson_file_text( "../../../DATA/test.gson" );
print( json_text );
write_file_text( "OUT/processed_test.json", json_text );

json_value = read_gson_file_value( "../../../DATA/test.gson" );
print( _json.dumps( json_value ) );

gson_text = build_gson_text( json_value );
print( gson_text );
write_file_text( "OUT/processed_test.gson", gson_text );

json_text = read_gson_file_text( "../../../DATA/test.gson", False );
print( json_text );
write_file_text( "OUT/unprocessed_test.json", json_text );

gson_text = build_gson_text( json_value, False );
print( gson_text );
write_file_text( "OUT/unprocessed_test.gson", gson_text );

json_value = read_gson_file_value( "../../../DATA/test.gson", False );
print( _json.dumps( json_value ) );

gson_text = build_gson_text( json_value, True, False );
print( gson_text );
write_file_text( "OUT/unprocessed_test.gson", gson_text );


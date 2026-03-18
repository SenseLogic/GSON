![](https://github.com/senselogic/GSON/blob/master/LOGO/gson.png)

# GSON

Granular Structured Object Notation.

## Features

GSON is a superset of JSON with:
*   Fast parsing through Unicode markers.
*   A simple syntax for:
    *   Multiline strings
    *   File inclusion
    *   UUID and TUID generation

## Sample

```
{
    "path":
        "test.json",
    "text":
        ‴first line
        second line
        third line ‗
        ‗ fourth line
        fifth line‴,
    "person":
        {
            "name":
                "Jack",
            "age":
                48
        },
    "personArray":
        [
            {
                "name":
                    "Mike",
                "age":
                    35
            },
            {
                "name":
                    "Nina",
                "age":
                    32
            },
            {
                "name":
                    "Pete",
                "age":
                    38
            }
        },
    "personByIdMap":
        {
            "mike":
                {
                    "name":
                        "Mike",
                    "age":
                        35
                },
            "nina":
                {
                    "name":
                        "Nina",
                    "age":
                        32
                },
            "pete":
                {
                    "name":
                        "Pete",
                    "age":
                        38
                }
        ],
    "escaped":
        "\u2034",
    "uuid":
        ‴‼#jack‴,
    "tuid":
        ‴‼%jack‴,
    "included":
        ‴‼@included.gson‴
}
```

## Syntax

Any JSON file is also a GSON file, since GSON is a superset of JSON.

Multiline strings are enclosed by `‴` characters, and use the `‗` character to represent a non-trimmable space:
```
‴first line
second line
third line ‗
‗ fourth line
fifth line‴
```

Command strings are also enclosed by `‴` characters, but start with a `‼` character:
* `‴‼#id‴` generates an MD5-based UUID.
* `‴‼%id‴` generates an MD5-based TUID.
* `‴‼@path/to/file.gson‴` includes the contents of another GSON file.

## Limitations

When used as literal text:
* The `‴` character must be escaped in string literals.
* The `‼` and `‗` characters must be escaped in multiline string literals.

## Version

0.1

## Author

Eric Pelzer (ecstatic.coder@gmail.com).

## License

This project is licensed under the GNU Lesser General Public License version 3.

See the [LICENSE.md](LICENSE.md) file for details.

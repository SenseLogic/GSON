![](https://github.com/senselogic/GSON/blob/master/LOGO/gson.png)

# GSON

Granular Structured Object Notation.

## Features

*   Multiline strings
*   File inclusions
*   UUID and TUID generation
*   Customizable commands
*   Ultra fast parsing based on obscure Unicode characters

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

Multiline strings are enclosed between `‴` characters, and use the `‗` character to represent a non-trimmable space:
```
‴first line
second line
third line ‗
‗ fourth line
fifth line‴
```

Command strings are also enclosed between `‴` characters, but start with a `‼` character:
* `‴‼#id‴` generates an MD5-based UUID.
* `‴‼%id‴` generates an MD5-based TUID.
* `‴‼@path/to/file.gson‴` includes the contents of another GSON file.

## Limitations

*   The `‴` character must be escaped in string literals.
*   The `‼` and `‗` characters can't be used in multiline string literals.

## Version

0.1

## Author

Eric Pelzer (ecstatic.coder@gmail.com).

## License

This project is licensed under the GNU Lesser General Public License version 3.

See the [LICENSE.md](LICENSE.md) file for details.

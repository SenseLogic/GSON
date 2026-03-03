![](https://github.com/senselogic/GSON/blob/master/LOGO/gson.png)

# GSON

Granular Structured Object Notation.

## Features

*   Multiline strings
*   File inclusions
*   UUID and TUID generation
*   Customizable commands
*   Ultra fast parsing
*   Based on obscure characters

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

## Limitations

*   `‴` must be escaped in string literals.
*   `‼` and `‗` can't be used in string literals.

## Version

0.1

## Author

Eric Pelzer (ecstatic.coder@gmail.com).

## License

This project is licensed under the GNU Lesser General Public License version 3.

See the [LICENSE.md](LICENSE.md) file for details.

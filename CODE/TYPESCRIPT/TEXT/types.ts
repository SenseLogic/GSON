// -- TYPES

export type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonValue[]
    | { [ key: string ]: JsonValue };

// ~~

export type GsonValue =
    | JsonValue
    | Map< unknown, unknown >;

// ~~

export type FetchFileTextFunction =
    (
        filePath: string
    ) => string | Promise< string >;

// ~~

export type ProcessPrimedTextFunction =
    (
        primedText: string
    ) => string;

// ~~

export interface BuildGsonContext
{
    levelSpaceCount: number;
    lineArray: string[];
}

// -- TYPES

export type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonValue[]
    | { [ key: string ]: JsonValue };

// ~~

export type ReadFileTextFunction =
    (
        filePath: string
    ) => string;

// ~~

export type ProcessPrimedTextFunction =
    (
        primedText: string
    ) => string;

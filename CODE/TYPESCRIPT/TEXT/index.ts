// -- IMPORTS

import { buildGsonText } from "./building.ts";
import { haveSameValue } from "./equivalence.ts";
import { fetchFileText, getFetchedJsonText, fetchGsonFileText, fetchGsonFileValue } from "./fetching.ts";
import { getTextHash, getTextUuid, getTextTuid, processPrimedText } from "./processing.ts";

// -- EXPORTS

export {
    fetchFileText,
    fetchGsonFileText,
    fetchGsonFileValue,
    getFetchedJsonText,
    buildGsonText,
    getTextHash,
    getTextTuid,
    getTextUuid,
    haveSameValue,
    processPrimedText,
    };

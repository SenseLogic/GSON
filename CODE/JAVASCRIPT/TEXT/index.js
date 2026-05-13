// -- IMPORTS

import { buildGsonText } from "./building.js";
import { haveSameValue } from "./equivalence.js";
import { fetchFileText, getFetchedJsonText, fetchGsonFileText, fetchGsonFileValue } from "./fetching.js";
import { getTextHash, getTextUuid, getTextTuid, processPrimedText } from "./processing.js";

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

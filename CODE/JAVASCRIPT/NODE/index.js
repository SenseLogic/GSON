// -- IMPORTS

import { buildGsonText } from './building.js';
import { getDumpText } from './dumping.js';
import { haveSameValue } from './equivalence.js';
import { fetchFileText, getFetchedJsonText, fetchGsonFileText, fetchGsonFileValue } from './fetching.js';
import { readFileText, getReadJsonText, readGsonFileText, readGsonFileValue } from './reading.js';
import { getTextHash, getTextUuid, getTextTuid, processPrimedText } from './processing.js';
import { writeFileText, writeGsonValue } from './writing.js';

// -- EXPORTS

export {
    fetchFileText,
    fetchGsonFileText,
    fetchGsonFileValue,
    getDumpText,
    getFetchedJsonText,
    buildGsonText,
    getReadJsonText,
    getTextHash,
    getTextTuid,
    getTextUuid,
    haveSameValue,
    processPrimedText,
    readFileText,
    readGsonFileText,
    readGsonFileValue,
    writeFileText,
    writeGsonValue
    };

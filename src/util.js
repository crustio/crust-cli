const { Keyring } = require('@polkadot/keyring');

/**
 * Judge arg exist with calling different functions
 * @param {Object} arg 
 * @param {Function} err 
 * @param {Function} handler 
 */
function withHelper(arg, err, handler) {
    if (!arg) {
        err();
    } else {
        handler();
    }
}

/**
 * Send tx to Crust Network
 * @param {SubmittableExtrinsic} tx substrate-style tx
 * @param {string} seeds tx already been sent
 */
async function sendTx(tx, seeds) {
    console.log('⛓  Send tx to chain...');
    const krp = loadKeyringPair(seeds);

    return new Promise((resolve, reject) => {
        tx.signAndSend(krp, ({events = [], status}) => {
            console.log(
                `  ↪ 💸  Transaction status: ${status.type}, nonce: ${tx.nonce}`
            );

            if (
                status.isInvalid ||
                status.isDropped ||
                status.isUsurped ||
                status.isRetracted
            ) {
                reject(new Error('Invalid transaction'));
            } else {
                // Pass it
            }

            if (status.isInBlock) {
                events.forEach(({event: {method, section}}) => {
                if (section === 'system' && method === 'ExtrinsicFailed') {
                    // Error with no detail, just return error
                    console.error(`  ↪ ❌  Send transaction(${tx.type}) failed.`);
                    resolve(false);
                } else if (method === 'ExtrinsicSuccess') {
                    console.log(`  ↪ ✅  Send transaction(${tx.type}) success.`);
                    resolve(true);
                }
                });
            } else {
                // Pass it
            }
        }).catch(e => {
            reject(e);
        });
    });
}

/**
 * Parse object into JSON object
 * @param {Object} o any object
 */
function parseObj(o) {
    return JSON.parse(JSON.stringify(o));
}

/**
 * Load keyring pair with seeds
 * @param {string} seeds 
 */
function loadKeyringPair(seeds) {
    const kr = new Keyring({
        type: 'sr25519',
    });

    const krp = kr.addFromUri(seeds);
    return krp;
}

module.exports = {
    withHelper,
    sendTx,
    parseObj
}
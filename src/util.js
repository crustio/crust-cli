
function withHelper(arg, err, handler) {
    if (!arg) {
        err();
    } else {
        handler();
    }
}

/**
 * Send tx to Crust Network
 * @param tx substrate-style tx
 * @returns tx already been sent
 */
async function sendTx(tx, seeds) {
    const krp = loadKeyringPair(seeds);

    return new Promise((resolve, reject) => {
        tx.signAndSend(krp, ({events = [], status}) => {
            console.debug(
                `  ↪ 💸 Transaction status: ${status.type}, nonce: ${tx.nonce}`
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
                    console.debug(`  ↪ 💸 ❌ Send transaction(${tx.type}) failed.`);
                    resolve(false);
                } else if (method === 'ExtrinsicSuccess') {
                    console.debug(`  ↪ 💸 ✅ Send transaction(${tx.type}) success.`);
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
 * Load keyring pair with seeds
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
}
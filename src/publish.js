const { ApiPromise, WsProvider } = require('@polkadot/api');
const { typesBundleForPolkadot } = require('@crustio/type-definitions');
const createClient = require('ipfs-http-client');
const fs = require('fs');
const { chainAddr, seedsPath, ipfsTimeout } = require('./consts');
const { sendTx } = require('./util');

module.exports = {
    default: async (cid) => {
        try {
            // 1. Check cid locally
            let existed = false;
            const ipfs = createClient({
                timeout: ipfsTimeout
            });
            for await (const pin of ipfs.pin.ls({
                paths: cid,
                types: 'recursive'
            })) {
                if (cid.equals(pin.cid)) existed = true;
            }
            if (!existed) {
                console.error(`Cid ${cid} don't existed, please pin it first`);
                return;
            }

            // 2. Get file size
            const objInfo = JSON.parse(await ipfs.object.stat(cid));
            const fileSize = objInfo.CumulativeSize;
            
            // 3. Try connect to Crust Network
            let chain = new ApiPromise({
                provider: new WsProvider(chainAddr),
                typesBundle: typesBundleForPolkadot
            });
            chain = await chain.isReadyOrError();

            // 4. Load seeds info
            const seeds = fs.readFileSync(seedsPath, 'utf8');

            // 5. Send place storage order tx
            const tx = chain.tx.market.placeStorageOrder(cid, fileSize, 0, false);
            const res = await sendTx(tx, seeds);
            if (res) {
                console.log(`Publish ${cid} success, you can monitor the status by calling status command`)
            } else {
                console.error('Publish failed with \'Send transaction failed\'')
            }
        } catch (e) {
            console.error(`Publish failed with: ${e}`);
        }
    }
}
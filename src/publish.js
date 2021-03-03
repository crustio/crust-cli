const { ApiPromise, WsProvider } = require('@polkadot/api');
const { typesBundleForPolkadot } = require('@crustio/type-definitions');
const IpfsHttpClient = require('ipfs-http-client');
const { CID } = IpfsHttpClient;
const fs = require('fs');
const { chainAddr, seedsPath, ipfsTimeout } = require('./consts');
const { sendTx, parseObj } = require('./util');

module.exports = {
    default: async (cid) => {
        try {
            // 1. Check cid locally
            const cidObj = new CID(cid);
            let existed = false;
            const ipfs = IpfsHttpClient({
                timeout: ipfsTimeout
            });
            for await (const pin of ipfs.pin.ls({
                paths: cidObj,
                types: 'recursive'
            })) {
                if (cidObj.equals(pin.cid)) existed = true;
            }
            if (!existed) {
                console.error(`Cid ${cid} don't existed, please pin it first`);
                return;
            }

            // 2. Get file size
            const objInfo = parseObj(await ipfs.object.stat(cid));
            const fileSize = objInfo.CumulativeSize;
            
            // 3. Try connect to Crust Network
            const chain = new ApiPromise({
                provider: new WsProvider(chainAddr),
                typesBundle: typesBundleForPolkadot
            });
            await chain.isReadyOrError;

            // 4. Load seeds info
            const seeds = fs.readFileSync(seedsPath, 'utf8');

            // 5. Send place storage order tx
            const tx = chain.tx.market.placeStorageOrder(cid, fileSize, 0, false);
            const res = await sendTx(tx, seeds);
            if (res) {
                console.log(`Publish ${cid} success`)
            } else {
                console.error('Publish failed with \'Send transaction failed\'')
            }

            // 6. Disconnect with chain
            chain.disconnect();
        } catch (e) {
            console.error(`Publish failed with: ${e}`);
        }
    }
}
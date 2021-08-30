const { ApiPromise, WsProvider } = require('@polkadot/api');
const { typesBundleForPolkadot } = require('@crustio/type-definitions');
const { parseObj } = require('./util');
const { chainAddr } = require('./consts');

module.exports = {
    default: async (cid) => {
        try {
            // 1. Try connect to Crust Network
            const chain = new ApiPromise({
                provider: new WsProvider(chainAddr),
                typesBundle: typesBundleForPolkadot
            });
            await chain.isReadyOrError;

            // 2. Query on-chain file data
            const maybeFileInfo = parseObj(await chain.query.market.files(cid));
            if (maybeFileInfo) {
                const replicaCount = maybeFileInfo.reported_replica_count;
                if (replicaCount === 0) {
                    console.log(`⚠️  ${cid} is pending...`);
                } else {
                    console.log(`✅  ${cid} is picked, replicas: ${replicaCount}`);
                }
            } else {
                console.error(`🗑  ${cid} is not existed or already expired`);
            }

            // 3. Disconnect with chain
            chain.disconnect();
        } catch (e) {
            console.error(`Query status failed with ${e}`);
        }
    }
}
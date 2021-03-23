# Crust Command Line

The Crust command-line interface (Crust CLI) is a set of commands used to access Crust Network resources

## Quick Start

Please refer this [doc]([https://](https://wiki.crust.network/docs/en/buildGettingStarted)) to see how Crust help to host your website without any servers

## Usage

### 1. Login

> Secret seeds will be stored locally and won't be leaked by cli-itself.

**Login** with Crust Account secret **seeds**(*12 random words*), it will be used to sign your publishing transaction.

```shell
npx crust-cli login "vanish desert itch writer pretty unite wax wistful painful pine key bore"
```

### 2. Pin

> If you are not familiar with IPFS, we highly recommend you to install [the IPFS Desktop of Crust version](https://apps.crust.network/#/storage/welcome)

**Pin** will add your file/folder to local IPFS. Make sure you installed [IPFS](https://ipfs.io/#install) and keep it running.

```shell
npx crust-cli pin my-website/build/
```

### 3. Publish

> Please login first, otherwise you will failed

**Publish** will send a `place storage order` transaction to chain, and the storage nodes in Crust Network will help you to store your file through IPFS

```shell
npx crust-cli publish QmevJf2rdNibZCGrgeyVJEM82y5DsXgMDHXM6zBtQ6G4Vj
```

### 4. Status

Status will help you to monitor your file on-chain

```shell
npx crust-cli status QmevJf2rdNibZCGrgeyVJEM82y5DsXgMDHXM6zBtQ6G4Vj
```

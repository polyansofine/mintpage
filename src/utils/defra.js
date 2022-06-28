// TODO functions should differentiate between a missing item and network error

import { config } from "../config";

export async function getCollectionByHash(ipfsHash) {
  try {
    const collection = await fetch(
      config().apiHost + `/collection/${ipfsHash}`
    ).then((res) => res.json());

    return collection;
  } catch (e) {
    console.log(e);
    return { error: `Unable to retrieve collection` };
  }
}

export async function getDeployableContract() {
  try {
    const contract = await fetch(config().apiHost + `/contract`)
      .then((res) => res.json())
      .catch((e) => console.log(e));

    return contract;
  } catch (e) {
    console.error(e);
    return { error: `Unable to retrieve contract` };
  }
}

export async function getIpfsHash(hash) {
  try {
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
    const text = await response.text();
    return JSON.parse(text);
  } catch (e) {
    console.error(e);
    return { error: `Unable to retrieve file` };
  }
}

import { ReputationLevel } from "@interrep/reputation-criteria";
import config from "src/config";
import { checkGroup } from "src/core/groups";
import {
  MerkleTreeNodeDocument,
  MerkleTreeNode,
  MerkleTreeZero,
} from "@interrep/data-models";
import { Provider } from "src/types/groups";
import poseidonHash from "src/utils/common/crypto/hasher";
import { PoapGroupName } from "../poap";

export default async function appendLeaf(
  provider: Provider,
  name: ReputationLevel | PoapGroupName | string,
  identityCommitment: string
): Promise<string> {
  if (!checkGroup(provider, name)) {
    throw new Error(`The group ${provider} ${name} does not exist`);
  }

  if (
    await MerkleTreeNode.findByGroupAndHash(
      { provider, name },
      identityCommitment
    )
  ) {
    throw new Error(
      `The identity commitment ${identityCommitment} already exist`
    );
  }

  // Get the zero hashes.
  const zeroes = await MerkleTreeZero.findZeroes();

  if (!zeroes || zeroes.length === 0) {
    throw new Error(`The zero hashes have not yet been created`);
  }

  // Get next available index at level 0.
  let currentIndex = await MerkleTreeNode.getNumberOfNodes(
    { provider, name },
    0
  );

  if (currentIndex >= 2 ** config.MERKLE_TREE_LEVELS) {
    throw new Error(`The tree is full`);
  }

  let node = await MerkleTreeNode.create({
    group: { provider, name },
    level: 0,
    index: currentIndex,
    hash: identityCommitment,
  });

  for (let level = 0; level < config.MERKLE_TREE_LEVELS; level++) {
    if (currentIndex % 2 === 0) {
      node.siblingHash = zeroes[level].hash;

      let parentNode = await MerkleTreeNode.findByGroupAndLevelAndIndex(
        { provider, name },
        level + 1,
        Math.floor(currentIndex / 2)
      );

      if (parentNode) {
        parentNode.hash = poseidonHash(node.hash, node.siblingHash);

        await parentNode.save();
      } else {
        parentNode = await MerkleTreeNode.create({
          group: {
            provider,
            name,
          },
          level: level + 1,
          index: Math.floor(currentIndex / 2),
          hash: poseidonHash(node.hash, node.siblingHash),
        });
      }

      node.parent = parentNode;

      await node.save();

      node = parentNode;
    } else {
      const siblingNode = (await MerkleTreeNode.findByGroupAndLevelAndIndex(
        { provider, name },
        level,
        currentIndex - 1
      )) as MerkleTreeNodeDocument;

      node.siblingHash = siblingNode.hash;
      siblingNode.siblingHash = node.hash;

      const parentNode = (await MerkleTreeNode.findByGroupAndLevelAndIndex(
        { provider, name },
        level + 1,
        Math.floor(currentIndex / 2)
      )) as MerkleTreeNodeDocument;

      parentNode.hash = poseidonHash(siblingNode.hash, node.hash);

      node.parent = parentNode;

      await node.save();
      await parentNode.save();
      await siblingNode.save();

      node = parentNode;
    }

    currentIndex = Math.floor(currentIndex / 2);
  }

  return node.hash;
}

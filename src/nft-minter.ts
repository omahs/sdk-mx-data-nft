import {
  Address,
  AddressValue,
  BigUIntValue,
  BooleanValue,
  ContractCallPayloadBuilder,
  ContractFunction,
  IAddress,
  StringValue,
  TokenIdentifierValue,
  Transaction,
  U64Value
} from '@multiversx/sdk-core/out';
import { Minter } from './minter';
import dataNftLeaseAbi from './abis/data-nft-lease.abi.json';

export class NftMinter extends Minter {
  constructor(env: string, contractAddress: string, timeout: number = 10000) {
    super(env, contractAddress, dataNftLeaseAbi, timeout);
  }

  /**
   * Creates an initialize contract transaction for the contract
   * @param senderAddress The address of the sender, must be the admin of the contract
   * @param collectionName The name of the NFT collection
   * @param tokenTicker The ticker of the NFT collection
   * @param mintLimit(seconds)- The mint limit between mints
   * @param requireMintTax - A boolean value to set if the mint tax is required or not
   * @param options - If `requireMintTax` is true, the `options` object must contain the `taxTokenIdentifier` and `taxTokenAmount`
   */
  initializeContract(
    senderAddress: IAddress,
    collectionName: string,
    tokenTicker: string,
    mintLimit: number,
    requireMintTax: boolean,
    options: {
      taxTokenIdentifier: string;
      taxTokenAmount: number;
    }
  ): Transaction {
    let data;
    if (requireMintTax && options) {
      data = new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('initializeContract'))
        .addArg(new StringValue(collectionName))
        .addArg(new StringValue(tokenTicker))
        .addArg(new BigUIntValue(mintLimit))
        .addArg(new BooleanValue(requireMintTax))
        .addArg(new TokenIdentifierValue(options.taxTokenIdentifier))
        .addArg(new BigUIntValue(options.taxTokenAmount))
        .build();
    } else {
      data = new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('initializeContract'))
        .addArg(new StringValue(collectionName))
        .addArg(new StringValue(tokenTicker))
        .addArg(new BigUIntValue(mintLimit))
        .addArg(new BooleanValue(requireMintTax))
        .build();
    }

    const initializeContractTx = new Transaction({
      value: 50000000000000000,
      data: data,
      receiver: this.contract.getAddress(),
      gasLimit: 10000000,
      sender: senderAddress,
      chainID: this.chainID
    });
    return initializeContractTx;
  }

  /**
   * Creates a updateAttributes transaction for the contract
   * @param senderAddress The address of the sender, must be the admin of the contract
   * @param tokenIdentiifer The token identifier of the data nft to update attributes
   * @param nonce The nonce of the token to update attributes
   * @param attributes The new attributes to update
   * @param quantity The quantity of the token to update attributes (default: 1)
   */
  updateAttributes(
    senderAddress: IAddress,
    tokenIdentiifer: string,
    nonce: number,
    attributes: {
      dataMarshalUrl: string;
      dataStreamUrl: string;
      dataPreviewUrl: string;
      creator: IAddress;
      title: string;
      description: string;
    },
    quantity = 1
  ): Transaction {
    const updateAttributesTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('ESDTNFTTransfer'))
        .addArg(new TokenIdentifierValue(tokenIdentiifer))
        .addArg(new U64Value(nonce))
        .addArg(new U64Value(quantity))
        .addArg(new AddressValue(this.contract.getAddress()))
        .addArg(new StringValue('updateAttributes'))
        .addArg(new StringValue(attributes.dataMarshalUrl))
        .addArg(new StringValue(attributes.dataStreamUrl))
        .addArg(new StringValue(attributes.dataPreviewUrl))
        .addArg(new AddressValue(attributes.creator))
        .addArg(new StringValue(attributes.title))
        .addArg(new StringValue(attributes.description))
        .build(),
      receiver: senderAddress,
      gasLimit: 12000000,
      sender: senderAddress,
      chainID: this.chainID
    });
    return updateAttributesTx;
  }

  /**
   * Creates a setLocalRoles transaction for the contract
   * @param senderAddress The address of the sender, must be the admin of the contract
   */
  setLocalRoles(senderAddress: IAddress): Transaction {
    const setLocalRolesTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('setLocalRoles'))
        .build(),
      receiver: this.contract.getAddress(),
      gasLimit: 10000000,
      sender: senderAddress,
      chainID: this.chainID
    });
    return setLocalRolesTx;
  }

  /**
   * Creates a setTransferRoles transaction for the contract
   * @param senderAddress The address of the sender, must be the admin of the contract
   * @param address The address to set the transfer roles
   */
  setTransferRole(senderAddress: IAddress, address: IAddress): Transaction {
    const setTransferRolesTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('setTransferRole'))
        .addArg(new AddressValue(address))
        .build(),
      receiver: this.contract.getAddress(),
      gasLimit: 10000000,
      sender: senderAddress,
      chainID: this.chainID
    });
    return setTransferRolesTx;
  }

  /**
   * Creates an unsetTransferRoles transaction for the contract
   * @param senderAddress The address of the sender, must be the admin of the contract
   * @param address The address to unset the transfer roles
   */
  unsetTransferRole(senderAddress: IAddress, address: IAddress): Transaction {
    const unsetTransferRolesTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('unsetTransferRole'))
        .addArg(new AddressValue(address))
        .build(),
      receiver: this.contract.getAddress(),
      gasLimit: 10000000,
      sender: senderAddress,
      chainID: this.chainID
    });
    return unsetTransferRolesTx;
  }

  /** Creates a pause transaction for the contract
   * @param senderAddress The address of the sender, must be the admin of the contract
   */
  pauseContract(senderAddress: IAddress): Transaction {
    const pauseContractTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('setIsPaused'))
        .addArg(new BooleanValue(true))
        .build(),
      receiver: this.contract.getAddress(),
      gasLimit: 10000000,
      sender: senderAddress,
      chainID: this.chainID
    });

    return pauseContractTx;
  }

  /** Creates a unpause transaction for the contract
   * @param senderAddress The address of the sender, must be the admin of the contract
   */
  unpauseContract(senderAddress: IAddress): Transaction {
    const unpauseContractTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('setIsPaused'))
        .addArg(new BooleanValue(false))
        .build(),
      receiver: this.contract.getAddress(),
      gasLimit: 10000000,
      sender: senderAddress,
      chainID: this.chainID
    });

    return unpauseContractTx;
  }

  /** Creates a set mint tax transaction for the contract
   * @param senderAddress The address of the sender, must be the admin of the contract
   * @param is_required A boolean value to set if the mint tax is required or not
   */
  setMintTaxIsRequired(
    senderAddress: IAddress,
    is_required: boolean
  ): Transaction {
    const setMintTaxIsRequiredTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('setTaxIsRequired'))
        .addArg(new BooleanValue(is_required))
        .build(),
      receiver: this.contract.getAddress(),
      gasLimit: 10000000,
      sender: senderAddress,
      chainID: this.chainID
    });

    return setMintTaxIsRequiredTx;
  }

  /** Creates a set mint tax transaction for the contract
   * @param senderAddress The address of the sender, must be the admin of the contract
   * @param tokenIdentifier The token identifier of the token to set the mint tax
   * @param tax The tax to set for the token
   */
  setMintTax(
    senderAddress: IAddress,
    tokenIdentifier: string,
    tax: number
  ): Transaction {
    const setMintTaxTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('setAntiSpamTax'))
        .addArg(new TokenIdentifierValue(tokenIdentifier))
        .addArg(new BigUIntValue(tax))
        .build(),
      receiver: this.contract.getAddress(),
      gasLimit: 10000000,
      sender: senderAddress,
      chainID: this.chainID
    });
    return setMintTaxTx;
  }

  /** Creates a set mint tax transaction for the contract
   * @param senderAddress The address of the sender, must be the admin of the contract
   * @param is_enabled A boolean value to set if whitelist is enabled or not
   */
  setWhitelistIsEnabled(
    senderAddress: IAddress,
    is_enabled: boolean
  ): Transaction {
    const setWhitelistIsEnabledTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('setWhiteListEnabled'))
        .addArg(new BooleanValue(is_enabled))
        .build(),
      receiver: this.contract.getAddress(),
      gasLimit: 10000000,
      sender: senderAddress,
      chainID: this.chainID
    });
    return setWhitelistIsEnabledTx;
  }

  /** Creates a whitelist transaction for the contract
   * @param senderAddress The address of the sender, must be the admin of the contract
   * @param addresses The addresses to whitelist
   */

  whitelist(
    senderAddress: IAddress,
    addresses: string[],
    gasLimit = 0
  ): Transaction {
    const whitelistTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('setWhiteListSpots'))
        .setArgs(
          addresses.map((address) => new AddressValue(new Address(address)))
        )
        .build(),
      receiver: this.contract.getAddress(),
      gasLimit: 10000000 + gasLimit,
      sender: senderAddress,
      chainID: this.chainID
    });
    return whitelistTx;
  }

  /**  Creates a delist transaction for the contract
   *  @param senderAddress The address of the sender, must be the admin of the contract
   *  @param addresses The addresses to delist
   */
  delist(
    senderAddress: IAddress,
    addresses: string[],
    gasLimit: 0
  ): Transaction {
    const delistTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('delist'))
        .setArgs(
          addresses.map((address) => new AddressValue(new Address(address)))
        )
        .build(),
      receiver: this.contract.getAddress(),
      gasLimit: 10000000 + gasLimit,
      sender: senderAddress,
      chainID: this.chainID
    });
    return delistTx;
  }

  /** Creates a set mint time limit transaction for the contract
   * @param senderAddress The address of the sender, must be the admin of the contract
   * @param timeLimit(seconds)  The time limit to set between mints
   */
  setMintTimeLimit(senderAddress: IAddress, timeLimit: number): Transaction {
    const setMintTimeLimitTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('setMintTimeLimit'))
        .addArg(new BigUIntValue(timeLimit))
        .build(),
      receiver: this.contract.getAddress(),
      gasLimit: 10000000,
      sender: senderAddress,
      chainID: this.chainID
    });
    return setMintTimeLimitTx;
  }

  /** Sets a new administrator for the contract
   * @param senderAddress The address of the sender, must be the admin of the contract
   * @param newAdministrator The address of the new administrator
   */
  setAdministrator(
    senderAddress: IAddress,
    newAdministrator: IAddress
  ): Transaction {
    const setAdministratorTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('setAdministrator'))
        .addArg(new AddressValue(newAdministrator))
        .build(),
      receiver: this.contract.getAddress(),
      gasLimit: 10000000,
      sender: senderAddress,
      chainID: this.chainID
    });
    return setAdministratorTx;
  }

  /** Sets the claim address for the contract
   * @param senderAddress The address of the sender, must be the admin of the contract
   * @param claimsAddress The claims address
   */
  setClaimsAddress(
    senderAddress: IAddress,
    claimsAddress: IAddress
  ): Transaction {
    const setClaimsAddressTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('setClaimsAddress'))
        .addArg(new AddressValue(claimsAddress))
        .build(),
      receiver: this.contract.getAddress(),
      gasLimit: 10000000,
      sender: senderAddress,
      chainID: this.chainID
    });
    return setClaimsAddressTx;
  }

  /** Creates a claim royalties transaction for the contract
   * @param senderAddress The address of the sender, must be the admin of the contract
   * @param tokenIdentifier The token identifier of the token to claim royalties
   * @param nonce The nonce of the token to claim royalties (default: 0 for ESDT)
   */
  claimRoyalties(
    senderAddress: IAddress,
    tokenIdentifier: string,
    nonce = 0
  ): Transaction {
    const claimRoyaltiesTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('claimRoyalties'))
        .addArg(new TokenIdentifierValue(tokenIdentifier))
        .addArg(new BigUIntValue(nonce))
        .build(),
      receiver: this.contract.getAddress(),
      gasLimit: 10000000,
      sender: senderAddress,
      chainID: this.chainID
    });
    return claimRoyaltiesTx;
  }

  /**
   * Pause collection transaction
   * @param senderAddress The address of the sender, must be the admin or owner of the contract
   */
  pauseCollection(senderAddress: IAddress): Transaction {
    const pauseCollectionTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('pause'))
        .build(),
      receiver: this.contract.getAddress(),
      gasLimit: 10000000,
      sender: senderAddress,
      chainID: this.chainID
    });
    return pauseCollectionTx;
  }

  /**
   * Unpause collection transaction
   * @param senderAddress The address of the sender, must be the admin or owner of the contract
   */
  unpauseCollection(senderAddress: IAddress): Transaction {
    const unpauseCollectionTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('unpause'))
        .build(),
      receiver: this.contract.getAddress(),
      gasLimit: 10000000,
      sender: senderAddress,
      chainID: this.chainID
    });

    return unpauseCollectionTx;
  }

  /**
   * Freeze transaction
   * @param senderAddress The address of the sender, must be the admin or owner of the contract
   */
  freeze(senderAddress: IAddress, freezeAddress: IAddress): Transaction {
    const freezeTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('freeze'))
        .addArg(new AddressValue(freezeAddress))
        .build(),
      receiver: this.contract.getAddress(),
      gasLimit: 10000000,
      sender: senderAddress,
      chainID: this.chainID
    });

    return freezeTx;
  }

  /**
   *  Unfreeze transaction
   * @param senderAddress The address of the sender, must be the admin or owner of the contract
   */
  unfreeze(senderAddress: IAddress, unfreezeAddress: IAddress): Transaction {
    const unfreezeTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('unfreeze'))
        .addArg(new AddressValue(unfreezeAddress))
        .build(),
      receiver: this.contract.getAddress(),
      gasLimit: 10000000,
      sender: senderAddress,
      chainID: this.chainID
    });

    return unfreezeTx;
  }

  /**
   *
   * @param senderAddress The address of the sender, must be the admin or owner of the contract
   * @param nonce The nonce of the token to freeze for `freezeAddress`
   * @param freezeAddress The address to freeze
   */
  freezeSingleNFT(
    senderAddress: IAddress,
    nonce: number,
    freezeAddress: IAddress
  ): Transaction {
    const freezeSingleNFTTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('freezeSingleNFT'))
        .addArg(new U64Value(nonce))
        .addArg(new AddressValue(freezeAddress))
        .build(),
      receiver: this.contract.getAddress(),
      gasLimit: 10000000,
      sender: senderAddress,
      chainID: this.chainID
    });
    return freezeSingleNFTTx;
  }

  /**
   *
   * @param senderAddress The address of the sender, must be the admin or owner of the contract
   * @param nonce The nonce of the token to unfreeze for `unfreezeAddress`
   * @param unfreezeAddress The address to unfreeze
   */
  unFreezeSingleNFT(
    senderAddress: IAddress,
    nonce: number,
    unfreezeAddress: IAddress
  ): Transaction {
    const unFreezeSingleNFTTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('unFreezeSingleNFT'))
        .addArg(new U64Value(nonce))
        .addArg(new AddressValue(unfreezeAddress))
        .build(),
      receiver: this.contract.getAddress(),
      gasLimit: 10000000,
      sender: senderAddress,
      chainID: this.chainID
    });
    return unFreezeSingleNFTTx;
  }

  /**
   *
   * @param senderAddress The address of the sender, must be the admin or owner of the contract
   * @param nonce The nonce of the token to wipe for `wipeAddress`
   * @param wipeAddress The address to wipe from
   * Important: This will wipe all NFTs from the address
   * Note: The nonce must be freezed before wiping
   */
  wipeSingleNFT(
    senderAddress: IAddress,
    nonce: number,
    wipeAddress: IAddress
  ): Transaction {
    const wipeSingleNFTTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('wipeSingleNFT'))
        .addArg(new U64Value(nonce))
        .addArg(new AddressValue(wipeAddress))
        .build(),
      receiver: this.contract.getAddress(),
      gasLimit: 10000000,
      sender: senderAddress,
      chainID: this.chainID
    });
    return wipeSingleNFTTx;
  }
}

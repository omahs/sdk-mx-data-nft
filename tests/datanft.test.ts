import { DataNft } from '../src';

describe('Data NFT test', () => {
  test('#getMessageToSign', async () => {
    DataNft.setNetworkConfig('devnet');
    const dataNft = new DataNft({
      dataMarshal: 'https://api.itheumcloud-stg.com/datamarshalapi/achilles/v1'
    });

    const nonceToSign = await dataNft.getMessageToSign();

    expect(typeof nonceToSign).toBe('string');

    const nft = await DataNft.createFromApi(62, 'DATANFTFT3-d0978e');

    expect(nft).toBeInstanceOf(DataNft);
  }, 10000);

  test('#getOwnedByAddress', async () => {
    DataNft.setNetworkConfig('devnet');
    const dataNfts = await DataNft.ownedByAddress(
      'erd1w6ffeexmumd5qzme78grrvp33qngcgqk2prjyuuyawpc955gvcxqqrsrtw'
    );

    expect(dataNfts).toBeInstanceOf(Array);
    for (const item of dataNfts) {
      expect(item).toBeInstanceOf(Object as unknown as DataNft);
    }
  }, 10000);

  test('#create many data NFTs different token identifiers', async () => {
    DataNft.setNetworkConfig('devnet');

    const dataNfts = await DataNft.createManyFromApi([
      { nonce: 62, tokenIdentifier: 'DATANFTFT4-3ba099' },
      { nonce: 2, tokenIdentifier: 'INSP-a65b3b' },
      { nonce: 80 }
    ]);

    for (const item of dataNfts) {
      expect(item).toBeInstanceOf(Object as unknown as DataNft);
    }
  }, 12000);
});

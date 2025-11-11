const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LuxuryGoodsNFT", function () {
  let luxuryGoodsNFT;
  let owner;
  let verifier;
  let buyer;
  let unauthorized;

  beforeEach(async function () {
    [owner, verifier, buyer, unauthorized] = await ethers.getSigners();

    const LuxuryGoodsNFT = await ethers.getContractFactory("LuxuryGoodsNFT");
    luxuryGoodsNFT = await LuxuryGoodsNFT.deploy();
    await luxuryGoodsNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await luxuryGoodsNFT.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await luxuryGoodsNFT.name()).to.equal("LuxuryGoodsPassport");
      expect(await luxuryGoodsNFT.symbol()).to.equal("LGP");
    });

    it("Should start with zero authenticated items", async function () {
      expect(await luxuryGoodsNFT.getTotalAuthenticatedItems()).to.equal(0);
    });
  });

  describe("Verifier Authorization", function () {
    it("Should allow owner to authorize verifier", async function () {
      await luxuryGoodsNFT.setVerifierAuthorization(verifier.address, true);
      expect(await luxuryGoodsNFT.authorizedVerifiers(verifier.address)).to.be.true;
    });

    it("Should allow owner to revoke verifier", async function () {
      await luxuryGoodsNFT.setVerifierAuthorization(verifier.address, true);
      await luxuryGoodsNFT.setVerifierAuthorization(verifier.address, false);
      expect(await luxuryGoodsNFT.authorizedVerifiers(verifier.address)).to.be.false;
    });

    it("Should not allow non-owner to authorize verifier", async function () {
      await expect(
        luxuryGoodsNFT.connect(unauthorized).setVerifierAuthorization(verifier.address, true)
      ).to.be.reverted;
    });

    it("Should emit VerifierAuthorized event", async function () {
      await expect(luxuryGoodsNFT.setVerifierAuthorization(verifier.address, true))
        .to.emit(luxuryGoodsNFT, "VerifierAuthorized")
        .withArgs(verifier.address, true);
    });
  });

  describe("Minting", function () {
    beforeEach(async function () {
      await luxuryGoodsNFT.setVerifierAuthorization(verifier.address, true);
    });

    it("Should mint NFT with valid parameters", async function () {
      const tx = await luxuryGoodsNFT.connect(verifier).mintAuthenticatedItem(
        buyer.address,
        "Louis Vuitton",
        "Neverfull MM",
        "FL4198",
        "NFC-123456",
        "ipfs://test"
      );

      await expect(tx)
        .to.emit(luxuryGoodsNFT, "ItemAuthenticated")
        .withArgs(1, "NFC-123456", verifier.address, buyer.address);

      expect(await luxuryGoodsNFT.ownerOf(1)).to.equal(buyer.address);
    });

    it("Should not allow unauthorized to mint", async function () {
      await expect(
        luxuryGoodsNFT.connect(unauthorized).mintAuthenticatedItem(
          buyer.address,
          "Louis Vuitton",
          "Neverfull MM",
          "FL4198",
          "NFC-123456",
          "ipfs://test"
        )
      ).to.be.revertedWith("Not authorized to mint");
    });

    it("Should not allow duplicate chip IDs", async function () {
      await luxuryGoodsNFT.connect(verifier).mintAuthenticatedItem(
        buyer.address,
        "Louis Vuitton",
        "Neverfull MM",
        "FL4198",
        "NFC-123456",
        "ipfs://test"
      );

      await expect(
        luxuryGoodsNFT.connect(verifier).mintAuthenticatedItem(
          buyer.address,
          "Gucci",
          "Marmont",
          "GG001",
          "NFC-123456",
          "ipfs://test2"
        )
      ).to.be.revertedWith("Item already authenticated");
    });

    it("Should not allow empty chip ID", async function () {
      await expect(
        luxuryGoodsNFT.connect(verifier).mintAuthenticatedItem(
          buyer.address,
          "Louis Vuitton",
          "Neverfull MM",
          "FL4198",
          "",
          "ipfs://test"
        )
      ).to.be.revertedWith("Chip ID cannot be empty");
    });

    it("Should increment total authenticated items", async function () {
      await luxuryGoodsNFT.connect(verifier).mintAuthenticatedItem(
        buyer.address,
        "Louis Vuitton",
        "Neverfull MM",
        "FL4198",
        "NFC-123456",
        "ipfs://test"
      );

      expect(await luxuryGoodsNFT.getTotalAuthenticatedItems()).to.equal(1);
    });

    it("Should store correct item details", async function () {
      await luxuryGoodsNFT.connect(verifier).mintAuthenticatedItem(
        buyer.address,
        "Louis Vuitton",
        "Neverfull MM",
        "FL4198",
        "NFC-123456",
        "ipfs://test"
      );

      const details = await luxuryGoodsNFT.getItemDetails(1);
      expect(details.brand).to.equal("Louis Vuitton");
      expect(details.model).to.equal("Neverfull MM");
      expect(details.serialNumber).to.equal("FL4198");
      expect(details.chipId).to.equal("NFC-123456");
      expect(details.verifier).to.equal(verifier.address);
      expect(details.isAuthenticated).to.be.true;
    });
  });

  describe("Verification", function () {
    beforeEach(async function () {
      await luxuryGoodsNFT.setVerifierAuthorization(verifier.address, true);
      await luxuryGoodsNFT.connect(verifier).mintAuthenticatedItem(
        buyer.address,
        "Louis Vuitton",
        "Neverfull MM",
        "FL4198",
        "NFC-123456",
        "ipfs://test"
      );
    });

    it("Should verify item by chip ID", async function () {
      const [isValid, tokenId, ownerAddr] = await luxuryGoodsNFT.verifyItemByChipId("NFC-123456");
      expect(isValid).to.be.true;
      expect(tokenId).to.equal(1);
      expect(ownerAddr).to.equal(buyer.address);
    });

    it("Should return false for non-existent chip ID", async function () {
      const [isValid, tokenId, ownerAddr] = await luxuryGoodsNFT.verifyItemByChipId("NFC-999999");
      expect(isValid).to.be.false;
      expect(tokenId).to.equal(0);
      expect(ownerAddr).to.equal(ethers.ZeroAddress);
    });

    it("Should get token ID by chip ID", async function () {
      const tokenId = await luxuryGoodsNFT.getTokenIdByChipId("NFC-123456");
      expect(tokenId).to.equal(1);
    });

    it("Should return 0 for non-existent chip ID", async function () {
      const tokenId = await luxuryGoodsNFT.getTokenIdByChipId("NFC-999999");
      expect(tokenId).to.equal(0);
    });
  });

  describe("Transfers", function () {
    beforeEach(async function () {
      await luxuryGoodsNFT.setVerifierAuthorization(verifier.address, true);
      await luxuryGoodsNFT.connect(verifier).mintAuthenticatedItem(
        buyer.address,
        "Louis Vuitton",
        "Neverfull MM",
        "FL4198",
        "NFC-123456",
        "ipfs://test"
      );
    });

    it("Should transfer NFT and emit ItemTransferred event", async function () {
      const tx = await luxuryGoodsNFT.connect(buyer).transferFrom(
        buyer.address,
        unauthorized.address,
        1
      );

      await expect(tx)
        .to.emit(luxuryGoodsNFT, "ItemTransferred")
        .withArgs(1, buyer.address, unauthorized.address, await ethers.provider.getBlock('latest').then(b => b.timestamp));

      expect(await luxuryGoodsNFT.ownerOf(1)).to.equal(unauthorized.address);
    });

    it("Should maintain item details after transfer", async function () {
      await luxuryGoodsNFT.connect(buyer).transferFrom(
        buyer.address,
        unauthorized.address,
        1
      );

      const details = await luxuryGoodsNFT.getItemDetails(1);
      expect(details.brand).to.equal("Louis Vuitton");
      expect(details.chipId).to.equal("NFC-123456");
      expect(details.isAuthenticated).to.be.true;
    });

    it("Should update owner after transfer", async function () {
      await luxuryGoodsNFT.connect(buyer).transferFrom(
        buyer.address,
        unauthorized.address,
        1
      );

      const [isValid, tokenId, newOwner] = await luxuryGoodsNFT.verifyItemByChipId("NFC-123456");
      expect(newOwner).to.equal(unauthorized.address);
    });
  });
});


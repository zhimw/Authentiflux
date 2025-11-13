const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LuxuryGoodsNFT - Transfer with Price Recording", function () {
  let luxuryGoodsNFT;
  let owner;
  let verifier;
  let buyer1;
  let buyer2;
  let buyer3;

  beforeEach(async function () {
    [owner, verifier, buyer1, buyer2, buyer3] = await ethers.getSigners();

    const LuxuryGoodsNFT = await ethers.getContractFactory("LuxuryGoodsNFT");
    luxuryGoodsNFT = await LuxuryGoodsNFT.deploy();
    await luxuryGoodsNFT.waitForDeployment();

    // Authorize verifier and mint a test item
    await luxuryGoodsNFT.setVerifierAuthorization(verifier.address, true);
    await luxuryGoodsNFT.connect(verifier).mintAuthenticatedItem(
      buyer1.address,
      "Rolex",
      "Submariner",
      "RS-001",
      "NFC-TEST-001",
      "ipfs://test"
    );
  });

  describe("Transfer with Price", function () {
    it("Should transfer with price and record history", async function () {
      const price = ethers.parseEther("2.5");
      
      await luxuryGoodsNFT.connect(buyer1).transferWithPrice(
        buyer1.address,
        buyer2.address,
        1,
        price
      );

      expect(await luxuryGoodsNFT.ownerOf(1)).to.equal(buyer2.address);
      
      const history = await luxuryGoodsNFT.getTransferHistory(1);
      expect(history.length).to.equal(2); // Initial mint + this transfer
      expect(history[1].from).to.equal(buyer1.address);
      expect(history[1].to).to.equal(buyer2.address);
      expect(history[1].price).to.equal(price);
    });

    it("Should transfer with zero price (gift)", async function () {
      await luxuryGoodsNFT.connect(buyer1).transferWithPrice(
        buyer1.address,
        buyer2.address,
        1,
        0
      );

      const history = await luxuryGoodsNFT.getTransferHistory(1);
      expect(history[1].price).to.equal(0);
    });

    it("Should emit ItemTransferredWithPrice event", async function () {
      const price = ethers.parseEther("3.0");
      
      await expect(
        luxuryGoodsNFT.connect(buyer1).transferWithPrice(
          buyer1.address,
          buyer2.address,
          1,
          price
        )
      ).to.emit(luxuryGoodsNFT, "ItemTransferredWithPrice")
       .withArgs(1, buyer1.address, buyer2.address, await ethers.provider.getBlock('latest').then(b => b.timestamp + 1), price);
    });

    it("Should not allow non-owner to transfer", async function () {
      const price = ethers.parseEther("1.0");
      
      await expect(
        luxuryGoodsNFT.connect(buyer2).transferWithPrice(
          buyer1.address,
          buyer2.address,
          1,
          price
        )
      ).to.be.revertedWith("Caller is not owner nor approved");
    });

    it("Should not allow transfer to zero address", async function () {
      const price = ethers.parseEther("1.0");
      
      await expect(
        luxuryGoodsNFT.connect(buyer1).transferWithPrice(
          buyer1.address,
          ethers.ZeroAddress,
          1,
          price
        )
      ).to.be.revertedWith("Invalid recipient address");
    });

    it("Should not allow transfer from wrong address", async function () {
      const price = ethers.parseEther("1.0");
      
      await expect(
        luxuryGoodsNFT.connect(buyer1).transferWithPrice(
          buyer2.address, // Wrong 'from' address
          buyer3.address,
          1,
          price
        )
      ).to.be.revertedWith("From address is not the owner");
    });
  });

  describe("Transfer History", function () {
    it("Should record initial mint in history", async function () {
      const history = await luxuryGoodsNFT.getTransferHistory(1);
      
      expect(history.length).to.equal(1);
      expect(history[0].from).to.equal(ethers.ZeroAddress);
      expect(history[0].to).to.equal(buyer1.address);
      expect(history[0].price).to.equal(0);
    });

    it("Should maintain complete transfer history", async function () {
      const price1 = ethers.parseEther("2.0");
      const price2 = ethers.parseEther("3.0");
      const price3 = ethers.parseEther("2.5");

      // Transfer 1: buyer1 -> buyer2
      await luxuryGoodsNFT.connect(buyer1).transferWithPrice(
        buyer1.address,
        buyer2.address,
        1,
        price1
      );

      // Transfer 2: buyer2 -> buyer3
      await luxuryGoodsNFT.connect(buyer2).transferWithPrice(
        buyer2.address,
        buyer3.address,
        1,
        price2
      );

      // Transfer 3: buyer3 -> buyer1 (gift)
      await luxuryGoodsNFT.connect(buyer3).transferWithPrice(
        buyer3.address,
        buyer1.address,
        1,
        price3
      );

      const history = await luxuryGoodsNFT.getTransferHistory(1);
      expect(history.length).to.equal(4); // mint + 3 transfers

      // Check mint
      expect(history[0].from).to.equal(ethers.ZeroAddress);
      expect(history[0].to).to.equal(buyer1.address);

      // Check transfers
      expect(history[1].from).to.equal(buyer1.address);
      expect(history[1].to).to.equal(buyer2.address);
      expect(history[1].price).to.equal(price1);

      expect(history[2].from).to.equal(buyer2.address);
      expect(history[2].to).to.equal(buyer3.address);
      expect(history[2].price).to.equal(price2);

      expect(history[3].from).to.equal(buyer3.address);
      expect(history[3].to).to.equal(buyer1.address);
      expect(history[3].price).to.equal(price3);
    });

    it("Should record timestamps for each transfer", async function () {
      const beforeTime = Math.floor(Date.now() / 1000);
      
      await luxuryGoodsNFT.connect(buyer1).transferWithPrice(
        buyer1.address,
        buyer2.address,
        1,
        ethers.parseEther("1.0")
      );

      const afterTime = Math.floor(Date.now() / 1000);
      const history = await luxuryGoodsNFT.getTransferHistory(1);
      
      const transferTime = Number(history[1].timestamp);
      expect(transferTime).to.be.at.least(beforeTime);
      expect(transferTime).to.be.at.most(afterTime + 2);
    });

    it("Should not allow getting history for non-existent token", async function () {
      await expect(
        luxuryGoodsNFT.getTransferHistory(999)
      ).to.be.revertedWith("Token does not exist");
    });
  });

  describe("Current Owner Acquisition Time", function () {
    it("Should return acquisition time for current owner", async function () {
      const beforeTransfer = Math.floor(Date.now() / 1000);
      
      await luxuryGoodsNFT.connect(buyer1).transferWithPrice(
        buyer1.address,
        buyer2.address,
        1,
        ethers.parseEther("1.0")
      );

      const acquisitionTime = await luxuryGoodsNFT.getCurrentOwnerAcquisitionTime(1);
      expect(Number(acquisitionTime)).to.be.at.least(beforeTransfer);
    });

    it("Should update acquisition time on subsequent transfers", async function () {
      // First transfer
      await luxuryGoodsNFT.connect(buyer1).transferWithPrice(
        buyer1.address,
        buyer2.address,
        1,
        0
      );
      const time1 = await luxuryGoodsNFT.getCurrentOwnerAcquisitionTime(1);

      // Wait a bit (simulate time passing)
      await ethers.provider.send("evm_increaseTime", [100]);
      await ethers.provider.send("evm_mine");

      // Second transfer
      await luxuryGoodsNFT.connect(buyer2).transferWithPrice(
        buyer2.address,
        buyer3.address,
        1,
        0
      );
      const time2 = await luxuryGoodsNFT.getCurrentOwnerAcquisitionTime(1);

      expect(Number(time2)).to.be.greaterThan(Number(time1));
    });
  });

  describe("Approved Transfer with Price", function () {
    it("Should allow approved address to transfer with price", async function () {
      // buyer1 approves buyer2 to transfer the token
      await luxuryGoodsNFT.connect(buyer1).approve(buyer2.address, 1);
      
      const price = ethers.parseEther("2.0");
      
      // buyer2 transfers on behalf of buyer1
      await luxuryGoodsNFT.connect(buyer2).transferWithPrice(
        buyer1.address,
        buyer3.address,
        1,
        price
      );

      expect(await luxuryGoodsNFT.ownerOf(1)).to.equal(buyer3.address);
      
      const history = await luxuryGoodsNFT.getTransferHistory(1);
      expect(history[1].price).to.equal(price);
    });

    it("Should allow operator to transfer with price", async function () {
      // buyer1 sets buyer2 as operator
      await luxuryGoodsNFT.connect(buyer1).setApprovalForAll(buyer2.address, true);
      
      const price = ethers.parseEther("1.5");
      
      // buyer2 transfers as operator
      await luxuryGoodsNFT.connect(buyer2).transferWithPrice(
        buyer1.address,
        buyer3.address,
        1,
        price
      );

      expect(await luxuryGoodsNFT.ownerOf(1)).to.equal(buyer3.address);
    });
  });
});


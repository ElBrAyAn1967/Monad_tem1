import { expect } from "chai";
import { ethers } from "hardhat";
import { ServerLottery } from "../typechain-types";

describe("ServerLottery", function () {
  let serverLottery: ServerLottery;
  let owner: any;
  let server: any;
  let winner: any;

  before(async () => {
    [owner, server, winner] = await ethers.getSigners();
    const serverLotteryFactory = await ethers.getContractFactory("ServerLottery");
    serverLottery = (await serverLotteryFactory.deploy(server.address)) as ServerLottery;
    await serverLottery.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await serverLottery.owner()).to.equal(owner.address);
    });

    it("Should set the right server", async function () {
      expect(await serverLottery.server()).to.equal(server.address);
    });

    it("Should have prize not claimed", async function () {
      expect(await serverLottery.prizeClaimed()).to.equal(false);
    });
  });

  describe("Functionality", function () {
    it("Should allow server to set winner", async function () {
      await serverLottery.connect(server).setWinner(winner.address);
      expect(await serverLottery.winner()).to.equal(winner.address);
    });
  });
});

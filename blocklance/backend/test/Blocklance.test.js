const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BlockLance", function () {
  it("lets a client post a job, freelancer accept, complete, and get paid", async function () {
    const [client, freelancer] = await ethers.getSigners();

    const BlockLance = await ethers.getContractFactory("BlockLance");
    const blockLance = await BlockLance.deploy();

    await blockLance.connect(client).postJob("Build a website", "React landing page", {
      value: ethers.parseEther("1"),
    });

    await blockLance.connect(freelancer).acceptJob(1);
    await blockLance.connect(freelancer).markCompleted(1);

    const before = await ethers.provider.getBalance(freelancer.address);
    await blockLance.connect(client).approveAndPay(1);
    const after = await ethers.provider.getBalance(freelancer.address);

    expect(after).to.be.gt(before);

    const job = await blockLance.getJob(1);
    expect(job.status).to.equal(3);
  });
});
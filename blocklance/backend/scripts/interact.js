const hre = require("hardhat");

async function main() {
  const [client, freelancer] = await hre.ethers.getSigners();

  console.log("Client address:    ", client.address);
  console.log("Freelancer address:", freelancer.address);

  const BlockLance = await hre.ethers.getContractFactory("BlockLance");
  const blockLance = await BlockLance.deploy();
  await blockLance.waitForDeployment();
  console.log("\nContract deployed at:", await blockLance.getAddress());

  console.log("\n--- Client posting a job ---");
  let tx = await blockLance.connect(client).postJob(
    "Build a landing page",
    "React + Tailwind, 3 sections",
    { value: hre.ethers.parseEther("1") }
  );
  await tx.wait();
  console.log("Job posted with 1 ETH locked in the contract.");

  console.log("\n--- Freelancer accepting job #1 ---");
  tx = await blockLance.connect(freelancer).acceptJob(1);
  await tx.wait();
  console.log("Job accepted.");

  console.log("\n--- Freelancer marking job #1 complete ---");
  tx = await blockLance.connect(freelancer).markCompleted(1);
  await tx.wait();
  console.log("Marked complete.");

  const balanceBefore = await hre.ethers.provider.getBalance(freelancer.address);
  console.log("\n--- Client approving payment ---");
  tx = await blockLance.connect(client).approveAndPay(1);
  await tx.wait();
  const balanceAfter = await hre.ethers.provider.getBalance(freelancer.address);
  console.log("Payment released. Freelancer balance change:",
    hre.ethers.formatEther(balanceAfter - balanceBefore), "ETH");

  const job = await blockLance.getJob(1);
  console.log("\n--- Final job state ---");
  console.log({
    title: job.title,
    budget: hre.ethers.formatEther(job.budget) + " ETH",
    status: ["Open", "InProgress", "Completed", "Approved", "Cancelled"][job.status],
    client: job.client,
    freelancer: job.freelancer,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const CONTRACT_ABI = [
  "function postJob(string _title, string _description) external payable",
  "function acceptJob(uint256 _jobId) external",
  "function markCompleted(uint256 _jobId) external",
  "function approveAndPay(uint256 _jobId) external",
  "function cancelJob(uint256 _jobId) external",
  "function getJob(uint256 _jobId) external view returns (tuple(uint256 id, address client, address freelancer, string title, string description, uint256 budget, uint8 status, uint256 createdAt))",
  "function jobCount() external view returns (uint256)",
  "event JobPosted(uint256 indexed jobId, address indexed client, uint256 budget)",
  "event JobAccepted(uint256 indexed jobId, address indexed freelancer)",
  "event WorkCompleted(uint256 indexed jobId)",
  "event PaymentReleased(uint256 indexed jobId, address indexed freelancer, uint256 amount)",
];
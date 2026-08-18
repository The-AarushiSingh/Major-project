// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BlockLance {

    enum Status { Open, InProgress, Completed, Approved, Cancelled }

    struct Job {
        uint256 id;
        address client;
        address freelancer;
        string title;
        string description;
        uint256 budget;
        Status status;
        uint256 createdAt;
    }

    uint256 public jobCount;
    mapping(uint256 => Job) public jobs;

    event JobPosted(uint256 indexed jobId, address indexed client, uint256 budget);
    event JobAccepted(uint256 indexed jobId, address indexed freelancer);
    event WorkCompleted(uint256 indexed jobId);
    event PaymentReleased(uint256 indexed jobId, address indexed freelancer, uint256 amount);
    event JobCancelled(uint256 indexed jobId);

    modifier onlyClient(uint256 _jobId) {
        require(msg.sender == jobs[_jobId].client, "Only the client can call this");
        _;
    }

    modifier onlyFreelancer(uint256 _jobId) {
        require(msg.sender == jobs[_jobId].freelancer, "Only the assigned freelancer can call this");
        _;
    }

    function postJob(string memory _title, string memory _description) external payable {
        require(msg.value > 0, "Budget must be greater than 0");

        jobCount++;
        jobs[jobCount] = Job({
            id: jobCount,
            client: msg.sender,
            freelancer: address(0),
            title: _title,
            description: _description,
            budget: msg.value,
            status: Status.Open,
            createdAt: block.timestamp
        });

        emit JobPosted(jobCount, msg.sender, msg.value);
    }

    function acceptJob(uint256 _jobId) external {
        Job storage job = jobs[_jobId];
        require(job.status == Status.Open, "Job is not open");
        require(msg.sender != job.client, "Client cannot accept their own job");

        job.freelancer = msg.sender;
        job.status = Status.InProgress;

        emit JobAccepted(_jobId, msg.sender);
    }

    function markCompleted(uint256 _jobId) external onlyFreelancer(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.status == Status.InProgress, "Job is not in progress");

        job.status = Status.Completed;
        emit WorkCompleted(_jobId);
    }

    function approveAndPay(uint256 _jobId) external onlyClient(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.status == Status.Completed, "Work not marked completed yet");

        job.status = Status.Approved;
        uint256 amount = job.budget;

        (bool sent, ) = payable(job.freelancer).call{value: amount}("");
        require(sent, "Payment transfer failed");

        emit PaymentReleased(_jobId, job.freelancer, amount);
    }

    function cancelJob(uint256 _jobId) external onlyClient(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.status == Status.Open, "Can only cancel an open job");

        job.status = Status.Cancelled;
        uint256 refund = job.budget;

        (bool sent, ) = payable(job.client).call{value: refund}("");
        require(sent, "Refund failed");

        emit JobCancelled(_jobId);
    }

    function getJob(uint256 _jobId) external view returns (Job memory) {
        return jobs[_jobId];
    }
}
import { Contract } from "ethers";
import { artifacts } from "hardhat";
const fs = require("fs");
const path = require("path");

function createPath(chain: any) {

    var contractsDirectory = path.join(__dirname, "../../", "web3task-front", "src", "contracts", `${chain}`);

    console.log('Saving frontend files...')
    if (!fs.existsSync(contractsDirectory)) {
        fs.mkdirSync(contractsDirectory);
    }
    return contractsDirectory
}

export async function saveFrontendFiles(contract: Contract, chain: any) {

    const contractsDirectory = createPath(chain)
    const address = (await contract).address;

    fs.writeFileSync(
        path.join(contractsDirectory, "contract-Web3Task-address.json"),
        JSON.stringify({ Web3Task: address }, undefined, 2)
    );

    const Web3TaskArtifact = artifacts.readArtifactSync("Web3Task");
    const TasksManagerArtifact = artifacts.readArtifactSync("TasksManager");


    fs.writeFileSync(
        path.join(contractsDirectory, "Web3Task.json"),
        JSON.stringify(Web3TaskArtifact, null, 2)
    );

    fs.writeFileSync(
        path.join(contractsDirectory, "TasksManager.json"),
        JSON.stringify(TasksManagerArtifact, null, 2)
    );


}
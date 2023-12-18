import { ethers } from "hardhat";
import abi from "../artifacts/contracts/TasksManager.sol/TasksManager.json";

const { CONTRACT_ADDRESS } = process.env;

async function main() {
    const [signer] = await ethers.getSigners();
    /// Get the signer and connect to the contract
    const contract = new ethers.Contract(
        `${CONTRACT_ADDRESS}`,
        abi.abi,
        signer
    );

    /// Prepare the encoding of data and submit it to the contract
    const payloadArray = [];
    for (var i = 1; i <= 10; i++) {
        payloadArray.push(
            contract.interface.encodeFunctionData("getTask", [i])
        );
    }
    const response = await contract.multicallRead(payloadArray);

    /// Decode the results
    let decodedResults = [];
    /// Get the sighash of the function
    let getTaskID = contract.interface.getSighash("getTask(uint256)");
    /// Map the results to the function name and the decoded arguments
    decodedResults = response.map((res: any) => {
        try {
            const decodedArgs = contract.interface.decodeFunctionResult(
                getTaskID,
                res
            );
            return {
                name: contract.interface.getFunction(getTaskID).name,
                args: decodedArgs,
            };
        } catch (error) {
            console.log("Could not decode result", error);
        }
    });

    /// Print the result
    console.log(decodedResults);

    /// How to fetch the results (double array)
    console.log(decodedResults[0].args[0]);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

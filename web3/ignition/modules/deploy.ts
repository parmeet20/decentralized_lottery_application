// scripts/deploy.js
import { ethers } from "hardhat";
async function main() {
    const Lottery = await ethers.getContractFactory("Lottery");

    const lottery = await Lottery.deploy();

    console.log("Lottery contract deployed to:", await lottery.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

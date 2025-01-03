import { Lottery } from "../typechain-types"
import { Signer } from "ethers";
import { ethers } from 'hardhat'
import { expect } from "chai"
describe('Lottery Tests', () => {
    let lottery: Lottery;
    let owner: Signer;
    let player1: Signer;
    let player2: Signer;
    let player3: Signer;
    beforeEach(async () => {
        [owner, player1, player2, player3] = await ethers.getSigners();
        const Lott = await ethers.getContractFactory('Lottery');
        lottery = await Lott.connect(owner).deploy();
    })
    describe('deployments', () => {
        it("should set the owner", async () => {
            expect(await lottery.owner()).to.equal(await owner.getAddress());
        })
        it("should test the initial lottery balance", async () => {
            expect(await lottery.getBalance()).to.equal(0);
        })
        it("should have an empty players array", async () => {
            expect(await lottery.getPlayers()).to.be.empty;
        })
    })
    describe('enter lottery', () => {
        it('should allow to enter the lottery with suffecient funds', async () => {
            const tx = await lottery.connect(player1).enter({ value: ethers.parseEther("0.2") });
            tx.wait();
            const players = await lottery.getPlayers();
            expect(players.length).to.equal(1);
            expect(players[0]).to.equal(await player1.getAddress());
        });
        it("should have sufficient funds to enter the lottery", async () => {
            await expect(
                lottery.connect(player1).enter({ value: ethers.parseEther("0.001") })
            ).to.be.revertedWith("Minimum 0.1 ether required to enter the lottery");
        });

    })
    describe('pick winner()', () => {
        it('should allow owner to pick winner',async()=>{
            await lottery.connect(player1).enter({value:ethers.parseEther("1")});
            await lottery.connect(player2).enter({value:ethers.parseEther("1")});
            await lottery.connect(player3).enter({value:ethers.parseEther("1")});
            const tx = await lottery.connect(owner).pickWinner();
            tx.wait();
            const players = await lottery.getPlayers();
            const winners = await lottery.getWinners();
            const contractBalance = await lottery.getBalance();
            expect(players.length).to.equal(0);
            expect(winners.length).to.equal(1);
            expect(contractBalance).to.equal(0);
        })  
    })
})
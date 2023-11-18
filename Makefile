export

mocks:
		make deploy
		make funding
		make roles
		make operators
		make tasks

deploy:
		npx hardhat run --network lachain scripts/deploy.ts

funding:
		npx hardhat run --network lachain scripts/fundingContract.ts

roles:
		npx hardhat run --network lachain scripts/setRole.ts

operators:
		npx hardhat run --network lachain scripts/setOperator.ts

tasks:
		npx hardhat run --network lachain scripts/createTasks.ts
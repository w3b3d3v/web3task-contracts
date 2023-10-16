export

mocks:
		make deploy
		make funding
		make setRoles
		make setOperators
		make tasks

deploy:
		npx hardhat run --network localhost scripts/deploy.ts

funding:
		npx hardhat run --network localhost scripts/fundingContract.ts

roles:
		npx hardhat run --network localhost scripts/setRole.ts

operators:
		npx hardhat run --network localhost scripts/setOperator.ts

tasks:
		npx hardhat run --network localhost scripts/createTasks.ts
export async function dateNowToUnixTimestamp() {
	const currentTimestampMs = Date.now();
	const currentTimestampSec = Math.floor(currentTimestampMs / 1000);
	const uint256Timestamp = BigInt(currentTimestampSec);
	return uint256Timestamp;
}

export async function unixTimestampToDateNow(timestamp: any) {
	const unixTimestamp = timestamp * 1000; // Convert to milliseconds (Unix timestamps are in seconds)
	const date = new Date(unixTimestamp);
	const formattedDate = date.toLocaleString();
	return formattedDate;
}

module.exports = {
	dateNowToUnixTimestamp,
	unixTimestampToDateNow,
};

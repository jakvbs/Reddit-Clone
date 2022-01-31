export function setVoteScore() {
	this.voteScore = this.votes.reduce((acc, vote) => acc + vote.value, 0);
}

export function setUserVote(user) {
	const userVote = this.votes.find((vote) => vote.user._id.equals(user._id));
	if (userVote) {
		this.userVote = userVote.value;
		return;
	}
	this.userVote = 0;
}

export async function paginate({ req }) {
	const sort_by = {};
	sort_by[req.query.sort || 'createdAt'] = req.query.order?.toLowerCase() || 'desc';

	const limit = parseInt(req.query.limit, 10) || 10;
	const page = parseInt(req.query.page, 10) || 1;
	const skip = (page - 1) * limit;

	const results = await this.find(req.filters).sort(sort_by).skip(skip).limit(limit).exec();

	return results;
}

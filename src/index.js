import axios from 'axios';

function getIdentifier() {
  return new Promise((resolve, reject) => {
    axios.post('https://www.menti.com/core/identifiers')
      .then((value) => resolve(new String(value.data.identifier)))
      .catch((reason) => reject(reason))
  })
}

function getVoteId(seriesId) {
  return new Promise((resolve, reject) => {
    axios.get(`https://www.menti.com/core/vote-ids/${seriesId}/series`)
      .then((value) => {
        const data = value.data.questions.filter((filter) => filter.type == "wordcloud")[0];
        if (data) resolve(new String(data.id));
        else reject(null)
      })
      .catch((reason) => reject(reason))
  })
}

function makeVote(voteId, identifier, vote) {
  return new Promise((resolve, reject) => {
    axios.post(`https://www.menti.com/core/votes/${voteId}`, { question_type: "wordcloud", vote }, { headers: { 'x-identifier': identifier } })
      .then((value) => resolve(value))
      .catch((reason) => reject(reason))
  })
}

export async function run(seriesId, vote) {
  const identifier = await getIdentifier();
  const voteId = await getVoteId(seriesId);
  const { status, statusText } = await makeVote(voteId, identifier, vote);

  return {
    seriesId,
    identifier,
    voteId,
    vote,
    response: { status, statusText }
  };
}

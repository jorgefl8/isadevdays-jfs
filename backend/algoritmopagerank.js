function findByusername(req, res) {
  const username = req.params.username;
  _callGithubApi(username).then((user) => {
    res.status(200).send(user);
  }).catch((err) => {
    res.status(500).send({ message: err.message || "Error al obtener los datos de Github" });
  });
}
async function _callGithubApi(username) {
  const token = "Bearer sdijdisdj";
  const url = "https://api.github.com/graphql";
  const requestConfig = { Authorization: token };
  const query = `{
    user(login: "${username}"){
        id
        status {
          message
        }
        followers(first: 3){
          nodes{
            login
          }
        }
        following(first: 100){
          nodes{
            login
          }
        }
      }
    }`;
  const result = await axios.post(url, { query }, { headers: requestConfig });
  if (result) {
    const userData = result.data.data.user;
    const usuario = {
      username: username,
      id: userData.id,
      status: userData.status.message,
      followers: userData.followers.nodes.map(follower => follower.login),
      following: userData.following.nodes.map(following => following.login)
    }
  }
  return usuario;
}
//cogemos en el  objeto co ne l no,bre y sus seguidores 
//y seguidos e iteramos
let user = {
  username: "string",
  followers: ["string"],
  following: ["string"],
}
let result = [];
let dampingFactor = 0.85;
let sumatorio = 0;
let acc = 0;
function github_pagerank(user, acc) {
  if (acc === 3) {
    return result.sort((a, b) => b.score - a.score);
  } else {
    let followers = user.followers;
    let following = user.following;
    for (i = 0; i < 3; i++) {
      sumatorio += github_pagerank(followers[i]) / following.length
      pr = (1 - dampingFactor) + dampingFactor * sumatorio;
      result[i] = {
        username: user.username,
        score: pr
      }
    }
  }
  return result;
}

export default github_pagerank;
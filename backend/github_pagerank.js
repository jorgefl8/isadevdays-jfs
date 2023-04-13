import axios from "axios";
async function _callGithubApi(username, depth) {
  const token = "Bearer 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";
  //const token = `Bearer ${process.env.GITHUB_TOKEN}`;
  const url = "https://api.github.com/graphql";
  const requestConfig = { Authorization: token, Accept: 'application/vnd.github.starfox-preview+json' };
  let usuario = {
    username: username,
    depth: depth,
    status: "",
    followers: [],
    following: []
  }
  let hasNextPage = true;
  let endCursor = null;
  const query = `query($depth: Int){
    user(login: "${username}"){
      status {
        message
      }
      followers(first: $depth){
        nodes{
          login
        }
      }
      following(first: 100) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          login
        }
      }
    }
  }`;
  const query_more_following = `query ($after: String){
    user(login: "${username}"){
      following(first: 100, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          login
        }
      }
    }
  }`;
  while (hasNextPage) {
    if (hasNextPage === true && endCursor != null) {
      const result = await axios.post(url, JSON.stringify({ query: query_more_following, variables: { after: endCursor, depth: depth } }), { headers: requestConfig });
      const userData = result.data.data.user;
      const followings = userData.following.nodes.map((following) => following.login);
      for (const following of followings) {
        usuario.following.push(following);
      }
      hasNextPage = userData.following.pageInfo.hasNextPage;
      endCursor = userData.following.pageInfo.endCursor;
    } else {
      const result = await axios.post(url, JSON.stringify({ query: query, variables: { depth: depth } }), { headers: requestConfig });
      const userData = result.data.data.user;
      usuario.status = userData.status?.message;
      usuario.followers = userData.followers.nodes.map((follower) => follower.login);
      usuario.following = userData.following.nodes.map((following) => following.login);
      endCursor = userData.following.pageInfo.endCursor;
      hasNextPage = userData.following.pageInfo.hasNextPage;
    }
  }
  return usuario;
}

async function github_pagerank(username, depth, damping_factor) {
  const user = await _callGithubApi(username, depth);
  var resultado = {
    "status": "",
    "params": {
      "username": "",
      "damping_factor": 0,
      "depth": 0
    },
    "result": []
  };
  resultado.status = user.status;
  resultado.params.username = user.username;
  resultado.params.damping_factor = parseFloat(damping_factor);
  resultado.params.depth = parseInt(depth);
  const resul = github_pagerank_aux(user, resultado, 0, 0);
  return resul;
}
async function github_pagerank_aux(user, resultado, acc, sumatorio) {
  let pagerank = 0;
  if (acc < resultado.params.depth) {
    resultado.result.push({ "username": user.username, "score": 0 });
    let primer_seguidor = user.followers[0];
    let user_aux = await _callGithubApi(primer_seguidor, resultado.params.depth);
    const pagerank_aux = await github_pagerank_aux(user_aux, resultado, acc + 1, sumatorio);
    sumatorio += pagerank_aux / user_aux.following.length;
    pagerank = (1 - resultado.params.damping_factor) + resultado.params.damping_factor * parseFloat(sumatorio);
    resultado.result[acc].score = parseFloat(pagerank);
  } else {
    pagerank = (1 - resultado.params.damping_factor) + resultado.params.damping_factor * 1;
  }
  if (acc === 0) {
    return resultado;
  } else {
    return pagerank;
  }
}
export { github_pagerank, _callGithubApi };
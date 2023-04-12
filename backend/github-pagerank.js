import axios from "axios";
async function _callGithubApi(username, depth) {
  const token = "Bearer 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";
  //const token = `Bearer ${process.env.GITHUB_TOKEN}`;
  const url = "https://api.github.com/graphql";
  const requestConfig = { Authorization: token,  Accept: 'application/vnd.github.starfox-preview+json' };
  let usuario = {
    username: username,
    depth: depth,
    status: "",
    followers: [],
    following: []
  }
  let pp = true;
  let hasNextPage = true;
  let endCursor = null;
  const query = `query{
    user(login: "${username}"){
      status {
        message
      }
      followers(first:${depth}){
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
  const query_more_following = `query{
    user(login: "${username}"){
      following(first: 100, after: "${endCursor}") {
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
  while (pp) {
    if (endCursor != null && hasNextPage == true) {
        pp = false;
        /*
        mientras se arregla
        const result = await axios.post(url, {query_more_following}, { headers: requestConfig });
        const userData = result.data.data.user;
        usuario.following.push(userData.following.nodes.map((following) => following.login));
        hasNextPage = userData.following.pageInfo.hasNextPage;
        endCursor = userData.following.pageInfo.endCursor;
        */
    } else {
      const result = await axios.post(url, {query}, { headers: requestConfig });
      const userData = result.data.data.user;
      usuario.status = userData.status?.message;
      usuario.followers = userData.followers.nodes.map((follower) => follower.login);
      usuario.following = userData.following.nodes.map((following) => following.login);
      endCursor = userData.following.pageInfo.endCursor;
      hasNextPage = userData.following.pageInfo.hasNextPage;
    }
    if (hasNextPage == false) {
      pp = false;
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
  return github_pagerank_aux(user, resultado, 0, 0);
}
async function github_pagerank_aux(user, resultado, acc, sumatorio) {
  let pagerank = 0;
  if (acc < resultado.params.depth) {
    resultado.result.push({ "username": user.username, "score": 0 });
    for (const follower of user.followers) {
      const user_aux = await _callGithubApi(follower, resultado.params.depth);
      const followerScore = await github_pagerank_aux(user_aux, resultado, acc + 1, sumatorio) / user_aux.following.length;
      sumatorio += followerScore;
    }
    pagerank = (1 - resultado.params.damping_factor) + resultado.params.damping_factor * parseFloat(sumatorio);
  } else if (acc === resultado.params.depth) {
    pagerank = (1 - resultado.params.damping_factor) + resultado.params.damping_factor * parseFloat(sumatorio);
  }
  console.log("sumatorio: " + sumatorio);
  console.log("pagerank: " + pagerank);
  resultado.result[acc].score = parseFloat(pagerank);
  return pagerank;
}




export { github_pagerank, _callGithubApi };
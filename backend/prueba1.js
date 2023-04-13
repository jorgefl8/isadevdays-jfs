import axios from 'axios';
async function callGitHubApi(username) {
    const token = "Bearer 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";
    const url = 'https://api.github.com/graphql';
    const requestConfig = { Authorization: token, Accept: 'application/vnd.github.starfox-preview+json' };
    let firstFollower = "";
    const query = `query{
        user(login: "${username}"){
          followers(first:100){
            nodes{
              login
            }
          }
          following(first: 100) {
            nodes {
              login
            }
          }
        }
      }`;
    let usuario = {
        "firstFollower": "",
        "following": []
    }
    const result = await axios.post(url, JSON.stringify({ query: query }), { headers: requestConfig });
    const userData = result.data.data.user;
    const followers = userData.followers.nodes.map((follower) => follower.login);
    firstFollower = followers[0];
    const following = userData.following.nodes.map((following) => following.login);
    usuario.firstFollower = firstFollower;
    usuario.following = following;
    return usuario;
}

async function github_pagerank(username, iterations, damping_factor) {
    const data = await callGitHubApi(username);
    const follower = [data.firstFollower];
    const following = data.following;

    let pageranks = {};
    if (follower.length > 0) {
        pageranks[follower[0]] = 0;
    }
    for (const user of follower.concat(following)) {
        if (user !== follower[0]) {
            pageranks[user] = 1 / (follower.length + following.length);
        }
    }

    for (let i = 0; i < iterations; i++) {
        const newPageranks = {};
        for (const user of follower) {
            let pagerank = 0;
            const C = following.filter(f => f !== user);
            for (const follower of C) {
                pagerank += pageranks[follower] / follower.length;
            }
            pagerank = damping_factor * pagerank + (1 - damping_factor) / (follower.length + following.length);
            newPageranks[user] = pagerank;
        }
        for (const user of following) {
            let pagerank = 0;
            const C = follower.filter(f => f !== user);
            for (const follower of C) {
                pagerank += pageranks[follower] / following.length;
            }
            pagerank = damping_factor * pagerank + (1 - damping_factor) / (follower.length + following.length);
            newPageranks[user] = pagerank;
        }
        pageranks = newPageranks;
    }

    console.log(`${username}: ${pageranks[username]}`);
    console.log(`${follower[0]}: ${pageranks[follower[0]]}`);
}



export { github_pagerank, callGitHubApi };

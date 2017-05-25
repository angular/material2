const request = require('request');
const {version, name} = require('./package.json');

/** Data that must be specified to set a Github PR status. */
export type GithubStatusData = {
  result: boolean;
  name: string;
  description: string;
  url: string;
};

/** Function that sets a Github commit status */
export function setGithubStatus(commitSHA: string, authToken: string, data: GithubStatusData) {
  const state = data.result ? 'success' : 'failure';

  const requestData = JSON.stringify({
    state: state,
    target_url: data.url,
    context: data.name,
    description: data.description
  });

  const headers = {
    'Authorization': `token ${authToken}`,
    'User-Agent': `${name}/${version}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(requestData)
  };

  return new Promise((resolve) => {
    request({
      url: `https://api.github.com/repos/angular/material2/statuses/${commitSHA}`,
      method: 'POST',
      form: requestData,
      headers: headers
    }, (error: any, response: any) => resolve(response.statusCode));
  });
}

const config = {
    baseUrl: "http://localhost:8080",
    // notionRedirectUri: "https://api.notion.com/v1/oauth/authorize?client_id=346c32bb-48b5-40bb-b732-002cc75c87fe&response_type=code&owner=user&redirect_uri=https%3A%2F%2Fnarad.online%2Fapi%2Fnotion%2Fauth%2Fredirect%2F&state="
    notionRedirectUrl: "https://api.notion.com/v1/oauth/authorize?client_id=346c32bb-48b5-40bb-b732-002cc75c87fe&response_type=code&owner=user&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fapi%2Fnotion%2Fauth%2Fredirect%2F&state="
}

module.exports = config;


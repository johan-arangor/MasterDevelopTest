const global = {};

global.url = "https://api.github.com";
global.config = {
        headers: {
            'User-Agent': 'Awesome-Octocat-App',
        },
    };

module.exports = global;
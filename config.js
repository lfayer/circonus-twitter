module.exports = {
  twitter: {
        // account name
        username: '<TWITTER HANDLE>',
        // oauth credentials from Twitter
        api_key: '',
        api_secret: '',
        access_token: '',
        access_token_secret: '',
        // timeline parameters
        exclude_replies: true,
        include_rts: false, 
        trim_user: true, 
        tweet_count: 200 
    },
  circonus: {
        data_submission_url: '' // from HTTPTrap extended details in Circonus
  }
}

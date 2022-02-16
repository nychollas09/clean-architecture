export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '314585514045442',
    clientSecret:
      process.env.FB_CLIENT_SECRET ?? '44dfeef9a97389ad38d15e11467d7e1c'
  },
  appPort: process.env.PORT ?? 8080
}

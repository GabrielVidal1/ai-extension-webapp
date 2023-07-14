import NextAuth, { type DefaultSession } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import CredentialsProvider from "next-auth/providers/credentials"

declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's id. */
      id: string
    } & DefaultSession['user']
  }
}
const mockAuth = () => new Promise<{ session: { user: { id: string } } }>((resolve) => resolve({ session: { user: { id: "1" } } }))

export const {
  handlers: { GET, POST },
  auth: nextAuth,
  CSRF_experimental, // will be removed in future,
  ...res
} = NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    })

  ],
  // pages: {
  //   signIn: '/sign-in' // overrides the next-auth default signin page https://authjs.dev/guides/basics/pages
  // }
})

export const auth = process.env.MOCK_AUTH === "true" ? mockAuth : nextAuth

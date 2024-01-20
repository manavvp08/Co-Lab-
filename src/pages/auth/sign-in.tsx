import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from "next"
import { getProviders, signIn, getCsrfToken } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/server/auth"

import { Button } from "@/components/ui/button"
import { BiLogoDiscordAlt, BiLogoGoogle, BiLogoGithub } from "react-icons/bi";
import { APP_NAME } from "@/data/constants"
import { Mail } from "lucide-react"

export default function SignIn({
    providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <div className="min-h-screen flex items-center justify-center dark:bg-slate-800">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-5">Welcome to {APP_NAME}.</h1>
                <p className="text-gray-600 mb-8 dark:text-white">Please sign in to continue.</p>
                <div className="flex flex-col space-y-4">
                    {Object.values(providers).map((provider) => (
                        <Button
                            key={provider.name}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-800 transition-colors"
                            onClick={() => signIn(provider.id)}
                        >
                            <span className="mr-2">
                                {
                                    provider.name === "Discord" ? (<BiLogoDiscordAlt className="w-5 h-5" />)
                                        : provider.name === "Google" ? (<BiLogoGoogle className="w-5 h-5" />)
                                            : provider.name === "GitHub" ? (<BiLogoGithub className="w-5 h-5" />)
                                                : provider.name === "Email" ? (<Mail className="w-5 h-5" />)
                                                    : null
                                }
                            </span>
                            Sign in with {provider.name}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions)

    // If the user is already logged in, redirect.
    // Note: Make sure not to redirect to the same page
    // To avoid an infinite loop!
    if (session) {
        return { redirect: { destination: "/" } }
    }

    const providers = await getProviders()

    return {
        props: { providers: providers ?? [] },
    }
}
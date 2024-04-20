import PusherServer from 'pusher'

// Ensure environment variables are defined or provide default values
const appId = process.env.PUSHER_APP_ID || '';
const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '';
const secret = process.env.PUSHER_APP_SECRET || '';

export const pusherServer = new PusherServer({
    appId,
    key,
    secret,
    cluster: 'ap2',
    useTLS: true,
})

/**
 * The following pusher client uses auth, not necessary for the video chatroom example
 * Only the cluster would be important for that
 * These values can be found after creating a pusher app under
 * @see https://dashboard.pusher.com/apps/<YOUR_APP_ID>/keys
 */

import PusherClient from 'pusher-js'

export const pusherClient = new PusherClient(key, {
    cluster: 'ap1',
    authEndpoint: '/api/pusher-auth',
    authTransport: 'ajax',
    auth: {
        headers: {
            'Content-Type': 'application/json',
        },
    },
})

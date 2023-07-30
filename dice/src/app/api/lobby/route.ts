import { NextResponse } from "next/server"

type Lobby = {
    lobbyName?: string,
    initialAmount?: number,
    reroll?: boolean, 
    spectators?: boolean, 
    openLobby?: boolean
}

export async function POST(request: Request) {
    const data: Lobby = await request.json()
    console.log('data: ', data)

    const { lobbyName, initialAmount, reroll, spectators, openLobby } = data

    return NextResponse.json({ lobbyName, initialAmount, reroll, spectators, openLobby })
}
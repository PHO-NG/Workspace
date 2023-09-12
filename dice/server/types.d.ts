type Player = {
    id: string
    name: string
    icon: string
}

type Lobby = {
    lobbyId: string
    lobbyName: string
    initialAmount: number
    openInvite: boolean
    spectator: boolean
    reroll: boolean
    host : Player
}
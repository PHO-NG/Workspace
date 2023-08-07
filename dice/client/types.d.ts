type Player = {
    id: string
    name: string
    icon: string
}

type Lobby = {
     lobbyName: string
     initialAmount: number
     host: Player
     openLobby: boolean
     spectator: boolean
     reroll: boolean
     playerList?: Player[]
}

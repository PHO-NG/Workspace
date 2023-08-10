type Player = {
    id: string
    name: string
    icon: string
}

type PlayerStatus = Player & {
    ready: boolean
    filled: boolean
    loaded: boolean
  }

type Lobby = {
    lobbyId: string
    lobbyName: string
    initialAmount: number
    openLobby: boolean
    spectator: boolean
    reroll: boolean
    playerList?: PlayerStatus[]
}

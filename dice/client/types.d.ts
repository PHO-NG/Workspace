type Player = {
    id: string
    name: string
    icon: string
}

type PlayerStatus = Player & {
    ready: boolean
    host: boolean
    position: number
    filled: boolean
    loaded?: boolean
  }

type Lobby = {
    lobbyId: string
    lobbyName: string
    initialAmount: number
    host: PlayerStatus
    openLobby: boolean
    spectator: boolean
    reroll: boolean
    playerList?: PlayerStatus[]
}

interface JWTData {
    userId: number
    jwtTokenVersion: number
}

interface List {
    listId: number
    title: string
}

interface GetListsResposne {
    lists: List[]
}
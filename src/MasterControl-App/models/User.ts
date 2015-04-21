interface User {
    id : string
    username : string
    fullName : string
    email : string
    password? : string
    developer : boolean
    dateCreated : Date
    friendIds: string[]
}

export = User;
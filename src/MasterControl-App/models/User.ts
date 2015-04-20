interface User {
    id : string
    username : string
    fullName : string
    email : string
    password? : string
    developer : boolean
    date_created : Date
    friendIds: string[]
}

export = User;
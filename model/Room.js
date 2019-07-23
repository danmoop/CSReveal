class Room
{
    constructor()
    {
        this.users = [];
    }

    constructor(user1, user2)
    {
        this.users = [];
        this.users.push(user1, user2);
    }
}

module.exports = Room;
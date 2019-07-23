class User
{
    constructor(name, email, password)
    {
        this.name = name;
        this.email = email;
        this.password = password;
        this.projects = [];
        this.github = null;
    }
}

module.exports = User;
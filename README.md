# GraphQL API

![](http://img.shields.io/badge/Status-Work%20In%20Progress-ff69b4.svg?style=flat)

## Data

### Users

```
{
    _id: String,
    email: String,
    password: String,
    profileImage: {
        url: String
    },
    role: Enum["admin", "writer", "reader"]
}
```

### Articles

```
{
    _id: String,
    title: String,
    text: String,
    author: UserId,
    createdAt: Date,
    modifiedAt: Date,
    files: [{
        url: String,
        fileType: String
    }],
    status: Enum["draft", "published", "deleted"],
    tags: [String]
}
```

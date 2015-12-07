# API

![](http://img.shields.io/badge/Status-Work%20In%20Progress-ff69b4.svg?style=flat)

## Models

### Users

```
{
    _id: String,
    email: String,
    password: String,
    name: String,
    profileImage: {
        url: String
    },
    createdAt: Date,
    modifiedAt: Date,
    role: Enum["superuser", "writer", "editor", "reader"]
}
```

### Articles

```
{
    _id: String,
    title: String,
    text: String,
    author: UserIdRef,
    createdAt: Date,
    modifiedAt: Date,
    files: [{
        url: String,
        fileType: String
    }],
    status: Enum["draft", "published", "deleted"],
    tags: [String],
    topic: TopicIdRef
}
```


### Topic

```
{
    _id: String,
    title: String,
    createdAt: Date,
    modifiedAt: Date
}
```

## Endpoints

REST via `/v1`:

- `GET` /articles (public)
- `GET` /articles/:id (public)
- `POST` /articles (private - writers)
- `PUT` /articles/:id (private - writers)
- `DELETE` /articles/:id (private - writers)
- `POST` /articles/:id/publish (private - editors)
- `POST` /writers (private - superuser)
- `GET` /writers (public)
- `GET` /writers/:id (public)
- `POST` /writers/login
- `GET` /topics (public)
- `POST` /topics (private - superuser)

Experimental:

- `GET` /graphql (private)

## License

BSD-2-Clause Licensed

Copyright (c) 2015, [r-o-b.media](http://r-o-b.media) ping@r-o-b.media 
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

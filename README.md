Got em!!!
---

[![Preview](https://cloud.githubusercontent.com/assets/1265379/22193623/3c88effc-e102-11e6-9276-45f2fe2b0cbc.gif)](http://got-em.mybluemix.net/)

Setup
---

```
npm install
```

Add sounds to the `/public/sounds` directory

Run
---

```
npm start
```

Watch
---

```
npm run dev
```

Build
---

```
npm run build
```

API
---

The API is served up on port 3000.

#### GET /

View main page. Play sounds or text-to-speech.

#### GET /sounds/:sound

Play a sound

#### POST /speech

* Body
  * message - string to convert to audio

Text-to-speech

#### POST /slack

* Body
  * text - name of the sound file to play

Play a sound via POST


Docker
---

```
docker build -t got-em .
docker run -d -p 3000:3000 --name got-em got-em
```

License
---

MIT

const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const OpenAI = require("openai");
const uri = "<MONGO DB CONNECTION>";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const { WebError } = require("./weberror.js");

// Adding generated roadmap to database
async function sendRoadMap(roadmapObject) {
  await client.connect();
  const db = client.db("roadai");
  const roadmaps = db.collection("roadmaps");
  const result = await roadmaps.insertOne({
    data: JSON.stringify(roadmapObject),
  });

  await client.close();
  return result.insertedId.toString();
}

//Generating roadmap
async function generateRoadMap(apiKey, prompt) {
  const openai = new OpenAI({ apiKey: apiKey });
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Your response must be only json file. Genereate as much as possible. Below will be instruction *{here will be your genertaed text}. You need to generate roadmap for: ${prompt}. JSON structure (every object and item must be strictly placed):
    {"roadmap": {
    *{point you wil generate}: {name: "*{you need to generate short name}", description: "*{you need to generate description}", children: [*{the same structure if it has additional points to get on}]}
    *{generate another points like upper one}
    }}`,
      },
    ],
    model: "gpt-3.5-turbo",
  });
  const answer = JSON.parse(completion.choices[0].message.content);
  return await sendRoadMap(answer);
}

// Fetching roadmap for database
async function getMapData(mapId) {
  await client.connect();
  const db = client.db("roadai");
  const roadmaps = db.collection("roadmaps");
  const mapData = await roadmaps.findOne({ _id: new ObjectId(mapId) });

  await client.close();

  return mapData;
}

app.listen(3001, () => {
  console.log("Example app listening on port 3001!");
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,Content-Type,Authorization",
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());

app.post("/", async (req, res, next) => {
  let body = req.body;
  await generateRoadMap(body.openai_key, body.prompt)
    .then((roadmap) => {
      res.status(200).send({
        id: roadmap,
      });
    })
    .catch((e) => {
      if (e instanceof OpenAI.AuthenticationError) {
        next(new WebError(401, "Incorrect API key!"));
      } else {
        next(new WebError(0, "Unknown error."));
      }
    });
});

app.get("/map/:mapId", async (req, res, next) => {
  const mapId = req.params.mapId;
  await getMapData(mapId)
    .then((mapdata) => {
      res.status(200).send({
        map: mapdata,
      });
    })
    .catch((err) => {
      console.log(err);
      next(new WebError(404, "Roadmap not found."));
    });
});

//Error handling
app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.message });
});
